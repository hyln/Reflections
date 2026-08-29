---
title: 01_qemu_x86_with_linux
createTime: 2024/10/10 07:31:15
permalink: /article/m13iic48/
---

## 一个完整的Linux 系统的构成

对于在qemu中运行的系统，必要组件为
- Linux Kernel
- rootfs

对于一个arm芯片上运行的linux操作系统，其包含以下3个部分
- u-boot
- rootfs
- kernel

initrd 加载一个临时的根文件系统到 memory中
有两种不同的实现方法。
- initrd
      - 第一个进程: /linuxrc，执行结束后认为真实的文件系统的以及被挂载，接着执行/sbin/init开始正常用户空间的boot 进程。
- initramfs
      - 从 linux kernel 2.6.13开始可用

ubuntu_base 就是一个rootfs，一个全量版的大小为5


## 系统启动流程

:::info
1. Linux 内核在存储时通常是==以压缩状态存在==的。具体来说，内核镜像文件（通常称为 bzImage）是经过压缩的，以便减少其占用的磁盘空间并加快加载速度。压缩后的内核会在系统启动时由引导程序加载到内存，然后进行解压缩并运行。
:::



==内核阶段==
1. 加载内核:引导程序（如 GRUB）加载内核镜像（kernel），内核启动并开始初始化硬件。

==initramfs/initrd 阶段==


==init==
2. `/sbin/init`,第一个用户空间进程（非内核进程）,PID是1，用于初始化和配置用户空间环境。
     1. /etc/inittab
     2. /etc/rc.d/rc.sysinit
3. 在传统的 SysV init 系统中，内核模块加载可以通过 `/etc/modules.conf` 文件（或 `/etc/modules.d` ）来指定，系统会按照这些配置文件中的指示加载内核模块。
4. SYStemd

:::caution
文件系统到底提供了什么功能
:::

## 构建第一个linux镜像

:::info 
本节中生成的镜像包含两个部分
- `kernel`编译出的`bzImage`
- `busybox`编译出的`initramfs-busybox-x86.cpio.gz`
:::


### 安装QEMU x86

```
sudo apt install build-essential git kconfig-frontends flex bison libelf-dev bc libssl-dev qemu qemu-system-x86
```

### 下载linux和busybox

:::info
本节构建的系统均在 `~/kdev` 文件夹下完成
:::


```bash
cd $HOME
mkdir kdev 

# compile busybox   ->  cpio
cd ~/kdev
wget http://busybox.net/downloads/busybox-1.36.1.tar.bz2
tar -xvf busybox-1.36.1.tar.bz2
cd busybox-1.36.1
make O=$HOME/kdev/busybox-1.36.1/build/busybox-x86 defconfig
make O=$HOME/kdev/busybox-1.36.1/build/busybox-x86 menuconfig
# Setting -->
#    -- Build Options
#    勾选 Build static library (no shared libs)
cd build/busybox-x86
make -j8 
make install

# 构建 cpio.gz

mkdir -p $HOME/kdev/busybox-1.36.1/build/initramfs/busybox-x86
cd $HOME/kdev/busybox-1.36.1/build/initramfs/busybox-x86

mkdir -pv {bin,sbin,etc,proc,sys,usr/{bin,sbin}}
cp -av ../../busybox-x86/_install/* .
## 创建 init
touch init
vim init
## 构建压缩过的initramfs-busybox-x86.cpio.gz
find . -print0 | cpio --null -ov --format=newc | gzip -9 > ../initramfs-busybox-x86.cpio.gz

# compile linux
git clone https://github.com/torvalds/linux.git
cd linux
mkdir build/linux-x86-basic
make O=/home/hao/kdev/linux/build/linux-x86-basic/ x86_64_defconfig
make O=/home/hao/kdev/linux/build/linux-x86-basic/ kvm_guest.config

cd build/linux-x86-basic
make -j8 #大约5分钟

# 启动 qemu

qemu-system-x86_64 \
-kernel $HOME/kdev/linux/build/linux-x86-basic/arch/x86_64/boot/bzImage \
-initrd $HOME/kdev/busybox-1.36.1/build/initramfs/initramfs-busybox-x86.cpio.gz \
-nographic -append "console=ttyS0" \
-enable-kvm
```

`-enable-kvm` 是 QEMU 的命令行参数之一，用于启用 KVM（Kernel-based Virtual Machine）加速技术。它的作用是让 QEMU 使用主机系统的 KVM 模块来加速虚拟机的执行。


对于busybox 1.24.2,在 ubuntu22.04上编译报没有rpc/rpc.h， 1.36.1没有这个问题

```bash
networking/inetd.c:178:11: fatal error: rpc/rpc.h: No such file or directory
          32 | #include <rpc/rpc.h>
```

## ubuntu core



## 参考资料
https://gist.github.com/ncmiller/d61348b27cb17debd2a6c20966409e86

https://developer.nvidia.com/embedded/jetpack

https://www.cnblogs.com/lvzh/p/14907592.html

https://www.cnblogs.com/bruce1992/p/17670128.html



