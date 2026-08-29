---
title: LUCKFOX_driver
createTime: 2026/08/30 01:49:21
permalink: /article/2znliexo/
---



LUCKFOX 驱动开发


**Luckfox Pico Mini B M**

# 开发环境构建

## 基于docker的开发环境

```bash
(base) hao@hao-CVN-B760I-A-FROZEN-WIFI:/media/hao/WorkSpace/EventCamDev/build_luckfox_docker/compile$ sudo docker run -it --rm --name luckdocker -v $(pwd):/app luckfox /bin/bash
```

## 默认密码

```bash
# Buildroot
Login: root
Password: luckfox
Static IP: 172.32.0.93
# Ubuntu
Login: pico
Password: luckfox
Static IP: 172.32.0.70
```

## **在 Linux 环境下进行烧录（x86_64 平台）**

upgrade_tool 是一款专为 Linux 设计的工具，用于烧录原厂固件、RK 固件和分区镜像到 eMMC。它是由 Rockchip 提供的闭源命令行工具。该工具**仅支持使用 SPI NAND 闪存进行烧录**。

SPI 烧录

```bash

cd /media/hao/WorkSpace/EventCamDev/build_luckfox_docker/upgrade_tool_v2.17/upgrade_tool_v2.17_for_linux
./upgrade_tols -la /media/hao/WorkSpace/EventCamDev/build_luckfox_docker/compile

ol  uf ../../compile/luckfox-pico/output/image/update.img
```

# 驱动移植

## 设备树修改

> 完成
> 

rv1103-luckfox-pico-ipc.dtsi






## 修改makefile

### .MK文件

BoardConfig-SD_CARD-Ubuntu-RV1103_Luckfox_Pico_Mini_B-IPC.mk

同级有一个 overlay

没有找到sc3336 dtsi 使用的地方

- drv_sc3336.c
- drv_sc3336p.c

.rv1103g-luckfox-pico-mini.dtb.dts.tmp 似乎只有一个 dts ，被自动汇总了

BoardConfig-SD_CARD-Ubuntu-RV1103_Luckfox_Pico_Mini_B-IPC.mk 加载了

```makefile
export RK_KERNEL_DTS=rv1103g-luckfox-pico-mini.dts

```

rv1103g-luckfox-pico-mini.dts 包含了 rv1103-luckfox-pico-ipc.dtsi

## ISP 部分

> 只需要摘出来
> 

对于一般的相机 需要提供一个IQ（Image Quality）file ,CAC calibration bin files（色差校准二进制文件）

- CAC（Chromatic Aberration Correction）

## hpmcu

不知道 **hpmcu 对我读取有什么影响**

假设我们不考虑 **hpmcu**

## 相机驱动移植

rv1106使用的是 5.10的kernel，

编译驱动的指令是

rv1106 和rv1103 几乎共用设备树

minib mipi接口的I2c是 i2c4: i2c@ff470000

```bash
[root@luckfox device-tree]# cd i2c@ff470000/
[root@luckfox i2c@ff470000]# ls
#address-cells   clock-frequency  clocks           interrupts       pinctrl-0        reg              sc4336@30        status
#size-cells      clock-names      compatible       name             pinctrl-names    sc3336@30        sc530ai@30

```

我们在

sysdrv/source/kernel/drivers/media/i2c 

增加 genx320的驱动

/media/hao/WorkSpace/EventCamDev/build_luckfox_docker/compile/luckfox-pico

pi5 

:/media/hao/WorkSpace/raspberryPi_manual_build/linux/drivers/media/i2c$

# 局部修改

```bash
# 修改驱动为了生成 ko文件 ，需要 
./build.sh driver
# 更改了设备树必须
./build.sh kernel
# build driver 生成的ko文件最终需要存储在 oem文件夹中， 更新到oem 文件夹需要
./build.sh firmware
# 想升级固件必须
./build.sh updateimg
# 实在不知道怎么办
 ./build.sh all 
```

