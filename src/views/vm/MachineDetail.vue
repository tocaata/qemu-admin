<template>
  <div class="container">
    <el-page-header @back="goBack" :content="$t('machineDetail.machineDetail')">
    </el-page-header>

    <div class="container">
      <el-form :model="vmSetting" class="vm-setting" inline>
        <el-form-item :label="$t('common.name')" prop="name">
          <el-input v-show="vmSettingEditable" v-model="vmSetting.name" size="small" style="width: 12rem"></el-input>
          <div v-show="!vmSettingEditable" style="width: 12rem">{{vmSetting.name}}</div>
        </el-form-item>
        <el-form-item :label="$t('machineDetail.autoBoot')" prop="autoBoot">
          <el-switch v-show="vmSettingEditable" v-model="vmSetting.autoBoot"></el-switch>
          <div v-show="!vmSettingEditable">{{!!vmSetting.autoBoot}}</div>
        </el-form-item>
        <el-form-item>
          <el-link v-if="!vmSettingEditable" @click="vmSettingEditable = true" icon="el-icon-setting" type="primary" class="middle-icon"></el-link>
          <el-link v-else @click="handleSettingChange" icon="el-icon-circle-check" type="primary" class="middle-icon"></el-link>
        </el-form-item>
      </el-form>

      <el-table :data="configs" v-loading="loading" :expand-row-keys="expand" row-key="values.id"
                @expand-change="handleExpandChange">
        <el-table-column type="expand">
          <template slot-scope="{ row, $index: index }">
            <machine-config-form
              :key="JSON.stringify(row.values.value)"
              :value="row.values.value"
              @input="rowData => editConfig(row.values.id, rowData)"
              :params="row.config.params"
              :on-cancel="() => fold(row.values.id)"
            >
            </machine-config-form>
          </template>
        </el-table-column>
        <el-table-column prop="arg" width="200" :label="$t('machineDetail.option')" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="name" width="200" :label="$t('common.name')" show-overflow-tooltip>
        </el-table-column>
        <el-table-column :label="$t('machineDetail.value')" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <el-tag v-for="cmd in row.cmd" :key="cmd" effect="plain" class="command-tag">{{ cmd }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="200" align="center">
          <template slot-scope="{ row }">
            <delete-link class="middle-icon" @click="deleteArg(row.values.id)"></delete-link>
          </template>
        </el-table-column>
      </el-table>

      <div style="padding-top: 30px">
        <el-button type="primary" icon="el-icon-plus" @click="dialogVisible = true">{{$t('common.add')}}</el-button>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="$t('machineDetail.selectTemplate')">
      <el-form>
        <el-form-item :label="$t('machineDetail.optionTemplate')">
          <el-select v-model="selectedArg" filterable>
            <el-option v-for="temp in data" :label="temp.label" :key="temp.key" :value="temp.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addConfig">{{$t('common.add')}}</el-button>
        <el-button size="small" @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';
  import MachineConfigForm from "./components/MachineConfigForm";
  import { vmDetail, editVm, deleteConfig, editConfig, getEnabledOptions, addConfig } from '../../api/vm'
  import DeleteLink from '@/components/DeleteLink';

  export default {
    name: 'MachineDetail',
    components: {
      DeleteLink,
      MachineConfigForm
    },
    data() {
      return {
        loading: false,
        machineId: this.$route.query['machineId'],
        activeName: 1,
        vmSetting: {
          autoBoot: false,
          name: ''
        },
        vmSettingEditable: false,
        configs: [],
        newVM: {
          name: '',
          os: null,
          arguments: {}
        },
        data: [],
        selectedArg: null,
        dialogVisible: false,
        expand: []
      };
    },
    computed: {
    },
    mounted() {
      this.getData();
      getEnabledOptions().then(res => {
        this.data = res.data.map(temp => {
          const data = JSON.parse(temp.config);
          const template = _.zip(data.arg, data.template).map(([arg, tpl]) => arg + (tpl ? ' ' + tpl : '')).join('\n');

          return { key: temp.id, label: `${data.title} '${template}'` };
        });
      });
    },
    methods: {
      goBack() {
        this.$router.push('/vm/list');
      },
      getData() {
        this.loading = true;
        return vmDetail(this.machineId).then(({ data }) => {
          this.vmSetting.autoBoot = data.auto_boot === 1;
          this.vmSetting.name = data.name;
          this.configs = data['vmOptionTemplates'].map(x => {
            x.config = JSON.parse(x.config);
            x.values.value = JSON.parse(x.values.value);
            x.cmd = this.getCmd(x);
            return x;
          });
        }).finally(() => {
          this.loading = false;
        });
      },
      getCmd(config) {
        try {
          const kvs = config['values']['value'];
          // const optTemp = JSON.parse(config['vmOptionTemplate']['config']);
          const args = config['config']['arg'];
          let templates = Array.isArray(config['config']['template']) ? config['config']['template'].slice() : [];

          templates = templates.map(template => {
            if (template) {
              for (let [k, v] of Object.entries(kvs)) {
                template = template.replace(k, v);
              }
            }

            return template;
          });

          return _.zip(args, templates)
            .map(([arg, template]) => [arg, template].join(' '))
        } catch (e) {
          console.error(e);
        }
      },
      handleSettingChange() {
        this.loading = true;
        editVm({ id: this.machineId, ...this.vmSetting }).then(({message}) => {
          this.$message({
            type: 'success',
            message: message
          });
          this.$store.dispatch('addDirtyViews', ['VmList']);
          this.getData();
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err.message
          });
          this.loading = false;
        }).finally(() => {
          this.vmSettingEditable = false;
        });
      },
      deleteArg(configId) {
        this.loading = true;
        deleteConfig(this.machineId, configId).then(({ message, data }) => {
          this.$message({
            type: 'success',
            message: message
          });
          this.getData();
          this.$store.dispatch('addDirtyViews', ['VmList']);
        }).finally(() => {
          this.loading = false;
        })
        // this.$delete(this.newVM.arguments, key);
      },
      editConfig(configId, configParams, index, rowId) {
        this.loading = true;
        editConfig(this.machineId, configId, configParams).then(({ message }) => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: message
          });
          this.$store.dispatch('addDirtyViews', ['VmList']);
          this.getData();
          this.fold(configId);
        }).catch(() => {
          this.loading = false;
        })
      },
      addConfig() {
        this.loading = true;
        addConfig(this.machineId, this.selectedArg).then(({ message, data }) => {
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: message
          });

          this.getData();
          this.$store.dispatch('addDirtyViews', ['VmList']);
        }).finally(() => {
          this.loading = false;
        })
      },
      handleExpandChange(e, expandedRows) {
        this.expand = expandedRows.map(row => row.values.id);
      },
      fold(key) {
        const index = this.expand.indexOf(key);
        if (index >= 0) {
          this.expand.splice(index, 1);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    .vm-setting {
      /deep/ .el-form-item__content {
        padding-left: 0;
      }
    }

    /deep/ .el-form-item__content {
      width: auto;
      padding-left: 20px;

      >.el-input {
        width: 300px;
      }
    }

    /deep/ .command-tag:not(:last-child) {
      margin-right: 16px;
    }
  }
</style>
