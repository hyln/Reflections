---
title: rtk_config
createTime: 2025/01/19 21:08:23
permalink: /article/y33qv7gg/
tags:
    - 硬件
---

> 本文针对um980和um982

px4 飞控需要 `gpgga` 和 `gprmc` 两个类型的消息。

流动站：
```
unlog com1\r\n
unlog com2\r\n
mode rover\r\n
gpgga com1 0.1\r\n
gprmc com1 0.1\r\n
saveconfig\r\n
```

基站1:(基站编号0~4095)
```
unlog com1\r\n
unlog com2\r\n
# 开始配置
mode base 1 time 60 1.5 2.5\r\n
rtcm1006 com2 10\r\n
rtcm1033 com2 10\r\n
rtcm1074 com2 1\r\n
rtcm1124 com2 1\r\n
rtcm1084 com2 1\r\n
rtcm1094 com2 1\r\n
saveconfig\r\n
```

基站2:
```
unlog com1\r\n
unlog com2\r\n
# 开始配置
mode base 2 time 60 1.5 2.5\r\n
rtcm1006 com2 10\r\n
rtcm1033 com2 10\r\n
rtcm1074 com2 1\r\n
rtcm1124 com2 1\r\n
rtcm1084 com2 1\r\n
rtcm1094 com2 1\r\n
saveconfig\r\n
``` 

