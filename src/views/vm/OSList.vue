<template>
  <div class="container">
    <el-form ref="searchOS" :model="searchOS" :rules="searchOSRules" @submit.native.prevent="search" inline>
      <el-form-item prop="searchStr" label="">
        <el-input
          clearable
          placeholder="Searching String"
          v-model="searchOS.searchStr">
          <el-button slot="append" icon="el-icon-search"
                     :loading="loading" @click="search">
          </el-button>
        </el-input>
      </el-form-item>
      <newos-conf-dialog @created="search"></newos-conf-dialog>
    </el-form>

    <el-table :data="oss" v-loading="loading">
      <el-table-column prop="name" label="Name">
      </el-table-column>
      <el-table-column prop="type" label="OS Type">
      </el-table-column>
      <el-table-column prop="detail" label="Detail" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="enabled" label="Enabled">
        <template slot-scope="{ row }">
          <el-tag v-if="row.enabled" type="primary">enabled</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Created Date" :formatter="dateFormatter">
      </el-table-column>
      <el-table-column label="Actions" align="center">
        <template slot-scope="scope">
          <el-link class="middle-icon" @click="handleEdit(scope.row)" type="primary" icon="el-icon-setting"></el-link>
          <delete-link class="middle-icon" @click="deleteOS(scope.row.id)"></delete-link>
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

    <component v-for="item in dynamicComponents"
               v-bind="item.props" :key="item.key" :is="item.component">
    </component>
  </div>
</template>

<script>
  import DeleteLink from '@/components/DeleteLink';
  import NewosConfDialog from './components/NewOSConfDialog';
  import EditosConfDialog from './components/EditOSConfDialog';

  import { OSList, deleteOS } from '../../api/vm';
  import Vue from 'vue';
  const EditDialog = Vue.extend(EditosConfDialog);

  export default {
    name: 'OSList',
    components: {
      DeleteLink,
      NewosConfDialog,
      EditosConfDialog
    },
    data() {
      return {
        searchOS: {
          searchStr: ''
        },
        searchOSRules: {},
        oss: [],
        dynamicComponents: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        ascending: false,
        orderBy: 'created_at',
        total: 0
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      handleCurrentChange(value) {
        this.pageIndex = value;
        this.search();
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.search();
      },

      search() {
        this.loading = true;
        const { pageIndex, pageSize, ascending, orderBy } = this;
        OSList({ pageIndex, pageSize, ascending, orderBy, searchStr: this.searchOS.searchStr }).then(res => {
          const data = res.data;
          this.loading = false;
          this.oss = data.list;
        }).catch(() => {
          this.loading = false;
        });
      },

      handleEdit(OS) {
        const component = {
          component: 'EditosConfDialog',
          key: OS.id,
          props: {
            data: OS,
            onClose: () => {
              this.dynamicComponents.splice(component);
            },
            onUpdate: () => {
              this.search();
            }
          }
        };
        this.dynamicComponents.push(component);
      },

      handleEdit2() {
        let ele = null;
        const onClose = () => {
          document.body.removeChild(ele);
          document.body.removeChild(document.querySelector('.v-modal'));
        };

        const editDialog = new EditDialog({
          propsData: {
            onClose
          }
        });

        ele = editDialog.$mount().$el;
        document.body.appendChild(ele);
      },

      deleteOS(id) {
        this.loading = true;
        deleteOS(id).then(res => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: res.message
          });

          this.search();
        }).catch(() => {
          this.loading = false;
        })
      },

      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      }
    }
  }
</script>

<style scoped>

</style>
