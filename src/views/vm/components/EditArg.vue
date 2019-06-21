<template>
  <div>
    <el-form ref="newConfig" :model="newConfig" :rules="newConfigRules" size="small" label-width="auto" @change="handleChange">
      <el-form-item label="Title:" prop="title">
        <el-input style="width: 40%" v-model="newConfig.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Template:" prop="template">
        <el-input style="width: 40%" type="textarea" v-model.trim="newConfig.template" clearable></el-input>
      </el-form-item>
      <el-form-item label="Desc:" prop="desc">
        <el-input style="width: 40%" type="textarea" v-model="newConfig.desc" clearable></el-input>
      </el-form-item>
      <el-form-item label="Primary:" prop="isPrimary">
        <el-switch v-model="newConfig.isPrimary"></el-switch>
      </el-form-item>
    </el-form>

    <el-form :model="newConfig" inline size="small">
      <el-row class="border-row" v-for="param in newConfig.params" :key="param.key">
        <el-col :span="3">
          <el-form-item prop="name">
            <el-input v-model="param.name" placeholder="Name:" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="label">
            <el-input v-model="param.label" placeholder="Label:" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="type">
            <el-select v-model="param.type" placeholder="Type:" clearable>
              <el-option
                v-for="t in types"
                :key="t.value"
                :label="t.label"
                :value="t.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="component">
            <el-select v-model="param.component" placeholder="Component:" clearable>
              <el-option v-for="c in componentOptions"
                         :key="c.value"
                         :label="c.label"
                         :value="c.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-form-item prop="options" v-if="param.component === 'el-select'">
          <el-select placeholder="Selected Options:" clearable
                     v-model="param.options" multiple allow-create filterable default-first-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="default">
          <el-input placeholder="Default:" v-model="param.default" clearable />
        </el-form-item>
        <el-button @click="removeParam(param.key)" type="text" icon="el-icon-delete"></el-button>
        <div class="divider"></div>
      </el-row>
      <el-form-item>
        <el-button @click="addParam" type="primary" icon="el-icon-plus">Add Param</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'EditArg',
    props: {
      value: {
        type: Object,
        validator: (value) => {
          if (['title', 'arg', 'template', 'is_primary'].every(x => x in value)) {
            if ('params' in value) {
              if (Array.isArray(value.params)) {
                return value.params.every(p => {
                  return ['name', 'type', 'component'].every(o => o in p);
                })
              }
            } else {
              return true;
            }
          }
          return false;
        }
      }
    },
    data() {
      const templateValidator = (rule, value, callback) => {
        if (/-{1,2}\w{1,16} [^ ]/.test(value)){
          callback();
        } else {
          callback(new Error('Please input correct template.'));
        }
      }

      const { title, arg, template, desc, isPrimary, params } = this.value;

      return {
        newConfig: {
          title,
          arg,
          template,
          desc,
          isPrimary,
          params: params || []
        },
        newConfigRules: {
          template: [
            { validator: templateValidator, trigger: 'blur' }
          ]
        },
        newParams: {
          name: '',
          label: '',
          type: '',
          options: [],
          component: '',
          default: ''
        },
        types: [
          { label: 'String', value: 'string' },
          { label: 'Boolean', value: 'boolean' },
          { label: 'Number', value: 'number' }
        ],
        componentOptions: [
          { label: 'input', value: 'el-input' },
          { label: 'select', value: 'el-select' },
          { label: 'switch', value: 'el-switch' },
          { label: 'number', value: 'el-input-number' }
        ],
        dialogVisible: false,
        loading: false
      };
    },
    mounted() {
    },
    methods: {
      handleChange(e) {
        this.$emit('input', this.newConfig);
      },
      validate(callback) {
        return this.$refs['newConfig'].validate(callback);
      },
      addParam() {
        this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
      },
      removeParam(key) {
        const index = this.newConfig.params.indexOf(p => p.key === key);
        this.newConfig.params.splice(index, 1);
      },
    }
  }
</script>

<style scoped>

</style>
