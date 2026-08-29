---
title: wireguard
createTime: 2024/09/09 13:10:25
permalink: /linux_base/network/nnr7rvii/
---


:::warning
wireguard使用UDP进行通讯，国内运营商会对udp进行限流，导致带宽上不去，一种解决方案是将udp包装成tcp，但是需要服务器和客户端同时安装，比较麻烦。
:::

vpn 虚拟局域网工具，其连接需要server 与 client 交换公钥。 

没有办法 Traversing the NAT ， 似乎需要更多的配置
# ubuntu下的安装

```bash
sudo apt install wiregurad
```



## 配置
生成公钥私钥
```
mkdir wireGuard_cfg
cd wireGuard_cfg/
wg genkey > privatekey  # 生成私钥
wg pubkey < privatekey > publickey #用私钥生成公钥
```

创建配置文件`touch wg0.conf` server和 client 只有配置文件不同

server_config
```
[Interface]
Address = 10.5.5.1/24
ListenPort = 51820
# Use your own private key
PrivateKey =  your_private_key

[Peer]
# Workstation public key 5900
PublicKey = your_public_key
# VPN client's IP address in the VPN
AllowedIPs = 10.5.5.2/32

[Peer]
# laptop public key nuc server
PublicKey = your_public_key
# VPN client's IP address in the VPN
AllowedIPs = 10.5.5.3/32

```


client_config

```
[Interface]
# The address your computer will use on the VPN
Address = 10.5.5.2/32
DNS = 8.8.8.8
# Load your privatekey from file
PostUp = wg set %i private-key /home/hao/23_workspace/wireguard/privatekey
# Also ping the vpn server to ensure the tunnel is initialized
PostUp = ping -c1 10.5.5.1
[Peer]
# VPN server's wireguard public key
PublicKey = server_private_key
# Public IP address of your VPN server (USE YOURS!)
Endpoint = 120.46.221.18:51820
# 10.0.0.0/24 is the VPN subnet
AllowedIPs = 0.0.0.0/0, ::/0
# PersistentKeepalive = 25
```





开启 与关闭
```bash
wg-quick up $(pwd)/wg0.conf
wg-quick down $(pwd)/wg0.conf
```


## 1.wireguard配置

# 1. 服务器端
## ipv4 forward enable

```
vim /etc/sysctl.conf

# 修改
##########################################
# Uncomment the next line to enable packet forwarding for IPv4
net.ipv4.ip_forward=1

############################################

sysctl -p # 生效设置，不要忘了
```
## 安装 wireguard

```
apt install wireguard resolvconf
```

## server 配置

生成key，找一个用来存储公钥和私钥的地方生成一对公钥和私钥
```bash
wg genkey | tee privatekey | wg pubkey > publickey
```

设置，全在 /etc/wireguard/wg0.conf中完成，client也是如此
```
[Interface]
# 设置vpn中服务器的地址，client是可以ping到服务器的
Address = 10.120.0.1
# wireguard提供了默认端口()，但是为了安全这里使用
ListenPort = 39814
# 在配置里，私钥都是本机的，公钥全是其他机子的
PrivateKey = aChEu1qGxDAcKHFhOqzUNMCkfP3lhScppO3O6ORrf0Y=
# DNS默认就好
DNS = 8.8.8.8
# 如果用于上网的网卡不是 eth0 ，请改成对应的
PostUp   = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# peer 指的是client，server上可以存多个peer,换句话说,增加设备需要更改服务器设置
[peer]
# my 12700
AllowedIPs = 10.120.0.0/24
# 这里指的是对应的client 的公钥
PublicKey = Xnrt2ZU8wtkWzpKqday6oTljD9Dy7gghIKN/46h0mEg=


[peer]
# my 5900
# 这里设置成仅设备ip可用
AllowedIPs = 10.120.0.0/24
# 这里指的是对应的client 的公钥
PublicKey = 8u5/gIUUOqBbaCzvVwmfzhvYJMccZJTz2eAZrb1FSXo=

# 如果想添加一个设备,仅需使用下面设置
[peer]
PublicKey = 8u5/gIUUOqBbaCzvVwmfzhvYJMccZJTz2eAZrb1FSXo=
AllowedIPs = 10.120.0.0/24
```


## server 热重载
不知道是否管用

```
wg syncconf wg0 <(wg-quick strip wg0)
```

# 2. 客户端


找一个用来存储公钥和私钥的地方生成一对公钥和私钥
```bash
wg genkey | tee privatekey | wg pubkey > publickey
```



```
[Interface]
# 本机地址要修改
Address = 10.120.0.3
ListenPort = 39815 # 如果不做中转可以没有这一行
# 本机私钥
PrivateKey = 2GRUV9RwsJ8cOfif83S4pcWNVBTtcenaZBzVYK5BCkY=
DNS = 8.8.8.8

[Peer]
AllowedIPs = 10.0.0.0/24
Endpoint = 45.89.228.246:39814
# 服务器公钥，不要改
PublicKey = M20PNElOAo6AhLN4MeAkx65F3Cy7arCSpp9SawfbRDw=
PersistentKeepalive = 25
```
更详细的客户端配置参考[[2.如何添加一个设备(用户侧)]]

# 3. 其他
## 测试结果
购买了一个月的俄罗斯服务器，测试从秦皇岛ping西伯利亚是 110ms，双向就是220ms，这个状况下桌面有明显的延时。(有一部分原因是 Nomachine 在 不创建服务器的情况下本身延时就大)
看来没有国内的服务器的话是不行的

## 防火墙设置
俄罗斯服务器Justshot的管理做的稀碎，防火墙需要自己整
```
root@vm799874:~# ufw status
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
39814                      ALLOW       Anywhere
22/tcp (v6)                ALLOW       Anywhere (v6)
39814 (v6)                 ALLOW       Anywhere (v6)

```


## 开机自启

## 2.如何添加一个设备(用户侧)


# 安装
[安装wireguard](https://www.wireguard.com/install/)，如果是ubuntu，可使用`apt install wireguard resolvconf`,以下均以ubuntu 为例
# 创建密钥
2. 创建一个文件夹用于存储公钥，并生成一对公钥和私钥
	```
	# example
	mkdir wg_key
	cd wg_key
	wg genkey | tee privatekey | wg pubkey > publickey
	```
3.  将公钥`publickey`发给管理员，等待管理员回复过程中先继续
# 配置wireguard
 1. 切换到 root 模式 `sudo su`
 2. `cd /etc/wireguard`
 3. `vim wg0.conf`


复制下面文字到 wg0.conf， 修改 ip 和 私钥(上一步生成的`privatekey`)
```
[Interface]
# 本机地址要修改
Address = 10.120.0.3
ListenPort = 39815
# 本机私钥
PrivateKey = 2GRUV9RwsJ8cOfif83S4pcWNVBTtcenaZBzVYK5BCkY=
DNS = 8.8.8.8

[Peer]
AllowedIPs = 10.0.0.0/24
Endpoint = 45.89.228.246:39814
# 服务器公钥，不要改
PublicKey = M20PNElOAo6AhLN4MeAkx65F3Cy7arCSpp9SawfbRDw=
PersistentKeepalive = 25
```

# 等待完成

等待管理员的通知，

现在你可以使用以下命令管理了
```

sudo wg-quick up wg0

sudo wg-quick down wg0

```


phantun udp2tcp


[https://icloudnative.io/posts/wireguard-over-tcp-using-phantun/](https://icloudnative.io/posts/wireguard-over-tcp-using-phantun/)

似乎没有windows版



从目前的需求来说 ruskdesk应该还是最满足需求的



正点原子Lora 不适合用来传RTK的消息