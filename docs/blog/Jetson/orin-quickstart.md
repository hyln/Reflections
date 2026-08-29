---
title: Jetson Orin Nx Quickstart
createTime: 2024/10/10 04:37:38
permalink: /article/gzrpxpiq/
tags:
    - linux
---

<!-- # Jetson Orin Nx Quickstart -->

## NX 套件 清单

- NX本体
    - AX200 网卡
    - 256G固态硬盘
    - 达秒科技载板
- Type-c转usb3.0 x2
- Micro hdmi转hdmi 
- 12V 3A 电源适配器
- GH1.25x8pin 转网口


## Orin Nx 参数

| 参数           | 值           |
| ------------- |:-------------:| 
| 电源输入      | 10~28V |
| type-c接口     | usb3.0 x 2,其中一路支持 Recovery + usb2.0 x1     |   
| zebra stripes | are neat      |

## 预置环境
- Jetpack 5.1.3
- ROS-noetic
    - mavros
    - realsense2_camera
- librealsense

## 使用技巧
### 屏幕键盘
选中`Screen Keyboard`，若屏幕键盘输入不上去， 先按一下 Enter


## 存在的隐患
- (失败), 12V 2A 适配器，无法开机。12V 3A 适配器可用
- 天线效果可能不太好，要注意
- (OTG)虚拟网卡很不稳定，是不是需要USB 3.0的线材，TODO
https://forums.developer.nvidia.com/t/coneection-problems/179380/6


:::info
以下为配置过程
:::

## Nvdia 环境参数

使用的环境版本信息为
- version : r35.5
- ubuntu20.04
- linux kernel 5.10
- jetpack 5.1.3

## 固件烧写

:::warning TODO
等待补全
:::
### SDK Manager

:::info 
以烧录 jetpack 5.1.3 版本为例
:::

#### 准备

- 一根usb3.0 type-a 到type-c
- 12V 3A 电源线

#### Flash 流程

- 打开SDK Manager
- 将usb线连接至主机和jetson设备
- 通电前按住 Recoverey
- 通电
- 等待识别到Jetson设备

### 手动烧写


Jetpack 5.1.3

