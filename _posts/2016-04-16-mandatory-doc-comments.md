---
layout: post
title:  Linting to mediocrity - mandatory doc comments
---

> When doc comments are required by a linter, the average value of doc comments
> trends towards worthless.

Documentation should tell you something the signature and name haven't told you
already. Not every public member needs extra explanation; when they do it may
be better to rename them.

Perhaps valuable information is too often lost because the author doesn't write
a doc comment, but mandatory comments do not solve the problem.  Mandatory
comments lead to complacency with documentation that does nothing more than
repeat the name or type.

## Imagine two projects

### Ideal project

Developers have good documentation habits and don't need a linter forcing them
to add necessary documentation. The presence of a doc comment is a signal that
there is something interesting about it's target. The code has a high signal to
noise ratio so maintainers actually pay attention to comments and they are kept
up to date. When a reviewer asks for a doc comment the author recognizes that
there is something worth saying and thinks carefully about what to write.

### Project with mandatory doc comments

Developers grow numb to comments which simply repeat information. The code has
a low signal to noise ratio and maintainers don't bother checking whether
they've invalidated a doc comment because more often the comment was worthless
to start. Most readers skim past comments and don't bother to search out the
rare documentation that adds value. The members which do need extra
documentation still get worthless comments out of habit rather than the author
or reviewer thinking critically about what should be written. Some members
*must* get worthless comments so it becomes OK for *any* member to get a
worthless comment.

## Find better solutions

Great documentation won't happen just because developers are forced to write
*any* documentation. Encourage documentation in more subtle ways like seeking
out and praising well written doc comments. Leave the linter for catching
things that are likely mistakes, or will at least look that way to maintainers.
