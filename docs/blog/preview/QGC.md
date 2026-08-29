---
title: QGC
createTime: 2024/10/10 06:55:57
permalink: /article/ur98kbwk/
---


## QGC安装
qgc依赖
```bash
sudo usermod -a -G dialout $USER
sudo apt-get remove modemmanager -y
sudo apt install gstreamer1.0-plugins-bad gstreamer1.0-libav gstreamer1.0-gl -y
sudo apt install libfuse2 -y
sudo apt install libxcb-xinerama0 libxkbcommon-x11-0 libxcb-cursor-dev -y
```

QGC 版本 V4.2.2 感觉还好
