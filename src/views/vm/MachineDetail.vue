<template>
  <div class="container">
    <el-page-header @back="goBack" content="Machine Detail">
    </el-page-header>

    <div class="container">
      <el-table :data="configs">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-form>
              <el-form-item></el-form-item>
              <el-button type="primary" size="small">Save</el-button>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="arg" label="Option">
        </el-table-column>
        <el-table-column prop="cmd" label="Value">
        </el-table-column>
        <el-table-column label="Action" align="center">
          <template slot-scope="{ row }">
            <delete-link class="middle-icon" @click="deleteArg(row.values.id)"></delete-link>
          </template>
        </el-table-column>
      </el-table>
      <el-card v-if="false" shadow="never" style="width: 50%">
        <el-collapse v-model="activeName" accordion v-loading="loading">
          <el-collapse-item v-for="c in configsFiltered" :title="getCmd(c)" :key="c.id" :name="c.id">
            <el-form label-position="top">
              <el-form-item v-for="param in c.config.params"
                            :key="param.key"
                            :label="param.label">
                <component :is="param.component" v-model="newVM.arguments[c.id].value[param.name]"></component>
              </el-form-item>
            </el-form>
            <el-button @click="deleteArg(c.id)" type="danger" size="small">Delete</el-button>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <div style="padding-top: 30px">
        <el-button type="primary" @click="editVM">Save</el-button>
        <el-button>Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { vmShow, editVm, deleteConfig } from '../../api/vm';
  import DeleteLink from '@/components/DeleteLink';

  export default {
    name: 'MachineDetail',
    components: {
      DeleteLink
    },
    data() {
      return {
        loading: false,
        machineId: this.$route.query['machineId'],
        activeName: 1,
        configs: [],
        newVM: {
          name: '',
          os: null,
          arguments: {}
        }
      };
    },
    computed: {
      configsFiltered() {
        const keys = Object.keys(this.newVM.arguments);
        return this.configs.filter(x => keys.includes(x.id.toString()));
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      goBack() {
        this.$router.push('/vm/list');
      },
      getData() {
        this.loading = true;
        vmShow(this.machineId).then(({ data }) => {
          // console.log(data);
          this.configs = data['vmOptionTemplates'].map(x => {
            x.config = JSON.parse(x.config);
            x.values.value = JSON.parse(x.values.value);
            x.cmd = this.getCmd(x);
            return x;
          });

          console.log('bbb');

          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      getCmd(config) {
        try {
          const kvs = config['values']['value'];
          // const optTemp = JSON.parse(config['vmOptionTemplate']['config']);
          let { template, arg } = config['config'];

          for (let [k, v] of Object.entries(kvs)) {
            template = template.replace(k, v);
          }

          return arg + (template ? ' ' + template : '');
        } catch (e) {
          console.error(e);
        }
      },
      editVM() {
        editVm({ id: this.machineId, ...this.newVM }).then(res => {
        }).catch(err => {
        });
      },
      deleteArg(configId) {
        this.loading = true;
        deleteConfig(this.machineId, configId).then(({ message, data }) => {
          this.loading = false;
          this.$message({
            type: 'success',
            message: message
          });
          this.getData();
        }).catch(err => {
          this.loading = false;
        })
        // this.$delete(this.newVM.arguments, key);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    /deep/ .el-form-item__content {
      width: auto;
      padding-left: 20px;

      input.el-input {
        width: 300px;
      }
    }
  }
</style>
