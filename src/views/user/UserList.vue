<template>
  <div>
    <el-table :data="users" border align="center"
              v-loading="loading"
              fit highlight-current-row>
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        label="Username"
        prop="username">
      </el-table-column>
      <el-table-column
        label="Created Date"
        prop="created_at">
      </el-table-column>
      <el-table-column
        label="Email Address"
        prop="email">
      </el-table-column>
      <el-table-column
        label="action">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { userList } from '../../api/user';

  export default {
    name: 'UserList',
    data() {
      return {
        loading: false,
        users: []
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      search() {
        this.loading = true;
        userList().then(res => {
          this.users = res.data;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      }
    }
  }
</script>

<style scoped>

</style>
