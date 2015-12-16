Template.home.rendered = function(){
    /*$(document).ready(function(){
        var text =  watermark.text;
        watermark(['http://x.imagefapusercontent.com/u/Mistergone/5852438/846074698/New_folder_alt_IMG_7571_1600x1067.JPG'],function(img){
            img.crossOrigin = 'anonymous';
        })
            .image(text.lowerRight('exleaked.com', '48px Josefin Slab', '#fff', 0.5))
            .then(function (img) {
                img.width="500";
                document.getElementById('preview').appendChild(img);
            });
    })*/
}

Template.home.viewmodel({
    isReady : false,
    albums : function(){
        return Albums.find({},{sort : {updatedAt : -1}});
    },
    autorun : function(){
        var subs = this.templateInstance.subscribe('getAlbums');
        this.isReady(subs.ready());
    }
});
