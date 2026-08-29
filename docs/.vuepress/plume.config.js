import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNavbar, zhNavbar } from './navbar'
import { enCollections, zhCollections } from './collections'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'notebook.svg',
  // base: '/Knowledge-Base/',
  base: '/',

  // your git repo url
  docsRepo: '',
  docsDir: 'docs',

  appearance: true,

  // social: [
  //   { icon: 'github', link: '/' },
  // ],

  locales: {
    '/': {
      profile: {
        avatar: 'notebook.svg',
        name: 'Hyaline',
        description: '个人博客，整理的笔记',
        // circle: true,
        // location: '',
        organization: '大连理工大学',
      },

      navbar: zhNavbar,
      collections: zhCollections,
    },
    '/en/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'knowledge base',
        description: '机器人,px4飞控设计使用心得',
        // circle: true,
        // location: '',
        // organization: '',
      },

      navbar: enNavbar,
      collections: enCollections,
    },
  },
})
