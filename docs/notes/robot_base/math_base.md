---
title: math_base
createTime: 2024/09/09 15:33:30
permalink: /robot_base/hurywudg/
---

# math_base
## 点积（Dot product）的性质

$$
\vec{a} \cdot \vec{a} = |\vec{a}||\vec{b}|\cos{\theta}
$$

当$\vec{a},\vec{b}$均为单位向量时，点积反应了向量间的夹角
- 当 夹角接近90度时，趋近于0
- 当 夹角>90度时，结果为负

## 向量叉积(cross product)的性质


向量外积 $\mathbf{a}\times \mathbf{b}$ 或 $\mathbf{a} \wedge \mathbf{b}$

$$
\mathbf{a}\times \mathbf{b}= \parallel \mathbf{a}\parallel \parallel \mathbf{b}\parallel \sin(\theta) \mathbf{n}
$$

考虑几何意义
- 计算两个向量的旋转轴 n

## 四元数

:::warning
注意 ==Eigen::quaternion== 有两种初始化方式，
- Eigen::quaternion(Eigen::Vector4d(x,y,z,w))
- Eigen::quaternion(w,x,y,z)
:::

### canonical form

A quaternion is in "canonical form" **when its first element is nonnegative**.
**当四元数的第一个元素(w)为非负时，四元数处于“规范形式”**。
### 求逆
$$
\mathbf{q}^{−1}=\mathbf{q}^*=(q_0, -q_1, −q2, −q3_)
$$

### 乘法

先执行 $\mathbf{q}_0$ ，在执行 $\mathbf{q}_1$ ，可用乘法表示，实现如下

```python
def quaternion_multiply(quaternion0, quaternion1,quat_order="xyzw"):
	if(quat_order == "wxyz"):
		w0, x0, y0, z0 = quaternion0
		w1, x1, y1, z1 = quaternion1
	else: # xyzw
		x0, y0, z0,w0 = quaternion0
		x1, y1, z1,w1 = quaternion1
	return np.array([-x1 * x0 - y1 * y0 - z1 * z0 + w1 * w0,
	x1 * w0 + y1 * z0 - z1 * y0 + w1 * x0,
	-x1 * z0 + y1 * w0 + z1 * x0 + w1 * y0,
	x1 * y0 - y1 * x0 + z1 * w0 + w1 * z0], dtype=np.float64)# wxyz
```

### Half-Way Vector Solution 

### Half-Way Quaternion Solution[^Half-Way_Quaternion_Solution_Ref]



如何计算由向量 a -> b 的四元数
我们知道
$$
\begin{aligned}
\vec{a} \cdot \vec{b} &= |\vec{a}| |\vec{b}| \cos \theta \\
\vec{a} \times \vec{b} &= |\vec{a}| |\vec{b}| \sin \theta \mathbf{n}
\end{aligned}
$$
> 不要单位向量忽略n

这里n为旋转轴 theta 为 旋转角,可表示成四元数q

$$
q = \begin{bmatrix} \cos{\frac{\theta}{2}}\\
\mathbf{n}\sin{\frac{\theta}{2}}\\
\end{bmatrix}
$$
这里需要计算 $\cos{\frac{\theta}{2}}$ 和 $\sin{\frac{\theta}{2}}$，但是有取巧的办法。
即Half-Way Quaternion Solution，我们计算旋转两倍的四元数即
$$
q = \begin{bmatrix} \cos{\theta}\\
\mathbf{n}\sin{\theta}\\
\end{bmatrix}
$$
接着找到他和0度之间一半的四元数（find the quaternion half-way between that and zero degrees.）。
零旋转的四元数为：
$$
q_2 = \begin{bmatrix} 1\\
0\\ 0\\ 0
\end{bmatrix}
$$

[为什么可以使用加法计算一半旋转角的四元数？](https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/transforms/halfAngle.htm)

接着我们可以仅通过加法计算,这里需要q 和 q_2 有相同的尺度，q的大小为 $|\vec{a}||\vec{b}|$ ,将q_2写成

$$
q_2 = \begin{bmatrix} |\vec{a}| |\vec{b}|\\
0\\ 0\\ 0
\end{bmatrix} =\begin{bmatrix} \sqrt{|\vec{a}|^2 |\vec{b}|^2}\\
0\\ 0\\ 0
\end{bmatrix} 
$$

最后的形式比上一步少算了一个根号.
代码对照

```c++
Quaternion &q = *this;
Vector3<Type> cr = src.cross(dst);
const float dt = src.dot(dst);
if (cr.norm() < eps && dt < 0) {
		// handle corner cases with 180 degree rotations
		// if the two vectors are parallel, cross product is zero
		// if they point opposite, the dot product is negative
		// 对于这种特殊情况，cr是一个只需要找到一个正交向量就可以，下面的方法通过是通过与一个坐标轴形成一个平面，接着找到平面的正交向量实现的，(但是不理解使用向量中最小的轴分量的理由，这个做法是唯一的还是只是其中一种)，三个轴的四元数表示很容易写出 (w,x,y,z) x轴 180度为 (0,1,0,0),y轴 180度为 (0,0,1,0),z轴 180度为 (0,0,0,1)
		cr = src.abs();
		if (cr(0) < cr(1)) {
				if (cr(0) < cr(2)) {
						cr = Vector3<Type>(1, 0, 0);
				} else {
						cr = Vector3<Type>(0, 0, 1);
				}
		} else {
				if (cr(1) < cr(2)) {
						cr = Vector3<Type>(0, 1, 0);
				} else {
						cr = Vector3<Type>(0, 0, 1);
				}
		}
		q(0) = Type(0);
		cr = src.cross(cr); //这里计算出一个 正交向量
} else {
	// 正常情况，对照上面公式理解
	// normal case, do half-way quaternion solution
	q(0) = dt + std::sqrt(src.norm_squared() * dst.norm_squared());
}
q(1) = cr(0);
q(2) = cr(1);
q(3) = cr(2);
q.normalize(); //return
```

