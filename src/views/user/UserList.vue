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
        :formatter="dateFormatter"
        label="Created Date"
        prop="created_at">
      </el-table-column>
      <el-table-column
        label="Email Address"
        prop="email">
      </el-table-column>
      <el-table-column
        label="action">
        <template slot-scope="scope">
          <el-link @click="deleteUser(scope.row.id)" type="primary" size="small" icon="el-icon-delete">Delete</el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      :total="total"
      class="pagination-container"
      :page-sizes="[5,10,20,50]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import { userList, deleteUser } from '../../api/user';

  export default {
    name: 'UserList',
    data() {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        users: []
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      search() {
        this.loading = true;
        const { pageIndex, pageSize } = this;
        return userList({ pageIndex, pageSize }).then(res => {
          this.users = res.data.list;
          this.total = res.data.totalSize;
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      },
      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      },
      deleteUser(userId) {
        this.$confirm('Do you confirm to delete this user?', 'Confirm to delete user', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancel'
        }).then(() => {
          this.loading = true;
          deleteUser(userId).then(res => {
            console.log(res);
            this.$message({
              type: 'success',
              message: 'Delete user successfully!'
            });
            this.search().then(res => {
              this.loading = false;
            });
          }).catch(err => {
            this.loading = false;
            this.$message({
              type: 'error',
              message: 'Fail to delete user!'
            });
          });
        });
      },

      handleCurrentChange(value) {
        this.pageIndex = value;
        this.search();
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.search();
      }
    }
  }
</script>

<style scoped>

</style>
