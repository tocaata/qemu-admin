<template>
  <div class="margin">
    <el-button icon="el-icon-plus" @click="dialogVisible = true">Add</el-button>

    <el-dialog :visible.sync="dialogVisible" width="75%" title="Add new argument template">
      <el-form :model="newConfig" size="small" label-width="auto">
        <el-form-item label="Title" prop="title">
          <el-input style="width: 35%" v-model="newConfig.title"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="Argument" prop="arg">
            <el-input style="width: 35%" v-model="newConfig.arg"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Template" prop="template">
            <el-input style="width: 35%" type="textarea" v-model="newConfig.template"></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <el-form :model="newConfig" inline size="small">
        <el-row v-for="param in newConfig.params" :key="param.key">
          <el-form-item label="Name" prop="name">
            <el-input v-model="param.name"></el-input>
          </el-form-item>
          <el-form-item label="Label" style="margin-left: auto" prop="label">
            <el-input v-model="param.label"></el-input>
          </el-form-item>
          <el-form-item label="Type" prop="type">
            <el-select v-model="param.type">
              <el-option
                v-for="t in types"
                :key="t.value"
                :label="t.label"
                :value="t.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Component" prop="component">
            <el-select v-model="param.component">
              <el-option v-for="c in componentOptions"
                         :key="c.value"
                         :label="c.label"
                         :value="c.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Options" prop="options" v-if="param.component === 'el-select'">
            <el-select v-model="param.options" multiple allow-create filterable default-first-option>
            </el-select>
          </el-form-item>
          <el-button @click="removeParam(param.key)" type="info" icon="el-icon-minus" size="small" circle></el-button>
        </el-row>
        <el-form-item>
          <el-button @click="addParam" type="primary" icon="el-icon-plus">Add Param</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveConfig">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'VmConfig',
    data() {
      return {
        dialogVisible: false,
        newConfig: {
          title: '',
          arg: '',
          template: '',
          params: []
        },
        newParams: {
          name: '',
          label: '',
          type: '',
          options: [],
          component: ''
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
        ]
      };
    },
    mounted() {
      this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
    },
    methods: {
      addParam() {
        this.newConfig.params.push(Object.assign({}, this.newParams));
      },
      removeParam(key) {
        const index = this.newConfig.params.indexOf(p => p.key === key);
        this.newConfig.params.splice(index, 1);
      },
      saveConfig() {
        1
      }
    }
  }
</script>

<style scoped>
  .margin {
    margin: 30px;
  }
</style>
