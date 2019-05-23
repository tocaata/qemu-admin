import Layout from '@/views/layout/Layout'

const usersRouter = {
  path: '/user',
  component: Layout,
  redirect: 'noredirect',
  name: 'User List',
  meta: {
    title: 'User List',
    icon: 'peoples'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/user/UserList'),
      name: 'UserList',
      meta: { title: 'User List', noCache: true }
    }
  ]
}

export default usersRouter
