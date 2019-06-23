import Layout from '@/views/layout/Layout'

const vmsRouter = {
  path: '/vm',
  component: Layout,
  redirect: 'noredirect',
  name: 'Machines',
  meta: {
    title: 'Machines',
    icon: 'example'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/vm/VmList'),
      name: 'VmList',
      meta: { title: 'Machine List', noCache: true, icon: 'list' }
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
