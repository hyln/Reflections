---
title: tmux
createTime: 2024/09/09 16:42:58
permalink: /linux_base/software_use/t34d9f3b/
---

# tmux

```
# create new seesion
tmux  # defaulte session_name is 0 ,or
tmux new-session -s session_name

# show all session
tmux ls


# attach
tmux attach-session -t session_name

# kill <name>
tmux kill-session -t  session_name
```


快捷键
```bash
ctrl + b , d # 退出
ctrl + b , up-down-left-right # 切换window
ctrl + b, ;

```


[https://www.fabfile.org/](https://www.fabfile.org/)
Paramiko 
