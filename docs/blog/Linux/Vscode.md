---
title: Vscode
createTime: 2026/08/30 01:21:13
permalink: /article/14g3j8bm/
---

# ROS1_DEBUG

# Attach

```bash
{
    "configurations": [
        {
            "name": "(gdb) Attach",
            "type": "cppdbg",
            "request": "attach",
            "program": "${workspaceFolder}/../../devel/lib/sensor_bridge_pkg/sensor_bridge_pkg_node",
			"processId": "${command:pickProcess}",
            "MIMode": "gdb",
            "setupCommands": [
                {
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "Set Disassembly Flavor to Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ]
        }   
    ]
}
```