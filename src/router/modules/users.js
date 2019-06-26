import Layout from '@/views/layout/Layout'

const usersRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noredirect',
  name: 'User',
  meta: {
    title: 'User',
    icon: 'peoples'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/user/UserList'),
      name: 'UserList',
      meta: { title: 'User List', noCache: true }
    }
  ]
}

export default usersRouter