## 欧拉方程的推导

### 坐标系

首先明确两个参考系：

- 空间系（space frame）: 一个被固定在空间中的惯性系 $S_0$ 。
- 物理系（body frame）：一个被固定在转动的刚体上的，自身会转动的非惯性系 $S$ 。

### 推导

设物体的角速度为 $\mathbf{\omega}=(\omega_1,\omega_2,\omega_3)$ ,转动惯量分别为 $\lambda_1,\lambda_2,\lambda_3$, 则在 **body frame** 里，物体的角动量为

$$
\mathbf{L}=(\lambda_1 \omega_1,\lambda_2 \omega_2,\lambda_3 \omega_3)
$$

力矩为 $\mathbf{\Gamma}$ ,则在**space frame**里，有

$$
\mathbf{\Gamma} = (\frac{d\mathbf{L}}{dt})_{space}
$$


:::tip
一个重要的结论：向量$\mathbf{Q}$ 在惯性系$S_0$ 与在非惯性系$S$中的时间导数的关系是：
$$
\left(\frac{d\mathbf{Q}}{dt}\right)_{S_0}= \left(\frac{d\mathbf{Q}}{dt}\right)_{S}+\mathbf{\Omega}\times \mathbf{Q}
$$
其中$\mathbf{\Omega}$ 是body frame下的角速度
:::

将$\mathbf{L}$ 带入$\mathbf{Q}$，得到

$$
\left(\frac{d\mathbf{L}}{dt}\right)_{S_0}= \left(\frac{d\mathbf{L}}{dt}\right)_{S}+\mathbf{\omega}\times \mathbf{L}
=\mathbf{\dot{L}}+\mathbf{\omega}\times \mathbf{L}
$$

$$
\mathbf{\dot{L}}=(\lambda_1 \dot{\omega}_1,\lambda_2 \dot{\omega}_2,\lambda_2 \dot{\omega}_3)
$$




## 函数有唯一极值点的条件

### 对于一元函数

对于一个一元函数$f(x)$，唯一极值点的条件主要涉及一阶导数和二阶导数。

**局部极值点的判定**

条件一：==必要条件== 在$x_0$处的一阶导为0即($f^{''}(x)=0$)或一阶导不存在。

条件二：二阶导数判定
- 如果函数的二阶导数 $f^{''}(x)$ 在某点$x_0$处是正的,即$f^{''}(x)>0$,则$x_0$是一个局部极小值点。
- 如果函数的二阶导数 $f^{''}(x)<0$,则$x_0$是一个局部极大值点。
- 如果 $f^{''}(x)=0$，则需要进一步分析更高阶导数。

**唯一极值点的条件**

**函数的单峰性**：函数具有唯一的极大值或极小值，通常表现为单调递增到一个点后变为单调递减（或相反），这种性质通常与函数的凸性或凹性有关。
- 如果函数是严格凸的，即 $f^{''}(x)>0$ 对于所有 $x\in\mathbb{R}$,则函数只有一个极小值点。
- 如果函数是严格凹的，即 $f^{''}(x)<0$ 对于所有 $x\in\mathbb{R}$,则函数只有一个极大值点。

### 对于多元函数

**局部极值点的判定**

条件一：==必要条件== 梯度向量为0。
条件二: Hessian 矩阵判断法,通过Hessian矩阵的正定性或者负定性判定:
- 如果 Hessian 矩阵在某点正定，则该点是局部极小值点。
- 如果 Hessian 矩阵在某点负定，则该点是局部极大值点。
- 如果 Hessian 矩阵既非正定也非负定，可能存在鞍点。

**唯一极值点的条件**
- 严格凸性：如果函数 $f(x_1,x_2,...,x_n)$ 是严格凸的（即 Hessian 矩阵在定义域内正定），则该函数只有一个全局极小值点。
- 严格凹性：如果函数是严格凹的（即 Hessian 矩阵在定义域内负定），则该函数只有一个全局极大值点。

::: tip
在优化问题中，通常需要求极小值，例如在QP问题中，需要保证 Hessian 矩阵是一个正定矩阵。（正定矩阵首先是对称的）
:::

[^Half-Way_Quaternion_Solution_Ref]: [https://stackoverflow.com/questions/1171849/finding-quaternion-representing-the-rotation-from-one-vector-to-another](https://stackoverflow.com/questions/1171849/finding-quaternion-representing-the-rotation-from-one-vector-to-another)