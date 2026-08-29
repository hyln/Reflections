---
title: ssh
createTime: 2024/10/19 16:28:19
permalink: /article/eaqdpyh5/
---

## 安装

```bash
sudo apt install openssh-server
```

## config 文件

`~/.ssh/config` 配置文件可以简化你日常的 SSH 连接，避免在每次连接时都需要手动指定这些参数。
例如当`config`文件如下时：
```bash
# 为特定主机设置别名和其他参数
Host myserver
    HostName 192.168.1.100  # 服务器的 IP 或域名
    User myusername         # 登录时使用的用户名
    Port 2222               # SSH 端口号
    IdentityFile ~/.ssh/myserver_key  # 使用特定的私钥文件
```
连接到192.168.1.100 可用简化为

```bash
ssh myserver
```

此外。像vscode等软件会读取`config`

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hyaline_kb/Linux/SSH/image_20241020140412.png)




## ssh 的代理转发

服务器往往需要多人使用，在服务器上部署自己的代理服务似乎不太合适，当我们使用ssh时，可以尝试使用==ssh转发本地主机上的代理服务端口到服务器==上来取巧。

:::warning
代理通道占用ssh的带宽，假如ssh通过内网穿透实现的，那么效果受限于转发服务器的带宽，主流的国内服务器带宽一般低于5Mbps，效果可能不佳。

这里的转发服务器带宽为100Mbps。
:::

### 准备
首先需要让ssh 服务器允许传入指定参数，编辑服务器上的 `/etc/ssh/sshd_config`，将 `AcceptEnv`修改为

```
AcceptEnv LANG LC_* https_proxy http_proxy
```

完成之后请重启ssh服务,`systemctl restart sshd`

### 本机设置

对于VScode可以使用 `RemoteForward`和 `SetEnv`
```bash {5-6}
Host XXXXX
    HostName xxx.xxx.xxx.xxx
    User root 
    IdentityFile "C:\Users\xxx\.ssh\id_rsa"
    RemoteForward 9001 localhost:7890  # 将本地clash端口(7890)转发至服务器9001端口
    SetEnv http_proxy=http://localhost:9001 https_proxy=http://localhost:9001 
```


