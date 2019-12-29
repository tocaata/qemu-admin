<template>
  <div>
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="800px"
               class="transfer-dialog"
               @closed="handleClose"
               :title="data.name">
      <div class="form-container" v-if="step === 0">
        <el-form class="newOS" :model="newOS" label-position="left" label-width="100px">
          <el-form-item prop="name" :label="$t('common.nameLabel')">
            <el-input v-model="newOS.name"></el-input>
          </el-form-item>
          <el-form-item prop="type" :label="$t('common.typeLabel')">
            <el-select v-model="newOS.type">
              <el-option v-for="item of OSTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
        <el-transfer
          filterable
          :filter-method="filterConfigs"
          filter-placeholder="Please input config"
          :titles="[$t('os.newDialog.allTemplates'), $t('os.newDialog.enabledTemplates')]"
          v-model="selectedConfig"
          :data="allConfig">
        </el-transfer>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="onClose">{{$t('common.cancel')}}</el-button>
        <el-button @click="step--" :disabled="step === 0">{{$t('common.back')}}</el-button>
        <el-button @click="step++" v-if="step < totalStep - 1">{{$t('common.next')}}</el-button>
        <el-button v-else
                   icon="el-icon-check" type="primary"
                   @click="updateOS" :loading="loading">{{$t('common.save')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllOptions, updateOS, OSDetail } from '@/api/vm';

  export default {
    name: 'EditOSConfDialog',
    props: {
      data: {
        type: Object,
        validator(value) {
          return 'id' in value && 'name' in value && 'type' in value;
        }
      },
      onClose: {
        type: Function
      },
      onUpdate: {
        type: Function
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: true,
        selectedConfig: [],
        allConfig: [],
        step: 0,
        totalStep: 2,
        newOS: {
          name: '',
          type: null,
          detail: '',
          enabled: false
        },
        OSTypes: [
          { label: 'Windows', value: 'windows' },
          { label: 'Linux', value: 'linux' },
          { label: 'MacOS', value: 'osx' },
          { label: 'Unix', value: 'unix' }
        ]
      };
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        getAllOptions().then(res => {
          this.allConfig = res.data.map(temp => {
            const data = JSON.parse(temp.config);
            const template = data.arg + (data.template ? ' ' + data.template : '');

            return { key: temp.id, label: template };
          });
        });

        OSDetail(this.data.id).then(res => {
          const data = res.data;

          const { name, type, detail, enabled } = res.data;
          this.newOS = { name, type, detail, enabled: enabled === 1 };
          this.selectedConfig = data.vmOptionTemplates.map(temp => temp.id);
        })
      },

      updateOS() {
        this.loading = true;
        updateOS({...this.newOS, id: this.data.id, templates: this.selectedConfig}).then(res => {
          this.loading = false;
          this.step = 0;
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          if (this.onUpdate) {
            this.onUpdate();
          }
        }).catch(_ => {
          this.loading = false;
        });
      },

      filterConfigs(query, item) {
        return item.label.indexOf(query) > -1;
      },

      handleClose() {
        this.onClose();
      }
    }
  }
</script>

<style lang="scss" scoped>
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
