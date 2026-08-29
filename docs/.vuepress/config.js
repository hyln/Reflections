import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
import { excalidrawPlugin } from './excalidraw-plugin.js'

export default defineUserConfig({
  // base: '/Knowledge-Base/',
  base: '/',
  plugins: [excalidrawPlugin()],

  lang: 'zh-CN',
  locales: {
    '/': {
      title: 'Hyaline',
      lang: 'zh-CN',
      description: '机器人,px4飞控设计使用心得',
    },
    '/en/': {
      title: 'Hyaline',
      lang: 'en-US',
      description: '机器人,px4飞控设计使用心得',
    },
  },

  bundler: viteBundler(),

  theme: plumeTheme({
    // 添加您的部署域名
    hostname: 'https://hyln.space/',
    // encrypt: {
    //   global: true,
    //   admin: ['123456'],
    // },
    markdown: {
      demo: true,
      math: { type: 'katex' },
    },
  }),
})
