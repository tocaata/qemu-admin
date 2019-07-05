<template>
  <div class="container">
    <el-page-header @back="goBack" content="Machine Detail">
    </el-page-header>

    <div class="container">
      <el-collapse v-model="activeName" accordion v-loading="loading">
        <el-collapse-item v-for="c in configs" :title="getCmd(c)" :key="c.id" :name="c.id">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
      </el-collapse>
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
        configs: []
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
          this.configs = data.configs;

          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      },
      getCmd(config) {
        const kvs = JSON.parse(config['value']);
        const optTemp = JSON.parse(config['vmOptionTemplate']['config']);
        let { template, arg } = optTemp;

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
