---
title: adc_patch
createTime: 2026/08/23 18:04:43
permalink: /px4code/ybowkkap/
---

Pixhawk 6C Mini 的供电检测阈值定得不合理。

这块板要求稳压器输出 **> 5.05 V**，PX4 才认为电压有效；否则会判 invalid，MAVLink 里把 voltage 报成 `65535`。

PM02 空载大概能稳在 5.14 V 左右，飞行时负载一上来，输出却可能掉到 5.05 V 以下。同一套逻辑在 Pixhawk 6C 上只要 **> 3.9 V** 就算 valid，6C Mini 把门槛抬到 5.05 V，裕量几乎没有。

所以我们在固件里绕开这段有效性检查。

`board_config.h` 里把 `BOARD_ADC_BRICK1_VALID` / `BOARD_ADC_BRICK2_VALID` 强制为 `1`：系统不再读对应 GPIO，两路电池砖会一直被当成在线。硬件检测脚异常或没接时，电源仍会被视为有效。

`analog_battery.cpp` 里把 `connected` 强制为 `true`：不再用电压阈值和 `is_valid()` 判断是否接了电池。ADC 读数偏低、开路或异常时，固件仍会报告电池已连接。


```bash
diff --git a/boards/px4/fmu-v6c/src/board_config.h b/boards/px4/fmu-v6c/src/board_config.h
index 87806d3ed7..8830a27e2d 100644
--- a/boards/px4/fmu-v6c/src/board_config.h
+++ b/boards/px4/fmu-v6c/src/board_config.h
@@ -239,6 +239,8 @@
- #define BOARD_ADC_BRICK1_VALID  (!px4_arch_gpioread(GPIO_nVDD_BRICK1_VALID))
- #define BOARD_ADC_BRICK2_VALID  (!px4_arch_gpioread(GPIO_nVDD_BRICK2_VALID))
 
+ #define BOARD_ADC_BRICK1_VALID  (1)
+ #define BOARD_ADC_BRICK2_VALID  (1)

 #define BOARD_ADC_PERIPH_5V_OC  (!px4_arch_gpioread(GPIO_VDD_5V_PERIPH_nOC))
 #define BOARD_ADC_HIPOWER_5V_OC (!px4_arch_gpioread(GPIO_VDD_5V_HIPOWER_nOC))
 
diff --git a/src/modules/battery_status/analog_battery.cpp b/src/modules/battery_status/analog_battery.cpp
index e7ca828ce0..9622f6843a 100644
--- a/src/modules/battery_status/analog_battery.cpp
+++ b/src/modules/battery_status/analog_battery.cpp
@@ -74,11 +74,13 @@ void
 AnalogBattery::updateBatteryStatusADC(hrt_abstime timestamp, float voltage_raw, float current_raw)
 {
- 	const float voltage_v = voltage_raw * _analog_params.v_div;
+	const float voltage_v = voltage_raw + 25; // convert to mV
+
 	const float current_a = (current_raw - _analog_params.v_offs_cur) * _analog_params.a_per_v;
 
-   const bool connected = voltage_v > BOARD_ADC_OPEN_CIRCUIT_V &&
 			       (BOARD_ADC_OPEN_CIRCUIT_V <= BOARD_VALID_UV || is_valid());
+	const bool connected = true; // --- IGNORE ---
 	Battery::setConnected(connected);
 	Battery::updateVoltage(voltage_v);
 	Battery::updateCurrent(current_a);

```