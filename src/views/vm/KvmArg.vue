<template>
  <div class="margin">
    <new-arg-dialog :on-create="handleCreate">
    </new-arg-dialog>

    <el-table :data="options" border class="arg-table"
              style="margin-top: 30px" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <arg-detail :data="scope.row"></arg-detail>
        </template>
      </el-table-column>
      <el-table-column prop="arg" label="Arg" width="200">
      </el-table-column>
      <el-table-column prop="name" label="Name" width="200">
      </el-table-column>
      <el-table-column prop="is_primary" label="Primary"
                       width="200"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.is_primary === 1">Primary</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="config" label="Config"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="Action" width="200" align="center">
        <template slot-scope="scope">
          <delete-link @click="deleteArg(scope.row.id)"></delete-link>
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
      :page-sizes="[10,20,50]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import { listOption, deleteArg } from '../../api/vm';
  import NewArgDialog from './components/NewArgDialog';
  import DeleteLink from '@/components/DeleteLink';
  import ArgDetail from './components/ArgDetail';

  export default {
    name: 'KvmArg',
    components: { ArgDetail, DeleteLink, NewArgDialog },
    data() {
      return {
        loading: false,
        newParams: {
          name: '',
          label: '',
          type: '',
          options: [],
          component: '',
          default: ''
        },
        options: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
      };
    },
    mounted() {
      this.search()
    },
    filters: {
    },
    methods: {
      search() {
        this.loading = true;
        const { pageIndex, pageSize } = this;
        return listOption({ pageIndex, pageSize }).then(res => {
          this.options = res.data.list;
          this.total = res.data.totalSize;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      deleteArg(id) {
        this.loading = true;

        deleteArg(id).then(res => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          this.search();
        });
        this.loading = false;
      },

      handleCurrentChange(value) {
        this.pageIndex = value;
        this.search();
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.search();
      },
      handleExpandChange(e, b) {
        if (b.length > 0) {
          this.$nextTick(() => {
            PR.prettyPrint();
          });
        }
      },
      handleCreate() {
        this.search();
      }
    }
  }
</script>

<style scoped>
  .margin {
    margin: 30px;
  }
</style>

<style>
</style>
