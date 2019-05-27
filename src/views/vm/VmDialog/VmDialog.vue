<template>
  <el-dialog
    modal
    center
    title="Create Machine"
    width="40%"
    :visible.sync="visible">
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
        <div v-if="activeStep === 1">
          <h3>Select OS type</h3>
          <el-form-item label="OS:" prop="os">
            <el-input v-model="newVM.os"
                      style="width: 300px"
                      placeholder="Please OS name">
            </el-input>
          </el-form-item>
        </div>
        <div v-if="activeStep === 2">
          <h3>CPU Config</h3>
          <el-form-item label="CPU Core Count:" prop="smp">
            <el-input-number
              :min="1"
              v-model="newVM.smp">
            </el-input-number>
          </el-form-item>
          <el-form-item label="CPU Parameter:" prop="cpu">
            <el-input v-model="newVM.cpu">
            </el-input>
          </el-form-item>
        </div>
        <div v-if="activeStep === 3">
          <h3>Memory Config</h3>
          <el-form-item
            label="Memory capacity">
            <el-select v-model="mem">
              <el-option>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="activeStep === 4">
          <el-input placeholder="please input your name" label="name"></el-input>
        </div>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button @click="activeStep -= 1" v-show="activeStep > 0">上一步</el-button>
      <el-button type="primary" @click="activeStep += 1" v-show="activeStep < 5">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    name: 'VmDialog',
    data() {
      return {
        // dialogVisible: this.visible,
        activeStep: 0,
        newVM: {
          name: '',
          os: '',
          smp: 1,
          cpu: '',
          mem: '128M'
        }
      };
    },
    props: {
      visible: Boolean
    },
    watch: {
      visible(newValue) {
        this.$emit("trigger", newValue);
      }
    }
  }
</script>

<style scoped>
  h3 {
    margin-bottom: 40px;
  }
</style>
