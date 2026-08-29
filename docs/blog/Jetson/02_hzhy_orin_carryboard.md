---
title: HZHY Orin 载板 使用
createTime: 2025/03/31 17:26:54
permalink: /article/d1zo97m2/
---

:::info
Jetpack5.1.3 版本，刷机 PC Ubuntu 版本必须是 20.04 的，jetpack5.1.2 及以下版本，刷机 PC Ubuntu 版本必须是 18.04 的。
刷机完成，配置完成后，如果卡在 Ubuntu 界面，不进入系统，大概率是 ubuntu 用的版本不对应，此
时可以在 Linux_for_Tegra/tools 目录下面，以 root 用户执行下面的命令，跳过系统配置界面，直接进入
系统。配置下面的命令完成后，只需重新刷机即可
:::


:::: steps
1. 下载镜像
    <LinkCard title="镜像下载" href="https://pan.baidu.com/s/1p1STVnDru02u7D7ZKWbSKw?pwd=93tg" description="flash-AI318UAV-O_ONX_Jp5.1.4_SC_v1.0.0_20250311-uartok.tar.gz 百度云密码: 93tg" />
    :::warning TODO
    放到本地
    :::

2. 解压
    > 镜像包解压时需要root权限
3. 进入recovery 模式

3. 烧录固件。（Write）
    在 Linux_for_Tegra/tools 目录下面，以 root 用户执行下面的命令，跳过系统配置界面，直接进入系统
    ```bash
    sudo ./tools/kernel_flash/l4t_initrd_flash.sh --external-device nvme0n1p1 \
    -c tools/kernelflash/flashl4texternal.xml -p "-c bootloader/t186ref/cfg/flash_t234_qspi.xml" \
    --showlogs --network usb0 p3509-a02+p3767-0000 internal
    # sudo ./l4tcreatedefaultuser.sh -u nvidia -p nvidia -n nvidia-desktop -a --accept-license
    ```
3. 安装jetpack

    :::warning TODO
    使用官方sdk安装,直接装网速慢
    :::
    ```bash
    sudo apt update
    sudo apt install nvidia-jetpack
    ```
::::


