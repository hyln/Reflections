---
title: 网卡驱动安装
createTime: 2024/09/07 01:11:19
permalink: /linux_base/zkt7lipg/
---


# 板载wifi网卡驱动

一些电脑主板可能比较新，相关的驱动还没有并入linux主线，会导致网卡不能正常使用。

这里记录一些常用的办法

## 升级Linux Kernel



## 手动安装 驱动

请注意，一些网卡的默认驱动可能对应了比较老的linux kernel 版本， 不同linux kernel 的api 并不完全相同，不过现在有AI，直接让AI适配也不是难事，只要找对了对应型号的驱动



# USB网卡驱动安装

# rtl8821

适用网卡 ：绿联AC650 11ac (rtl8821)，CF-811AC

正常电脑按官方教程安装就行 推荐用 **DKMS 安装**

> 直接make 然后make install 也完全没有问题
> 

以ubuntu 为例

```bash
# 安装 dkms
sudo apt-get install dkms

git clone https://github.com/brektrou/rtl8821CU.git
cd rtl8821CU
sudo ./dkms-install.sh

```

经过上面步骤，如果能检测到wifi，恭喜。如果没有，也许您需要在终端中通过以下步骤切换设备的 USB 模式：

```bash
lsusb
# 找到 USB-wifi 适配器设备 ID 比如 0bda:1a2b
sudo usb_modeswitch -KW -v 0bda -p 1a2b
systemctl start bluetooth.service
# 现在应该好了 ,看看 现在wifi 能不能 用
# 不过现在只是暂时的，我们还需要 永久化
sudo vim /lib/udev/rules.d/40-usb_modeswitch.rules
# 在结束行之前附加LABEL="modeswitch_rules_end"以下内容 ，注意改id
# Realtek 8211CU Wifi AC USB
ATTR{idVendor}=="0bda", ATTR{idProduct}=="1a2b", RUN+="/usr/sbin/usb_modeswitch -K -v 0bda -p 1a2b"
```

## 如何安装 rtl8821 驱动 在 nx

jetson nx 编译是会报  4.9.253-tegra 的错（我的nx是18.04 版本 ，不同版本 jetpack 的 版本号不一样）

在编译 rtl8821 驱动时 会提示/lib/modules/4.9.253-tegra/build: No such file or directory ，按提示安装`linux-headers` `sudo apt-get install linux-headers-$(uname -r)`又会提示 找不到

最后发现在 nvidia给的 BSP 里面可以找到






## 网卡驱动修复
低版本内核对于新硬件不太支持，通过下面命令可以将内核升级到5.15，重启之后生效。
```
sudo apt upgrade
# 使用下面命令重启
reboot
```


### COMFAST CF-811AC
```bash
# 安装 dkms
sudo apt-get install dkms
mkdir -p ~/install && cd ~/install 
git clone https://github.com/brektrou/rtl8821CU.git
cd rtl8821CU
sudo ./dkms-install.sh
# 验证
dkms status |grep rtl8821CU
# 若 看到含有红色的rtl8821CU字样，则成功
```

## 使用nmcli连接wifi

```bash
# 更新wifi 列表
sudo nmcli device wifi list
# 更新后按q退出
# 连接到 XXXXXXX_5G
sudo nmcli device wifi connect XXXXXXX_5G password 123456789
# 成功后拔掉网线
clash_ok
# 返回 连接正常，则之后不再需要网线了。

```
ifconfig 可以查看所有ip,找到 wifi的 ip,贴到电脑上




设置 默认连接wifi


建议使用nmcli 确实好用


# RTL8812AU

这个卡似乎在DIY圈很受欢迎。

# Kernel 中的网卡驱动设置

> 以buildroot 为例
>