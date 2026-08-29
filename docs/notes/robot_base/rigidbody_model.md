---
title: 刚体动力学模型
createTime: 2024/09/07 00:48:12
permalink: /robot_base/r8o5kgii/
---

# 刚体动力学模型

## 无约束刚体动力学(Unconstrained Rigid Body Dynamics)

### 牛顿-欧拉公式(Newton-Euler equation)

在经典力学中，牛顿-欧拉方程描述了刚体的平移和旋转动力学[^wiki_newton_euler]

$$
\begin{aligned}
F&=ma\\
\tau &=\mathbf{I} \cdot \dot{\omega} + \omega \times(I \cdot \omega)
\end{aligned}
$$

:::info

- F: 作用在质心上的总力
- $\tau$: 作用于质心的总扭矩

- $m$: 是刚体的质量
- $\mathbf{I}$: $3 \times 3$ 的 惯性矩阵
- $\dot{\omega}$: 刚体的角加速度(angular acceleration)，


其中
- $I \cdot \dot{\omega}$ 描述了合外力矩
- $\omega \times(I \cdot \omega)$ 描述了惯性力

公式推导参考[欧拉方程的推导](./math_base.md#欧拉方程的推导)
:::




[^wiki_newton_euler]:[https://en.wikipedia.org/wiki/Newton%E2%80%93Euler_equations](https://en.wikipedia.org/wiki/Newton%E2%80%93Euler_equations)