<template>
  <el-dialog
      modal
      @close="reset"
      :close-on-click-modal="false"
      title="Create Machine"
      width="40%"
      :visible.sync="mutableVisible">
    <div>
      <el-form :model="newVM" class="new-vm-form" label-position="top">
        <div v-if="activeStep === 0">
          <h3 class="wizard-header">Welcome to the New Virtual Machine Wizard</h3>
          <p>Please input the name of this virtual machine name.
            <br/>Etc. Windows 10 for Gaming </p>
          <el-divider></el-divider>
          <el-form-item label="VM Name:" prop="name">
            <el-input v-model="newVM.name"
                      style="width: 300px"
                      placeholder="Please input your VM name">
            </el-input>
          </el-form-item>
        </div>

        <div v-if="activeStep === 1">
          <h3>Select a Guest Operating System</h3>
          <p>Which operating system will be installed on the virtual machine?</p>
          <el-divider></el-divider>
          <el-form-item label="OS:" prop="os">
            <el-cascader-panel :options="oss" v-model="newVM.os"></el-cascader-panel>
          </el-form-item>
        </div>

        <div v-for="(option, index) in configurableArgs" :key="option.id">
          <keep-alive>
            <kvm-wizard-control
                v-if="activeStep === index + 2"
                v-model="newVM.arguments[option.id]"
                :config="option.config">
            </kvm-wizard-control>
          </keep-alive>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="mutableVisible = false">取 消</el-button>
      <el-button @click="activeStep -= 1" v-show="activeStep > 0">上一步</el-button>
      <el-button type="primary" @click="activeStep += 1" v-if="activeStep <= configurableArgs.length">下一步</el-button>
      <el-button type="primary" @click="createVm" v-loading v-else :disabled="createDisabled">创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getPrimaryOptions, OSEnabled, createVm, OSDetail } from '@/api/vm';
  import KvmWizardControl from './KvmWizardControl';

  export default {
    name: 'VmDialog',
    components: {
      KvmWizardControl
    },
    props: {
      visible: Boolean
    },
    computed: {
      mutableVisible: {
        get() {
          return this.visible;
        },
        set(newValue) {
          this.$emit("update:visible", newValue);
        }
      }
    },
    data() {
      return {
        loading: false,
        activeStep: 0,
        newVM: {
          name: '',
          os: null,
          arguments: {}
        },
        createDisabled: true,
        configurableArgs: [],
        unconfigArgs: [],
        oss: {}
      };
    },
    watch: {
      ['newVM.os'](newValue) {
        if (newValue != null && newValue[1] != null) {
          OSDetail(newValue[1]).then(({ data }) => {
            const templates = data['vmOptionTemplates'];

            const allVmArgs = templates.map(x => {
              x.config = JSON.parse(x.config);
              return x;
            });

            [this.configurableArgs, this.unconfigArgs] = allVmArgs.reduce((total, cur) => {
              if (cur.config.params.length > 0) {
                total[0].push(cur);
              } else {
                total[1].push(cur);
              }
              return total;
            }, [[], []]);

            Object.freeze(this.configurableArgs);
            Object.freeze(this.unconfigArgs);
            this.createDisabled = false;
          });
        }
      }
    },
    mounted () {
      OSEnabled().then(res => {
        const { data } = res;
        this.oss = data.reduce((total, cur) => {
          let i = total.find((x) => x.value === cur.type);
          if (!i) {
            total.push({
              label: cur.type,
              value: cur.type,
              children: []
            });
            i = total[total.length - 1];
          }
          i.children.push({ label: cur.name, value: cur.id });
          return total;
        }, []);
      })

      return;

      getPrimaryOptions().then(res => {
        const allVmArgs = res.data.map(d => {
          d.config = JSON.parse(d.config);
          return d;
        });

        return ;

        [this.configurableArgs, this.unconfigArgs] = allVmArgs.reduce((total, cur) => {
          if (cur.config.params.length > 0) {
            total[0].push(cur);
          } else {
            total[1].push(cur);
          }
          return total;
        }, [[], []]);

        Object.freeze(this.configurableArgs);
        Object.freeze(this.unconfigArgs);
      });
    },
    methods: {
      createVm() {
        this.loading = true;
        const tmpArgs = this.unconfigArgs.reduce((total, cur) => {
          total[cur.id] = {};
          return total;
        }, {});

        createVm({
          name: this.newVM.name,
          arguments: Object.assign({}, this.newVM.arguments, tmpArgs)
        }).then(res => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: res.message
          });

          this.$emit('created', undefined);
        }).catch(() => {
          this.loading = false;
        })
      },
      reset() {
        this.newVM = {
          name: '',
          arguments: {}
        };
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .new-vm-form {
    padding-left: 20px;
    padding-right: 20px;

    /deep/ .el-form-item__content {
      width: auto;
      padding-left: 20px;
      /deep/ .el-cascader-menu:last-child{
        border-right: solid 1px #E4E7ED;
      }
    }
  }
</style>