驱动需要手动加载

没有加载其他设备的原因是 没有ko

在 Buildroot 或一些嵌入式系统中，你可能看不到 `modprobe`，可能因为：

- 模块用 `insmod` 手动加载；
- 模块被静态编译进内核；
- 系统太精简，没有引入 `kmod` 包。

rv1103提供了 一个输出时钟的引脚，在i2c的驱动中控制其开始和结束

# 进入系统

```bash
ssh root@172.32.0.93
# Buildroot Password: luckfox
ssh-keygen -f "/home/hao/.ssh/known_hosts" -R "172.32.0.93"

```

- entity 63: genx320 4-003c (1 pad, 1 link)
type V4L2 subdev subtype Sensor flags 0
device node name /dev/v4l-subdev2
pad0: Source
[fmt:unknown/320x320 field:none colorspace:raw xfer:none]
-> "rockchip-csi2-dphy0":0 [ENABLED]

读到了

这是一个好消息



# mipi驱动的位置

查找**生成的**设备树`.rv1103g-luckfox-pico-mini.dtb.dts.tmp`

寻找和Mipi 0有关的设备树

```bash
 csi2_dphy0: csi2-dphy0 {
  compatible = "rockchip,rv1106-csi2-dphy";
  rockchip,hw = <&csi2_dphy_hw>;
  status = "disabled";
 };
 mipi0_csi2: mipi0-csi2 {
  compatible = "rockchip,rv1106-mipi-csi2";
  rockchip,hw = <&mipi0_csi2_hw>, <&mipi1_csi2_hw>;
  status = "disabled";
 };
 
 rkcif_mipi_lvds: rkcif-mipi-lvds {
  compatible = "rockchip,rkcif-mipi-lvds";
  rockchip,hw = <&rkcif>;
  status = "disabled";
 };

 rkcif_mipi_lvds_sditf: rkcif-mipi-lvds-sditf {
  compatible = "rockchip,rkcif-sditf";
  rockchip,cif = <&rkcif_mipi_lvds>;
  status = "disabled";
 };

 rkcif_mipi_lvds1: rkcif-mipi-lvds1 {
  compatible = "rockchip,rkcif-mipi-lvds";
  rockchip,hw = <&rkcif>;
  status = "disabled";
 };
 mipi0_csi2_hw: mipi-csi2-hw@ffa20000 {
  compatible = "rockchip,rv1106-mipi-csi2-hw";
  reg = <0xffa20000 0x10000>;
  reg-names = "csihost_regs";
  interrupts = <0 99 4>,
        <0 100 4>;
  interrupt-names = "csi-intr1", "csi-intr2";
  clocks = <&cru 221>, <&cru 222>;
  clock-names = "pclk_csi2host", "clk_rxbyte_hs";
  resets = <&cru 327700>;
  reset-names = "srst_csihost_p";
  status = "okay";
 };
```

rockchip,rv1106-mipi-csi2-hw  → mipi-csi2.h

# 给内核打patch

v4l2-utils 在 media/libv4l 中 ，可以看看patch如何生效

## 其他

```bash
media-ctl  --known-mbus-fmts
```

对于 buildroot中的package 我还是需要删掉已经下载好的package ,才能重新编译



## 如何制作patch

## 对于一个没有通过git 管理的仓库

```bash
git init
git add .
git commit -m "original"
nano somefile.c # 再次修改
git diff > ~/v4l-utils-feature.patch
```

对于 buildroot 只要在 `buildroot-XXXXXX/package/<pkg-name>/` 下添加 .patch文件，就会自动生效




尝试设置

