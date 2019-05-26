<template>
  <div class="vm-create">

  </div>
</template>

<script>
  export default {
    name: 'VMCreate',
    data() {
      return {
        activeStep: 0,
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
  .vm-create,.margin {
    margin: 30px;
  }

  .inline-form {
    display: inline-block;
  }

  .inline-form .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
  }

  .inline-form label {
    float: none;
    display: inline-block;
  }
</style>
