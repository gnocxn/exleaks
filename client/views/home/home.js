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
