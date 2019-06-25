<template>
  <div class="container">
    <el-form ref="searchOS" :model="searchOS" :rules="searchOSRules" @submit.native.prevent="search" inline>
      <el-form-item prop="searchStr" label="">
        <el-input
          clearable
          placeholder="Searching String"
          v-model="searchOS.searchStr">
          <el-button slot="append" icon="el-icon-search"
                     :loading="loading" @click="search">
          </el-button>
        </el-input>
      </el-form-item>
      <el-button
        @click="true"
        type="primary"
        icon="el-icon-plus">
        Create
      </el-button>
    </el-form>

    <el-table>
      <el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'OSList',
    data() {
      return {
        searchOS: {
          searchStr: ''
        },
        searchOSRules: {}
      };
    },
    methods: {
      search() {
        1
      }
    }
  }
</script>

<style scoped>

</style>
