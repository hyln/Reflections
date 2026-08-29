---
title: X152b PC 生产初始化
createTime: 2024/10/22 20:34:59
permalink: /article/27023b50/
---


## X152b PC 生产初始化

:::warning
大致步骤为
- 烧录固件
- 进入PC，手动进行初始化设置
:::

:::info
- 供电：以下过程的供电，都以PD充电器供电为例，功率大于30w，华为的不能用
- 权限: 以下操作大部分需要root权限。
:::

:::: steps
1. 下载镜像
    <LinkCard title="镜像下载" href="https://pan.baidu.com/s/1gCpzRgslIaQBB8V8f3iHUQ?pwd=5ugn" description="百度云密码: 5ugn" />
    1. 准备u盘，确保格式为exfat，若不是请格式化成exfat
    1. 下载镜像，并放到U盘中
2. 烧录固件。（Write）
    <LinkCard title="USB 有线刷固件" href="/article/1zbyaj5c/#dump-%E4%B8%8E-write" description="请看Write" />

3. 使用pd充电器向供电口供电 
4. 连接usb至edge2 的OTG口 （现在X152b会自动获取ip，无需手动设置）
5. 重置主机名
    当第一次启动飞机后
    ```bash
    sudo python3 /opt/init_emnavi_device/01_rename_hostname.py --drone_type X152b --px4_sys_id 1
    ```
    :::info
    重新打开窗口后生效
    :::
6. 下载nomachine并安装
    ```bash
    curl -O http://110.42.45.189:18080/Nomachine/nomachine_8.6.1_3_arm64.deb  
    sudo dpkg -i nomachine_8.6.1_3_arm64.deb # 安装大约耗时1.5分钟，耐心等待
    rm nomachine_8.6.1_3_arm64.deb
    sudo systemctl set-default multi-user.target
    ```
7. 清除所有wifi连接
    ```bash
    sudo python3 /opt/init_emnavi_device/04_clean_wifi_connect.py
    ```
8. 设置wifi为wifi热点模式（5G AP模式）
    ```bash
    sudo python3 /opt/init_emnavi_device/05_reset_ap_mode.py
    ```
    :::info
    现在就可以通过`emNavi-XXXXXXXX_5G` 连接到机载PC了
    :::
9. 清除缓存
    ```bash
    sudo python3 /opt/init_emnavi_device/06_clean_cache.py
    ```
10. sync
    ```bash
    sync
    ```
11. pc断电，结束
::::

## 连接至飞行器机载电脑

:::info
默认账户密码为
|Account|Password|
|-------|--------|
|emnavi |123456  |
:::

有四种方法可以连接到飞行器pc
- USB 虚拟网卡连接
- 连接至 X152b的热点（AP）
- 将X152b连接至路由器 (STA)
- Hdmi + 键鼠

热点 和 STA 模式不兼容，切换推荐通过 USB有线

### USB 连接

:::info
USB OTG模式会在连接过其他设备后自动退出
:::

通过usb连接到主机(连接后主机会自动获取ip)，飞行器ip地址为 `192.168.108.1`,你可以通过ssh连接至设备
```bash
ssh emnavi@192.168.108.1
```
除了ssh登录外，你还可以使用Nomachine登录

### AP模式

X152b设备被设计为出厂设置为AP模式，你可以通过连接至 `emNavi-XXXXXXXXX-5G`访问设备，飞行器ip为 **192.168.109.1**

```bash
ssh emnavi@192.168.109.1
```

除了ssh登录外，你还可以使用Nomachine登录


### STA 模式

在**除AP模式之外**的其他连接模式中通过以下方式连接至其他wifi
```bash
sudo python3 /opt/init_emnavi_device/04_clean_wifi_connect.py # 清除所有wifi连接，包括关闭ap模式
sudo nmcli device wifi list # 列出所有的搜索到的wifi
sudo nmcli device wifi connect <wifi_name>  password <wifi_password>
```
- <wifi_name> ： wifi名
- <wifi_password>: wifi密码

除了ssh登录外，你还可以使用Nomachine登录

### Hdmi + 键鼠

:::info
出厂状态下，连接HDMI并不会直接进入到图形化界面，这是这是为了Nomachine能够正常工作。为了图形化界面正常工作，你可以进行如下操作。
```bash
# 在连接了键鼠之后，使用emnavi账户登录，密码123456
sudo systemctl set-default graphical.target
sudo reboot #重启设备
```
重启完成后应该正常显示图形化界面
:::


