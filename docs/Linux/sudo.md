---
title: sudo
createTime: 2026/08/30 01:46:11
permalink: /article/vngrq2dd/
---


# 显示进度的cp

```bash
rsync -av --progress /path/to/source_folder/ /path/to/destination_folder/
```

# 显示进度的 tar -xf

```bash
sudo apt install pv
pv archive.tar | tar -xf -

```



# 挂载

```bash
lsblk
sudo mkdir -p /mnt/hdd
sudo mount /dev/sda /mnt/hdd
```

1. **果想开机自动挂载**，可以把它写入 `/etc/fstab`：

```bash
UUID=52318339-55b2-4c5f-b828-66f091252229 /mnt/hdd ext4 defaults 0 2

```

（用 `blkid /dev/sda` 获取 UUID 确认）





# 卸载

### 🔧 步骤 1：确认挂载情况

```bash
bash
复制编辑
mount | grep /dev/sda

```

如果你看到像这样的输出：

```
/dev/sda on /mnt/hdd type ext4 (rw,relatime,data=ordered)

```

说明它挂载在 `/mnt/hdd`，你需要先卸载它。

### 🔧 步骤 2：卸载磁盘

```bash
sudo umount /mnt/hdd
```

⚠️ 如果提示设备正忙（`device is busy`）：

- 检查是否有终端在访问该目录，例如你当前就在 `/mnt/hdd` 目录下，先 `cd ~` 回到主目录；
- 查看占用的进程：

```bash
sudo lsof +f -- /mnt/hdd
```

然后杀掉相关进程。




# Tmux

```bash
tmux new -s hyln

Ctrl+b   d # 临时退出
tmux attach -t hyln

###### Ctrl+b
" 下分栏
% 右分栏

exit 退出

```