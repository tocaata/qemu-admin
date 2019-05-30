<template>
  <el-dialog
    modal
    center
    @close="reset"
    :close-on-click-modal="false"
    title="Create Machine"
    width="40%"
    :visible.sync="mutableVisible">
    <div>
      <el-form :model="newVM" class="inline-form" label-width="auto">
        <div v-if="activeStep === 0">
          <h3>Input VM name</h3>
          <el-form-item label="VM Name:" prop="name">
            <el-input v-model="newVM.name"
                      style="width: 300px"
                      placeholder="Please input VM name">
            </el-input>
          </el-form-item>
        </div>

        <div v-for="(option, index) in allPrimaryOptions" :key="option.id">
          <keep-alive>
            <kvm-wizard-control
              v-if="activeStep === index + 1"
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
      <el-button type="primary" @click="activeStep += 1" v-if="activeStep <= allPrimaryOptions.length">下一步</el-button>
      <el-button type="primary" @click="createVm" v-else v-loading>创建</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { getPrimaryOptions, createVm } from '@/api/vm';
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
          arguments: {}
        },
        allPrimaryOptions: [],
      };
    },
    mounted () {
      getPrimaryOptions().then(res => {
        this.allPrimaryOptions = res.data;
      });
    },
    methods: {
      createVm() {
        this.loading = true;
        createVm(this.newVM).then(res => {
          this.loading = false;
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

<style scoped>
  h3 {
    margin-bottom: 40px;
  }
</style>
