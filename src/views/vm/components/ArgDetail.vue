<template>
  <div class="detail">
    <!--Show (not editable)-->
    <show-arg :value="config" v-show="notEditable"></show-arg>

    <el-form label-position="left" v-show="false">
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
    <edit-arg ref="editConfig" v-model="config" v-if="!notEditable"></edit-arg>

    <el-button icon="el-icon-edit-outline" type="primary" v-if="notEditable" @click="notEditable = false">Edit</el-button>
    <div v-else>
      <el-button icon="el-icon-check" type="primary" @click="editArg">Save</el-button>
      <el-button icon="el-icon-close" type="primary" @click="notEditable = true">Cancel</el-button>
    </div>
  </div>
</template>

<script>
  import EditArg from './EditArg';
  import ShowArg from './showArg'
  import { editArg } from '../../../api/vm';

  export default {
    name: 'ArgDetail',
    props: {
      data: { type: Object }
    },
    components: {
      ShowArg,
      EditArg
    },
    data() {
      return {
        notEditable: true,
        config: JSON.parse(this.data.config)
      };
    },
    filters: {
      getCmd(config) {
        const object = JSON.parse(config);
        return `${object.arg} ${object.template}`;
      }
    },
    methods: {
      editArg() {
        this.$refs.editConfig.validate((valid) => {
          if (valid) {
            editArg(this.config).then(res => {
              console.log(res);
            }).catch(err => {
              1
            })
          }
        })
      }
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
