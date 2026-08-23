import { defineNoteConfig, defineNotesConfig, } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

const zhDemoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  // sidebar: ['', 'foo', 'bar'],
  sidebar: 'auto',
  // sidebar: [
  //   { text: 'X152b', collapsed: true, items: [
  //     { text: 'foo', link: 'foo' },
  //     { text: 'bar', link: 'bar' },
  //   ] },
  //   { text: 'X190g', collapsed: true, items: [
  //     { text: 'foo', link: 'foo' },
  //     { text: 'bar', link: 'bar' },
  //   ] },
  //   { text: 'X255c',  link: '/ppx', collapsed: true, items: 'auto',},
  //   // { text: '介绍', link: 'foo' },
  //   // { text: '使用', link: 'bar' },
  // ]
})


const zhAlgorithmNote = defineNoteConfig({
  dir: 'algorithm',
  link: '/algorithm',
  sidebar: 'auto',
  // sidebar: ['', 'atti_control', 'EKF_height','px4_mode','firmware_change','mc_mixer'],
})


const zhPx4CodeNote = defineNoteConfig({
  dir: 'px4code',
  link: '/px4code',
  sidebar: 'auto',
  // sidebar: ['', 'atti_control', 'EKF_height','px4_mode','firmware_change','mc_mixer'],
})

const zhRobotBaseNote = defineNoteConfig({
  dir: 'robot_base',
  link: '/robot_base',
  sidebar: ['', 'mc_model','rigidbody_model'],


})


const zhLinuxBaseNote = defineNoteConfig({
  dir: 'linux_base',
  link: '/linux_base',
  // sidebar: ['', 'sougou_install','apache_qs'],
  sidebar: 'auto'
})

const zhNormalHwBaseNote = defineNoteConfig({
  dir: 'normal_hw',
  link: '/normal_hw',
  // sidebar: ['', 'vimedge2'],
  sidebar: 'auto'

})

const zhEasyServerManageNote = defineNoteConfig({
  dir: 'easy_server_manage',
  link: '/easy_server_manage',
  // sidebar: ['', 'vimedge2'],
  sidebar: 'auto'

})
const zhProductionDocNote = defineNoteConfig({
  dir: 'production_doc',
  link: '/production_doc',
  // sidebar: ['', 'vimedge2'],
  sidebar: 'auto'

})

const zhEvcamNote = defineNoteConfig({
  dir: 'evcam',
  link: '/evcam',
  sidebar: 'auto',
})


export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    zhAlgorithmNote,
    zhPx4CodeNote,
    zhRobotBaseNote,
    zhNormalHwBaseNote,
    zhLinuxBaseNote,
    zhEasyServerManageNote,
    zhProductionDocNote,
    zhEvcamNote,
  ],
})

/* =================== locale: en-US ======================= */

const enDemoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/en/',
  notes: [enDemoNote],
})

