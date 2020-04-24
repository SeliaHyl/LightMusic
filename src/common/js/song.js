export class songList {
  constructor(
    musicId = '', musicName = '',
    albumId = '', albumName = '', albumImg = '',
    singerId = '', singerName = '', singerImg = ''
  ) {
    /*歌曲id*/
    this.musicId = musicId
    /*歌曲名*/
    this.musicName = musicName
    /*专辑id*/
    this.albumId = albumId
    /*专辑名*/
    this.albumImg = albumImg
    /*专辑封面*/
    this.albumName = albumName
    /*歌手id*/
    this.singerId = singerId
    /*歌手名*/
    this.singerName = singerName
    /*歌手图片*/
    this.singerImg = singerImg
  }
}