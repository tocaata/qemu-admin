<template>
  <el-form label-position="top" :model="value" ref="configForm">
    <el-form-item v-for="param in params" :key="param.key" :label="param.label" :prop="param.name">
      <component :is="param.component" v-model="value[param.name]">
        <template v-if="param.component === 'el-select'">
          <el-option v-for="option in param.options" :key="option" :label="option" :value="option">
          </el-option>
        </template>
      </component>
    </el-form-item>
    <el-button type="primary" size="small" @click="handleSave">{{$t('common.save')}}</el-button>
    <el-button type="second" size="small" @click="handleCancel">{{$t('common.cancel')}}</el-button>
  </el-form>
</template>

<script>
    export default {
      name: "MachineConfigForm",
      props: {
        value: {
          type: Object
        },
        params: {
          type: Array
        },
        onCancel: {
          type: Function
        }
      },
      data() {
        return {};
      },
      methods: {
        handleSave() {
          this.$emit('input', this.value);
        },

        handleCancel() {
          this.$refs.configForm.resetFields();
          this.onCancel(this.value);
        }
      }
    }
</script>

<style scoped>

</style>
