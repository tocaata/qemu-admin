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
      component: () => import('@/views/vm/VMList'),
      name: 'VMList',
      meta: { title: 'Machine List', noCache: true, icon: 'list' }
    },
    {
      path: 'new',
      component: () => import('@/views/vm/VMCreate'),
      name: 'VMCreate',
      meta: { title: 'Create Machine', noCache: true, icon: 'edit' }
    }
  ]
}

export default vmsRouter