```bash
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":1 -> "rockchip-mipi-csi2":0[1]' # 启动 link
media-ctl -d /dev/media0 -V "'stream_cif_mipi_id0':0[fmt:PSEE_EVT21/320x320]"

 # close link
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":1 -> "stream_cif_mipi_id0":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":2 -> "stream_cif_mipi_id1":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":3 -> "stream_cif_mipi_id2":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":4 -> "stream_cif_mipi_id3":0[0]' 
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":5 -> "rkcif_scale_ch0":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":6 -> "rkcif_scale_ch1":0[0]' 
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":7 -> "rkcif_scale_ch2":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":8 -> "rkcif_scale_ch3":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":9 -> "rkcif_tools_id0":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":10 -> "rkcif_tools_id1":0[0]'
media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":11 -> "rkcif_tools_id2":0[0]'

media-ctl -d /dev/media0 -l '"rockchip-mipi-csi2":1 -> "stream_cif_mipi_id0":0[1]'
```

- Mipi-csi.c
- cif/dev.c      rkcif stream_cif
- genx320.c

ENOIOCTLCMD 515  指没有  ioctl cmd

```bash
[  417.359069] stream_cif_mipi_id0: open video, entity use_count 3
[  417.359079] rkcif_fh_open, ret 0
[  417.366729] cma: cma_alloc: rk-dma-heap-cma: alloc failed, req-size: 972 pages, ret: -12
[  417.366776] vb2_cma_sg_alloc_contiguous: cma_en:1 alloc pages fail
[  417.369039] rkcif-mipi-lvds: stream[0] start streaming
[  417.511792] rkcif-mipi-lvds: stream[0] start stopping, total mode 0x3, cur 0x1
[  417.574547] rkcif-mipi-lvds: stream[0] stopping finished, dma_en 0x0
[  417.580941] stream_cif_mipi_id0: close video, entity use_count 2
[  417.580968] rkcif_fh_release, ret 0

```

以上是正常的sc3336

```bash
v4l2-ctl --device=/dev/video0 --set-fmt-video=width=320,height=320,pixelformat=PSE2
v4l2-ctl --device=/dev/video0 --stream-mmap --stream-count=1 --stream-to=frame.raw

```

