<template>
  <div class="margin">
    <el-button icon="el-icon-plus" @click="dialogVisible = true" type="primary">Add</el-button>

    <el-table :data="options" border style="margin-top: 30px">
      <el-table-column prop="arg" label="Arg" width="200">
      </el-table-column>
      <el-table-column prop="name" label="Name" width="200">
      </el-table-column>
      <el-table-column prop="is_primary" label="Primary"
                       width="200"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.is_primary === 1">Primary</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="config" label="Config"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="Action" width="200" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click">
            <p><strong>Template: </strong><el-tag type="info" style="font-size: 1em;">{{ getCmd(scope.row.config) }}</el-tag></p>
            {{ scope.row.config }}
            <el-link type="primary" icon="el-icon-view" slot="reference">Detail</el-link>
          </el-popover>
          <el-link type="primary"
                   style="margin-left: 15px"
                   @click="deleteArg(scope.row.id)"
                   icon="el-icon-delete">
            Delete
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="pageIndex"
      :page-size="pageSize"
      :total="total"
      class="pagination-container"
      :page-sizes="[10,20,50]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="75%" title="Add new argument template">
      <el-form :model="newConfig" size="small" label-width="auto">
        <el-form-item label="Title:" prop="title">
          <el-input style="width: 35%" v-model="newConfig.title"></el-input>
        </el-form-item>
        <el-row>
          <el-form-item label="Argument:" prop="arg">
            <el-input style="width: 35%" v-model="newConfig.arg">
              <template slot="prepend">-</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="Template:" prop="template">
          <el-input style="width: 35%" type="textarea" v-model="newConfig.template"></el-input>
        </el-form-item>
        <el-form-item label="Desc:" prop="desc">
          <el-input style="width: 35%" type="textarea" v-model="newConfig.desc"></el-input>
        </el-form-item>
        <el-form-item label="Primary:" prop="isPrimary">
          <el-switch v-model="newConfig.isPrimary"></el-switch>
        </el-form-item>
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
        <el-button type="primary" @click="saveConfig" :loading="loading">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { saveVmOption, listOption, deleteArg } from '../../api/vm'

  export default {
    name: 'KvmArg',
    data() {
      return {
        dialogVisible: false,
        loading: false,
        newConfig: {
          title: 'smp',
          arg: 'smp',
          template: '$1,threads=$2',
          desc: '',
          isPrimary: false,
          params: [
            {"name":"$1","label":"cpu count","type":"number","options":[],"component":"el-input-number","key":1558962702577},
            {"name":"$2","label":"thread count per core","type":"number","options":[],"component":"el-input-number", "key":1558962702578}
          ]
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
        ],

        options: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
      };
    },
    mounted() {
      this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
      this.search();
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
        saveVmOption(this.newConfig).then(res => {
          this.loading = false;
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: res.message
          });

          this.search();
        }).catch(() => {
          this.loading = false;
        })
      },

      search() {
        this.loading = true;
        const { pageIndex, pageSize } = this;
        listOption({ pageIndex, pageSize }).then(res => {
          this.options = res.data.list;
          this.total = res.data.totalSize;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },

      deleteArg(id) {
        this.loading = true;

        deleteArg(id).then(res => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: res.message
          });
          this.search();
        });
        this.loading = false;
      },

      handleCurrentChange(value) {
        this.pageIndex = value;
        this.search();
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.search();
      },
      getCmd(config) {
        const object = JSON.parse(config);
        return `-${object.arg} ${object.template}`;
      }
    }
  }
</script>

<style scoped>
  .margin {
    margin: 30px;
  }
</style>
