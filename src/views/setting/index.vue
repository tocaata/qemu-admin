<template>
    <div class="container">
      <add-setting-button
        :on-created="settingCreated"
        :text="$t('common.add')">
      </add-setting-button>
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
          <template slot-scope="{ row }">
            <el-input v-if="row.editable" size="small" v-model="row.valueMutable"></el-input>
            <span v-else>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          :label="$t('common.createdAt')"
          prop="created_at">
        </el-table-column>
        <el-table-column
          :label="$t('common.action')">
          <template slot-scope="{ row }">
            <template v-if="row.editable">
              <el-link
                @click="updateSetting(row)"
                icon="el-icon-check">
                {{$t('common.save')}}
              </el-link>
              <el-link
                @click="cancelUpdate(row)"
                icon="el-icon-close">
                {{$t('common.cancel')}}
              </el-link>
            </template>
            <template v-if="!row.editable">
              <el-link
                @click="row.editable = true"
                type="primary"
                icon="el-icon-edit">
                {{$t('common.edit')}}
              </el-link>
              <delete-link @click="deleteSetting(row.id)">
                {{$t('common.delete')}}
              </delete-link>
            </template>
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
  import {getSettings, updateSetting, deleteSetting} from '@/api/setting';
  import AddSettingButton from './components/AddSettingButton';
  import DeleteLink from '@/components/DeleteLink';
  import moment from 'moment';
  import {pick} from 'lodash';

  export default {
    name: "Setting",
    mixins: [ Pager ],
    components: {AddSettingButton, DeleteLink},

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
          this.settings = list.map(item => {
            Object.entries(item).forEach(([k, v]) => {
              item[k + 'Mutable'] = v;
            });

            item['editable'] = false;
            return item;
          });
        }).finally(() => {
          this.loading = false;
        });
      },
      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      },
      settingCreated(data, message) {
        this.$message({type: 'success', message});
        this.search();
      },
      updateSetting(row) {
        this.loading = true;
        const {id, type, name, value, valueMutable} = row;
        updateSetting({id, type, name, value: valueMutable}).then(({data, message}) => {
          this.$message({type: 'success', message});
          this.search();
        }).finally(() => {
          this.loading = false;
        });
      },
      cancelUpdate(row) {
        row.editable = false;
        row.valueMutable = row.value;
      },
      deleteSetting(id) {
        this.loading = true;

        return deleteSetting(id).then(({message}) => {
          this.$message({type: 'success', message});
          this.search();
        }).finally(() => {
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    /deep/ .el-link:not(:last-child) {
      margin-right: 5px;
    }

    .el-input {
      padding-right: 50px;
    }
  }
</style>
