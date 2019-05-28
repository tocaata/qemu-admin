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
      path: 'new',
      component: () => import('@/views/vm/VmCreate'),
      name: 'VmCreate',
      meta: { title: 'Create Machine', noCache: true, icon: 'edit' }
    },
    {
      path: 'kvmarg',
      component: () => import('@/views/vm/KvmArg'),
      name: 'KvmArg',
      meta: { title: 'KVM Args', noCache: true, icon: 'edit' }
    }
  ]
}

export default vmsRouter
