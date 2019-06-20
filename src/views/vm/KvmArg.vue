<template>
  <div class="margin">
    <new-arg-dialog :on-create="handleCreate">
    </new-arg-dialog>

    <el-table :data="options" border style="margin-top: 30px" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item label="name:">
              <span>{{ scope.row.name }}</span>
            </el-form-item>
            <el-form-item label="Template:">
              <el-tag type="info" style="font-size: 1em;">{{ getCmd(scope.row.config) }}</el-tag>
            </el-form-item>
            <el-form-item label="config:">
              <el-card shadow="never">
                <pre class="prettyprint code">
                  {{ JSON.stringify(JSON.parse(scope.row.config), null, 2) }}
                </pre>
              </el-card>
            </el-form-item>
          </el-form>
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
  import { listOption, deleteArg } from '../../api/vm'
  import NewArgDialog from './Components/NewArgDialog';
  import DeleteLink from '@/components/DeleteLink'

  export default {
    name: 'KvmArg',
    components: { DeleteLink, NewArgDialog },
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
      },
      getCmd(config) {
        const object = JSON.parse(config);
        return `-${object.arg} ${object.template}`;
      }
    }
  }
</script>

<style scoped>
  .margin {
    margin: 30px;
  }

  .code {
    line-height: 1.2rem;
    border: 0;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  pre.code :first-child, pre.code :last-child {
    display: none;
  }

  .divider {
    height: 1px;
    width: 100%;
    background: #DCDFE6;
    /*border-bottom: 1px solid #DCDFE6;*/
    position: relative;
    top: -10px;
  }
</style>

<style>
  .divider:not(:last-child) {
    height: 1px;
    width: 100%;
    background: #DCDFE6;
    /*border-bottom: 1px solid #DCDFE6;*/
    position: relative;
    top: -10px;
  }
</style>
