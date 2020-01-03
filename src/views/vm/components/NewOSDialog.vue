<template>
  <div style="display: inline-block">
    <el-button icon="el-icon-plus" @click="dialogVisible = true" type="primary">
      {{ text }}
    </el-button>

    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               append-to-body
               width="800px"
               class="transfer-dialog"
               :title="$t('os.newDialog.createOSTemplate')">
      <div class="form-container" v-if="step === 0">
        <p>
          OS template is a set of QEMU arguments to create a virtual machine.
        </p>
        <el-divider></el-divider>
        <el-form class="newOS" :model="newOS" label-position="right" label-width="100px">
          <el-form-item prop="name" :label="$t('common.nameLabel')">
            <el-input v-model="newOS.name"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('common.typeLabel')">
            <el-select v-model="newOS.type">
              <el-option v-for="item of OSTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="icon" :label="$t('os.newDialog.brandLabel')">
            <el-input v-model="newOS.icon"></el-input>
          </el-form-item>
          <el-form-item prop="detail" :label="$t('common.detailLabel')">
            <el-input v-model="newOS.detail" type="textarea"></el-input>
          </el-form-item>
          <el-form-item prop="enabled" :label="$t('common.enabledLabel')">
            <el-switch v-model="newOS.enabled"></el-switch>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-container" v-if="step === 1">
        <p>
          Specify the parameters for this OS template.
        </p>
        <el-divider></el-divider>
        <el-input
          v-model="searchStr"
          class="config-filter"
          placeholder="Please input config"
          clearable>
        </el-input>
        <el-card>
          <el-checkbox-group
            class="config-group"
            v-model="selectedConfig">
            <el-tooltip
              v-for="config in filteredCmdTemplates"
              :key="config.key"
              effect="dark"
              disabled
              :content="config.label"
              placement="top-start">
              <el-checkbox
                :disabled="config.disabled"
                :label="config.key">
                {{config.label}}
              </el-checkbox>
            </el-tooltip>
          </el-checkbox-group>
        </el-card>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button @click="step--" :disabled="step === 0">{{$t('common.back')}}</el-button>
        <el-button @click="step++" v-if="step < totalStep - 1">{{$t('common.next')}}</el-button>
        <el-button v-else
                   icon="el-icon-plus" type="primary"
                   @click="saveOS" :loading="loading">{{$t('common.create')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllOptions, saveOS } from '@/api/vm';
  import {zip, pick} from 'lodash';
  import { mapGetters } from 'vuex'

  export default {
    name: 'NewOSDialog',
    props: {
      text: String
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        cmdTemplates: [],
        searchStr: '',
        selectedConfig: [],
        step: 0,
        totalStep: 2,
        newOS: {
          name: '',
          type: null,
          icon: '',
          detail: '',
          enabled: true
        },
        OSTypes: [
          { label: 'Windows', value: 'windows' },
          { label: 'Linux', value: 'linux' },
          { label: 'MacOS', value: 'osx' },
          { label: 'Unix', value: 'unix' }
        ]
      };
    },
    computed: {
      ...mapGetters(['dirtyViews']),
      filteredCmdTemplates() {
        const searchStr = this.searchStr;
        return this.cmdTemplates.filter(config => config.label.toLowerCase().includes(searchStr.toLowerCase()));
      }
    },
    mounted() {
      this.getData();
    },
    activated() {
      if (this.dirtyViews.includes('OSList')) {
        this.getData();
      }
    },
    methods: {
      getData() {
        getAllOptions().then(res => {
          this.cmdTemplates = res.data.map(cmdTemplate => {
            const data = JSON.parse(cmdTemplate.config);
            const template = zip(data.arg, data.template).map(([arg, tpl]) => arg + (tpl ? ' ' + tpl : '')).join('\n');
            return {
              key: cmdTemplate.id,
              label: `${data.title} '${template}'`,
              disabled: !cmdTemplate.is_primary,
              ...pick(data, ['title', 'desc'])
            };
          });
        });
      },

      saveOS() {
        this.loading = true;
        saveOS({...this.newOS, templates: this.selectedConfig}).then(res => {
          this.step = 0;
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          this.$emit('created', undefined);
          this.$store.dispatch('addDirtyViews', ['VmList']);
        }).finally(() => {
          this.loading = false;
        });
      },

      filterConfigs(query, item) {
        return item.label.indexOf(query) > -1;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .transfer-dialog {

    /deep/ .el-dialog {
    }


    /deep/ .el-transfer-panel {
      width: 300px;
    }

    /deep/ .el-dialog__body {
      display: flex;
      justify-content: center;
    }

    /deep/ .el-form {
      width: 100%;
    }

    /deep/ .form-container {
      width: 100%;
      padding: 15px 25px;

      .config-filter {
        margin-bottom: 10px;
        width: 40%;
      }

      .el-card {
         box-shadow: none;
       }

      .config-group {
        /*height: 260px;*/
        overflow-y: auto;
        overflow-x: hidden;

        label {
          overflow: hidden;
          margin-bottom: 10px;

          display: block;
        }
      }
    }

    /deep/ .newOS {
      /deep/ .el-input {
        width: 300px;
      }

      /deep/ textarea {
        width: 300px;
      }
    }
  }
</style>
