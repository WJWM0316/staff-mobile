class Preview {
  funcReadImgInfo (containerClass) {
    var imgs = []
    var imgObj = $(`${containerClass} img`)
    for (var i = 0; i < imgObj.length; i++) {
      imgs.push(imgObj.eq(i).attr('src'))
      imgObj.eq(i).click(function () {
        var nowImgurl = $(this).attr('src')
        window.WeixinJSBridge.invoke('imagePreview', {
          'urls': imgs,
          'current': nowImgurl
        })
      })
    }
  }
}

export default new Preview()
