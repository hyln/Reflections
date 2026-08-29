---
title: Init_PC_Config
createTime: 2024/10/22 20:47:34
permalink: /article/1zbyaj5c/
---

## 用户名更改

默认用户名为khadas，密码是khadas
https://blog.nowcoder.net/n/525cc83df73448a0909cb2a0c286df72

:::info
示例中 ： khadas 是 oldName, qyswarm 是 newName,X152b-ubuntu20 是newHostName
:::

```bash
sudo su
vim /etc/passwd 找到当前用户名并修改
vim /etc/shadow 找到当前用户名并修改
vim /etc/group 找到所有当前用户名并修改
'可以使用 : %s/oldName/newName/g 完成替换'
reboot
```
现在重启就是新的用户改密码，主机名，以及用户根目录名
```bash
# 更改用户根目录名
sudo mv /home/oldName /home/newName
# 更改主机名
sudo hostnamectl set-hostname newHostName
# 更改密码
sudo passwd newName
```
注意'/etc/hosts'中也要修改 ，否则连接可能有问题

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/image_20241022210055.png)

## 修改ssh登录显示

在 `/etc/update-motd.d/00-header`中
```bash
#!/bin/bash

KERNEL_VER=$(uname -r)

. /etc/os-release
. /etc/fenix-release

printf "\nWelcome to \e[0;91mFenix\x1B[0m %s %s %s\n" "$VERSION $PRETTY_NAME Linux $KERNEL_VER"

# TERM=linux toilet -f standard -F metal "Khadas $BOARD"
# X-152b 的位置就是会显示大logo的地方
TERM=linux toilet -f standard -F metal "X-152b"

if cat /proc/cmdline | grep -q reboot_test; then
        TERM=linux toilet -f standard -F metal "REBOOT TEST"
fi
```
![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/image_20241022210128.png)




## usb Gadget 配置wifi 热点

dnsmasq 与 systemd-resolved 冲突，可以选择用 dnsmasq 替代掉 systemd-resloved，

```bash
apt install dnsmasq
```

```bash
systemctl disable systemd-resolved
systemctl stop systemd-resolved
systemctl restart dnsmasq
```


## Apt 换源
请注意 x86和arm架构cpu的换源方法是不同的

## Dump 与 Write 
### 准备
1. 在通电前，插入U盘，用usb线连接电脑

    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022210357.png)

2. 通电，然后按住Function键并短按reset键进入 oowow
3. 在浏览器中使用 http://172.22.1.1/x/control  进入控制界面

    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022233636.png) 

4. 现在你可以选择Dump镜像或者Write镜像。

:::: tabs
@tab Write
### write 镜像

5. 启动电脑后，按住Function键并短按reset键进入 oowow    
6. 在浏览器中使用 http://172.22.1.1/x/control  进入控制界面
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022233636.png)
7. 选择    
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022210900.png)
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022210940.png)
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022211121.png)

8. 开始 写入
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022211209.png)

@tab Dump
### Dump镜像
5. ==插入U盘==，选择==Dump image from eMMC== ,可以看到如下画面
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022233817.png)
6. U盘会被直接识别到,如图所示，现在选择==Start==
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022233922.png)
7. 现在选择==Start==,接着可看到如图所示进度条
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022234108.png)
8. dump完成，看到如下画面
    ![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/X152b/dump-write/image_20241022234827.png)
9. 不要直接拔电，Power off 掉计算机 ，然后拔出u盘
10. 现在U盘里以及存储了新镜像的压缩包了


::::

##

- 基本的编译环境
- ROS-noetic
- 清华源 （apt,ros）
- 新的开机logo



## ap 模式设置
1. 设置5G AP模式
```bash
sudo nmcli con add type wifi ifname wlan0 mode ap con-name Hostspot ssid khadas_ap_5G
sudo nmcli con modify Hostspot 802-11-wireless.band a
sudo nmcli con modify Hostspot 802-11-wireless.channel 149
sudo nmcli con modify Hostspot 802-11-wireless-security.key-mgmt wpa-psk
sudo nmcli con modify Hostspot 802-11-wireless-security.proto rsn
sudo nmcli con modify Hostspot 802-11-wireless-security.group ccmp
sudo nmcli con modify Hostspot 802-11-wireless-security.pairwise ccmp
sudo nmcli con modify Hostspot 802-11-wireless-security.psk 12345678
sudo nmcli con modify Hostspot ipv4.addresses 192.168.2.1/24
sudo nmcli con modify Hostspot ipv4.gateway 192.168.2.1
sudo nmcli con modify Hostspot ipv4.method shared
sudo nmcli con up Hostspot
```


## 固件更新
版本依赖于烧录镜像版本

烧录
镜像名为 X152b-ubuntu20-V1.1.zip
V1.1
镜像名为 X152b-ubuntu20-V1.1.zip