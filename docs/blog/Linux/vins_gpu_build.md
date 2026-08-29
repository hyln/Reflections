---
title: Vins_GPU  构建
createTime: 2024/10/15 13:38:28
permalink: /article/0y4guace/
---


## 准备环境

::: info
以下以jetson设备为例
:::

- Opencv:安装请参考[多版本Opencv安装](opencv-install.md#编译with-cuda)
- cv_bridge:安装请参考[多版本cv_bridge安装](opencv-install.md#多版本cv-bridge)

## vins_gpus

```bash
mkdir -p catkin_ws/src
cd catkin_ws/src

git clone https://github.com/pjrambo/VINS-Fusion-gpu.git
# 现在你需要在CMakeLists 中设置 OpenCV_DIR , cv_bridge_DIR 
# set(OpenCV_DIR /usr/local/share/OpenCV)
# set(cv_bridge_DIR /home/nvidia/cv_bridge_ws/devel/share/cv_bridge/cmake)
# 回到catkin_ws
catkin_make

```


