<template>
  <div @mouseenter="showLabel = true" @mouseleave="showLabel = false">
    <slot :data="visibleData"></slot>
    <div class="show-more" @click="isMore = !isMore" v-show="this.data && this.data.length > 5">
      <i :class="{'el-icon-caret-bottom': !isMore, 'el-icon-caret-top': isMore, 'hovering': showLabel}"></i>
      <span v-show="showLabel && !isMore">{{$t('common.showMore')}}</span>
      <span v-show="showLabel && isMore">{{$t('common.hideMore')}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    props: {
      data: {type: Array}
    },
    data() {
      return {
        isMore: false,
        showLabel: false
      };
    },
    computed: {
      visibleData() {
        if (this.isMore) {
          return this.data;
        } else {
          return this.data && this.data.slice(0, 5);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .show-more {
    text-align: center;
    color: #d3dce6;
    width: 80%;
    cursor: pointer;
    line-height: 44px;

    &:hover {
      color: #409eff;
    }

    i {
      transition: .8s;
    }

    span {
      transition: .8s;
    }
  }
</style>
