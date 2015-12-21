Template.album_detail.viewmodel({
    isReady : false,
    Limit : 50,
    Loaded : 0,
    hasMoreImages : function(){
        return this.images().count() >= this.Limit();
    },
    loadMoreImages : function(e){
        e.preventDefault();
        var limit = this.Limit();
        limit += 50;
        this.Limit(limit);
    },
    images : function(){
        var albumId = FlowRouter.getParam('id');
        return Images.find({albumId : albumId},{limit : this.Loaded()});
    },
    autorun : function(){
        var albumId = FlowRouter.getParam('id');
        var subs = this.templateInstance.subscribe('getImagesByAlbum', albumId, this.Limit());
        if(subs.ready()){
            this.Loaded(this.Limit());
        }
    }
})