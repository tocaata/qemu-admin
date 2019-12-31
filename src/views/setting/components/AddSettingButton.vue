<template>
  <div>
    <el-button @click="visible = true" icon="el-icon-plus" type="primary">{{ text }}</el-button>
    <el-dialog
      :title="$t('setting.newSettingTitle')"
      width="30%"
      :visible.sync="visible"
      append-to-body>
      <el-form
        ref="addSettingForm"
        label-position="left"
        label-width="60px"
        :model="newSetting">
        <el-form-item
          prop="name"
          :label="$t('common.nameLabel')">
          <el-col :span="14">
            <el-input v-model="newSetting.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          prop="type"
          :label="$t('common.typeLabel')">
          <el-col :span="14">
            <el-input v-model="newSetting.type"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item
          prop="value"
          :label="$t('setting.valueLabel')">
          <el-col :span="14">
            <el-input v-model="newSetting.value"></el-input>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="visible = false">{{$t('common.cancel')}}</el-button>
        <el-button
          icon="el-icon-check"
          type="primary"
          :loading="loading"
          @click="createSetting">
          {{$t('common.save')}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {createSetting} from '@/api/setting';

  export default {
    name: "AddSettingButton",
    props: {
      text: {type: String},
      onCreated: {type: Function}
    },
    data() {
      return {
        visible: false,
        loading: false,
        newSetting: {
          name: '',
          type: '',
          value: ''
        }
      };
    },
    methods: {
      createSetting() {
        this.loading = true;
        createSetting(this.newSetting).then(({data, message}) => {
          this.visible = false;
          this.$refs['addSettingForm'].resetFields();
          this.onCreated && this.onCreated(data, message);
        }).finally(() => {
          this.loading = false;
        });
      }
    }
  }
</script>

<style scoped>

</style>