```bash
   74.989063] rkcif-mipi-lvds: remote sensor mbus code not supported
[   74.995257] 8<--- cut here ---
[   74.998312] Unable to handle kernel NULL pointer dereference at virtual address 00000000
[   75.006431] pgd = 81ddb24e
[   75.009136] [00000000] *pgd=00000000
[   75.012714] Internal error: Oops - BUG: 5 [#2] THUMB2
[   75.017765] Modules linked in: phy_rockchip_csi2_dphy phy_rockchip_csi2_dphy_hw video_rkisp video_rkcif genx320_driver rk_dvbm [last unloaded: mis5001]
[   75.031338] CPU: 0 PID: 621 Comm: v4l2-ctl Tainted: G      D           5.10.160 #3
[   75.038894] Hardware name: Rockchip (Device Tree)
[   75.043733] PC is at rkcif_output_fmt_check+0xc/0x2a4 [video_rkcif]
[   75.050041] LR is at rkcif_enum_fmt_vid_cap_mplane+0x85/0xd8 [video_rkcif]
[   75.056912] pc : [<af820a2c>]    lr : [<af824a41>]    psr: 00000033
[   75.063170] sp : b1a53d98  ip : 00000000  fp : b16418a0
[   75.068389] r10: af835fdc  r9 : 0000001c  r8 : 00000000
[   75.073611] r7 : af835c3c  r6 : b16503f8  r5 : b1650010  r4 : 00000000
[   75.080133] r3 : 00000000  r2 : 00000280  r1 : af835fdc  r0 : b16503f8
[   75.086657] Flags: nzcv  IRQs on  FIQs on  Mode SVC_32  ISA Thumb  Segment user
[   75.093961] Control: 50c53c7d  Table: 01a44059  DAC: 00000055
[   75.099702] Process v4l2-ctl (pid: 621, stack limit = 0x4f337e32)
[   75.105794] Stack: (0xb1a53d98 to 0xb1a54000)
[   75.110150] 3d80:                                                       b1650010 b1a53e8c
[   75.118325] 3da0: b16503f8 b16418a0 af8364b4 00000001 b1a53e8c af824a41 00000000 00000000
[   75.126499] 3dc0: 00000280 000001e0 b1a64180 00000000 b1a53e8c b16418a0 af8364b4 b16505d0
[   75.134672] 3de0: b041a350 b02cd5d1 b1a53e8c 00000040 00000003 b1a53e8c 00000040 00000000
[   75.142846] 3e00: b16505d0 00000000 b02cd537 c0405602 b16505c4 b02cf63f b13b5a54 2af36d2e
[   75.151020] 3e20: b0701b80 b1a53e8c af8364b4 b16418a0 00000000 b1a64180 b0701b80 00000000
[   75.159194] 3e40: 00000000 00000000 b1648900 b00734cd b02cfc73 00000000 c0405602 b02cf4a5
[   75.167367] 3e60: 00000000 00000000 b1a53e8c 00000000 c0405602 b02cfd87 00000000 ae9c43e4
[   75.175540] 3e80: b1a64180 00000000 00000000 00000000 00000009 00000000 00000000 00000000
[   75.183712] 3ea0: 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
[   75.191886] 3ec0: 00000000 00000000 00000000 b13b9478 00000000 00000000 b1a7d1c0 0000001f
[   75.200059] 3ee0: 00000274 b1a653c0 b1a7d1c0 00000010 00000274 b1a7d200 00000000 b006122d
[   75.208234] 3f00: 000a801d b0fd9770 b0b9fc10 2af36d2e 01100cca b15359c0 c0405602 ae9c43e4
[   75.216407] 3f20: b1a64180 00000003 b1a52000 b1a64180 00000000 b0081541 00002000 b0081b2b
[   75.224581] 3f40: 00000875 0000018f b1a53fb0 b1a653c0 004c13b8 b1a7d1c0 00000017 b1a53fb0
[   75.232755] 3f60: b000fa11 00000017 b05f9078 004c13b8 b1a53fb0 50c53c7d ae9c45d0 ae9c45e8
[   75.240930] 3f80: 00000000 ae9c43e4 ae9c43e4 00000003 00000036 b0008424 b1a52000 00000036
[   75.249104] 3fa0: 00000000 b0008201 ae9c43e4 ae9c43e4 00000003 c0405602 ae9c43e4 00000000
[   75.257277] 3fc0: ae9c43e4 ae9c43e4 00000003 00000036 a6fd2ec4 00000001 0053ad60 00000000
[   75.265451] 3fe0: 0052ede4 ae9c43b8 004bab64 a6d45558 60000010 00000003 00000000 00000000
[   75.273732] [<af820a2c>] (rkcif_output_fmt_check [video_rkcif]) from [<af824a41>] (rkcif_enum_fmt_vid_cap_mplane+0x85/0xd8 [video_rkcif])
[   75.286117] [<af824a41>] (rkcif_enum_fmt_vid_cap_mplane [video_rkcif]) from [<b02cd5d1>] (v4l_enum_fmt+0x9b/0x14d2)
[   75.296554] [<b02cd5d1>] (v4l_enum_fmt) from [<b02cf63f>] (__video_do_ioctl+0x19b/0x278)
[   75.304647] [<b02cf63f>] (__video_do_ioctl) from [<b02cfd87>] (video_usercopy+0x173/0x258)
[   75.312912] [<b02cfd87>] (video_usercopy) from [<b0081541>] (vfs_ioctl+0x11/0x1c)
[   75.320394] [<b0081541>] (vfs_ioctl) from [<b0081b2b>] (sys_ioctl+0x73/0x47c)
[   75.327527] [<b0081b2b>] (sys_ioctl) from [<b0008201>] (ret_fast_syscall+0x1/0x58)
[   75.335084] Exception stack(0xb1a53fa8 to 0xb1a53ff0)
[   75.340138] 3fa0:                   ae9c43e4 ae9c43e4 00000003 c0405602 ae9c43e4 00000000
[   75.348312] 3fc0: ae9c43e4 ae9c43e4 00000003 00000036 a6fd2ec4 00000001 0053ad60 00000000
[   75.356483] 3fe0: 0052ede4 ae9c43b8 004bab64 a6d45558
[   75.361540] Code: f8d0 3588 7804 6845 (681a) f243 
[   75.366402] ---[ end trace 2bc91cb93f65103b ]---

```

