---
title: Grub
createTime: 2024/10/10 07:44:34
permalink: /article/nx1c40tr/
---


## 修改GRUB等待时间
```bash
sudo vim /etc/default/grub
# 修改
GRUB_TIMEOUT=5
# 更新
sudo update-grub
```