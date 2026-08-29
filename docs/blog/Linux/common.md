---
title: common
createTime: 2026/08/30 01:26:12
permalink: /article/07rthpjc/
---


# Linux ext4 掉电文件系统损坏的问题

>  时长sync一下还是稳妥的


[https://forums.developer.nvidia.com/t/tuning-linux-on-jetson-nano-for-better-data-reliability-in-power-failure-scenario/252664/5](https://forums.developer.nvidia.com/t/tuning-linux-on-jetson-nano-for-better-data-reliability-in-power-failure-scenario/252664/5)

突然掉电可能会导致两个问题

- 数据丢失
- 文件系统损坏

此情况在所有linux系统中都可能存在在我们常用的 `vim edge2` 和 `orin nx` 都出现过，在orin nx 中出现文件系统损坏的概率更大, `vim edge2` 更常遇见的是数据丢失

产生这种情况的原因是，文件系统会通过缓存来提高性能。

如果启用了缓存，就无法避免数据丢失的可能性。

如果只是数据丢失，问题不大；但如果系统正在写入元数据，而这改变了文件系统本身的结构（例如，添加或删除目录），那么突然断电可能会导致文件系统内的寻道规则被破坏。

文件系统损坏的问题一般会出现在，完成配置后

# 如何解决

### 1. 使用 `sync` 指令

通过手动执行`sync` 指令可以规避这个问题，但是

### 2. 增加备用电源

显然这在飞行器上是无法实现的

### 2. 文件系统不使用缓存，

### 3. 增大文件系统

日志是一小块 100% 同步的磁盘空间。操作系统和磁盘本身都不会缓存这块空间。由于它很小，通常不会影响固态硬盘的寿命（日志可以通过指针访问其他磁盘空间来平衡，而不是指向特定的一小块固态内存）。

无论是台式电脑、Windows 还是 Linux，断电都会导致已缓存但尚未写入的内容丢失。 ***只要日志足够大，就不会发生损坏 。 这个大是相对的，即 若有20G未写入***

journalctl 可以管理日志

```bash
(base) hao@hao-ThinkPad-X13-Gen-3:~$ journalctl --disk-usage
Archived and active journals take up 1.0G in the file system.
```

日志并*不能*阻止数据丢失，但它可以阻止损坏。

您可以增加日志大小。这意味着您可以丢失更多数据而不会造成损坏。您仍然会丢失数据，更改会被截断，但无需用户干预即可修复。这是所有操作系统上所有存储设备和文件系统的本质。只读存储器是唯一不会因突然断电而受到任何损害的存储器

> 只有只读数据没有被损坏的风险，`systemd journal` 的数据**不走文件系统缓存**，是直接写入硬盘的因此不存在丢失
> 

jetson 设备的空间居然只有32M

```python
emnavi@nvidia-desktop:~$ journalctl --disk-usage
Archived and active journals take up 32.0M in the file system.
```



# udev


```bash
SUBSYSTEM=="tty", KERNEL=="ttyACM*", ATTRS{idVendor}=="1b8c", ATTRS{idProduct}=="0036", SYMLINK+="ttyX280"
SUBSYSTEM=="tty", ATTRS{manufacturer}=="emNavi", SYMLINK+="ttySensorBridge"
```


# mavros connect  False 原因

- 若直连QGC连接正常，那么查看SYS ID







# 字体问题

## 日文字体问题

> 修改优先级
> 

[https://bestoko.cc/p/linux-fonts-size/](https://bestoko.cc/p/linux-fonts-size/)
`vim /etc/fonts/conf.d/64-language-selector-prefer.conf`

## 更好看的字体

## SF-Pro **Big Sur 界面 字体**

```python
git clone https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts.git --depth=1  # 下载字体库
sudo mkdir /usr/local/share/fonts/SF-Pro  # 新建字体文件夹
sudo mv San-Francisco-Pro-Fonts /usr/local/share/fonts/SF-Pro  # 安装字体
sudo fc-cache -fv  # 刷新字体列表缓存
```