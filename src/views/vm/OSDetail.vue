<template>
  <div>
    <div class="form-container" v-if="step === 0">
      <el-form class="newOS" :model="newOS" label-position="left" label-width="100px">
        <el-form-item prop="name" label="OS Name">
          <el-input v-model="newOS.name"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="OS Type">
          <el-select v-model="newOS.type">
            <el-option v-for="item of OSTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="detail" label="OS Detail">
          <el-input v-model="newOS.detail" type="textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-container" v-if="step === 1">
      <el-transfer
        filterable
        :filter-method="filterConfigs"
        filter-placeholder="Please input config"
        :titles="['All Templates', 'Enabled Templates']"
        v-model="selectedConfig"
        :data="data">
      </el-transfer>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="onClose">Cancel</el-button>
      <el-button @click="step--" :disabled="step === 0">Back</el-button>
      <el-button @click="step++" v-if="step < totalStep - 1">Next</el-button>
      <el-button v-else
                 icon="el-icon-plus" type="primary"
                 @click="saveOS" :loading="loading">Create</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'OSDetail'
  }
</script>

<style scoped>

</style>
