<template>
  <div class="container">
    <el-page-header @back="goBack" content="Machine Detail">
    </el-page-header>

    <div class="container">
      <el-card shadow="never" style="width: 50%">
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
  import { vmShow, editVm } from '../../api/vm';

  export default {
    name: 'MachineDetail',
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
          console.log(data);
          this.configs = data['vmOptionTemplates'].map(x => {
            x.config = JSON.parse(x.config);
            return x;
          });

          this.newVM.arguments = this.configs.reduce((total, cur) => {
            total[cur.id] = { value: JSON.parse(cur.values.value), configId: cur.values.id };
            return total;
          }, {});

          this.loading = false;
        }).catch(() => {
          this.loading = false;
        });
      },
      getCmd(config) {
        const kvs = JSON.parse(config['values']['value']);
        // const optTemp = JSON.parse(config['vmOptionTemplate']['config']);
        let { template, arg } = config['config'];

        for (let [k, v] of Object.entries(kvs)) {
          template = template.replace(k, v);
        }

        return arg + (template ? ' ' + template : '');
      },
      editVM() {
        editVm({ id: this.machineId, ...this.newVM }).then(res => {
        }).catch(err => {
        });
      },
      deleteArg(key) {
        // console.log(key);
        this.$delete(this.newVM.arguments, key);
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