增加了一些 格式

```bash
[   97.476499] stream_cif_mipi_id0: open video, entity use_count 1
[   97.476512] rkcif_fh_open, ret 0
[   97.482883] 8<--- cut here ---
[   97.502467] Unable to handle kernel NULL pointer dereference at virtual address 00000015
[   97.510583] pgd = a5bb5a52
[   97.513287] [00000015] *pgd=00000000
[   97.516875] Internal error: Oops - BUG: 5 [#1] THUMB2
[   97.521925] Modules linked in: rve rockit(O) rknpu mpp_vcodec(O) rga3 phy_rockchip_csi2_dphy phy_rockchip_csi2_dphy_hw video_rkisp video_rkcif genx320_driver rk_dvbm [last unloaded: mis5001]
[   97.538896] CPU: 0 PID: 726 Comm: v4l2-ctl Tainted: G           O      5.10.160 #3
[   97.546462] Hardware name: Rockchip (Device Tree)
[   97.551294] PC is at rkcif_queue_setup+0x1c/0xcc [video_rkcif]
[   97.557140] LR is at vb2_core_reqbufs+0x169/0x22c
[   97.561844] pc : [<af820ce0>]    lr : [<b02dbc01>]    psr: a0000033
[   97.568112] sp : b1103d60  ip : b1650460  fp : b1650984
[   97.573330] r10: b1103db8  r9 : b1650400  r8 : b1103db0
[   97.578552] r7 : b1650010  r6 : 00000001  r5 : af820cc5  r4 : b16503f8
[   97.585073] r3 : 00000000  r2 : b1103db4  r1 : af835d00  r0 : b1650400
[   97.591598] Flags: NzCv  IRQs on  FIQs on  Mode SVC_32  ISA Thumb  Segment user
[   97.598901] Control: 50c53c7d  Table: 01a44059  DAC: 00000055
[   97.604643] Process v4l2-ctl (pid: 726, stack limit = 0x75f0bbf1)
[   97.610734] Stack: (0xb1103d60 to 0xb1104000)
[   97.615092] 3d60: 00000000 00000b91 00000275 20000022 b0747000 9f168449 b1103dac b0747000
[   97.623266] 3d80: 00000000 b1650400 af820cc5 00000001 b1650460 b1103db8 b1103e8c b1650440
[   97.631439] 3da0: b1b83300 b02dbc01 b1650440 b1103e0c 00000004 00000000 00000000 00000000
[   97.639612] 3dc0: 00000000 00000000 00000000 00000000 00000000 00000000 b1088000 00000000
[   97.647785] 3de0: b1103e8c b16505d0 b1667540 c0145608 b16505c4 b041a3c8 b1b83300 b02dcdd9
[   97.655958] 3e00: b02dcd9b 00000000 b16505d0 00000000 b02cf1b3 b02cf63f b13e2834 9f168449
[   97.664131] 3e20: 00020000 b1103e8c af8364e8 b1b83300 00000000 b1667540 00000254 b13e2830
[   97.672306] 3e40: 0000002b b0126b5f 66500000 b0052729 b27bb740 00000000 c0145608 b02cf4a5
[   97.680478] 3e60: 00000000 00000000 b1103e8c 00000000 c0145608 b02cfd87 00000000 ae9473b0
[   97.688651] 3e80: b1667540 00000000 00000000 00000004 00000009 00000001 00000055 00000000
[   97.696824] 3ea0: b27bb720 00000000 0000002f b1098240 b13e2830 b004ce5f 00000100 0000002b
[   97.704997] 3ec0: b13e2834 00000030 00100000 b13c73a8 00000000 00000000 b10b6a80 0000002f
[   97.713171] 3ee0: 00000274 b10917e0 b10b6a80 00000020 00000274 b10b6ac0 00000000 b006122d
[   97.721344] 3f00: 0000866c b0772000 00000000 9f168449 01100cca b15379c0 c0145608 ae9473b0
[   97.729517] 3f20: b1667540 00000003 b1102000 b1667540 0047ed10 b0081541 00002000 b0081b2b
[   97.737690] 3f40: 00000875 0000018f b1103fb0 b10917e0 00422628 b10b6a80 80000007 b1103fb0
[   97.745864] 3f60: b000fa11 00000007 b05f9278 00422628 b1103fb0 50c53c7d 00000000 ae949450
[   97.754036] 3f80: 0047ed10 a6ff2ec4 ae9473b0 00000009 00000036 b0008424 b1102000 00000036
[   97.762209] 3fa0: 0047ed10 b0008201 a6ff2ec4 ae9473b0 00000003 c0145608 ae9473b0 00000000
[   97.770382] 3fc0: a6ff2ec4 ae9473b0 00000009 00000036 a6ff2ec4 00000000 ae949450 0047ed10
[   97.778555] 3fe0: 0047ede4 ae947360 00406544 a6d65558 60000010 00000003 00000000 00000000
[   97.786807] [<af820ce0>] (rkcif_queue_setup [video_rkcif]) from [<b02dbc01>] (vb2_core_reqbufs+0x169/0x22c)
[   97.796547] [<b02dbc01>] (vb2_core_reqbufs) from [<b02dcdd9>] (vb2_ioctl_reqbufs+0x3f/0x5e)
[   97.804898] [<b02dcdd9>] (vb2_ioctl_reqbufs) from [<b02cf63f>] (__video_do_ioctl+0x19b/0x278)
[   97.813424] [<b02cf63f>] (__video_do_ioctl) from [<b02cfd87>] (video_usercopy+0x173/0x258)
[   97.821688] [<b02cfd87>] (video_usercopy) from [<b0081541>] (vfs_ioctl+0x11/0x1c)
[   97.829170] [<b0081541>] (vfs_ioctl) from [<b0081b2b>] (sys_ioctl+0x73/0x47c)
[   97.836311] [<b0081b2b>] (sys_ioctl) from [<b0008201>] (ret_fast_syscall+0x1/0x58)
[   97.843867] Exception stack(0xb1103fa8 to 0xb1103ff0)
[   97.848921] 3fa0:                   a6ff2ec4 ae9473b0 00000003 c0145608 ae9473b0 00000000
[   97.857093] 3fc0: a6ff2ec4 ae9473b0 00000009 00000036 a6ff2ec4 00000000 ae949450 0047ed10
[   97.865263] 3fe0: 0047ede4 ae947360 00406544 a6d65558
[   97.870319] Code: 3584 6867 f8d4 1588 (7d58) 9305 
[   97.875151] ---[ end trace a23d36d799d6c643 ]---

```

