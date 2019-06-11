<template>
  <div class="container">
    <el-form ref="searchVM" :model="searchVM" :rules="searchVMRules" inline>
      <el-form-item prop="name" label="Name">
        <el-input
          placeholder="vm name"
          v-model="searchVM.name">
        </el-input>
      </el-form-item>
      <el-form-item prop="os" label="OS">
        <el-input
          placeholder="vm os name"
          v-model="searchVM.os">
        </el-input>
      </el-form-item>
      <el-form-item prop="status" label="Status">
        <el-input
          placeholder="vm status"
          v-model="searchVM.status">
        </el-input>
      </el-form-item>
      <el-button
        @click="search"
        :loading="loading"
        type="primary">
        Search
      </el-button>
      <el-button
        @click="dialogVisible = true"
        icon="el-icon-plus">
        Create
      </el-button>
    </el-form>
    <el-table :data="vms" border
              header-align="center" align="center"
              @sort-change="sortChange"
              :default-sort = "{ prop: 'created_at', order: 'descending' }"
              v-loading="loading"
              class="vm-table"
              @expand-change="handleExpandChange"
              fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="Status"
        prop="status">
        <template slot-scope="scope">
          <el-tag :type="['info','success','warning','danger'][scope.row.status]">{{ scope.row.status | mapStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="Memory"
        prop="memory">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="CPU"
        prop="cpu">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="OS"
        prop="os">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="Created Date"
        :formatter="dateFormatter"
        prop="created_at">
      </el-table-column>
      <el-table-column
        align="center"
        label="action">
        <template slot-scope="scope">
          <el-link @click="false" icon="el-icon-video-play" type="primary"></el-link>
          <delete-link @click="deleteVm(scope.row.id)"></delete-link>
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

    <vm-dialog :visible.sync="dialogVisible" @created="vmCreated"></vm-dialog>
  </div>
</template>

<script>
  import { vmList, deleteVm } from '../../api/vm'
  import VmDialog from './VmDialog/VmDialog'
  import DeleteLink from '@/components/DeleteLink'

  export default {
    name: 'VmList',
    components: { VmDialog, DeleteLink },
    data() {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        ascending: false,
        orderBy: 'created_at',
        total: 0,
        vms: [],
        searchVM: {
          name: '',
          os: '',
          status: ''
        },
        searchVMRules: {},
        dialogVisible: false,
      };
    },
    mounted() {
      this.search();
    },
    filters: {
      mapStatus(value) {
        return ['stopped', 'running', 'pending', 'down'][value] || value;
      }
    },
    methods: {
      search() {
        const { name, os } = this.searchVM;
        const { pageSize, pageIndex, orderBy, ascending } = this;
        this.loading = true;
        vmList({ name, os, pageSize, pageIndex, orderBy, ascending }).then(res => {
          this.vms = res.data.list;
          this.total = res.data.totalSize;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },
      handleCurrentChange(value) {
        this.pageIndex = value;
        this.search();
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.search();
      },
      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      },
      sortChange({order, prop}) {
        this.ascending = order === 'ascending';
        this.orderBy = prop || 'created_at';
        this.search();
      },
      vmCreated() {
        this.dialogVisible = false;
        this.search();
      },
      deleteVm(id) {
        this.loading = true;
        deleteVm(id).then(res => {
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
      handleExpandChange(rows, expandedRows) {
        if (expandedRows.length > 0) {
          expandedRows
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 30px;
  }
</style>
