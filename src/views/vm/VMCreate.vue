<template>
  <div>
    <el-form :model="newVM" ref="newVM" :rules="newVMRules">
      <el-form-item>
        <el-input v-model="newVM.name">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'VMCreate',
    data() {
      return {
        newVM: {
          name: '',
        },
        newVMRules: {
        }
      };
    }
  }
</script>

<style scoped>

</style>
