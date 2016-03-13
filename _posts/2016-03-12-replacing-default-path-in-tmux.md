---
layout: post
title:  "Replacing default-path in tmux"
date:   2016-03-12
---

With the 1.9 release of tmux, the `default-path` option was removed. This
[broke my workflow](https://xkcd.com/1172/) since I prefer new windows to open
at the root of the project I'm working on rather than whatever directory the
current window has. For a while I was just careful to cd to the right place
before starting a new sessions but it was annoying when I forgot, and I
couldn't use a key binding to open new sessions since they would be stuck with
the same working directory as the current session.

I hacked around it by creating a new session with the appropriate path,
renaming it to match, and shuffling windows over. The new session has a working
directory from wherever it was run so it simulates what `tmux set-option
default-path "$PWD"` used to do. Here's the zsh function:

```zsh
change_tmux_pwd() {
  local session_name=$(tmux display-message -p '#S')
  local tmp_session_name="${session_name}-old"
  tmux rename-session $tmp_session_name
  tmux new-session -s $session_name -d
  local has_renumber=$(tmux show-options -g | grep 'renumber-windows on')
  if [[ -z $has_renumber ]]; then
    tmux new-window -t $session_name:99
    tmux kill-window -t $session_name:0
  fi
  local win_id
  for win_id in $(tmux list-windows -F '#I'); do
    if [[ -z $has_renumber ]]; then
      tmux move-window -s $tmp_session_name:$win_id -t $session_name:$win_id
    else
      tmux move-window -s $tmp_session_name:$win_id -t $session_name
    fi
  done
  if [[ -z $has_renumber ]]; then
    tmux kill-window -t $session_name:99
  else
    tmux kill-window -t $session_name:0
  fi
  tmux switch-client -t $session_name
}
alias here=change_tmux_pwd
```

There is some trickiness around getting the windows shuffled over with the same
indexes, it needs to be handled differented depending on whether
[renumber_windows is turned
on.](https://github.com/natebosch/dotfiles/commit/77dbb0662c309bad549e469d73c5b6fe686c91fc)
I'm not sure if there is any other state that gets lost with the old session,
but I typically only run this shortly after creating a session.
