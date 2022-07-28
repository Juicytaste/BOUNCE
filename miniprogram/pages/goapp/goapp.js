Page({
    data: {
        srcs:''
    },
    onLoad(options){
        console.log(options.src)
        let src = unescape(options.src)
        this.setData({
            srcs:src
        })
    }

})