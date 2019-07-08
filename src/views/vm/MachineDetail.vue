<template>
  <div class="container">
    <el-page-header @back="goBack" content="Machine Detail">
    </el-page-header>

    <div class="container">
      <el-collapse v-model="activeName" accordion v-loading="loading">
        <el-collapse-item v-for="c in configs" :title="getCmd(c)" :key="c.id" :name="c.id">
          <el-form label-position="top">
            <el-form-item v-for="param in c.config.params"
                          :key="param.key"
                          :label="param.label">
              <component :is="param.component" v-model="newVM.arguments[c.id][param.name]"></component>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>

      <div style="padding-top: 30px">
        <el-button type="primary">Save</el-button>
        <el-button>Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { vmShow } from '../../api/vm';

  export default {
    name: 'MachineDetail',
    data() {
      return {
        loading: false,
        activeName: 1,
        configs: [],
        newVM: {
          name: '',
          os: null,
          arguments: {}
        }
      };
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
        vmShow(this.$route.query['machineId']).then(({ data }) => {
          console.log(data);
          this.configs = data['vmOptionTemplates'].map(x => {
            x.config = JSON.parse(x.config);
            return x;
          });

          this.newVM.arguments = this.configs.reduce((total, cur) => {
            total[cur.id] = JSON.parse(cur.values.value);
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
      }
    }
  }
</script>

<style scoped>

</style>
