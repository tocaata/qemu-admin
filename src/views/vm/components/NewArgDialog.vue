<template>
  <div>
    <el-button icon="el-icon-plus" @click="dialogVisible = true" type="primary">Add</el-button>
    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="50%" title="Add new argument template">
      <el-form :model="newConfig" :rules="newConfigRules" size="small" label-width="auto">
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

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-check" type="primary" @click="saveConfig" :loading="loading">Save</el-button>
        <el-button icon="el-icon-close" @click="dialogVisible = false">Cancel</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { saveVmOption } from '../../../api/vm';

  export default {
    name: 'NewArgDialog',
    components: {
    },
    props: {
      onCreate: { type: Function }
    },
    data() {
      const templateValidator = (rule, value, callback) => {
        if (/-{1,2}\w{1,16} [^ ]/.test(value)){
          callback();
        } else {
          callback(new Error('Please input correct template.'));
        }
      }

      return {
        newConfig: {
          title: 'smp',
          arg: '',
          template: '-smp $1,threads=$2',
          desc: '',
          isPrimary: false,
          params: [
            {"name":"$1","label":"cpu count","type":"number","options":[],"component":"el-input-number","key":1558962702577},
            {"name":"$2","label":"thread count per core","type":"number","options":[],"component":"el-input-number", "key":1558962702578}
          ]
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
      this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
    },
    methods: {
      addParam() {
        this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
      },
      removeParam(key) {
        const index = this.newConfig.params.indexOf(p => p.key === key);
        this.newConfig.params.splice(index, 1);
      },
      saveConfig() {
        this.loading = true;
        const template = this.newConfig.template;
        const edit = {
          arg: template.slice(0, template.indexOf(' ')),
          template: template.slice(template.indexOf(' '), template.length)
        };
        const data = Object.assign({}, this.newConfig, edit)

        saveVmOption(data).then(res => {
          this.loading = false;
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          if (this.onCreate) {
            this.onCreate();
          }
        }).catch(() => {
          this.loading = false;
        })
      }
    }
  }
</script>

<style scoped>

</style>
