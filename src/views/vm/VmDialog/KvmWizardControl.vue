<template>
  <div>
    <h3>{{ configObject.title }}</h3>
    <p>{{ configObject.desc }}</p>
    <el-divider></el-divider>
    <el-form-item v-for="(param, index) in configObject.params" :label="param.label" :key="param.name">
      <component :is="param.component" v-model="args[index]" :class="{ 'wide': param.component === 'el-input' }">
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
      config: [String, Object],
      value: Object
    },
    computed: {
      configObject() {
        return typeof(this.config) === 'object' ? this.config : JSON.parse(this.config);
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
  .wide {
    width: 300px;
  }
</style>
