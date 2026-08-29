---
title: z_axis_ctrl
createTime: 2024/09/09 13:25:30
permalink: /px4code/controller/xyb3tlxm/
---

## /mavros/setpoint_raw/attitude中的thrust 的坐标系

是enu的还是body的

> 结论：enu的z轴

> mavros -> mavlink -> uorb ->


[https://docs.ros.org/en/noetic/api/mavros_msgs/html/msg/AttitudeTarget.html](https://docs.ros.org/en/noetic/api/mavros_msgs/html/msg/AttitudeTarget.html)

通过查看mavros源码，`mavros/src/plugins/setpoint_raw.cpp`  277 行左右的`attitude_cb`函数，可以看到没有对thrust做任何处理，直接发布了SET_ATTITUDE_TARGET (id = 82)这条消息给飞控。
对于飞控，在`PX4-Autopilot/src/modules/mavlink/streams/mavlink_receiver.cpp`中完成接收，即`handle_message()`。

> 1. mavlink消息里，SET_ATTITUDE_TARGET 中不包含 和frame_id相关的变量，因此frame_id无所谓，只是用了header里的stamp。
> 2. SET_ATTITUDE_TARGET消息中有变量名thrust_body，以及thrust。 mavors在赋值时只给了thrust，px4在处理时，让thrust_body={0,0,-thrust},在之后只使用thrust_body。

自此，就可以结束了。

在 `handle_message_set_attitude_target()`中，当飞控进入offboard模式后，发送uorb消息(vehicle_attitude_setpoint)到 mc_att_control_main.cpp，thrust_body 没有做处理，接着uorb(vehicle_rates_setpoint)
给到下一环。

`/PX4-Autopilot/src/modules/mc_rate_control/MulticopterRateControl.cpp` thrust_body不做处理。

> ratecontrol 的输出可以来自于 手动 ， 姿态环 ， SET_ATTITUDE_TARGET中的rate。有个问题姿态环的指令mavlink的指令 应该不能同时生效从 mask中可以猜到。

```c++
uint8 type_mask  
uint8 IGNORE_ROLL_RATE = 1 # body_rate.x  
uint8 IGNORE_PITCH_RATE = 2 # body_rate.y  
uint8 IGNORE_YAW_RATE = 4 # body_rate.z  
uint8 IGNORE_THRUST = 64  
uint8 IGNORE_ATTITUDE = 128 # orientation field
```

## 总结

 1. /mavros/setpoint_raw/attitude 中的 thrust 是指 local_enu 坐标系下的z。

2. 姿态描述的是from [MAV_FRAME_LOCAL_NED](https://mavlink.io/en/messages/common.html#MAV_FRAME_LOCAL_NED) to [MAV_FRAME_BODY_FRD](https://mavlink.io/en/messages/common.html#MAV_FRAME_BODY_FRD) 

aircraft 坐标系也就是body_FRD， mavros中进行的转换如下

$$

q_{ned}^{enu}*q_{enu}^{baselink} * q_{baselink}^{aircraft} = q_{ned}^{aircraft}
$$
> from base_link to ENU  写作 $q_{enu}^{baselink}$ 

3. 姿态