[Jetson Linux | NVIDIA Developer](https://developer.nvidia.com/embedded/jetson-linux-r3550)


1. 下载[Driver Package (BSP)](https://developer.nvidia.com/downloads/embedded/l4t/r35_release_v5.0/release/jetson_linux_r35.5.0_aarch64.tbz2)
2. 

==命令行烧写镜像==

https://developer.nvidia.com/embedded/jetson-linux-archive


https://docs.nvidia.com/jetson/archives/r34.1/DeveloperGuide/text/IN/QuickStart.html#to-flash-jetson-developer-kit-operating-software 

## 开始配置

可以考虑先[换源](#apt)
```bash
sudo apt update
sudo apt install htop curl openssh-server
```

## 换源
### APT

### pip （原生python）
```
sudo apt install python3-pip
sudo pip3 config set global.index-url https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple

```

## 安装Jetpack

[官方教程](https://docs.nvidia.com/jetson/jetpack/install-setup/index.html#package-management-tool)

```bash
cat /etc/apt/sources.list.d/nvidia-l4t-apt-source.list
# 若文件中包含
deb https://repo.download.nvidia.com/jetson/common r35.5 main
deb https://repo.download.nvidia.com/jetson/t234 r35.5 main
deb https://repo.download.nvidia.com/jetson/ffmpeg r35.5 main
####### 之后进行
sudo apt update
sudo apt install nvidia-jetpack
```


>可以发现 Jetpack会自动安装相关版本的CUDA、cuDNN、TensorRT等  
  其中 cuDNN 默认安装路径在 /usr/lib/aarch64-linux-gnu 下  
  CUDA 默认安装路径在 /usr/local/cuda 下
  其中，默认安装的
  OpenCV: 4.5.4 with CUDA: NO




## [Jtop](https://rnext.it/jetson_stats/) 安装

```bash
sudo apt install python3-pip
sudo pip3 install -U jetson-stats
```

## install Ros

```bash
# 使用tsinghua源
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ focal main" | sudo tee -a /etc/apt/sources.list.d/ros-latest.list
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
sudo apt update

# install ros
sudo apt install ros-noetic-desktop-full
```

## 常用软件安装
### Nomachine 的安装

```bash
# 设置代理
export https_proxy=http://192.168.1.10:7890
wget https://download.nomachine.com/download/8.14/Arm/nomachine_8.14.2_1_arm64.deb
sudo dpkg -i nomachine_8.14.2_1_arm64.deb
rm nomachine_8.14.2_1_arm64.deb
```


> 没有安装CUPS， 似乎影响远程打印机的使用，应该可以不用



### Eigen install
```bash
sudo apt-get install -y libeigen3-dev
sudo cp -r /usr/include/eigen3/Eigen/ /usr/include/
```
#### 手动安装
```bash
sudo apt-get remove libeigen3-dev 
# 过程中会删除 ，如果要用 visionworks需要重新装
# Removing libvisionworks-sfm-dev (0.90.4.501) ...
# Removing libvisionworks-tracking-dev (0.88.2.501) ...
# Removing libvisionworks-samples (1.6.0.501) ...
cd ~/Downloads/
wget -O eigen.zip https://gitlab.com/libeigen/eigen/-/archive/3.3.7/eigen-3.3.7.zip 
#check version
unzip eigen.zip
mkdir eigen-build && cd eigen-build
cmake ../eigen-3.3.7/ && sudo make install
pkg-config --modversion eigen3 # Check Eigen Version
```

### Ceres install
```bash
sudo apt-get install -y libgoogle-glog-dev libgflags-dev
sudo apt-get install -y libatlas-base-dev libeigen3-dev libsuitesparse-dev
cd ~ && mkdir -p install && cd install
curl http://ceres-solver.org/ceres-solver-2.1.0.tar.gz -o cere-2.1.tar.gz
tar zxf cere-2.1.tar.gz
mkdir ceres-bin
cd ceres-bin
cmake ../ceres-solver-2.1.0
make -j8
sudo make install
# 验证，输入
ls /usr/local/lib/cmake/|grep Ceres
# 若返回 红色的Ceres,则安装成功
```

## install rospkg

### mavros
```bash
# 依赖安装
sudo usermod -a -G dialout $USER
sudo apt-get remove modemmanager -y
sudo apt install gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-gl -y
sudo apt install libfuse2 -y
sudo apt install libxcb-xinerama0 libxkbcommon-x11-0 libxcb-cursor-dev -y

sudo apt install ros-noetic-mavros*
export https_proxy=http://192.168.1.10:7890
export http_proxy=http://192.168.1.10:7890
source /opt/ros/noetic/lib/mavros/install_geographiclib_datasets.sh
```

### realsense

Librealsense2 SDK 支持两种用于与 Linux 平台上的 RealSense 设备通信的 API：  
1. UVC、USB 和 HID 的 Linux 原生内核驱动（分别为 Video4Linux 和 IIO）   
2. 使用`RSUSB` - UVC 和 HID 数据协议的用户空间实现，通过选择 SDK 的`-DFORCE_RSUSB_BACKEND`标志（在 v.2.30 之前的 SDK 版本中又称为`-DFORCE_LIBUVC` ）进行封装和激活。

:::info
realsense提供了[jetson的安装教程](https://dev.intelrealsense.com/docs/nvidia-jetson-tx2-installation),
此文档使用第一种方法进行安装，但是在orin中也存在丢包的现象，只是比edge2少些
:::


#### 安装使用 RSUSB 后端，无需内核补丁

为了使用`RSUSB`方法构建 SDK 并避免内核修补过程，请参阅[libuvc_installation.sh](https://github.com/IntelRealSense/librealsense/blob/master/scripts/libuvc_installation.sh)脚本了解详细信息。如果您安装了 CUDA 开发工具包，请不要忘记添加`-DBUILD_WITH_CUDA=true`以获得最佳性能。

#### realsense2_camera rospkg
```bash
sudo apt install ros-noetic-realsense2-camera*
```

## opencv 版本冲突

JetPack 5.1.3 includes ==OpenCV 4.5.4==，而ros-desktop-full 依赖于 OpenCV 4.2.0 (是从ros的源里下载的)，这导致了==版本冲突==。由于apt安装，opencv的包名是完全相同的，即都叫`libopencv`。
### 现象
会导致编译vins时报警告
```bash
/usr/bin/ld: warning: libopencv_video.so.4.2, needed by /home/nvidia/ego_planner_v1_all_in_one/devel/lib/libvins_lib.so, may conflict with libopencv_video.so.4.5 /usr/bin/ld: warning: libopencv_core.so.4.2, needed by /home/nvidia/ego_planner_v1_all_in_one/devel/lib/libvins_lib.so, may conflict with libopencv_core.so.4.5 /usr/bin/ld: warning: libopencv_imgcodecs.so.4.5, needed by /home/nvidia/ego_planner_v1_all_in_one/devel/lib/libvins_lib.so, may conflict with libopencv_imgcodecs.so.4.2 /usr/bin/ld: warning: libopencv_objdetect.so.4.2, needed by /usr/lib/aarch64-linux-gnu/libopencv_face.so.4.2.0, may conflict with libopencv_objdetect.so.4.5
```
以及运行时报错
```bash
terminate called after throwing an instance of 'cv::Exception'
  what():  OpenCV(4.5.4) /home/ubuntu/build_opencv/opencv/modules/core/src/alloc.cpp:73: error: (-4:Insufficient memory) Failed to allocate 419969809033920 bytes in function 'OutOfMemoryError'

```
### 解决方案
这里提供一个安装顺序
```bash
apt update
apt install jetpack
# 1.安装结束后，注释掉jetson的源
apt update
apt remove libopencv*

apt install libopencv-dev
apt install ros-noetic-desktop-full

# 先前删除的时候realsense也会被删除
# apt install ros-noetic-realsense2_camera
```
### 分析一下opencv的目录 arm

当使用apt安装时
- .so: `/usr/lib/aarch64-linux-gnu`
- include: `/usr/include/opencv4`
- cmake: `/usr/lib/aarch64-linux-gnu/cmake/opencv4/`
- pkg-config: `/usr/lib/aarch64-linux-gnu/pkgconfig/opencv4.pc`



## 查看驱动

lsmod 可以查看所有驱动
 - iwlwifi: AX210驱动
 - r8168: 有线网卡 RTL8111/8168

通过 lspci -k，可以看到pci设备具体使用了哪个驱动
通过lsusb -t，可以看到 usb设备具体使用哪个驱动

