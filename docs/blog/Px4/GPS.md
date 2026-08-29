---
title: GPS
createTime: 2024/10/10 07:39:52
permalink: /article/832yvj7m/
---

热

## GPS 数据格式

:::info
GPS的经纬度数据表示方法有
- 度(DD.DD): ==GeographicLib==
- 度+分(DDmm.mm): ==GPGGA==，
:::


差分龄期(Age of differential)

 _CORS_, also known as Continuously Operating Reference Stations, is one or several fixed and continuously operating GNSS reference stations

https://geo-matching.com/articles/the-principles-and-performance-of-cors-network-rtk-and-vrs



## 差分修正信号协议(RTCM)

RTCM（**Radio Technical Commission for Maritime Services**，海事无线电技术委员会）协议是一个用于差分全球导航卫星系统（**DGNSS**）的标准化数据格式。它主要用于提高全球导航卫星系统（如GPS、GLONASS、Galileo、北斗等）的定位精度，RTK（Real-Time Kinematic）技术常使用RTCM协议传输修正数据，提高定位精度。

### RTCM 协议简介

#### 1. **起源**

RTCM协议最初是为海事服务设计的，用于发送修正信号来提高海上船只的定位精度。后来，RTCM协议扩展到了其他GNSS相关的领域，如航空、农业、无人驾驶等。

#### 2. **差分GNSS（DGNSS）**

RTCM协议的核心目的是支持差分全球导航卫星系统（DGNSS）。DGNSS通过地面站对卫星信号进行修正，向接收机发送差分修正数据，能够将普通GNSS的定位精度从几米提升到亚米级甚至更高的精度。

#### 3. **RTCM消息格式**

RTCM消息通常采用二进制格式进行传输，以保证高效的数据传输。消息由多个字段组成，包括头部、消息类型、有效载荷和校验和。常见的RTCM消息包括：

- **RTCM 1001-1012**：GPS和GLONASS伪距和载波相位测量数据。
- **RTCM 1019**：GPS广播星历数据（卫星轨道信息）。
- **RTCM 1033**：接收机和天线信息。
- **RTCM 1074、1084、1094、1124**：针对GPS、GLONASS、Galileo和北斗系统的多信号观测数据。

### 基站RTCM报文设置
- RTCM 1006 基准站天线参考点坐标。
- rtcm 1033 接收机和 天线说明
- **RTCM 1074、1084、1094、1124** 差分报文

#### 4. **版本演进**

RTCM标准经过了多个版本的演进，主要版本包括：

- **RTCM 2.x**：早期版本，用于发送基本的伪距修正信息。数据量较小，但不支持现代多频、多系统GNSS信号。
- **RTCM 3.x**：支持多种GNSS系统（如GPS、GLONASS、Galileo、北斗等），增加了载波相位修正、星历数据等，能够提供更高精度的差分修正。RTCM 3.x版本成为目前的主流。


#### 6. **差分GPS的工作原理**

RTCM协议的工作原理基于地基增强系统（SBAS）或地面基准站。这些基准站接收来自GNSS卫星的信号，计算误差（如大气层延迟、卫星钟差），然后将修正信息编码为RTCM格式，广播给附近的移动接收机。接收机利用这些修正数据进行误差修正，从而大幅提高定位精度。



对延时的容忍度

RTCM 消息中包含时间戳

## 三角测量法


在 WGS84坐标系下， 至少需要3个卫星才可以定位，第四颗卫星可以用来矫正时间。


