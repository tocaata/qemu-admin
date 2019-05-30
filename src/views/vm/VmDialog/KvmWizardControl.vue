<template>
  <div>
    <p style="margin-bottom: 20px">{{ configObject.desc }}</p>
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
    props: {
      config: String,
      value: Object
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
    data() {
      return {
        args: []
      };
    },
    mounted() {
      this.args = this.configObject.params.map(p => p.default || '');
    },
    watch: {
      args(newValue) {
        let valueHash = {};
        for (let [index, param] of Object.entries(this.configObject.params)) {
          valueHash[param.name] = newValue[index];
        }
        this.$emit("input", valueHash);
      }
    }
  }
</script>

<style scoped>

</style>
