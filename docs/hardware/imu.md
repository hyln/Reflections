---
title: imu
createTime: 2026/08/30 01:40:33
permalink: /article/n3qie3cn/
---

- 采样频率

IMU通常可以配置 **ODR（Output Data Rate），这个是传感器输出数据的频率。**

DLPF（Digital Low-Pass Filter）

有一个  ICM42688 的 配置

![](./pic/imu/imu_signal_path.png)


![](./pic/imu/imu_guide.png)


# Basic exponential smoothing 简单指数平滑

一阶低通滤波和简单指数平滑数学上是等价的，差别主要在应用场景和参数含义上.