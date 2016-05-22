---
layout: post
title:  The many-workspaces workflow
---

In my post about [multitasking]({% post_url
2016-03-24-multitasking-slow-tasks-and-tmux %}) I alluded to having lightweight
workspaces which enables low(er)-overhead multitasking. Here's a recipe for how
I put it all together.

- Light workspaces which are cheap to spin up
- Easy to jump between projects
- A notification when a project is ready for my attention
- Lots of note taking


## Cheap and lightweight workspaces

I may have long running background processes for projects, so I find having
separate directories per project more effective than limiting myself to git
branches. Closely related changes can happen in the same workspace to make
rebasing and cherry-picking easier, and unrelated changes happen in total
isolation.

In order for a workspace to be cheap it needs to be:
- Easy to spin up
- Easy to tear down
- Easy to organize and find later

### Easy to spin up

I have a shortcut to spin up a 'typical' project and download the source code I
work on most frequently. I use vim so there is no overhead in configuring my
editor for each workspace. If I used a heavier IDE like intellij or eclipse I'd
need to find a way to automate setting them up as well.

### Easy to tear down

Workspaces don't leak outside their project directory or /tmp so tear down
doesn't take anything more than `rm -rf`. If any IDEs or tools touch files in
global directories I'd need to find a way to automate tearing them down as well.

### Easy to organize and find later

I keep projects as directories under a shared parent `~/projects/`. Since they
are cheap I'm willing to dispose of them frequently so I don't get a build up of
cruft. With a fuzzy finder and a shortcut to complete project names organization
isn't a problem.

## Easy to jump between projects

A project workspace is a directory, and an active project is a tmux session
with the workspace as `cwd`. Tmux is doing the multiplexing so there is a 1:1
mapping between active project and tmux session. Jumping between project is a
matter of jumping to, or starting, a tmux sessions at the right root. The
`project` shortcut and keybinding handle this for me (with [fuzzy finding]({%
post_url 2016-05-22-you-should-be-fuzzy-finding %}) of course).

This could potentially be accomplished with a graphical IDE using OS level
virtual desktops but it would mean a higher load on system resources. If the
only tools I needed for my work were contained within an IDE I could probably
use some sort of in-ide workspace switching - but this would preclude running
tests in the IDE, or would need a separate tmux session that gets switched on
its own.

## A notification when a project is ready for my attention

I covered this in my post on [multitasking]({% post_url
2016-03-24-multitasking-slow-tasks-and-tmux %}). This is a critical piece of
the many-workspaces workflow since it lessens (but can't remove completey) the
cognitive load of jumping around so much. It allows me to be comfortable
shelving thoughts about the projects that I'm not actively focusing on.

## Lots of note taking

TODO finish me

