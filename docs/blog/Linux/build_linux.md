---
title: build_linux
createTime: 2025/01/19 21:35:37
permalink: /article/oztlhwqr/
---

# 树莓派手动构建镜像

# 树莓派芯片对照表

| 开发板 | CPU 型号 | CPU规格 | 制程(nm) | 备注 |
| --- | --- | --- | --- | --- |
| 树莓派1A、A+、B、B+、树莓派Zero、树莓派Zero W和 树莓派CM1 | BCM2835 | 单核 ARM1176JZF-S  |  |  |
|  | BCM2836 | 四核 Cortex-A7 |  |  |
| 树莓派3B、树莓派2B的后期型号以及树莓派CM3 | BCM2837 | ARM Cortex A53（ARMv8）1.2GHz |  | 使该设备比树莓派2快约 50% |
| 树莓派3A+、B+和树莓派CM3+ | BCM2837B0 | ARM Cortex A53（ARMv8）1.4GHz |  |  |
| Raspberry Pi 4 Model B、Compute Module 4 和 Pi 400 | BCM 2711 | 四核 [Cortex-A72](https://en.wikipedia.org/wiki/ARM_Cortex-A72) (ARM v8) 64 位 SoC，主频 1.5 GHz |  |  |
|  Raspberry Pi 5、Compute Module 5 和 Pi 500 | BCM 2712 | 四核 Arm Cortex-A76 @ 2.4GHz | 16 |  |


# 树莓派的标准启动方式

## 1 bootcode.bin

会读取 [config.txt](https://www.raspberrypi.com/documentation/computers/config_txt.html) , 这里列出常用参数的default

- kernel :
    - `kernel.img` (Raspberry Pi 1, Zero and Zero W, and Raspberry Pi Compute Module 1 )
    - `kernel7.img` ( Raspberry Pi 2, 3, 3+ and Zero 2 W, and Raspberry Pi Compute Modules 3 and 3+)
    - `kernel8.img`  （ Raspberry Pi 4 and 400, and Raspberry Pi Compute Module 4） **if `arm_64bit` is set to 1.**
    - `kernel7l.img`  （ Raspberry Pi 4 and 400, and Raspberry Pi Compute Module 4） **if `arm_64bit` is set to 0.**
    - `kernel_2712.img` Raspberry Pi 5, Compute Module 5, and Raspberry Pi 500 firmware, because this image contains optimisations specific to those models (e.g. 16K page-size)
    - `kernel8.img`   If `kernel_2712.img`  is not present
- `cmdline`是引导分区上的备用文件名，从中读取内核命令行字符串；默认值为`cmdline.txt` 。


## 2 start.elf

在 Raspberry Pi 上，加载程序（ `start.elf`映像之一）的工作是将覆盖层与适当的基本设备树组合起来，然后将完全解析的设备树传递给内核。


# 手动构建

```bash
# Compile Uboot
cd uboot
make CROSS_COMPILE=aarch64-linux-gnu- distclean
make CROSS_COMPILE=aarch64-linux-gnu- rpi_arm64_defconfig
make CROSS_COMPILE=aarch64-linux-gnu- -j6
```


# 快速更新驱动

> raspberry pi4 b
> 

编译

```bash
make -j20 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- distclean
make -j20 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- bcm2711_defconfig
make -j20 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs
```

安装

```bash
sudo cp -vf arch/arm64/boot/dts/broadcom/*.dtb  /media/hao/bootfs

sudo cp -vf arch/arm64/boot/Image  /media/hao/bootfs

sudo make -j6 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- INSTALL_MOD_PATH= /media/hao/rootfs modules_install

```

## 部分修改驱动 - 更新

```bash
make -j20 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- Image modules dtbs
sudo make -j20 ARCH=arm64 CROSS_COMPILE=aarch64-linux-gnu- INSTALL_MOD_PATH= /media/hao/rootfs modules_install
sudo cp -vf arch/arm64/boot/dts/broadcom/*.dtb  /media/hao/bootfs
sudo cp -vf arch/arm64/boot/Image /media/hao/bootfs

```
如何覆盖模块

platform device  开发的过程是否是 给结构体赋值呢
```c
struct platform_device {
	const char	*name;
	int		id;
	bool		id_auto;
	struct device	dev;
	u64		platform_dma_mask;
	struct device_dma_parameters dma_parms;
	u32		num_resources;
	struct resource	*resource;

	const struct platform_device_id	*id_entry;
	/*
	 * Driver name to force a match.  Do not set directly, because core
	 * frees it.  Use driver_set_override() to set or clear it.
	 */
	const char *driver_override;

	/* MFD cell pointer */
	struct mfd_cell *mfd_cell;

	/* arch specific additions */
	struct pdev_archdata	archdata;
};
```

似乎只是 一部分

static int unicam_probe(struct platform_device *pdev) 

pdev 从哪来， /prop 中吗
brcm 是谁家的
中断资源是 软中断还是硬中断
```c
	ret = devm_request_irq(&pdev->dev, ret, unicam_isr, 0,
			       "unicam_capture0", unicam);
	if (ret) {
		dev_err(&pdev->dev, "Unable to request interrupt\n");
		ret = -EINVAL;
		goto err_unicam_put;
	}
```


subdev 的作用
of_node 中of 是


对比 
```c
struct unicam_device {
	struct kref kref;

	/* V4l2 specific parameters */
	struct v4l2_async_connection *asd;

	/* peripheral base address */
	void __iomem *base;
	/* clock gating base address */
	void __iomem *clk_gate_base;
	/* lp clock handle */
	struct clk *clock;
	/* vpu clock handle */
	struct clk *vpu_clock;
	/* clock status for error handling */
	bool clocks_enabled;
	/* V4l2 device */
	struct v4l2_device v4l2_dev; //有3
	struct media_device mdev; //有1

	struct gpio_desc *sync_gpio;

	/* parent device */
	struct platform_device *pdev;
	/* subdevice async Notifier */
	struct v4l2_async_notifier notifier;
	unsigned int sequence;
	bool frame_started;

	/* ptr to  sub device */
	struct v4l2_subdev *sensor;
	/* Pad config for the sensor */
	struct v4l2_subdev_state *sensor_state;

	enum v4l2_mbus_type bus_type;
	/*
	 * Stores bus.mipi_csi2.flags for CSI2 sensors, or
	 * bus.mipi_csi1.strobe for CCP2.
	 */
	unsigned int bus_flags;
	unsigned int max_data_lanes;
	unsigned int active_data_lanes;
	bool sensor_embedded_data;

	struct unicam_node node[MAX_NODES];
	struct v4l2_ctrl_handler ctrl_handler;

	bool mc_api;
};
```


```c
struct psee_video {
	struct media_device mdev;//有1
	struct video_device vdev;
	struct v4l2_device v4l2_dev; //有3
	struct dma_chan *chan[NB_DMA_CHAN];	/* dma support */
	struct mutex lock;
	struct vb2_queue queue;
	spinlock_t qlock;
	struct list_head buffers;
	int sequence;
	struct resource *reg_resource;
	void __iomem *regmap;
};
```

理解 v4l2_format 


```c
struct v4l2_pix_format {
    __u32 width;          // 图像宽度
    __u32 height;         // 图像高度
    __u32 pixelformat;    // 像素格式（FOURCC）
    __u32 field;          // 扫描模式（逐行、隔行等）
    __u32 bytesperline;   // 每行的字节数
    __u32 sizeimage;      // 图像大小
    __u32 colorspace;     // 色彩空间
    // V4L2_COLORSPACE_RAW 
    __u32 priv;           // 私有数据
    __u32 flags;          // 标志位, 都有？
    __u32 ycbcr_enc;      // YCbCr 编码方式
    __u32 quantization;   // 量化范围
    __u32 xfer_func;      // 传输函数
};
```

这个似乎只是设置的