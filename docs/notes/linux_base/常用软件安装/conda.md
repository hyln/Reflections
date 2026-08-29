---
title: conda
createTime: 2024/09/09 13:23:32
permalink: /linux_base/common_pkg_install/cmwahr1a/
---


```bash
# 常用指令
conda create -n XXXXX python=3.8  #python 一般大于3.8

conda activate XXXXX

python # 此时python在XXXXX 环境中了

pip install 包名

conda deactivate

conda env list

```



# 换软件镜像源

## conda 换源
```bash
# 更换中科大的源
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/main/
conda config --set show_channel_urls yes
```
[https://mirrors.ustc.edu.cn/help/anaconda.html](https://mirrors.ustc.edu.cn/help/anaconda.html)
## pip 换源
```
# 换清华源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```
[https://mirrors.tuna.tsinghua.edu.cn/help/pypi/](https://mirrors.tuna.tsinghua.edu.cn/help/pypi/)

## apt换源

有两个办法，图形化的方法和命令行的方法

### 图形化


### 命令行
```bash
sudo gedit /etc/apt/sources.list
```

将下面代码复制进去，保存退出，最后 `sudo apt update` 更新。 
```
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```