<template>
  <el-link @click="handleClick" icon="el-icon-delete" :type="type">
    <slot></slot>
  </el-link>
</template>

<script>
  export default {
    name: 'DeleteLink',
    props: {
      message: { type: String, default: 'Do you confirm to delete this item?' },
      type: { type: String, default: 'danger' }
    },
    methods: {
      handleClick(e) {
        this.$confirm(this.message,'Notification', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$emit('click', e);
        });
      }
    }
  }
</script>

<style scoped>

</style>
