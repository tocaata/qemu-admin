<template>
  <div class="margin">
    <div :style="{display: 'flex'}">
      <el-form ref="searching" :model="searching" @submit.native.prevent="search" inline>
        <el-form-item prop="searchStr">
          <el-input
            clearable
            :readonly="loading"
            :placeholder="$t('virtualMachine.searching')"
            v-model="searching.searchStr">
            <el-button slot="append"
                       icon="el-icon-search"
                       :loading="loading"
                       @click="search">
            </el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <new-option-dialog  :on-create="handleCreate" :text="$t('common.add')">
      </new-option-dialog>
    </div>

    <el-table :data="args" class="arg-table" stripe highlight-current-row :expand-row-keys="expand"
              style="margin-top: 30px" row-key="id" v-loading="loading" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <edit-cmd-option :data="row.config | json" :arg-id="row.id" @change="search"></edit-cmd-option>
        </template>
      </el-table-column>
      <el-table-column prop="arg" :label="$t('commandOption.option')" width="200">
        <template slot-scope="{ row }">
          {{ JSON.parse(row.arg).join(', ') }}
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('common.name')" width="150">
      </el-table-column>
      <el-table-column
        prop="is_primary"
        :label="$t('common.enabled')"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-tag type="primary" v-if="row.is_primary === 1">{{$t('common.isEnabled')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="config" :label="$t('commandOption.template1')"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column :label="$t('common.action')" width="200" align="center">
        <template slot-scope="{ row }">
          <el-link icon="el-icon-view" type="primary" class="middle-icon" @click="toggleExpand(row.id)"></el-link>
          <delete-link class="middle-icon" @click="deleteArg(row.id)"></delete-link>
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
  import NewOptionDialog from './components/NewOptionDialog';
  import DeleteLink from '@/components/DeleteLink';
  import EditCmdOption from './components/EditCmdOption'

  export default {
    name: 'KvmArg',
    components: { EditCmdOption, DeleteLink, NewOptionDialog },
    data() {
      return {
        loading: false,
        searching: {
          searchStr: ''
        },
        newParams: {
          name: '',
          label: '',
          type: '',
          options: [],
          component: '',
          default: ''
        },
        args: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        expand: []
      };
    },
    mounted() {
      this.search()
    },
    filters: {
      json(data) {
        return JSON.parse(data);
      }
    },
    methods: {
      search() {
        this.loading = true;

        const { pageIndex, pageSize } = this;
        return listOption({ pageIndex, pageSize, searchStr: this.searching.searchStr }).then(res => {
          this.args = res.data.list;
          this.total = res.data.totalSize;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      deleteArg(id) {
        this.loading = true;

        this.$store.dispatch('addDirtyViews', ['OSList']);
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
        this.expand = b.map(x => x.id);
      },
      handleCreate() {
        this.search();
      },
      toggleExpand(id) {
        let i;
        if ((i = this.expand.indexOf(id)) >= 0) {
          this.expand.splice(i, 1);
        } else {
          this.expand.push(id);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin {
    margin: 30px;
  }
</style>
