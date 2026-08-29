---
title: usb_3_fpc
createTime: 2024/09/09 16:46:58
permalink: /normal_hw/nl3cste6/
---




# 为什么用网格地

- 大面积的地铜会导致FPC变得很硬
- 当表明采用电镀工艺时会影响的表面镀层厚度

当设计成网格地时可以有效解决爆板问题，网格的参数经验值为线宽线距设置为0.2mm作用

> 嘉立创推荐线宽线距为 0.2/0.2 mm


[http://www.pibomo.com/datum/315.html](http://www.pibomo.com/datum/315.html)
# 差分线绘制

长度差通常控制在5mil以内，补偿原则是哪里出现长度差补偿哪里


 为了减少串扰，在空间允许的情况下，其他信号网络及地离差分线的间距至少20mil(20mil是经验值)，覆地与差分线的距离过近将对差分线的阻抗产生影响；


# usb 连接

[https://www.usbzh.com/article/detail-888.html](https://www.usbzh.com/article/detail-888.html)


![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240503031733.png)

CC 端口如果在无 PD 快充协议的适配中（比如电脑 USB 接口，充电宝或普通电源适配中）则可以任意或悬空。



sbu 端口 用于视频传输 可以不连接
[https://electronics.stackexchange.com/questions/588126/are-usb-type-c-pull-resistor-neccesary-on-cc-and-sbu-pins](https://electronics.stackexchange.com/questions/588126/are-usb-type-c-pull-resistor-neccesary-on-cc-and-sbu-pins)


[https://www.chongdiantou.com/archives/38284.html](https://www.chongdiantou.com/archives/38284.html)


# 什么是补强板避让

# 第一次尝试

CC 悬空
SBU 

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240503050003.png)
