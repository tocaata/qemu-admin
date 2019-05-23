import Layout from '@/views/layout/Layout'

const vmsRouter = {
  path: '/vm',
  component: Layout,
  redirect: 'noredirect',
  name: 'Virtual Machines',
  meta: {
    title: 'Virtual Machines',
    icon: 'example'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/vm/VMList'),
      name: 'VMList',
      meta: { title: 'Virtual Machines', noCache: true }
    }
  ]
}

export default vmsRouter
