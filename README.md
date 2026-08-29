# Hyaline

[网址](https://hyln.space)
The Site is generated using [vuepress](https://vuepress.vuejs.org/) and [vuepress-theme-plume](https://github.com/pengzhanbo/vuepress-theme-plume)

## Install

```sh
pnpm i
```

## excalidraw 中是流程图的源码

`excalidraw/*.excalidraw` 会在 `pnpm docs:dev` / `pnpm docs:build` 时自动导出为静态 SVG。

在 Markdown 中这样引用：

```md
![](/excalidraw/ego_planner.excalidraw)
```

https://excalidraw.com/

## Usage

```sh
# start dev server
pnpm docs:dev
# build for production
pnpm docs:build
# preview production build in local
pnpm docs:preview
# update vuepress and theme
pnpm vp-update
```

## Documents

- [vuepress](https://vuepress.vuejs.org/)
- [vuepress-theme-plume](https://theme-plume.vuejs.press/)
