 <template>
    <div class="m-header">
        <router-link tag="div" class="search" to="/search">
            <i class="icon-search"></i>
        </router-link>
        <div class="icon"></div>
        <h1 class="text">LightMusic</h1>
        <router-link tag="div" class="user" to="/user">
            <i class="icon-mine"></i>
        </router-link>
    </div>
 </template>
  <script>
  export default {}
 </script>
 <style scoped lang="stylus">
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"
    .m-header
        position relative
        height 44px
        text-align center
        color $color-theme
        .icon
            display inline-block
            vertical-align top
            margin-top 7px
            width 30px
            height 32px
            margin-right 2px
            bg-image('logo')
            background-size 30px 30px
        .text
            display inline-block
            vertical-align top
            line-height 44px
            font-size $font-size-large
        .user
            position absolute
            top 0
            right 0
            .icon-mine
                display block
                padding 12px
                font-size 20px
                color $color-theme
        .search
            position absolute
            top 0
            left 0
            .icon-search
                display block
                padding 8px
                font-size 28px
                color $color-theme
 </style>
 