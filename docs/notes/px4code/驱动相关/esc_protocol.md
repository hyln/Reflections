---
title: esc_protocol
createTime: 2024/09/09 16:56:27
permalink: /px4code/driver/6h4y4yda/
---



#  PWM
## 标准pwm
对于无刷电调，pwm一般使用高电平脉宽代表油门百分比，一般来说，脉宽的范围是1~2ms对应油门0~100%。

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/pwm.png)

由于满油门需要在一个周期保证2ms高电平，因此最大控制频率为500hz。当然一个周期里不能只有高电平，每个周期后面跟一个在跟一个时间非常短的低电平，pwm频率适当降低（比如490hz）。

常见的pwm控制频率为 50~490hz。




对于电机控制来说有，有一些特殊的脉宽含义
900 $\mu s$  Disable 电机
最小pwm油门，一些电机需要一个最小油门才开始转 px4默认值1075

## Oneshot125
onesshot 是pwm的另一种实现，能够提高电机控制频率，对于oneshot125协议来说，其相当于把1~2ms的脉宽缩放至125$\mu s$~250$\mu s$,缩放公式如下
$$
y=125\cdot\frac{x}{1000},x\in[1000,2000]
$$

那么对于900 $\mu s$  Disable 信号，缩放后为112.5$\mu s$。

在px4 1.13的固件的四旋翼机型中，默认状态使用了oneshot125而不是标准pwm，因为对于1.13固件，PWM_MAIN_RATE 默认为0，
![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240402133548.png)
但是虽然使用了oneshot125，但是事实的控制频率并没有提高，依然为400hz，虽然高电平脉宽**是正常的**，但是周期波动却非常大。

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240402134506.png)

与之相比 nxtpx4的固件周期就稳定多了，控制频率也达到了2khz
![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240402134349.png)
作为参考，以下是 betaflight pwm输出(400hz)的周期情况
![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240402134721.png)

# Dshot
dshot就和pwm完全不同了，这是一种数字协议.
## 帧格式
每帧数据由16bit组成。包含
- 11 bit 油门值: 一共2048个值，0被保留作为disarmed。1-47 作为特殊指令。剩下48~2047作为油门值，分辨率是2000（Steps）；
- 1 bit **Telemetry request** ： 如果设置了此选项，telemetry数据将通过单独的通道发送回来。
- **4 bit CRC** 校验:。
也就是结构如下：
```
SSSSSSSSSSSTCCCC
```

特殊指令含义如下
1-5：beep（1= low freq. 5 = high freq）
6： esc信息请求（fw版本和通过tlm线发送的SN）
7：一个方向旋转
8：另一个方向旋转
9：3d模式关闭
10：3d模式打开
11：esc设置请求（saved settings over the TLM wire）
12：保存设置 

## 0和1的表示
Dshot 通过每个周期(period time)的高电平维持时间来表示0或1。在Dshot中，1的高电平维持时间是0的高电平维持时间的2倍。以Dshot600为例，0的高电平(T0H)时间为625ns，1的高电平时间(T1H)为1250ns。

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/pwm.png)
而每个周期（period time，每位数据传输时间）的时间由具体的协议规定，依然以Dshot600为例，其中的600代表的是1ms可传输的bit数，也就是每个bit为  $\frac{1}{600} ms$ ,也就是1.67us(  $T0H+T0L$ 或  $T1H+T1L$  )。
知道了每个周期的时间不难算出最大数据带宽和控制频率，即最大传输带宽为600khz。控制频率可达 $\frac{600}{16}$ 为37.5khz。

常用Dshot协议的关键参数如下。

| DSHOT | Bitrate    | T1H   | T0H   | Bit period time (µs) | Frame (µs) |
| ----- | ---------- | ----- | ----- | -------------------- | ---------- |
| 150   | 150kbit/s  | 5.00  | 2.50  | 6.67                 | 106.72     |
| 300   | 300kbit/s  | 2.50  | 1.25  | 3.33                 | 53.28      |
| 600   | 600kbit/s  | 1.25  | 0.625 | 1.67                 | 26.72      |
| 1200  | 1200kbit/s | 0.625 | 0.313 | 0.83                 | 13.28      |


## ESC Telemetry
> **这种查询方式几乎已经过时，而且速度太慢，无法做任何有意义的事情**

上述帧格式中提到了 Telemetry bit, 它用于向ESC请求信息，比如 ESC 的温度，或电机旋转的 eRPM、电流消耗和电压。
>注意：ESC 遥测不是双向 DSHOT，并且通信速度太慢，RPM 过滤无法正常工作。

ESC 遥测需要单独的电线将信息传输回飞行控制器。它通常仅适用于 KISS 和 BLHELI_32 电调。连接飞行控制器的电线可以在多个 ESC 之间共享，并连接到未使用的 UART 的 TX 引脚（用于半双工通信）。

它实际上并不是 DSHOT 的一部分,详细规范可以在 [rcGroups thread](http://www.rcgroups.com/forums/showatt.php?attachmentid=8524039&d=1450424877) 中找到。

## 双向Dshot
>双向 DSHOT 仅适用于 DSHOT 300 及更高版本。


双向 DSHOT 也称为反相 DSHOT，因为信号电平是反相的，因此 1 为低电平，0 为高电平。**这样做是为了让 ESC 知道我们正在双向模式下运行并且它应该发回 eRPM Telemetry数据包**。
启用双向 DHSOT 后，对于发送到 ESC 的每个帧，都会返回带有 eRPM 遥测数据的帧（在同一线路上，而不是另外的遥测线路上），从而将每秒可以发送的帧量减半。

一旦飞控发送完指令帧，它就会切换到接收模式并等待 ESC 返回 eRPM 帧。发送完指令帧后，有 30μs 的中断时间来切换线路、DMA 和计时器，以便转换成接收模式。

### eRPM 帧
ESC在双向DSHOT模式下发送的eRPM遥测帧也是16位值，因此与接收到的帧大小相同，但结构不同：
- **12 bit**: eRPM Data 12 位：eRPM 数据
- **4 bit**: CRC 4位：CRC

但是eRPM 数据的编码并不像油门帧的编码那么简单:
- **3 bit**：以下值需要左移以获得以 µs 为单位的周期的量
- **9 bit**:  周期基数
具体的这里不再详述，请看参考资料2
# 参考资料
1. [https://docs.px4.io/main/en/peripherals/esc_motors.html](https://docs.px4.io/main/en/peripherals/esc_motors.html)
2. [https://brushlesswhoop.com/dshot-and-bidirectional-dshot/](https://brushlesswhoop.com/dshot-and-bidirectional-dshot/)