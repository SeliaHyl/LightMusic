<template>
  <div class="songs">
    <ul>
      <li v-for="(item,index) in songs"
          :key="item.musicId"
          class="item"
          @click="selectItem(item,index)"
      >
        <p class="rank">{{index+1}}</p>
        <div class="text">
          <h2 class="name">{{item.musicName}}</h2>
          <p class="detail">{{getAlbum(item)}}</p>
        </div>
        <div class="icon" @click.stop="insertItem(item)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getAlbum(item) {
      return `${item.singerName} - ${item.albumName}`
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    insertItem(item) {
      this.$emit('insert', item)
    }
  }
}
</script>
<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.songs
  width 100%
  background-color $color-theme
  .item
    display flex
    box-sizing border-box
    align-items center
    padding 3px 5px
    .rank
      width 50px
      height 50px
      line-height 50px
      text-align center
      color $color-word-l
      font-size $font-size-medium
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        no-wrap()
        color $color-word
        font-size $font-size-medium
      .detail
        no-wrap()
        color $color-word-l
        font-size $font-size-small-s
    .icon 
      width 30px
      height 30px
      line-height 30px
      text-align center
      color $color-word-l
      font-size $font-size-small
      transform rotate(45deg)
</style>