---
layout: post
title:  "Multitasking, slow tasks, and tmux"
---

Multitasking is bad for productivity, but sometimes I need to wait for a slow
test suite before I can make more progress. The best option is to stay focused
on the project, perhaps by writing out a solution in pencil, or drawing a
mikado graph. When I can't use that option I context switch to another project
in a different tmux session, but I find myself repeatedly jumping back to check
whether the tests have caught an error yet. I need a way to change this pull to
a push.

Tmux tracks which windows have an unseen bell. I wrote a script to check which
sessions have a bell and stick this information in my status line.

The script:

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

Ensure it is in my `$PATH` then wire it in to my status line:

```
set-option -g status-right '(#(tmux_session_bells.zsh))...'
```

Make it easier to rais a bell: `alias bell="print -n '\a'"`.

Run slow tasks with a trailing `; bell` and once they finish I'll see it in my
status line.
