<template>
  <div>

    <!--Show (not editable)-->
    <el-form label-position="left" v-show="notEditable">
      <el-form-item label="name:">
        <span>{{ data.name }}</span>
      </el-form-item>
      <el-form-item label="Template:">
        <el-tag type="info" style="font-size: 1em;">{{ data.config | getCmd }}</el-tag>
      </el-form-item>
      <el-form-item label="config:">
        <el-card shadow="never">
          <pre class="prettyprint code">
            {{ JSON.stringify(JSON.parse(data.config), null, 2) }}
          </pre>
        </el-card>
      </el-form-item>
    </el-form>

    <!--Editable-->
    <el-form>
      <el-form-item>
      </el-form-item>
    </el-form>

    <el-button icon="el-icon-edit-outline" type="primary" v-if="notEditable" @click="notEditable = false">Edit</el-button>
    <div v-else>
      <el-button icon="el-icon-check" type="primary">Save</el-button>
      <el-button icon="el-icon-close" type="primary" @click="notEditable = true">Cancel</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ArgDetail',
    props: {
      data: { type: Object }
    },
    data() {
      return {
        notEditable: true
      };
    },
    filters: {
      getCmd(config) {
        const object = JSON.parse(config);
        return `-${object.arg} ${object.template}`;
      }
    },
    methods: {

    }
  }
</script>

<style scoped>

  .code {
    line-height: 1.2rem;
    border: 0;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  pre.code :first-child, pre.code :last-child {
    display: none;
  }

</style>

<style>

</style>
