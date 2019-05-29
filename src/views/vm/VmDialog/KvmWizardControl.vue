<template>
  <div>
    <h4>{{ configObject.desc }}</h4>
    <el-form-item v-for="(param, index) in configObject.params" :label="param.label" :key="param.name">
      <component :is="param.component" v-model="args[index]">
        <template v-if="param.component === 'el-select'">
          <el-option v-for="v in param.options" :key="v" :label="v" :value="v">
          </el-option>
        </template>
      </component>
    </el-form-item>
  </div>
</template>

<script>
  export default {
    name: 'KvmWizardControl',
    data() {
      return {
        args: []
      };
    },
    props: {
      config: String,
      value: Array
    },
    computed: {
      configObject() {
        return JSON.parse(this.config);
      },
      argument() {
        let { template, params, arg } = this.configObject;
        for (let [index, param] of Object.entries(params)) {
          template = template.replace(param.name, this.args[index])
        }
        return [arg, template];
      }
    },
    watch: {
      argument(newValue) {
        this.$emit("input", newValue);
        // console.log(newValue);
      }
    }
  }
</script>

<style scoped>

</style>
