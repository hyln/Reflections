---
title: wifi_setting
createTime: 2024/09/09 13:16:23
permalink: /robot_base/9ngg2j4i/
---

## 网络常识

### 多播

10.42.0.255 为多播地址

传统通讯中常常使用 TCP或UDP通讯，这种通讯方式一般是1对1的。然而对于集群系统，往往需要多对多通讯。
虽然UDP 多播（multicast）能够实现多对多通讯，但其存在的丢包问题会有很多的隐患，此外多播的带宽常常被路由器限流。

通过Wi-Fi 进行广播或多播非常耗费传输时间(airtime)。为了确保所有无线客户端都能成功接收信息，Wi-Fi多播一般速率位该频段的最低速率。一般来说，不同的Wi-Fi标准（如802.11a/b/g/n/ac/ax等）都有各自的最低速率设置。

举例来说：

- 对于802.11b/g标准，最低信号速率通常为1 Mbps。 (2.4Ghz)
- 对于802.11a标准，最低信号速率通常为6 Mbps。(5Ghz)
- 对于802.11n标准，最低信号速率可以在不同的频段下变化，一般为6 Mbps或者更高。（2.4/5Ghz）
- 对于802.11ac标准，最低信号速率通常在10 Mbps或者更高。（5Ghz）

[https://superuser.com/questions/1632104/why-is-my-wifi-slow-when-i-send-a-video-using-broadcast-udp-packets-on-a-differe](https://superuser.com/questions/1632104/why-is-my-wifi-slow-when-i-send-a-video-using-broadcast-udp-packets-on-a-differe)

当局域网中存在多个设备时这样的带宽并不能满足需求。因此当发送复杂数据时经常会丢包。

### 信号质量

测试场地的无线数据交互使用了两个路由器Ultra_Drones 和 Drones，之后飞机将迁移至 Ultra_Drones ，宁愿降低带宽也要保证信号质量 最终使用了 165 频段虽然只有20mhz 140mbps的速度 但是延时是真的低

路由器使用 IP段 10.42.0.1~ 10.42.0.254



### wifi共享

当共享网络时linux默认使用 ==10.42.0.0/24== 网段，而windows 使用 ==192.168.0.0/24== 网段