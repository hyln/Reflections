---
title: opencv-install
createTime: 2024/10/10 04:32:54
permalink: /article/4r1kwxab/
tags:
    - 源码安装
    - linux
---


## 版本对应

| **OpenCV** | **CUDA** | **CUDA(Minimum)** | **CC(x86)** | **CC(Arm)** | **发布日期** |
| --- | --- | --- | --- | --- | --- |
| next (5.0.0相当) | 11.2 | 6.5 | 5.0 - 8.6 | 3.2,5.3,6.2,7.0,7.2 | - |
| 4.5.1 | 11.2 | 6.5 | 5.0 - 8.6 | 3.2,5.3,6.2,7.0,7.2 | [2020/Dec/22](https://github.com/opencv/opencv/commit/1363496c1106606684d40447f5d1149b2c66a9f8) |
| 3.4.13 | 11.2 | 6.5 | 5.0 - 8.6 | 3.2,5.3,6.2,7.0,7.2 | [2020/Dec/22](https://github.com/opencv/opencv/commit/8869dc776287a1b43b252a91ceb36cc26a56eed4) |
| 4.5.0 | 11.1 | 6.5 | 5.0 - 8.6 | 3.2,5.3,6.2,7.0,7.2 | [2020/Oct/12](https://github.com/opencv/opencv/commit/d5fd2f0155ffad366f9ac912dfd6d189a7a6a98e) |
| 3.4.12 | 11.1 | 6.5 | 5.0 - 8.6 | 3.2,5.3,6.2,7.0,7.2 | [2020/Oct/11](https://github.com/opencv/opencv/commit/dc15187f1b6784ef2ece30dae223570811eaddff) |
| 4.4.0 | 11.0 | 6.5 | 2.0 - 8.0 | 3.2,5.3,6.2,7.0,7.2 | [2020/Jul/18](https://github.com/opencv/opencv/commit/c3bb57afeaf030f10939204d48d7c2a3842f4293) |
| 4.3.0 | 10.2 | 6.5 | 2.0 - 7.5 | 3.2,5.3,6.2,7.2 | [2020/Apr/3](https://github.com/opencv/opencv/commit/01b2c5a77ca6dbef3baef24ebc0a5984579231d9) |
| 4.2.0 | 10.2 | 6.5 | 2.0 - 7.5 | 3.2,5.3,6.2,7.2 | [2019/Dec/20](https://github.com/opencv/opencv/commit/bda89a6469aa79ecd8713967916bd754bff1d931) |
| 4.1.0 | 10.1 | 6.5 | 2.0 - 7.5 | 3.2,5.3,6.2,7.2 | [2019/Apr/8](https://github.com/opencv/opencv/commit/371bba8f54560b374fbcd47e7e02f015ac4969ad) |
| 4.0.0 | 10.0 | 6.5 | 2.0 - 7.5 | 3.2,5.3,6.2,[7.0,7.5](https://qiita.com/tomoaki_teshima/items/4401349431ce266dc319) | [2018/Nov/18](https://github.com/opencv/opencv/commit/75ed282b20770a7a9b490102fd2e0b4fa26223e5) |
| 3.4.0 | 9.0 | 6.5 | 2.0 - 7.0 | 3.2,5.3,6.2,[7.0 7.5](https://qiita.com/tomoaki_teshima/items/4401349431ce266dc319) | [2017/Dec/23](https://github.com/opencv/opencv/commit/6d4f66472e14b29b8e1623859cfebfdc67f677c3) |
| 3.3.0 | 8.0 | 6.5 | 2.0 - 6.1 | 3.2,5.3,6.2 | [2017/Aug/4](https://github.com/opencv/opencv/commit/4af3ca4e4d7be246a49d751a79c6392e848ac2aa) |
| 3.2.0 | 8.0 | 6.5 | 2.0 - 6.1 | 3.2,5.3 | [2016/Dec/23](https://github.com/opencv/opencv/commit/70bbf17b133496bd7d54d034b0f94bd869e0e810) |
| 3.1.0 | 7.5 | 4.2 | 1.1 - 3.5 | 3.2,5.3 | [2015/Dec/19](https://github.com/opencv/opencv/commit/92387b1ef8fad15196dd5f7fb4931444a68bc93a) |
| 3.0.0 | 7.0 | 4.2 | 1.1 - 3.5 | 3.2,5.3 | [2015/Jun/4](https://github.com/opencv/opencv/commit/c12243cf4fccf5df7b0270a32883986b373dca7b) |
| 2.4.13.7 | 9.2 | 3.0 | 1.1 - 3.5 | 3.2,5.3 | [2018/Jul/2](https://github.com/opencv/opencv/commit/51cfa519249c89d24035b3f96315ad997deb300f) |



<!-- # opencv 安装 -->
## ROS 的默认OpenCV版本

|ROS Version|Melodic|Noetic|
|-----------|-------|------|
|OpenCV Version|3.*|4.2|

:::info
默认安装的opencv均不支持cuda
:::

## 多版本Opencv 

opencv 经常和 opencv_contrib 一起安装，有时要配合cv_bridge一起使用，以下给出几个安装示例

:::: tabs

@tab 3.4.18
测试环境：==ubuntu20.04==
```bash
wget https://codeload.github.com/opencv/opencv/zip/refs/tags/3.4.18 -O opencv.zip
unzip opencv.zip
cd opencv-3.4.18/
mkdir build && cd build
cmake ../opencv-3.4.18
make -j6   
sudo make install
```


@tab 4.5.5+contrib
测试环境：==ubuntu20.04==
```bash
wget https://github.com/opencv/opencv/archive/refs/tags/4.5.5.zip -O opencv.zip
wget https://github.com/opencv/opencv_contrib/archive/4.x.zip -O opencv_contrib.zip

unzip opencv.zip
unzip opencv_contrib.zip

mkdir build && cd build
cmake -DOPENCV_EXTRA_MODULES_PATH=../opencv_contrib-4.5.5/modules ../opencv-4.5.5
make -j6   
sudo make install
```


@tab 4.5.5 with cuda
测试环境：==ubuntu20.04==

ROS自带的opencv不包含CUDA加速，要使用cuda加速只能选择自行编译。
:::warning
如何知道`CUDA_ARCH_BIN`
- 对于 Jetson设备可以通过`jtop`，查看CUDA_ARCH_BIN, Orin Nx 是 8.7，
- 在[官网查看](https://developer.nvidia.com/cuda-gpus)

你可以通过以下命令确定当前cuda版本支持的硬件算力(`CUDA_ARCH_BIN`)
```bash
nvcc --list-gpu-arch
```
- 40系显卡只能用 cuda12了
- opencv3.4.20 + cuda 12.8无法编译
:::

```bash
sudo apt update && sudo apt install -y cmake g++ wget unzip
wget https://github.com/opencv/opencv/archive/refs/tags/4.5.5.zip -O opencv.zip

unzip opencv.zip
cd opencv-4.5.5/
mkdir -p build && cd build
 
# Configure
CUDA_ARCH_BIN=8.9 # 如果是4060Ti
CUDA_ARCH_BIN=8.7 # 如果是ORIN_NX

cmake -D CMAKE_BUILD_TYPE=RELEASE \
        -D CMAKE_INSTALL_PREFIX=/usr/local \
        -D WITH_CUDA=ON \
        -D CUDA_ARCH_BIN=$CUDA_ARCH_BIN \
        -D CUDA_ARCH_PTX="" \
        -D ENABLE_FAST_MATH=ON \
        -D CUDA_FAST_MATH=ON \
        -D WITH_CUBLAS=ON \
        -D WITH_LIBV4L=ON \
        -D WITH_GSTREAMER=ON \
        -D WITH_GSTREAMER_0_10=OFF \
        -D WITH_QT=ON \
        -D WITH_OPENGL=ON \
        -D CUDA_NVCC_FLAGS="--expt-relaxed-constexpr" \
        -D WITH_TBB=ON  ..

# Build
cmake --build 
```

@tab 4.11 with cuda(12.8) + contrib

测试环境：==ubuntu20.04==

```bash
mkdir -p opencv4.11_compile && cd opencv4.11_compile
sudo apt update && sudo apt install -y cmake g++ wget unzip
wget https://github.com/opencv/opencv/archive/refs/tags/4.11.0.zip -O opencv.zip
wget https://github.com/opencv/opencv_contrib/archive/refs/heads/4.x.zip -O opencv_contrib.zip

unzip opencv.zip
unzip opencv_contrib.zip
# Create build directory and switch into it
mkdir -p build && cd build
 
# Configure
CUDA_ARCH_BIN=8.9 # 如果是4060Ti
CUDA_ARCH_BIN=8.7 # 如果是ORIN_NX

        

cmake -D CMAKE_BUILD_TYPE=RELEASE \
        -D CMAKE_INSTALL_PREFIX=/usr/local \
        -D WITH_CUDA=ON \
        -D CUDA_ARCH_BIN=$CUDA_ARCH_BIN \
        -D CUDA_ARCH_PTX="" \
        -D ENABLE_FAST_MATH=ON \
        -D CUDA_FAST_MATH=ON \
        -D WITH_CUBLAS=ON \
        -D WITH_LIBV4L=ON \
        -D WITH_GSTREAMER=ON \
        -D WITH_GSTREAMER_0_10=OFF \
        -D WITH_QT=ON \
        -D WITH_OPENGL=ON \
        -D CUDA_NVCC_FLAGS="--expt-relaxed-constexpr" \
        -D WITH_TBB=ON \
        -D OPENCV_EXTRA_MODULES_PATH=../opencv_contrib-4.x/modules \
        ../opencv-4.11.0
make -j20
```


::::


- 如果你需要安装cv_bridge,请看[多版本cv-bridge](#多版本cv-bridge)
- 如果你使用Cmake 构建的项目需要使用 新构建的opencv，请查看[多版本使用](#多版本使用)

### 安装 

你可以选择==安装==或者==不安装==
- 如果安装: 你需要sudo make install
- 如果不安装：不需要做任何操作

::: info
假如程序使用CMake构建，且需要调用Opencv，在使用 `find(OpenCV)` 时，其实是找`OpenCVConfig.cmake`文件。默认情况下CMake会从`/usr/local/share/cmake-<version>/Modules`或`/usr/share/cmake/Modules`路径查找(对于opencv是`/usr/local/share/OpenCV`)。如果你没有安装，CMake是找不到的，此时我们可以指定路径
```bash
set(OpenCV_DIR XXXXXXXXXXXXXXXX)

# 比如 set(OpenCV_DIR /home/xx/fisheyews/opencv4.11_compile/build)
```
:::


## 多版本cv-bridge


::: code-tabs
@tab ubuntu18.04
```bash
mkdir cv_bridge_ws &&cd cv_bridge_ws
mkdir src && cd src
wget https://github.com/ros-perception/vision_opencv/archive/refs/heads/melodic.zip
unzip melodic.zip
cd vision_opencv-melodic/
# 设置所有CMakeLists.txt 的 OpenCV_DIR,使其链接到对应的版本，对于自行编译的版本,你需要在vision_opencv的每一个CMakeLists.txt都要添加类似如下语句
# set("OpenCV_DIR" "/home/hao/Lib_Install/opencv-3.4.3/build")
# 最后 catkin_make
```

@tab ubuntu20.04
```bash
mkdir cv_bridge_ws &&cd cv_bridge_ws
mkdir src && cd src
wget https://github.com/ros-perception/vision_opencv/archive/refs/heads/noetic.zip
unzip noetic.zip
cd vision_opencv-noetic/
# 设置所有CMakeLists.txt 的 OpenCV_DIR,使其链接到对应的版本，比如
# set(OpenCV_DIR /usr/local/share/OpenCV)
# 对于自行编译的版本
# set("OpenCV_DIR" "/home/hao/Lib_Install/opencv-3.4.3/build")

# 最后 catkin_make
```
:::
使用请查看[多版本使用](#多版本使用)

## 多版本使用
```bash
# 为了不安装使用，你需要手动在需要编译的project的CMakeLists.txt设置
# 根据实际情况修改
set(OpenCV_DIR /usr/local/share/OpenCV)
set(cv_bridge_DIR /home/nvidia/cv_bridge_ws/devel/share/cv_bridge/cmake)
```


