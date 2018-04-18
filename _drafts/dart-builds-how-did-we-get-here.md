---
layout: post
title:  Dart Builds - Where are we, how did we get here, and where are we going?
---

# Where we were: pub build (barback)

When barback was written it was intended to satisfy a small need within web
development: things like sass compilation, or compacting sprites to a single
image. It was a very flexible system and it turned out to be useful for more
intensive build steps, like the Angular compiler. Flexibility comes with a cost
though. If any file can be rewritten (or deleted) at any step in the build, then
care needs to be taken not to let other build steps read it until it is
'stable'. Barback adds protection with what turns out to be a significant
limitation - a Transformer running in package `Foo` can't read _any_ file from
package `Bar` until all transformer on `Bar` have finished. This is problematic
in the context of Dart source files because of features like type inference. In
order to understand the "meaning" of a Dart source file it is necessary to also
understand details from imported libraries. If two Transformers running in
different packages want to understand the resolved meaning of a Dart library
they must read transitive imports - and when those imports cycle across package
boundaries it can cause deadlock in Barback. Neither Transformer is allowed to
read imported Dart libraries until the other finishes, and neither will finish
until it can read the files.

This fundamental limitation meant that the Angular compiler before version 4 had
to cheat the system. Barback wouldn't let it read the source Dart files - but
the Angular transformer was also running on those source files and would
(hopefully) have already read them before the point where the information was
needed. Angular started storing what it needed in (effectively) global variables
that were shared between the runs across different packages. This introduced a
race condition - it relied on the transformers across all packages starting
together, and not reaching a certain point until the global data had been
populated.

When we rewrote the Angular compiler to use the analyzer and performer deeper
type resolution we hit a roadblock: In order to resolve types we needed to give
the analyzer transitive dart imports, but we couldn't do that if there were
package cycles. We were forced to disallow package cycles for packages using the
Angular transformer, and discovered that performance was dramatically impacted.
We could only do work up until the point where we needed to read an asset from a
dependency - which in the case of using the analyzer meant immediately. We were
serializing the work of the angular transformer across packages, because we
couldn't start doing anything on a package until Barback let us read in our
transitive imports.

Pub's intended use case also doesn't cover compilation steps that take a long
time. There is limited caching and cross-run incremental compiles. The fact that
there is not a consistent view of what a single file looks like make these hard
or impossible to add in.

# How we got here: bridging the gap with package:build

As teams inside Google were building ever bigger and bigger projects we were
also running into other difficulties integrating pub's "write whatever,
whenever" approach with bazel's much stricter statically analyzable build graph.
We could not take pub's model and make it incremental or modular - it *has* to
be monolithic. Bazel does not allow you to rewrite a file. Source files can't be
changed, and anything that generates an output needs to happen in a single build
step. We wrote package:build with a more restrictive model which could let us
run with a bazel-like set of restrictions while easily shimming to the `pub`
interface when we want to run in that build environment. Over time we gradually
adopted, in addition to the bazel restrictions, a definition approach that added
bazel's static analyzability. Instead of executing Dart code to determine the
files that will be written, we shifted to configuration metadata which says what
output extensions can be output for a given input extension. The `Builder`
concept was more restrictive to the author, but gave us a lot more flexibility
to integrate it with build systems. We could take a single Builder
implementation and run it in three ways - as a Transformer in pub, as a build
rule in a Bazel build, or by writing to the source tree directly using
`build_runner` for smaller local-only builders.

Our long term goal for the build package was to enable external users to use the
full power of the bazel build system like our internal users. We built a
prototype for `dazel` - a tool that could take builder configuration metadata
and generate the skylark build rules and BUILD files necessary for a Dart
project. We hit a few roadblocks with this approach:

- Internally we only need to build Dart on unix hosts but some Dart users
  develop on Windows. It would take a lot of effort to migrate our bazel build
  rules and tools to be cross platform.
- The bazel build system, despite attempts to hide it's complexity, still feels
  heavyweight for smaller projects which worked with the simpler `pub build`.

We were in a tough position. Our dev compiler is tricky to use without being
tightly integrated into a build system. External Angular builds were too slow to
be acceptable for most users, and the cost to generate angular code was paid
every time pub serve was started. We could give a good experience with bazel,
but only for a fraction of our users on a fraction of their projects.

# Where we are: `build_runner` as a full build system

Although it was originally written to satisfy a small part of the use case for
builders - generating code in a single package intended to be published with the
package - we did have a proof of concept build system which was pure Dart and
followed a more restrictive (read "easier to optimize") model. We've put a lot
of effort into making `build_runner` a fully capable build system for Dart
projects. There are two major areas we've improved:

- We've expanded the power of `build_runner` to run builds across all packages,
  and for files that are not intended to be published.
- We've improved the usability of `build_runner` so that it can be used more
  like `pub build` with automatic discovery of Builders rather than hardcoding
  the build into a manual build script.

With Dart 2 we're completely transitioning builds for web projects to
`build_runner` (though we're calling the CLI `webdev`) and we've dropped support
for the `build` and `serve` commands in `pub`.

# Where we are going: better, faster builds

## Easier

We're pushing more of the configuration and complexity on to the authors of
Builders so that end users don't need to do manual work. Most Builders can be
enabled automatically based on dependencies and the Builder configuration is
expressive enough to automatically determine things like the order of work.

## Better

We've proven that `build_runner` works for many projects using a small set of
Builders. We'll be working on expanding the happy path and blunting the sharp
edges which surround it. As we work to finish migrating builds over to
`build_runner` from pub we'll be exploring patterns for working within the
restrictions of the package:build paradigm.

We'll also be working to improve integration with other tools, like the analysis
server. Unlike with `pub build`, generated assets live on disk and not in
memory. Other tools can see these files which make them easier to inspect,
debug, and understand.

## Faster

We wanted to move quickly to a working end-to-end system - when we could reuse
code we did. Some of the APIs we use were written pub compatibility in mind.
Even though a Builder wouldn't overwrite a file, we couldn't be sure that some
other Transformer wouldn't and so we needed to be cautious. We have a lot of
room for improvement now that we can focus on build system that has a statically
analyzable model.

## Stronger

Despite it's restrictions we're focusing on making sure the new build system has
right generalizations for Dart. In fact, it's capable of running our web
compilers without any hardcoded knowledge - they appear to the system like any
other Builder - something that was not possible with Barback. The benefit is
that we can swap out implementations, say for compilers tuned for `node.js`
without changes to the build system itself.
