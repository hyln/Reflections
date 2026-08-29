---
title: realsense
createTime: 2024/10/20 12:48:05
permalink: /normal_hw/camera/m2aqm876/
---

## 命名

**D430i**
当D435i 缺少RGB摄像头时，设备会被识别为D430i。在x86设备中 realsense-veiwer 会将其识别，并正常使用，但是当使用realsense-ros,会提示
> Unsupported device! Product ID: 0x0B4B


幸运的是 在4.54.1 (2023-06-27) 版本中，添加了这个支持 ，可惜，新版本不支持ROS1
[https://index.ros.org/p/realsense2_camera/](https://index.ros.org/p/realsense2_camera/)

相机的问题
[https://github.com/IntelRealSense/realsense-ros/issues/2149](https://github.com/IntelRealSense/realsense-ros/issues/2149)
[https://github.com/IntelRealSense/realsense-ros/issues/2141](https://github.com/IntelRealSense/realsense-ros/issues/2141)
[https://github.com/IntelRealSense/librealsense/issues/11553](https://github.com/IntelRealSense/librealsense/issues/11553)
[https://github.com/IntelRealSense/librealsense/issues/11210](https://github.com/IntelRealSense/librealsense/issues/11210)
另外D430 可以用realsense 直接读到，D435i 是不行的。
