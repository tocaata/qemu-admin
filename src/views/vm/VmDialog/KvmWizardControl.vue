<template>
  <div>
    <h3>{{ config.title }}</h3>
    <p>{{ config.desc }}</p>
    <el-divider></el-divider>
    <el-form-item v-for="(param, index) in config.params" :label="param.label" :key="param.name">
      <component :is="param.component" v-model.lazy="args[index]" :class="{ 'wide': param.component === 'el-input' }">
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
      config: Object,
      value: Object
    },
    computed: {
      argument() {
        let { template, params, arg } = this.config;
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
      this.args = this.config.params.map(p => p.default || '');
    },
    watch: {
      args(newValue) {
        let valueHash = {};
        for (let [index, param] of Object.entries(this.config.params)) {
          valueHash[param.name] = newValue[index];
        }
        this.$emit("input", valueHash);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wide {
    width: 300px;
  }
</style>
