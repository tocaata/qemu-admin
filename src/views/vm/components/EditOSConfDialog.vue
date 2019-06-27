<template>
  <div>
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               append-to-body
               width="800px"
               class="transfer-dialog"
               :title="name">
      <div class="form-container" v-if="step === 0">
        <el-form class="newOS" :model="newOS" label-position="left" label-width="100px">
          <el-form-item prop="name" label="OS Name">
            <el-input v-model="newOS.name"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="OS Type">
            <el-select v-model="newOS.type">
              <el-option v-for="item of OSTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="detail" label="OS Detail">
            <el-input v-model="newOS.detail" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-container" v-if="step === 1">
        <el-transfer
          filterable
          :filter-method="filterConfigs"
          filter-placeholder="Please input config"
          :titles="['All Templates', 'Enabled Templates']"
          v-model="selectedConfig"
          :data="data">
        </el-transfer>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogVisible = false">Cancel</el-button>
        <el-button @click="step--" :disabled="step === 0">Back</el-button>
        <el-button @click="step++" v-if="step < totalStep - 1">Next</el-button>
        <el-button v-else
                   icon="el-icon-plus" type="primary"
                   @click="saveOS" :loading="loading">Create</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllOptions, saveOS } from '@/api/vm';

  export default {
    name: 'EditOSConfDialog',
    props: {
      data: {
        type: Object,
        validator(value) {
          return 'id' in value && 'name' in value && 'type' in value;
        }
      }
    },
    data() {
      return {
        loading: false,
        dialogVisible: true,
        data: [],
        selectedConfig: [],
        step: 0,
        totalStep: 2,
        newOS: {
          name: '',
          type: null,
          detail: ''
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
          this.data = res.data.map(temp => {
            const data = JSON.parse(temp.config);
            const template = data.arg + (data.template ? ' ' + data.template : '');

            return { key: temp.id, label: template };
          });
        })
      },

      saveOS() {
        this.loading = true;
        saveOS({...this.newOS, templates: this.selectedConfig}).then(res => {
          this.loading = false;
          this.step = 0;
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          this.$emit('update', undefined);
        }).catch(_ => {
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
