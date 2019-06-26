import Layout from '@/views/layout/Layout'

const vmsRouter = {
  path: '/vm',
  component: Layout,
  redirect: 'noredirect',
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
      meta: { title: 'Machine List', noCache: true, icon: 'vm' }
    },
    {
      path: 'show',
      component: () => import('@/views/vm/MachineDetail'),
      name: 'VmShow',
      meta: { title: 'Machine Detail', icon: 'el-icon-s-platform', noCache: true },
      hidden: true
    },
  ]
}

export default vmsRouter
