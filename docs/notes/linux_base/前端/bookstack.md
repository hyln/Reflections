---
title: bookstack
createTime: 2024/09/09 17:18:58
permalink: /linux_base/frontend/ho5f98ok/
---


[https://www.bookstackapp.com/docs/admin/installation/](https://www.bookstackapp.com/docs/admin/installation/)

# docker 安装

[https://github.com/linuxserver/docker-bookstack](https://github.com/linuxserver/docker-bookstack) 可以直接使用docker-compose

# 默认管理员

账号：admin@admin.com  
密码：password




# Latex 公式兼容

[https://www.bookstackapp.com/hacks/mathjax-tex/](https://www.bookstackapp.com/hacks/mathjax-tex/)

使用管理员在设置中设置`Custom HTML Head Content`

```html

<script>
    window.MathJax = {
        tex: {
            inlineMath: [['′,′']],
        },
    };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js"></script>

```

# 显示不正常

markdown 的下划线\_ 与 letex 的下标冲突，会导致 将 \_ 渲染为 `<em>` 标签，使得 mathjax 无法正常使用
因此 我们通过脚本，替换掉其中的`<em>`tag , 
<!-- inline 的公式还没有很好的办法解决这个问题 -->
<!-- 比如 x0+x1=0 -->
```html
<script type="text/javascript">
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('p').forEach(code => {
    const text = code.innerHTML;

    is_inline_math = /^(.∗)$/.exec(text);
    is_display_math = /^(.∗)$/.exec(text) || /^\begin\{.+\}(.*)\end\{.+\}/ms.exec(text);
    
    if (is_inline_math || is_display_math) {
      code.parentElement.classList.add('has-jax');
      if (is_inline_math) {
        // code.outerHTML = "<span class=yuuki_mathjax_inline>" + text.replace(/<em>|<\/em>/g, '\_') + "</span>";
      } else {
        // console.log(text.match(/<em>|<\/em>/g));
        code.outerHTML = "<span class=yuuki_mathjax_display>" + text.replace(/<em>|<\/em>/g, '\_') + "</span>";
      }
    }
  });
});
</script>
<script>
window.MathJax = {
  tex: {
    inlineMath: [['′,′'], ['′,′']]
  },
  svg: {
    fontCache: 'global'
  }
};
</script>
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js">
</script>

```

## 参考
> [https://liam.page/2015/09/09/fix-conflict-between-mathjax-and-markdown/](https://liam.page/2015/09/09/fix-conflict-between-mathjax-and-markdown/)