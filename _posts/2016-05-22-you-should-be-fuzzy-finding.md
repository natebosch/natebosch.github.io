---
layout: post
title:  You should be fuzzy finding everything
---

When it comes to productivity in the shell I can't think of any practices which
have made a bigger difference than using a fuzzy finder. My favorite is
[fzf](https://github.com/junegunn/fzf).

# Files

File search is the obvious first application, and it is amazing to have it in
both [vim](https://github.com/junegunn/fzf.vim#commands) and the
[shell](https://github.com/junegunn/fzf#files-and-directories).

# Tmux sessions

With a tmux session per project, and a half-dozen active projects happening at
once, a fuzzy [session
finder](https://github.com/natebosch/dotfiles/blob/master/bin/session_finder)
bound to a
[shortcut](https://github.com/natebosch/dotfiles/blob/39524e375f9748c0377d841e46add3b293f0e8e1/tmux.conf#L64)
makes jumping around super quick.

# History

Possibly the most impactful tool in the fuzzy-finding toolbox is ctrl-r history
search. I've used history search with zsh before, but the increased utility of
searching by flags and other arguments is incredible.

Fuzzy history search works best when all the commands are unique. In
[zsh](https://github.com/natebosch/dotfiles/blob/24b9ec6bb02b87f787b1a4d53d4b6f9b765e61e8/zshrc.d/history.zsh#L2)
use `setopt HIST_IGNORE_ALL_DUPS`. Once the setting is turned on you can clear
out previous duplicates by rewriting the history file with `fc -W`.

# And more!

- Keep projects in a consistent directory and fuzzy jump to
  [projects](https://github.com/natebosch/dotfiles/blob/master/bin/project)
- Jump to previously opened buffers in vim
- Jump to git commits by fuzzy searching description titles with vim-fugitive
- Quickly rerun vim commands or searches
- Fuzzy search lines across all open buffers
