<template>
  <div class="container">
    <el-form ref="searchVM" :model="searchVM" :rules="searchVMRules" class="inline-form" label-width="auto">
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

    <el-dialog
      modal
      title="Create Machine"
      width="40%"
      :visible.sync="dialogVisible">
      <div class="margin">
        <el-form :model="newVM" class="inline-form" label-width="auto">
          <div v-if="activeStep === 0">

              <el-form-item label="VM Name:" prop="name">
                <el-input v-model="newVM.name"
                          style="width: 300px"
                          placeholder="Please input VM name">
                </el-input>
              </el-form-item>
          </div>

          <div v-if="activeStep === 1">
              <el-form-item label="   OS:" prop="os">
                <el-input v-model="newVM.os"
                          style="width: 300px"
                          placeholder="Please OS name">
                </el-input>
              </el-form-item>
          </div>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="activeStep += 1">下一步</el-button>
      </span>
    </el-dialog>

    <el-table :data="vms" border
              header-align="center" align="center"
              @sort-change="sortChange"
              :default-sort = "{ prop: 'created_at', order: 'descending' }"
              v-loading="loading"
              class="vm-table"
              fit highlight-current-row>
      <el-table-column
        sortable="custom"
        label="Name"
        prop="name">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="Status"
        prop="status">
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
        label="action">
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
  import { vmList } from '../../api/vm'

  export default {
    name: 'VMList',
    data() {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        ascending: true,
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
        activeStep: 0,
        newVM: {
          name: '',
          os: '',
        }
      };
    },
    mounted() {
      this.search();
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
        }).catch(err => {
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
      }
    }
  }
</script>

<style scoped>
  .inline-form {
    display: inline-block;
  }

  .inline-form .el-input{
    width: 160px;
  }

  .inline-form .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }

  .inline-form label {
    float: none;
    display: inline-block;
  }

  .container {
    padding: 30px;
  }
</style>
