<template>
  <div>
    <el-form ref="newConfig" :model="newConfig" :rules="newConfigRules" size="small" label-width="auto">
      <el-form-item :label="$t('editCmdOption.title')" prop="title">
        <span v-if="isShow">{{ newConfig.title }}</span>
        <el-input v-else style="width: 40%" v-model="newConfig.title" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('editCmdOption.template')" prop="argTemplate">
        <template v-if="isShow">
          <template v-for="template in newConfig.argTemplate.split('\n')">
            <span class="el-tag">{{ template }}</span>
            <br/>
          </template>
        </template>
        <el-input v-else style="width: 40%" type="textarea" :rows="2" v-model="newConfig.argTemplate"></el-input>
      </el-form-item>
      <el-form-item :label="$t('editCmdOption.description')" prop="desc">
        <span v-if="isShow">{{ newConfig.desc }}</span>
        <el-input v-else style="width: 40%" type="textarea" :rows="1" v-model="newConfig.desc"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.typeLabel')" prop="type">
        <span v-if="isShow">{{ newConfig.type }}</span>
        <el-input v-else style="width: 40%" type="textarea" :rows="1" v-model="newConfig.type"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.enabledLabel')" prop="isPrimary">
        <span v-if="isShow">{{ newConfig.isPrimary }}</span>
        <el-switch v-else v-model="newConfig.isPrimary"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('editCmdOption.templateVariable')">
      </el-form-item>
    </el-form>

    <el-table :data="newConfig.params" style="width: 80%">
      <el-table-column :label="$t('common.name')" prop="name" width="120">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.name }}</span>
          <el-input v-if="!isShow" v-model="row.name" :placeholder="$t('common.nameLabel')" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.label')" prop="label" width="200">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.label }}</span>
          <el-input v-else v-model="row.label" :placeholder="$t('common.labelLabel')" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.type')" prop="type" width="160">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.type }}</span>
          <el-select v-else v-model="row.type" :placeholder="$t('common.typeLabel')" size="small" clearable>
            <el-option
              v-for="t in types"
              :key="t.value"
              :label="t.label"
              :value="t.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commandOption.component')" prop="component" width="160">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.component }}</span>
          <el-select v-else v-model="row.component" :placeholder="$t('commandOption.placeholder.componentType')" size="small" clearable>
            <el-option v-for="c in componentOptions"
                       :key="c.value"
                       :label="c.label"
                       :value="c.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('commandOption.options')" prop="options">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.options.join(',') }}</span>
          <el-select v-else-if="row.component === 'el-select'" size="small"
                     :placeholder="$t('commandOption.placeholder.options')" clearable style="width: 100%"
                     v-model="row.options" multiple allow-create filterable default-first-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.default')" prop="default">
        <template slot-scope="{ row }">
          <span v-if="isShow">{{ row.default }}</span>
          <el-input v-else v-model="row.default" :placeholder="$t('common.defaultLabel')" size="small" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.action')" align="center" width="100">
        <template slot-scope="{ row }" v-if="!isShow">
          <el-button @click="removeParam(row)" type="text" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="footer">
      <el-button icon="el-icon-edit-outline" type="primary" v-if="isShow" @click="isShow = false">{{$t('common.edit')}}</el-button>
      <div v-else>
        <el-button icon="el-icon-check" type="primary" @click="editArg">{{$t('common.save')}}</el-button>
        <el-button icon="el-icon-plus" @click="addParam">{{$t('editCmdOption.addVariable')}}</el-button>
        <el-button icon="el-icon-close" @click="handleCancel">{{$t('common.cancel')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { editArg } from '../../../api/vm';

  export default {
    name: 'EditCmdOption',
    props: {
      data: {
        type: Object,
        validator: (value) => {
          if (['title', 'arg', 'type', 'isPrimary'].every(x => x in value)) {
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
      const { title, arg = [], template = [], desc, type, isPrimary, params } = this.data;
      const argTemplate = [];

      for (let i = 0; i < arg.length; i++) {
        argTemplate.push(arg[i] + (template[i] ? (' ' + template[i]) : ''));
      }

      return {
        newConfig: {
          title,
          arg,
          template,
          argTemplate: argTemplate.join('\n'),
          desc,
          type,
          isPrimary,
          params: params || []
        },
        newConfigRules: {
          argTemplate: [
            { require: true, pattern: /(-{1,2}\w{1,16}(\s[^\s]+)?\n?)+$/,
              trigger: 'blur', message: 'Please input correct template.' }
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
        this.newConfig.arg = [];
        this.newConfig.template = [];
        newValue.split('\n').map(item => item.split(' ')).forEach(([arg, tpl]) => {
          this.newConfig.arg.push(arg);
          this.newConfig.template.push(tpl);
        });
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
      // validate(callback) {
      //   return this.$refs['newConfig'].validate(callback);
      // },
      addParam() {
        this.newConfig.params.push({ ...this.newParams, key: Date.now() });
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
              this.$store.dispatch('addDirtyViews', ['OSList']);
            }).catch(err => {
            });
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

<style lang="scss" scoped>
  .footer {
    margin: 30px 0;
  }

  .el-tag:not(:last-child) {
    margin: 0 8px 8px;
  }

</style>
