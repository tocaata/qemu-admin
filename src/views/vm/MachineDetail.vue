<template>
  <div class="container">
    <el-page-header @back="goBack" content="Machine Detail">
    </el-page-header>

    <el-tabs tab-position="left" style="height: 200px; margin-top: 20px" v-loading="loading">
      <el-tab-pane label="用户管理">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { vmShow } from '../../api/vm';

  export default {
    name: 'MachineDetail',
    data() {
      return {
        loading: false,
      };
    },
    mounted() {
    },
    methods: {
      goBack() {
        this.$router.push('/vm/list');
      },
      getData() {
        this.loading = true;
        vmShow(this.$router.query.machineId).then(res => {
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      }
    }
  }
</script>

<style scoped>

</style>
