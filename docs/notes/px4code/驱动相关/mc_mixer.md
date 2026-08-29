---
title: Quadrotor Mixer
createTime: 2024/09/07 00:36:33
permalink: /px4code/driver/faofu83s/
---

# [Control Groups](https://docs.px4.io/v1.12/en/concept/mixing.html#control-group-0-flight-control)
> **Control Groups** 有6组，包含actuator_controls_\[0~3\]，以及actuator_controls_virtual_fw 和 actuator_controls_virtual_mc

-  actuator_controls_0(Flight Control)
-  actuator_controls_1(Flight Control VTOL/Alternate)
-  actuator_controls_2(Gimbal)
-  actuator_controls_3(Manual Passthrough)

角速度环的输出为actuator_controls_0，这是一个length 为8的float数组
- 0: roll (-1..1)
- 1: pitch (-1..1)
- 2: yaw (-1..1)
- 3: throttle (0..1 normal range, -1..1 for variable pitch / thrust reversers)
- 4: flaps (-1..1)
- 5: spoilers (-1..1)
- 6: airbrakes (-1..1)
- 7: landing gear (-1..1)
对于4旋翼我们仅需取(0~3)作为`torque(4)`，放入混控器中

# MIX
PX4的混控器包含4个大类
- `R`: [Multirotor mixer](https://docs.px4.io/v1.12/en/concept/mixing.html#multirotor_mixer)  
- `H`: [Helicopter mixer](https://docs.px4.io/v1.12/en/concept/mixing.html#helicopter_mixer)  
- `M`: [Summing mixer](https://docs.px4.io/v1.12/en/concept/mixing.html#summing_mixer)  
- `Z`: [Null mixer](https://docs.px4.io/v1.12/en/concept/mixing.html#null_mixer)

其中细分类型在`src/lib/mixer/*Mixer/geometries/*.toml`中描述

以Multirotor为例，toml文件在编译时被`px_generate_mixers.py`生成 `mixer_multirotor_normalized.generated.h`
> 还有一个`mixer_multirotor.generated.h`，但是程序中并不使用，因此忽略这个文件

其中描述mixer 矩阵 大小为 \[4,rotor_count_num\]
**4**对应了pitch,roll,yaw,thrust

对于 **quadx** 飞行器 (AirMode=disable),令角速度环的输出为torque[4]
```c++
struct Rotor {
float roll_scale; /**< scales roll for this rotor */
float pitch_scale; /**< scales pitch for this rotor */
float yaw_scale; /**< scales yaw for this rotor */
float thrust_scale; /**< scales thrust for this rotor */
};
static constexpr MultirotorMixer::Rotor _config_quad_x[] {
{ -0.707107, 0.707107, 1.000000, 1.000000 },
{ 0.707107, -0.707107, 1.000000, 1.000000 },
{ 0.707107, 0.707107, -1.000000, 1.000000 },
{ -0.707107, -0.707107, -1.000000, 1.000000 },
};
float roll = math::constrain(torque(0), -1.0f, 1.0f);
float pitch = math::constrain(torque(1), -1.0f, 1.0f);
float yaw = math::constrain(torque(2), -1.0f, 1.0f);
float thrust = math::constrain(torque(3), 0.0f, 1.0f);

for (unsigned i = 0; i < _rotor_count; i++) {
	outputs[i] = roll * _rotors[i].roll_scale +
	pitch * _rotors[i].pitch_scale +
	yaw * _rotors[i].yaw_scale +
	thrust * _rotors[i].thrust_scale;
}
```
但是，**Mixer可能会发生油门饱和（到达上下限）的现象**,这种情况下引入minimize_saturation
# [airmode & Mixer Saturation](https://docs.px4.io/main/en/config_mc/pid_tuning_guide_multicopter.html?#airmode-mixer-saturation)
在电机输出饱和（到达上下限）的情况下,需要缩小或放大推力。
<!-- 原图 Pasted image 20240110194707.png 未纳入仓库 -->
PX4给定了3种模式
- **0:** Disabled
- **1:** Roll/Pitch
- **2:** Roll/Pitch/Yaw
如图，在Disable下，thrust仅通过 降低thrust保证正确的力和力矩的方向。
而在（1/2）模式下，thrust 还可以通过升高实现
```c++
//src/lib/mixer/MultirotorMixer/MultirotorMixer.cpp
void minimize_saturation(
const float *desaturation_vector, //需要消除饱和的轴上的值(pitch,roll,yall)，因此
float *outputs,
float min_output, 
float max_output, 
bool reduce_only) 
{
	float k1 = compute_desaturation_gain(desaturation_vector, outputs, min_output, max_output);
	
	//在disable下 reduce_only=true,即k1若为负，才会缩小
	if (reduce_only && k1 > 0.f) {
		return;
	}
	for (unsigned i = 0; i < _rotor_count; i++) {
		outputs[i] += k1 * desaturation_vector[i];
	}
	// Compute the desaturation gain again based on the updated outputs.
	// In most cases it will be zero. It won't be if max(outputs) - min(outputs) > max_output - min_output.
	// In that case adding 0.5 of the gain will equilibrate saturations.
	
	float k2 = 0.5f * compute_desaturation_gain(desaturation_vector, outputs, min_output, max_output);
	
	for (unsigned i = 0; i < _rotor_count; i++) {
	outputs[i] += k2 * desaturation_vector[i];
	}
}



float compute_desaturation_gain(
const float *desaturation_vector, 
const float *outputs,
float min_output, 
float max_output) 
{
float k_min = 0.f;
float k_max = 0.f;
for (unsigned i = 0; i < _rotor_count; i++) {
// Avoid division by zero. If desaturation_vector[i] is zero, there's nothing we can do to unsaturate anyway
if (fabsf(desaturation_vector[i]) < FLT_EPSILON) {
	continue;
}
if (outputs[i] < min_output) {
	//计算目标方向
	float k = (min_output - outputs[i]) / desaturation_vector[i];
	if (k < k_min) { k_min = k; }
	if (k > k_max) { k_max = k; }
}
if (outputs[i] > max_output) {
	float k = (max_output - outputs[i]) / desaturation_vector[i];
	if (k < k_min) { k_min = k; }
	if (k > k_max) { k_max = k; }
	}
}
// Reduce the saturation as much as possible
return k_min + k_max;
}
```

以 disable 模式为例,最终的混合器关键代码为
```c++
struct Rotor {
float roll_scale; /**< scales roll for this rotor */
float pitch_scale; /**< scales pitch for this rotor */
float yaw_scale; /**< scales yaw for this rotor */
float thrust_scale; /**< scales thrust for this rotor */
};
static constexpr MultirotorMixer::Rotor _config_quad_x[] {
{ -0.707107, 0.707107, 1.000000, 1.000000 },
{ 0.707107, -0.707107, 1.000000, 1.000000 },
{ 0.707107, 0.707107, -1.000000, 1.000000 },
{ -0.707107, -0.707107, -1.000000, 1.000000 },
};
void mix_airmode_disabled(float torque[], float *outputs)
{	
	float roll = math::constrain(torque[0], -1.0f, 1.0f);
	float pitch = math::constrain(torque[1], -1.0f, 1.0f);
	float yaw = math::constrain(torque[2], -1.0f, 1.0f);
	float thrust = math::constrain(torque[3], 0.0f, 1.0f);
// Airmode disabled: never allow to increase the thrust to unsaturate a motor

// Mix without yaw
for (unsigned i = 0; i < _rotor_count; i++) {
	outputs[i] = roll * _rotors[i].roll_scale +
	pitch * _rotors[i].pitch_scale +
	thrust * _rotors[i].thrust_scale;
	// Thrust will be used to unsaturate if needed
	_tmp_array[i] = _rotors[i].thrust_scale;
}
// only reduce thrust
minimize_saturation(_tmp_array, outputs, 0.f, 1.f, true);

// Reduce roll/pitch acceleration if needed to unsaturate
for (unsigned i = 0; i < _rotor_count; i++) {
_tmp_array[i] = _rotors[i].roll_scale;
}
minimize_saturation(_tmp_array, outputs);
for (unsigned i = 0; i < _rotor_count; i++) {
_tmp_array[i] = _rotors[i].pitch_scale;
}
minimize_saturation(_tmp_array, outputs);

// Add yaw to outputs
for (unsigned i = 0; i < _rotor_count; i++) {
	outputs[i] += yaw * _rotors[i].yaw_scale;
	// Yaw will be used to unsaturate if needed
	_tmp_array[i] = _rotors[i].yaw_scale;
}
// Change yaw acceleration to unsaturate the outputs if needed (do not change roll/pitch),
// and allow some yaw response at maximum thrust
minimize_saturation(_tmp_array, outputs, 0.f, 1.15f);
for (unsigned i = 0; i < _rotor_count; i++) {
	_tmp_array[i] = _rotors[i].thrust_scale;
}
// reduce thrust only
minimize_saturation(_tmp_array, outputs, 0.f, 1.f, true);

}
```