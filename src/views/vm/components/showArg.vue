<template>
  <div class="detail">
    <el-form ref="newConfig" size="small" label-width="auto">
      <el-form-item label="Title:" prop="title">
        <span>{{ value.title }}</span>
      </el-form-item>
      <el-form-item label="Template:" prop="template">
        <el-tag type="info">{{ value.template }}</el-tag>
      </el-form-item>
      <el-form-item label="Description:" prop="desc">
        <span>{{ value.desc }}</span>
      </el-form-item>
      <el-form-item label="Primary:" prop="isPrimary">
        <el-tag>{{ value.isPrimary }}</el-tag>
      </el-form-item>
    </el-form>

    <el-table :data="value.params" border>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Label" prop="label"></el-table-column>
      <el-table-column label="Type" prop="type"></el-table-column>
      <el-table-column label="Component" prop="component"></el-table-column>
      <el-table-column label="Options" prop="options"></el-table-column>
      <el-table-column label="Default" prop="default"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'showArg',
    props: {
      value: {
        type: Object,
        validator: (value) => {
          if (['title', 'arg', 'template', 'isPrimary'].every(x => x in value)) {
            if ('params' in value) {
              if (Array.isArray(value.params)) {
                return value.params.every(p => {
                  return ['name', 'type', 'component'].every(o => o in p);
                })
              }
            } else {
              return true;
            }
          }
          return false;
        }
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .detail {
    margin-bottom: 15px;
  }
</style>
