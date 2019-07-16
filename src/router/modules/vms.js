import Layout from '@/views/layout/Layout'

const vmsRouter = {
  path: '/vm',
  component: Layout,
  redirect: '/vm/list',
  name: 'Machine',
  meta: {
    title: 'Machine',
    icon: 'example'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/vm/VmList'),
      name: 'VmList',
      meta: { title: 'Machine List', noCache: false, icon: 'vm' }
    },
    {
      path: 'show',
      component: () => import('@/views/vm/MachineDetail'),
      name: 'VmShow',
      meta: { title: 'Machine Detail', icon: 'el-icon-s-platform', noCache: false },
      hidden: true
    },
  ]
}

export default vmsRouter
