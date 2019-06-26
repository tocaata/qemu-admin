<template>
  <div style="display: inline-block">
    <el-button icon="el-icon-plus" @click="dialogVisible = true" type="primary">
      Create
    </el-button>

    <el-dialog :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="60%" title="New OS Template">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="Please input config"
        v-model="selectConfig"
        :data="data">
      </el-transfer>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'NewOSConfDialog',
    data() {
      return {
        dialogVisible: false,
        data: [],
        selectConfig: []
      };
    }
  }
</script>

<style scoped>

</style>
