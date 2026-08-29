---
title: rk3588使用ffmpeg
createTime: 2024/09/09 16:43:45
permalink: /normal_hw/hff0uxj1/
---


RK3588标称解码能力为 
- h264 8K@30fps
- h265 8K@60fps

提供了适配了 Rockchip MPP (Media Process Platform，rockchip中的硬件解码器的ffmpeg
[https://github.com/nyanmisaka/ffmpeg-rockchip](https://github.com/nyanmisaka/ffmpeg-rockchip)
# 安装
ffmpeg-rockchip 中提供了[安装方法](https://github.com/nyanmisaka/ffmpeg-rockchip/wiki/Compilation), 但是感觉写的不够清楚，他的意思是要先去找官方教程上的依赖安装部分，安装所需的依赖，(ffmpeg为编解码器提供了统一的接口，在安装教程中出现了多种编解码库的安装，是可选的，对于rk平台，我们肯定是为了使用硬件解码器，因此我们可以一个也不用安装)

以Vim2 edge2 ubuntu20.04为例，我成功的版本如下:
```bash
# 安装依赖
sudo apt-get update -qq && sudo apt-get -y install \
  autoconf \
  automake \
  build-essential \
  cmake \
  git-core \
  libass-dev \
  libfreetype6-dev \
  libgnutls28-dev \
  libmp3lame-dev \
  libsdl2-dev \
  libtool \
  libva-dev \
  libvdpau-dev \
  libvorbis-dev \
  libxcb1-dev \
  libxcb-shm0-dev \
  libxcb-xfixes0-dev \
  meson \
  ninja-build \
  pkg-config \
  texinfo \
  wget \
  yasm \
  zlib1g-dev
sudo apt install libunistring-dev libaom-dev libdav1d-dev

# 构建
# Build MPP
mkdir -p ~/dev && cd ~/dev
git clone -b jellyfin-mpp --depth=1 https://github.com/nyanmisaka/mpp.git rkmpp
pushd rkmpp
mkdir rkmpp_build
pushd rkmpp_build
cmake \
    -DCMAKE_INSTALL_PREFIX=/usr \
    -DCMAKE_BUILD_TYPE=Release \
    -DBUILD_SHARED_LIBS=ON \
    -DBUILD_TEST=OFF \
    ..
make -j $(nproc)
make install

# Build RGA
mkdir -p ~/dev && cd ~/dev
git clone -b jellyfin-rga --depth=1 https://github.com/nyanmisaka/rk-mirrors.git rkrga
meson setup rkrga rkrga_build \
    --prefix=/usr \
    --libdir=lib \
    --buildtype=release \
    --default-library=shared \
    -Dcpp_args=-fpermissive \
    -Dlibdrm=false \
    -Dlibrga_demo=false
meson configure rkrga_build
ninja -C rkrga_build install

# Build the minimal FFmpeg (You can customize the configure and install prefix)
mkdir -p ~/dev && cd ~/dev
git clone --depth=1 https://github.com/nyanmisaka/ffmpeg-rockchip.git ffmpeg
cd ffmpeg
./configure --prefix=/usr --enable-gpl --enable-version3 --enable-libdrm --enable-rkmpp --enable-rkrga
# 这里遇到了一个bug但是记不得了
# 可以排查一下是否前面的都安装了
make -j $(nproc)

# Try the compiled FFmpeg without installation
# 你现在的位置应该是 ~/dev/ffmpeg
./ffmpeg -decoders | grep rkmpp
./ffmpeg -encoders | grep rkmpp
./ffmpeg -filters | grep rkrga

# Install FFmpeg to the prefix path
# 需要sudo，主体不需要，是doc需要
make install

```


# rga
RGA (Raster Graphic Acceleration Unit)是一个独立的2D硬件加速器，可用于加速点/线绘制，执行图像缩放、旋转、bitBlt、alpha混合等常见的2D图形操作。


# encode video | C++ example

```cmakelists
cmake_minimum_required(VERSION 3.0)

set(CMAKE_CXX_STANDARD 14)

project(RealSenseExample)

  

find_package(realsense2 REQUIRED)
find_package(OpenCV REQUIRED)
find_package(ZLIB REQUIRED)

  

# Find FFmpeg package

# add_executable(realsense_example main.cpp)

# target_link_libraries(realsense_example PRIVATE realsense2

# ${OpenCV_LIBS}

# /home/emnavi/dev/ffmpeg

# )

# target_include_directories(realsense_example PRIVATE

# ${OpenCV_INCLUDE_DIRS}

# /home/emnavi/dev/ffmpeg

# )

add_executable(encode_example encode_video.cpp)

target_link_libraries(encode_example PRIVATE

realsense2

${OpenCV_LIBS}

/home/emnavi/dev/ffmpeg/libavcodec/libavcodec.a

/home/emnavi/dev/ffmpeg/libavutil/libavutil.a

/home/emnavi/dev/ffmpeg/libavformat/libavformat.a

pthread

X11

m

vdpau

va

rockchip_mpp

drm

va-drm

ZLIB::ZLIB

swresample

lzma

va-x11

rga

)

target_include_directories(encode_example PRIVATE

${OpenCV_INCLUDE_DIRS}

/home/emnavi/dev/ffmpeg

  

)
```


```c++
```