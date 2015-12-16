Template.album_detail.viewmodel({
    isReady : false,
    images : function(){
        var albumId = FlowRouter.getParam('id');
        return Images.find({albumId : albumId});
    },
    autorun : function(){
        var albumId = FlowRouter.getParam('id');
        var subs = this.templateInstance.subscribe('getImagesByAlbum', albumId);
        this.isReady(subs.ready());
    }
})