上面的bug告诉我们是 rkcif_queue_setup 出的问题

```bash
[   97.551294] PC is at rkcif_queue_setup+0x1c/0xcc [video_rkcif]
[   97.557140] LR is at vb2_core_reqbufs+0x169/0x22c
```

```bash
[   57.031693] pixm = 64feaef2,cif_fmt = 00000000
[   57.031703] in_fmt = 5d96f513
[   57.031722] rkcif_queue_setup
[   57.031742] 8<--- cut here ---
[   57.061518] Unable to handle kernel
```

cif_fmt = 000000 这不合理

这个其实是 

cif_fmt_out   在(vb2_queue)  queue->drv_priv 中 

rkcif_set_fmt 中会赋值

rkcif_set_fmt在rkcif_set_default_fmt 中使用

rkcif_set_fmt在rkcif_s_fmt_vid_cap_mplane 中使用

rkcif_set_fmt在rkcif_try_fmt_vid_cap_mplane 中使用

rkcif_set_fmt在 rkcif_stream_init中使用

# 为什么 cif_fmt 是空指针

> 重新创建镜像
> 

```bash

```

# media-ctl 对不对

```cpp
- entity 63: genx320 4-003c (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
	pad0: Source
		[fmt:PSEE_EVT21/320x320 field:none colorspace:raw xfer:none]
		-> "rockchip-csi2-dphy0":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
	pad0: Sink
		[fmt:PSEE_EVT21/320x320 field:none colorspace:raw xfer:none]
		<- "genx320 4-003c":0 [ENABLED]
	pad1: Source
		-> "rockchip-mipi-csi2":0 [ENABLED]

- entity 45: rockchip-mipi-csi2 (12 pads, 122 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev0
	pad0: Sink
		[fmt:PSEE_EVT21/320x320 field:none colorspace:raw xfer:none
		 crop.bounds:(0,0)/320x320
		 crop:(0,0)/320x320]
		<- "rockchip-csi2-dphy0":1 [ENABLED]
	pad1: Source
		-> "stream_cif_mipi_id0":0 [ENABLED]
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad2: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 [ENABLED]
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad3: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 [ENABLED]
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad4: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 [ENABLED]
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad5: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 [ENABLED]
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad6: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 [ENABLED]
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad7: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 [ENABLED]
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad8: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 [ENABLED]
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad9: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 [ENABLED]
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad10: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 [ENABLED]
		-> "rkcif_tools_id2":0 []
	pad11: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 [ENABLED]

# 从哪里触发

```
video设备的注册

