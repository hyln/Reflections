import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const zhBlog = defineCollection({
  type: 'post',
  dir: 'blog',
  title: '博客',
  link: '/blog/',
})

const zhAlgorithm = defineCollection({
  type: 'doc',
  dir: 'notes/algorithm',
  title: '算法学习',
  sidebar: 'auto',
})

const zhPx4Code = defineCollection({
  type: 'doc',
  dir: 'notes/px4code',
  title: 'px4源码学习',
  sidebar: 'auto',
})

const zhRobotBase = defineCollection({
  type: 'doc',
  dir: 'notes/robot_base',
  title: '机器人动力学基础',
  sidebar: ['', 'mc_model', 'rigidbody_model'],
})

const zhLinuxBase = defineCollection({
  type: 'doc',
  dir: 'notes/linux_base',
  title: 'linux基础使用',
  sidebar: 'auto',
})

const zhNormalHw = defineCollection({
  type: 'doc',
  dir: 'notes/normal_hw',
  title: '硬件文档',
  sidebar: 'auto',
})

const zhEasyServerManage = defineCollection({
  type: 'doc',
  dir: 'notes/easy_server_manage',
  title: '简易服务器管理',
  sidebar: 'auto',
})

const zhProductionDoc = defineCollection({
  type: 'doc',
  dir: 'notes/production_doc',
  title: '生产文档',
  sidebar: 'auto',
})

const zhEvcam = defineCollection({
  type: 'doc',
  dir: 'notes/evcam',
  title: '相机与 v4l2',
  sidebar: 'auto',
})

export const zhCollections = defineCollections([
  zhBlog,
  zhAlgorithm,
  zhPx4Code,
  zhRobotBase,
  zhLinuxBase,
  zhNormalHw,
  zhEasyServerManage,
  zhProductionDoc,
  zhEvcam,
])

const enBlog = defineCollection({
  type: 'post',
  dir: 'preview',
  title: 'Blog',
  link: '/blog/',
})

const enDemo = defineCollection({
  type: 'doc',
  dir: 'notes/demo',
  title: 'Demo',
  sidebar: ['', 'foo', 'bar'],
})

export const enCollections = defineCollections([
  enBlog,
  enDemo,
])
