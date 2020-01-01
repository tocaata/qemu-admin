<template>
  <div class="container">
    <el-form ref="searchVM" :model="searchVM" :rules="searchVMRules" @submit.native.prevent="search" inline>
      <el-form-item prop="searchStr">
        <el-input
          clearable
          :readonly="loading"
          :placeholder="$t('virtualMachine.searching')"
          v-model="searchVM.searchStr">
          <el-button slot="append"
                     icon="el-icon-search"
                     :loading="loading"
                     @click="search">
          </el-button>
        </el-input>
      </el-form-item>
      <el-button
        @click="dialogVisible = true"
        type="primary"
        icon="el-icon-plus">
        {{$t('common.create')}}
      </el-button>
    </el-form>
    <el-table :data="vms" stripe
              header-align="center"
              @sort-change="sortChange"
              :default-sort = "{ prop: 'created_at', order: 'descending' }"
              v-loading="loading"
              class="vm-table"
              :expand-row-keys="expand"
              row-key="id"
              @expand-change="handleExpandChange"
              fit highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left">
            <el-form-item :label="$t('common.actionLabel')">
              <el-tooltip effect="dark" content="Start" placement="top" :open-delay="1000">
                <el-button type="text" style="font-size: 20px"
                           @click="runMachine(row.id)" :disabled="row.status !== 'stopped'">
                  <svg-icon icon-class="start"/>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="Shutdown" placement="top" :open-delay="1000">
                <el-button type="text" style="font-size: 20px"
                           @click="exec(row.id, 'shutdown')" :disabled="row.status === 'stopped'">
                  <svg-icon icon-class="shutdown"/>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="power off" placement="top" :open-delay="1000">
                <el-button type="text" style="font-size: 20px"
                           @click="exec(row.id, 'stop')" :disabled="row.status === 'stopped'">
                  <svg-icon icon-class="close"/>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="clone vm" placement="top" :open-delay="500">
                <el-button type="text" style="font-size: 20px"
                           @click="cloneVm(row.id)">
                  <svg-icon icon-class="clone"/>
                </el-button>
              </el-tooltip>

              <el-tooltip effect="dark" content="connect vpn" placement="top" :open-delay="500">
                <el-button type="text" style="font-size: 20px"
                           @click="vnc(row.id)">
                  <svg-icon icon-class="vnc"/>
                </el-button>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('common.nameLabel')">
              <span>{{ row.name }}</span>
            </el-form-item>
            <el-form-item :label="$t('common.statusLabel')">
              <el-tag :type="row.status | mapStatus" style="font-size: 1em;">{{ row.status }}</el-tag>
            </el-form-item>
            <el-form-item :label="$t('virtualMachine.commandOptionsLabel')" class="newline-item"></el-form-item>
            <el-row>
              <ShowMore
                style="width: 80%"
                :data="row.cmdArgs">
                <template slot-scope="{ data }">
                  <el-table class="cmd-args" v-loading="loading"
                            :data="data">
                    <el-table-column :label="$t('virtualMachine.option')"
                                     prop="option" width="180">
                    </el-table-column>
                    <el-table-column :label="$t('virtualMachine.value')" prop="value"></el-table-column>
                  </el-table>
                </template>
              </ShowMore>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :label="$t('common.name')"
        prop="name">
      </el-table-column>
      <el-table-column
        sortable="custom"
        :label="$t('common.status')"
        prop="status">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | mapStatus">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('virtualMachine.autoBoot')"
        prop="auto_boot">
        <template slot-scope="{ row }">
          <el-tag :type="row.auto_boot | mapAutoBoot">{{ row.auto_boot === 1 ? 'yes': 'no' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('virtualMachine.memory')"
        prop="memory">
      </el-table-column>
      <el-table-column
        label="CPU"
        prop="cpu">
      </el-table-column>
      <el-table-column
        :label="$t('virtualMachine.os')"
        prop="os">
        <template slot-scope="{ row }">
          {{ row.os && row.os.name }}
        </template>
      </el-table-column>
      <el-table-column
        sortable="custom"
        :label="$t('common.createdAt')"
        :formatter="dateFormatter"
        prop="created_at">
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('common.action')">
        <template slot-scope="{ row }">
          <el-link
            v-show="row.status === 'stopped'"
             class="middle-icon"
             @click="runMachine(row.id)"
             icon="el-icon-video-play"
             type="primary">
          </el-link>
          <el-link
            v-show="row.status !== 'stopped'"
            class="middle-icon"
            @click="exec(row.id, 'stop')"
            icon="el-icon-video-pause"
            type="primary">
          </el-link>
          <el-link class="middle-icon" icon="el-icon-setting" @click="machineDetail(row.id)"></el-link>
          <delete-link class="middle-icon" @click="deleteVm(row.id)"></delete-link>
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

    <new-vm-dialog :visible.sync="dialogVisible" @created="vmCreated"></new-vm-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { vmList, deleteVm, cloneVm, getCmd, run, exec } from '../../api/vm';
  import NewVmDialog from './VmDialog/NewVmDialog';
  import DeleteLink from '@/components/DeleteLink';
  import ShowMore from '@/components/ShowMore';
  import Pager from '@/mixins/pager';
  import moment from 'moment';

  export default {
    name: 'VmList',
    components: { NewVmDialog: NewVmDialog, DeleteLink, ShowMore },
    mixins: [ Pager ],
    data() {
      return {
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        ascending: false,
        orderBy: 'created_at',
        total: 0,
        vms: [],
        cmdArgs: [],
        searchVM: {
          searchStr: ''
        },
        searchVMRules: {},
        dialogVisible: false,
        expand: []
      };
    },
    computed: {
      ...mapGetters(['dirtyViews'])
    },
    mounted() {
      this.$store.dispatch('delDirtyView', 'VmList').then();
      this.search();
    },
    activated() {
      if (this.dirtyViews.includes('VmList')) {
        this.$store.dispatch('delDirtyView', 'VmList').then(() => {
          this.search();
        })
      }
    },
    filters: {
      mapStatus(value) {
        switch (value) {
          case 'running': return 'success';
          case 'stopped': return 'info';
          case 'resume': return 'warning';
        }
      },
      mapAutoBoot(value) {
        switch (value) {
          case 1: return 'success';
          case 0: return 'info';
          default: return 'info';
        }
      }
    },
    methods: {
      search() {
        const { searchStr } = this.searchVM;
        const { pageSize, pageIndex, orderBy, ascending } = this;
        this.loading = true;
        vmList({ searchStr, pageSize, pageIndex, orderBy, ascending }).then(({ data }) => {
          const cmds = this.vms.reduce((total, cur) => {
            total[cur.id] = cur.cmdArgs;
            return total;
          }, {});

          this.vms = data.list.map(vm => {
            vm.cmdArgs = cmds[vm.id];
            vm.loading = false;
            return vm;
          });
          this.total = data.totalSize;
          this.loading = false;
          // this.handleExpandChange(null, this.vms.filter(x => this.expand.indexOf(x.id) >= 0));
        }).catch(() => {
          this.loading = false;
        }).finally(() => {
          // this.searchVM.searchStr = '';
        })
      },
      dateFormatter(row, column, cellValue) {
        return moment(cellValue).format('YYYY-MM-DD hh:mm:ss');
      },
      sortChange({order, prop}) {
        this.ascending = order === 'ascending';
        this.orderBy = prop || 'created_at';
        this.search();
      },
      runMachine(id) {
        this.loading = true;
        return run(id).then(res => {
          this.$message({ type: 'success', message: res.message });
          const vm = this.vms.find(x => x.id === id);
          vm.status = 'in process';
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      },

      exec(id, cmd) {
        this.loading = true;
        exec(id, cmd).then(res => {
          this.$message({ type: 'success', message: res.message });
          this.loading = false;
        }).catch(err => {
          this.loading = false;
        });
      },
      vmCreated() {
        this.dialogVisible = false;
        this.search();
      },
      cloneVm(id) {
        this.loading = true;
        cloneVm(id).then(({message}) => {
          this.$message({ type: 'success', message });
          this.search();
        }).finally(() => {
          this.loading = false;
        });
      },
      vnc(id) {
        const pass = Math.random().toString(36).slice(2);
        this.loading = true;
        exec(
          id,
          'set_password',
          {'protocol': 'vnc', 'password': pass}
        ).then(({message}) => {
          this.$message({ type: 'success', message });
        }).finally(() => {
          this.loading = false;
        });
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
          expandedRows.forEach(row => {
            if (('cmdArgs' in row) && !row.cmdArgs) {
              this.$set(row, 'loading', true);
              getCmd(row.id).then(res => {
                this.$set(row, 'cmdArgs', res.data.map(([option, value]) => { return { option, value } }));
                this.$set(row, 'loading', false);
              }).catch(() => {
                this.$set(row, 'loading', false);
              })
            }
          });
        }

        this.expand = expandedRows.map(x => x.id);
      },

      machineDetail(machineId) {
        this.$router.push({
          path: '/vm/detail',
          query: { machineId }
        })
      }
    },
    sockets: {
      updateMachineList(data) {
        console.log('updateMachineList', data);
        this.search();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cmd-args {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .newline-item{
    /deep/ label {
      float: none;
    }
  }

  .el-form-item {
    margin-bottom: 10px;
  }
</style>
