---
title: linux-user-manager
createTime: 2024/10/10 05:28:43
permalink: /article/1u2gt34i/
---




## 密码管理
### linux 下的密码管理

`/etc/shadow` 格式如下 
```bash
nvidia:$5$/eHiWVBULQFemVk$rgFlZk.1PVBKSsU/X24lKrkSLHAU40csnb.UmWJQo./:19994:0:99999:7:::
```
- 用户名: nvidia
- 加密密码:   \$加密方式\$/“盐”值 /密码哈希值/
	- 5 SHA-256 
- **上次修改日期**：密码上次更改的时间（以自 Unix 纪元起的天数表示）。19994
- **最小间隔天数**：两次修改密码之间的最短时间。0
- **最大间隔天数**：密码的最长有效天数。 99999
- **警告天数**：在密码过期前发出警告的天数。7
- 禁用时间:账号到期时间:保留字段:  :::

> 如何在另外的机器上修改密码？