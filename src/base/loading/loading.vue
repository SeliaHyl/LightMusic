<template>
  <div class="loading">
    <img src="./loading.gif" height="25" width="25" />
    <p class="descript">{{title}}</p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '加载中'
    }
  }
}
</script>
<style scoped lang="stylus">
.loading {
  width: 100%;
  text-align: center;

  .descript {
    line-height: 20px;
    color: $color-theme-l;
    font-size: $font-size-small;
  }
}
</style>