---
layout: post
title:  Multitasking, slow tasks, and tmux
---

In an ideal environment I wouldn't get stuck waiting for slow builds or tests.

With an ideal workflow I'd find ways to stay focused on the same project while
waiting.

My environment and workflow aren't ideal. In some stages I get a tight code and
test loop, but other times I want to run a big suite to make sure I didn't
break anything, or when I expect I broke something and I want my tests to track
it down for me. I need ways to minimize the impact of context switching and
stay productive during the inevitable downtime on any given project.

# My workflow

I do almost all my work in the terminal so a project workspace is very
lightweight. I keep a tmux session per active project, and jump between them
with shortcuts and a fuzzy finder. Each project keeps state - an open vim
session, working directory, terminal windows - so I don't lose much momentum
beyond the unavoidable mental overhead when I switch.

The downside of this approach is that once I jump out of a project session I
lose any insight into when I should return. I find myself jumping back in just
to check whether any tests have tracked down an error yet. I need a way to turn
a poll into a push.

Luckily, tmux already tracks which windows have an unseen bell, they are the
ones that show an exclamation point when you run `tmux list-windows`.

# The setup

I have a script to pull the names of tmux sessions which have a bell waiting
for me:

```zsh
#!/usr/bin/zsh

local sessions
local -a bell_sessions
sessions=($(tmux list-sessions -F '#{session_name}'))
for session in $sessions; do
  if [[ -n $(tmux list-windows -t $session | grep '!') ]]; then
    bell_sessions+=$session
  fi
done
echo $bell_sessions
```

It's wired it in to my status line:

```
set-option -g status-right '(#(tmux_session_bells))...'
```

I use an alias to raise a bell: `alias bell="print -n '\a'"`.

And I pull it all together by postfixing slow commands with `; bell` so I'm
alerted as soon as they are finished and I can come back to take next steps. If
I'm engaged in something else it will just sit until I'm ready to respond.

# Some caveats

Unfortunately this doesn't work flawlessly. For some reason after I have a
window open for a while and I've used my alias to raise a bell, it can start to
get into an alert state apparently at random. Windows which are just sitting at
a zsh prompt will sometimes show up in my status line. So far the bugs haven't
been painful for me to give up the benefits. Closing the window and resuming my
work in a new one seems to be enough to get back to a good state.
