<template>
  <div>
    <el-form ref="newConfig" :model="newConfig" :rules="newConfigRules" size="small" label-width="auto">
      <el-form-item label="Title:" prop="title">
        <span v-if="isShow">{{ newConfig.title }}</span>
        <el-input v-else style="width: 40%" v-model="newConfig.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="Template:" prop="argTemplate">
        <span class="el-tag" v-if="isShow">{{ newConfig.argTemplate }}</span>
        <el-input v-else style="width: 40%" type="textarea" :rows="1" v-model="newConfig.argTemplate"></el-input>
      </el-form-item>
      <el-form-item label="Description:" prop="desc">
        <span v-if="isShow">{{ newConfig.desc }}</span>
        <el-input v-else style="width: 40%" type="textarea" :rows="1" v-model.trim="newConfig.desc"></el-input>
      </el-form-item>
      <el-form-item label="Primary:" prop="isPrimary">
        <span v-if="isShow">{{ newConfig.isPrimary }}</span>
        <el-switch v-else v-model="newConfig.isPrimary"></el-switch>
      </el-form-item>
      <el-form-item label="Template Parameters:">
      </el-form-item>
    </el-form>

    <el-table :data="newConfig.params" style="width: 80%">
      <el-table-column label="Name" prop="name" width="120">
        <template slot-scope="scope">
          <span v-if="isShow">{{ scope.row.name }}</span>
          <el-input v-if="!isShow" v-model="scope.row.name" placeholder="Name:" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Label" prop="label" width="200">
        <template slot-scope="scope">
          <span v-if="isShow">{{ scope.row.label }}</span>
          <el-input v-else v-model="scope.row.label" placeholder="Label:" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Type" prop="type" width="160">
        <template slot-scope="scope">
          <span v-if="isShow">{{ scope.row.type }}</span>
          <el-select v-else v-model="scope.row.type" placeholder="Type:" size="small" clearable>
            <el-option
              v-for="t in types"
              :key="t.value"
              :label="t.label"
              :value="t.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Component" prop="component" width="160">
        <template slot-scope="scope">
          <span v-if="isShow">{{ scope.row.component }}</span>
          <el-select v-else v-model="scope.row.component" placeholder="Component:" size="small" clearable>
            <el-option v-for="c in componentOptions"
                       :key="c.value"
                       :label="c.label"
                       :value="c.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Options" prop="options">
        <template slot-scope="scope">
          <!--<el-tag v-if="isShow" v-for="option in scope.row.options" :key="option" size="small">{{ option }}</el-tag>-->
          <span v-if="isShow">{{ scope.row.options.join(',') }}</span>
          <el-select v-else-if="scope.row.component === 'el-select'" size="small"
                     placeholder="Selected Options:" clearable style="width: 100%"
                     v-model="scope.row.options" multiple allow-create filterable default-first-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Default" prop="default">
        <template slot-scope="scope">
          <span v-if="isShow">{{ scope.row.default }}</span>
          <el-input v-else v-model="scope.row.default" placeholder="Default:" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" width="100">
        <template slot-scope="scope" v-if="!isShow">
          <el-button @click="removeParam(scope.row)" type="text" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer">
      <el-button icon="el-icon-edit-outline" type="primary" v-if="isShow" @click="isShow = false">Edit</el-button>
      <div v-else>
        <el-button icon="el-icon-check" type="primary" @click="editArg">Save</el-button>
        <el-button icon="el-icon-plus" @click="addParam">Add Param</el-button>
        <el-button icon="el-icon-close" @click="handleCancel">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { editArg } from '../../../api/vm';

  export default {
    name: 'EditArg',
    props: {
      data: {
        type: Object,
        validator: (value) => {
          if (['title', 'arg', 'template', 'isPrimary'].every(x => x in value)) {
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
      },
      argId: {
        type: Number,
        required: true
      }
    },
    data() {
      const templateValidator = (rule, value, callback) => {
        if (/-{1,2}\w{1,16}( [^ ]+)?$/.test(value)){
          callback();
        } else {
          callback(new Error('Please input correct template.'));
        }
      };

      const { title, arg, template, desc, isPrimary, params } = this.data;

      return {
        newConfig: {
          title,
          arg,
          template,
          argTemplate: arg + (template ? (' ' + template) : ''),
          desc,
          isPrimary,
          params: params || []
        },
        newConfigRules: {
          argTemplate: [
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
        loading: false,
        isShow: true
      };
    },
    filters: {
      getCmd(config) {
        const object = JSON.parse(config);
        return `${object.arg} ${object.template}`;
      }
    },
    watch: {
      ['newConfig.argTemplate'](newValue) {
        [this.newConfig.arg, this.newConfig.template] = newValue.split(' ');
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
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
      editArg() {
        this.$refs.newConfig.validate((valid) => {
          if (valid) {
            editArg({ id: this.argId, ...this.newConfig}).then(res => {
              this.isShow = true;
              this.$message({ type: 'success', message: res.message });
              this.$emit('change', null);
            }).catch(err => {
            })
          }
        })
      },
      handleCancel() {
        this.isShow = true;
        this.$refs.newConfig.resetFields();
      }
    }
  }
</script>

<style scoped>
  .footer {
    margin: 30px 0;
  }

</style>
