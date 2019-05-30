<template>
  <div class="margin">
    <el-button icon="el-icon-plus" @click="dialogVisible = true" type="primary">Add</el-button>

    <el-table :data="options" border style="margin-top: 30px" @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item label="name:">
              <span>{{ scope.row.name }}</span>
            </el-form-item>
            <el-form-item label="Template:">
              <el-tag type="info" style="font-size: 1em;">{{ getCmd(scope.row.config) }}</el-tag>
            </el-form-item>
            <el-form-item label="config:">
              <el-card shadow="never">
                <pre class="prettyprint code">
                  {{ JSON.stringify(JSON.parse(scope.row.config), null, 2) }}
                </pre>
              </el-card>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
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
          <delete-link @click="deleteArg(scope.row.id)"></delete-link>
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
               width="60%" title="Add new argument template">
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
        <el-row class="border-row" v-for="param in newConfig.params" :key="param.key">
          <el-form-item prop="name">
            <el-input v-model="param.name" placeholder="Name:"></el-input>
          </el-form-item>
          <el-form-item prop="label">
            <el-input v-model="param.label" placeholder="Label:"></el-input>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="param.type" placeholder="Type:">
              <el-option
                v-for="t in types"
                :key="t.value"
                :label="t.label"
                :value="t.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="component">
            <el-select v-model="param.component" placeholder="Component:">
              <el-option v-for="c in componentOptions"
                         :key="c.value"
                         :label="c.label"
                         :value="c.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="options" v-if="param.component === 'el-select'">
            <el-select placeholder="Selected Options:" v-model="param.options" multiple allow-create filterable default-first-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="default">
            <el-input placeholder="Default:" v-model="param.default" />
          </el-form-item>
          <el-button @click="removeParam(param.key)" type="text" icon="el-icon-delete"></el-button>
          <div class="divider"></div>
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
  import DeleteLink from '@/components/DeleteLink'

  export default {
    name: 'KvmArg',
    components: { DeleteLink },
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

        options: [],
        pageIndex: 1,
        pageSize: 10,
        total: 0
      };
    },
    mounted() {
      this.newConfig.params.push(Object.assign({}, this.newParams, { key: Date.now() }));
      this.search()
    },
    filters: {
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
        return listOption({ pageIndex, pageSize }).then(res => {
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
      handleExpandChange(e, b) {
        this.$nextTick(() => {
          PR.prettyPrint();
        });
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

  .code {
    line-height: 1.2rem;
    border: 0;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  pre.code :first-child, pre.code :last-child {
    display: none;
  }

  .divider {
    height: 1px;
    width: 100%;
    background: #DCDFE6;
    /*border-bottom: 1px solid #DCDFE6;*/
    position: relative;
    top: -10px;
  }
</style>

<style>
  .divider:not(:last-child) {
    height: 1px;
    width: 100%;
    background: #DCDFE6;
    /*border-bottom: 1px solid #DCDFE6;*/
    position: relative;
    top: -10px;
  }
</style>
