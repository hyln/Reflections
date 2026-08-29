---
title: RustDesk使用
createTime: 2024/10/19 23:01:33
permalink: /article/hiepslrz/
---



## 自管理服务器搭建

:::: steps
1. 下载

    <LinkCard title="Ruskdesk Self Host Doc" href="https://rustdesk.com/docs/en/self-host/" description="" />

    <LinkCard title="Ruskdesk Server" href="https://github.com/rustdesk/rustdesk-server/releases">

    > 推荐下载`rustdesk-server-linux-amd64.zip`而不是`.deb`
    - 1.12版本可用

    </LinkCard>

2. systemd

    > 官方推荐使用PM2，但我喜欢用systemd

    将文件解压到`~`中，即 `/root/amd64` 中，现在创建3个文件

    - `/etc/systemd/system/hbbr.service`
    - `/etc/systemd/system/hbbs.service`
    - `/opt/rustdesk/env`

    ::: tabs
    @tab hbbs.service
    ```bash
    [Unit]
    Description=hbbs Service
    After=network.target

    [Service]
    ExecStart=/root/amd64/hbbs -r <公网ip>
    Restart=always
    User=root
    WorkingDirectory=/root/amd64

    [Install]
    WantedBy=multi-user.target
    ```
    @tab hbbr.service

    ```bash
    [Unit]
    Description=hbbr Service
    After=network.target

    [Service]
    ExecStart=/root/amd64/hbbr
    Restart=always
    User=root
    EnvironmentFile=/opt/rustdesk/env
    WorkingDirectory=/root/amd64

    [Install]
    WantedBy=multi-user.target
    ```


    `<公网ip>`: 服务器的公网ip

    @tab /opt/rustdesk/env
    ```bash
    LIMIT_SPEED=100
    TOTAL_BANDWIDTH=100
    SINGLE_BANDWIDTH=100
    ```
    - `LIMIT_SPEED`: 单位 Mbps
    - `TOTAL_BANDWIDTH`: 单位 Mbps
    - `SINGLE_BANDWIDTH`: 单位 Mbps
    
    > 参数可根据服务器实际带宽调试

    :::

    ```bash
    systemctl daemon-reload
    systemctl enable hbbs
    systemctl enable hbbr
    systemctl restart hbbs
    systemctl restart hbbr
    ```
::::


