---
title: imu_patch
createTime: 2026/08/23 18:13:35
permalink: /px4code/7w0do0tw/
---

两个


```bash
diff --git a/src/modules/ekf2/EKF/ekf_helper.cpp b/src/modules/ekf2/EKF/ekf_helper.cpp
index afff6dc0ca..689c02e6ab 100644
--- a/src/modules/ekf2/EKF/ekf_helper.cpp
+++ b/src/modules/ekf2/EKF/ekf_helper.cpp
@@ -553,13 +553,13 @@ void Ekf::fuse(const VectorState &K, float innovation)
 	// pos
 	_state.pos = matrix::constrain(_state.pos - K.slice<State::pos.dof, 1>(State::pos.idx, 0) * innovation, -1.e6f, 1.e6f);
 
-	// gyro_bias
-	_state.gyro_bias = matrix::constrain(_state.gyro_bias - K.slice<State::gyro_bias.dof, 1>(State::gyro_bias.idx, 0) * innovation,
-					-getGyroBiasLimit(), getGyroBiasLimit());
+	// // gyro_bias
+	// _state.gyro_bias = matrix::constrain(_state.gyro_bias - K.slice<State::gyro_bias.dof, 1>(State::gyro_bias.idx, 0) * innovation,
+	// 				-getGyroBiasLimit(), getGyroBiasLimit());
 
-	// accel_bias
-	_state.accel_bias = matrix::constrain(_state.accel_bias - K.slice<State::accel_bias.dof, 1>(State::accel_bias.idx, 0) * innovation,
-					-getAccelBiasLimit(), getAccelBiasLimit());
+	// // accel_bias
+	// _state.accel_bias = matrix::constrain(_state.accel_bias - K.slice<State::accel_bias.dof, 1>(State::accel_bias.idx, 0) * innovation,
+	// 				-getAccelBiasLimit(), getAccelBiasLimit());
 
 #if defined(CONFIG_EKF2_MAGNETOMETER)
 	// mag_I, mag_B
diff --git a/src/modules/mavlink/mavlink_main.cpp b/src/modules/mavlink/mavlink_main.cpp
index 897443dd15..93a3962823 100644
--- a/src/modules/mavlink/mavlink_main.cpp
+++ b/src/modules/mavlink/mavlink_main.cpp
@@ -1461,7 +1461,7 @@ Mavlink::configure_streams_to_default(const char *configure_single_stream)
 		// Note: streams requiring low latency come first
 		configure_stream_local("TIMESYNC", 10.0f);
 		configure_stream_local("CAMERA_TRIGGER", unlimited_rate);
-		configure_stream_local("HIGHRES_IMU", 50.0f);
+		configure_stream_local("HIGHRES_IMU", unlimited_rate);
 		configure_stream_local("LOCAL_POSITION_NED", 30.0f);
 		configure_stream_local("ATTITUDE", 100.0f);
 		configure_stream_local("ALTITUDE", 10.0f);
diff --git a/src/modules/mavlink/streams/HIGHRES_IMU.hpp b/src/modules/mavlink/streams/HIGHRES_IMU.hpp
index a6682213bf..569452d1b5 100644
--- a/src/modules/mavlink/streams/HIGHRES_IMU.hpp
+++ b/src/modules/mavlink/streams/HIGHRES_IMU.hpp
@@ -41,6 +41,9 @@
 #include <uORB/topics/vehicle_air_data.h>
 #include <uORB/topics/vehicle_imu.h>
 #include <uORB/topics/vehicle_magnetometer.h>
+// 增加头文件
+#include <uORB/topics/vehicle_angular_velocity.h>
+#include <uORB/topics/vehicle_acceleration.h>
 
 using matrix::Vector3f;
 
@@ -70,7 +73,16 @@ private:
 	uORB::Subscription _differential_pressure_sub{ORB_ID(differential_pressure)};
 	uORB::Subscription _magnetometer_sub{ORB_ID(vehicle_magnetometer)};
 	uORB::Subscription _air_data_sub{ORB_ID(vehicle_air_data)};
-
+	//73行左右 send函数前 添加
+
+	uORB::Subscription _vehicle_acc_sub{ORB_ID(vehicle_acceleration)};
+	uORB::Subscription _vehicle_angular_vel_sub{ORB_ID(vehicle_angular_velocity)};
+	vehicle_acceleration_s vehicle_acc;
+	vehicle_angular_velocity_s vehicle_angular_vel;
+	bool vehicle_acc_updated = false, vehicle_angular_vel_updated = false;
+	uint64_t time_usec{0};
+	// #define original
+	#ifdef original
 	bool send() override
 	{
 		bool updated = false;
@@ -173,10 +185,12 @@ private:
 			}
 
 			const float accel_dt_inv = 1.e6f / (float)imu.delta_velocity_dt;
-			const Vector3f accel = (Vector3f{imu.delta_velocity} * accel_dt_inv) - accel_bias;
+			// const Vector3f accel = (Vector3f{imu.delta_velocity} * accel_dt_inv) - accel_bias;
+			const Vector3f accel = (Vector3f{imu.delta_velocity} * accel_dt_inv);
 
 			const float gyro_dt_inv = 1.e6f / (float)imu.delta_angle_dt;
-			const Vector3f gyro = (Vector3f{imu.delta_angle} * gyro_dt_inv) - gyro_bias;
+			// const Vector3f gyro = (Vector3f{imu.delta_angle} * gyro_dt_inv) - gyro_bias;
+			const Vector3f gyro = (Vector3f{imu.delta_angle} * gyro_dt_inv);
 
 			mavlink_highres_imu_t msg{};
 
@@ -203,5 +217,41 @@ private:
 
 		return false;
 	}
+	#else //UAV fast IMU version
+        bool send() override
+        {
+
+                //Check if accel and gyro are updated
+                if (_vehicle_acc_sub.update(&vehicle_acc)) {
+                        vehicle_acc_updated = true;
+                        time_usec = vehicle_acc.timestamp_sample;
+                }
+                if (_vehicle_angular_vel_sub.update(&vehicle_angular_vel)) {
+                        vehicle_angular_vel_updated = true;
+                        time_usec = vehicle_angular_vel.timestamp_sample;
+                }
+
+                // if (vehicle_acc_updated && vehicle_angular_vel_updated) {
+                if (vehicle_acc_updated&& vehicle_angular_vel_updated) {
+                        vehicle_acc_updated = false;
+                        vehicle_angular_vel_updated = false;
+                        uint16_t fields_updated = 0;
+                        fields_updated |= (1 << 0) | (1 << 1) | (1 << 2); // accel
+                        fields_updated |= (1 << 3) | (1 << 4) | (1 << 5); // gyro
+                        mavlink_highres_imu_t msg{};
+                        msg.time_usec = time_usec;
+                        msg.xacc = vehicle_acc.xyz[0];
+                        msg.yacc = vehicle_acc.xyz[1];
+                        msg.zacc = vehicle_acc.xyz[2];
+                        msg.xgyro = vehicle_angular_vel.xyz[0];
+                        msg.ygyro = vehicle_angular_vel.xyz[1];
+                        msg.zgyro = vehicle_angular_vel.xyz[2];
+                        msg.fields_updated = fields_updated;
+                        mavlink_msg_highres_imu_send_struct(_mavlink->get_channel(), &msg);
+                        return true;
+                }
+                return false;
+        }
+	#endif
 };
 #endif // HIGHRES_IMU_HPP

```