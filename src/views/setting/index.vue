<template>
    <div class="container">
      <el-table
        :data="settings"
        v-loading="loading"
        fit highlight-current-row>
        <el-table-column
          :label="$t('common.name')"
          prop="name">
        </el-table-column>
        <el-table-column
          :label="$t('common.type')"
          prop="type">
        </el-table-column>
        <el-table-column
          :label="$t('setting.value')"
          prop="value">
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          :label="$t('common.createdAt')"
          prop="created_at">
        </el-table-column>
        <el-table-column
          :label="$t('common.action')">
          <template slot-scope="{ row }">
            <el-link @click="deleteSetting(row.id)" type="primary" size="small" icon="el-icon-delete">{{$t('common.delete')}}</el-link>
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
  import Pager from '@/mixins/pager';
  import {getSettings, deleteSetting} from '@/api/setting';
  import moment from 'moment';

  export default {
    name: "Setting",
    mixins: [ Pager ],

    data() {
      return {
        loading: false,
        settings: [],
      };
    },
    mounted() {
      this.search();
    },
    methods: {
      search() {
        this.loading = true;

        const { pageSize, pageIndex } = this;
        return getSettings({ pageSize, pageIndex, searchStr: '' }).then(({data}) => {
          const {totalSize, list} = data;
          this.total = totalSize;
          this.settings = list;
        }).finally(() => {
          this.loading = false;
        });
      },
      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      },
      deleteSetting() {
        this.loading = true;

        return deleteSetting().then();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
  }
</style>
