---
title: ego_planner v1 学习
createTime: 2024/09/09 17:19:53
permalink: /article/w8ma430w/
---


# 总览

![](/excalidraw/ego_planner.excalidraw)

ego_planner中包含了很多个技术点
- Grid Map 构建
- 多段五次多项式初始轨迹生成
- 将五次多项式从采样成 B-spline，初始轨迹
- 优化B-spline 
- 将轨迹采样成当前期望位置


## GridMap 构建


## 多项式轨迹飞行



## 


EGO_planner 无论需要经过多少个路径点，总可以简化问题为 **从当前位置到达下一个路径点**

当一切正常发生时，流程简化为
![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240724170259.png)
里面包含了

**planNextWaypoint** ：全局路径规划(当前所在位置->到下一个目标位置)，结果表示为 5次多项式

**planFromGlobalTraj**: B-spline优化

还有一个与planFromGlobalTraj 相似的 函数 **planFromCurrentTraj**：区别主要是 起点的选取

# FSM

```c++
    enum FSM_EXEC_STATE
    {
      INIT,
      WAIT_TARGET,
      GEN_NEW_TRAJ,
      REPLAN_TRAJ,
      EXEC_TRAJ,
      EMERGENCY_STOP,
      SEQUENTIAL_START
    };
```

![](https://emnavi-doc-img.oss-cn-beijing.aliyuncs.com/hao_doc/Pasted%20image%2020240724170324.png)

## 状态转换细节

|Old Status | New Status|细节|
|-|-|-|
|INIT | WAIT_TARGET|odom 正常 (注意ego_planner在 没有障碍物信息的情况下是可以正常工作的，但没有odom是不行的)|
|WAIT_TARGET |  SEQUENTIAL_START|have_target_ = true;have_trigger_ = true|
| 第一次规划| SEQUENTIAL_START|执行 4-planFromGlobalTraj ，但似乎进不来|
|EXEC_TRAJ |GEN_NEW_TRAJ|切换条件 当距离当前目标点足够近（no_replan_thresh_） 且有下一个点时,执行 planNextWaypoint,在函数中成功后跳转|
|EXEC_TRAJ|WAIT_TRAGET||

# 疑问 
只有7个状态,为什么状态字符有8个，有一个没有初始化不会报错吗

```c++
    static string state_str[8] = {"INIT", "WAIT_TARGET", "GEN_NEW_TRAJ", "REPLAN_TRAJ", "EXEC_TRAJ", "EMERGENCY_STOP", "SEQUENTIAL_START"};

```

# 3-planNextWaypoint

核心目标：获取一条多项式轨迹 [3.1-GlobalTraj](#3.1-GlobalTraj)  
次要目标：可视化多项式轨迹
## 程序流程
1. 获取多项式执行时间
2. 间隔0.1秒取点
3. 形成一条路径
4. 发布
5. 进入下一个状态
    - WAIT_TARGET
    - REPLAN_TRAJ (当前状态必须不为 EXEC_TRAJ)

## 3.1-GlobalTraj

|Index|功能|细节|
|-|-|-|
|1| input|<ul><li>当前 odom（p,v,a=0） 作为 start_poin</li><li>Next_wp（p,v=0,a=0）作为 end_point</li></ul> |
|2|点差值|最大点间距 = 4m ，否则 等距差值|
|3|多项式初始轨迹|<ul><li>没有中间点(差值点)时(只有起止点)，直接解方程</li><li>有中间点(差值点)时，minSnapTraj</li></ul> |

## 3.2五次多项式
两种用法
- 没有中间点
- 有中间点（minSnapTraj）

# Tips
B-spline 初始化 时还会再用一次 多项式做初始化，注意区分开
# 4-planFromGlobalTraj
主要在调用

```c++
    bool flag_random_poly_init;
    if (timesOfConsecutiveStateCalls().first == 1)
      flag_random_poly_init = false;
    else
      flag_random_poly_init = true;
```
- start_pt_ = odom_pos_; 获取 目标点

## 4.1-callReboundReplan
**1.getLocalTarget**

核心其实也就是从一个全局多项式轨迹中确定一个ego_planner的下一个目标点

**2.从起点?遍历 多项式轨迹**
1. 若 一切顺利，则将最后一个点设置为局部点
2. 若 遍历过程发现距离 > planning_horizen_ 的点 设置新的局部点
3. 若 一开始就发现距离已经 > planning_horizen_ 则找到第一个小于 planning_horizen_ 的点再进行 2
	1. 想象不到这种情况

**终点处理**  

剩下的距离已经不够减速了
$$
D_{local->end}<\frac{v^2}{2a}
$$

则 local_target_vel_ 设为 0
- last_progress_time_ , 新多项式产生时归0
- global_duration_ 从多项式中来


### reboundReplan

(have_new_target_ || flag_use_poly_init), flag_randomPolyTraj);  
当距离 local_target_pt小于0.2m时 ，规划失败

### B-spline 优化
#### INIT
#TODO


#### Publish && visualization

------------------
# 4.2B-spline优化

## 1.初始五次多项式

### 五次多项式

TIPS
- flag_first_call
- flag_polyInit
- flag_force_polynomial


|flag|作用|
|-|-|
|flag_randomPolyTraj|在 planFromGlobalTraj  中若状态切换为true,否则 false;在 planFromCurrentTraj  为 false。|
|flag_use_poly_init|planFromGlobalTraj 为 true；planFromCurrentTraj 中 第一次调用callReboundReplan 为false，失败后再次调用时为true|

# 2.采样为 B-spline



# 3. OPTIMIZE


# 4. REFINE




# 其他

## 初始化
给出了两种 大模式
- 地图选点
- 预设目标点组

## 预设目标点
## 触发

## FIRST
- 读点
- Rviz可视化目标点
- [[3-planNextWaypoint]] 目标第一个点



## 地图选点






# 实验
# Ego-planner
1. 通电
1. 检查无人机位置放置是否正确
2. 为每架无人机启动节点
3. Start Server
4. 测试VINS工作正常
5. 若正常，不用重开
6. 启动程序

## nomachine mode
Drone
```bash
cd ~/ego_env_sh/edge2
./one_shot_swarm.sh

```

Server
```bash
roslaunch swarm_terminal swarm_terminal.launch
rosrun swarm_terminal ego_control_node

```


## nohup mode
Drone
```bash
cd ~/ego_env_sh/edge2
./nohup_one_shot_swarm.sh

```

Server
```bash
roslaunch swarm_terminal swarm_terminal.launch
rosrun swarm_terminal ego_control_node

```




# Track


rosrun car_cooperation car_msg.py


./S_takeoff.sh
./S_back.sh
./S_land.sh

```


## nohup mode
```bash
cd ~/ego_env_sh/edge2
./nohup_one_shot_with_vins.sh

# new terminal
rosrun car_cooperation car_msg.py

./S_takeoff.sh
./S_back.sh
./S_land.sh

```