```cpp
video_register_device 
```

media 设备的注册

```cpp
media_device_register
```






















# media-ctl

```bash
[root@luckfox root]# media-ctl -p
Media controller API version 5.10.160

Media device information
------------------------
driver          rkcif
model           rkcif-mipi-lvds
serial          
bus info        
hw revision     0x0
driver version  5.10.160

Device topology
- entity 1: stream_cif_mipi_id0 (1 pad, 11 links)
            type Node subtype V4L flags 0
            device node name /dev/video0
	pad0: Sink
		<- "rockchip-mipi-csi2":1 [ENABLED]
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 5: stream_cif_mipi_id1 (1 pad, 11 links)
            type Node subtype V4L flags 0
            device node name /dev/video1
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 [ENABLED]
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 9: stream_cif_mipi_id2 (1 pad, 11 links)
            type Node subtype V4L flags 0
            device node name /dev/video2
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 [ENABLED]
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 13: stream_cif_mipi_id3 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video3
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 [ENABLED]
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 17: rkcif_scale_ch0 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video4
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 [ENABLED]
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 21: rkcif_scale_ch1 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video5
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 [ENABLED]
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 25: rkcif_scale_ch2 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video6
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 [ENABLED]
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 29: rkcif_scale_ch3 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video7
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 [ENABLED]
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 33: rkcif_tools_id0 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video8
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 [ENABLED]
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 []

- entity 37: rkcif_tools_id1 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video9
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 [ENABLED]
		<- "rockchip-mipi-csi2":11 []

- entity 41: rkcif_tools_id2 (1 pad, 11 links)
             type Node subtype V4L flags 0
             device node name /dev/video10
	pad0: Sink
		<- "rockchip-mipi-csi2":1 []
		<- "rockchip-mipi-csi2":2 []
		<- "rockchip-mipi-csi2":3 []
		<- "rockchip-mipi-csi2":4 []
		<- "rockchip-mipi-csi2":5 []
		<- "rockchip-mipi-csi2":6 []
		<- "rockchip-mipi-csi2":7 []
		<- "rockchip-mipi-csi2":8 []
		<- "rockchip-mipi-csi2":9 []
		<- "rockchip-mipi-csi2":10 []
		<- "rockchip-mipi-csi2":11 [ENABLED]

- entity 45: rockchip-mipi-csi2 (12 pads, 122 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev0
	pad0: Sink
		[fmt:SBGGR10_1X10/2304x1296 field:none
		 crop.bounds:(0,0)/2304x1296
		 crop:(0,0)/2304x1296]
		<- "rockchip-csi2-dphy0":1 [ENABLED]
	pad1: Source
		-> "stream_cif_mipi_id0":0 [ENABLED]
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad2: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 [ENABLED]
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad3: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 [ENABLED]
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad4: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 [ENABLED]
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad5: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 [ENABLED]
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad6: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 [ENABLED]
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad7: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 [ENABLED]
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad8: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 [ENABLED]
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad9: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 [ENABLED]
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad10: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 [ENABLED]
		-> "rkcif_tools_id2":0 []
	pad11: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 2 links)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
	pad0: Sink
		[fmt:SBGGR10_1X10/2304x1296@10000/250000 field:none]
		<- "m00_b_sc3336 4-0030":0 [ENABLED]
	pad1: Source
		-> "rockchip-mipi-csi2":0 [ENABLED]

- entity 63: m00_b_sc3336 4-0030 (1 pad, 1 link)
             type V4L2 subdev subtype Sensor flags 0
             device node name /dev/v4l-subdev2
	pad0: Source
		[fmt:SBGGR10_1X10/2304x1296@10000/250000 field:none]
		-> "rockchip-csi2-dphy0":0 [ENABLED]

```

