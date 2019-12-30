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
      meta: { title: 'vm', noCache: false, icon: 'vm' }
    },
    {
      path: 'detail',
      component: () => import('@/views/vm/MachineDetail'),
      name: 'VmDetail',
      meta: { title: 'vmDetail', icon: 'el-icon-s-platform', noCache: false },
      hidden: true
    }
  ]
};

export default vmsRouter
