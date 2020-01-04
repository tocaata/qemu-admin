<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App',
  sockets: {
    showMessage(data) {
      console.log(data);

      this.$message({
        type: 'success',
        message: data.message
      });
    }
  }
}
</script>