```bash
	pad2: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 [ENABLED]
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad3: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 [ENABLED]
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad4: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 [ENABLED]
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad5: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 [ENABLED]
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad6: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 [ENABLED]
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad7: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 [ENABLED]
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad8: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 [ENABLED]
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad9: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 [ENABLED]
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 []
	pad10: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 [ENABLED]
		-> "rkcif_tools_id2":0 []
	pad11: Source
		-> "stream_cif_mipi_id0":0 []
		-> "stream_cif_mipi_id1":0 []
		-> "stream_cif_mipi_id2":0 []
		-> "stream_cif_mipi_id3":0 []
		-> "rkcif_scale_ch0":0 []
		-> "rkcif_scale_ch1":0 []
		-> "rkcif_scale_ch2":0 []
		-> "rkcif_scale_ch3":0 []
		-> "rkcif_tools_id0":0 []
		-> "rkcif_tools_id1":0 []
		-> "rkcif_tools_id2":0 [ENABLED]

- entity 58: rockchip-csi2-dphy0 (2 pads, 1 link)
             type V4L2 subdev subtype Unknown flags 0
             device node name /dev/v4l-subdev1
	pad0: Sink
	pad1: Source
		-> "rockchip-mipi-csi2":0 [ENABLED]

```










# RK based Module

找到 rkcif 内存对齐的参数

```cpp
/* cif memory mode
 * 0: raw12/raw10/raw8 8bit memory compact
 * 1: raw12/raw10 16bit memory one pixel
 *    low align for rv1126/rv1109/rk356x
 *    |15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
 *    | -| -| -| -|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
 * 2: raw12/raw10 16bit memory one pixel
 *    high align for rv1126/rv1109/rk356x
 *    |15|14|13|12|11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0|
 *    |11|10| 9| 8| 7| 6| 5| 4| 3| 2| 1| 0| -| -| -| -|
 *
 * note: rv1109/rv1126/rk356x dvp only support uncompact mode,
 *       and can be set low align or high align
 */

enum cif_csi_lvds_memory {
	CSI_LVDS_MEM_COMPACT = 0,
	CSI_LVDS_MEM_WORD_LOW_ALIGN = 1,
	CSI_LVDS_MEM_WORD_HIGH_ALIGN = 2,
};

```

不知道有没有什么用处