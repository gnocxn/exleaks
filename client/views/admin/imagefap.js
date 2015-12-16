var SearchResult = new Mongo.Collection(null);
Template.imagefap.viewmodel({
    Term: '',
    Page: 0,
    Limit: 50,
    isSearching: false,
    isFound: false,
    SearchImage: function (e) {
        this.isSearching(true);
        SearchResult.remove({});
        var self = this;
        Meteor.call('imagefap_Search', this.Term(), this.Limit(), this.Page(), function (error, data) {
            if (error) {
                console.error(error);
            }
            if (data) {
                _.each(data, function (i) {
                    SearchResult.insert(i);
                });
                self.isFound(SearchResult.find().count() > 0);
            }
            self.isSearching(false);
        })
    },
    result: function () {
        return SearchResult.find();
    },
    autorun : function(){
        if(this.result().count() > 0){
            var ids = _.map(this.result().fetch(),function(r){ return r.id});
            this.templateInstance.subscribe('getAlbums',{_albumId : {$in : ids}},this.Limit());
        }
    }
});


Template.imagefap_result_item.rendered = function () {
    $('.album-name')
        .popup();
}

Template.imagefap_result_item.viewmodel({
    isFetched : function(){
        var album = Albums.findOne({_albumId : this.data().id});
        return (album) ? false : true;
    },
    fetchImages: function (e) {
        e.preventDefault();
        var albumId = this.data().id;
        var albumTpl = _.template('http://www.imagefap.com/pictures/<%=albumId%>/?gid=<%=albumId%>&view=2'),
            albumUrl = albumTpl({albumId : albumId});
        var self = this;
        console.warn('import', albumUrl);
        Meteor.call('imagefap_fetchAlbum', albumUrl,this.data().title, function (error, data) {
            if (error) console.error(error);
            if (data) {
                Meteor.call('importAlbum',data, function(error,result){
                    if (error) console.error(error.message);
                    if(result) {
                        self.isFetched(result);
                        console.info(result)
                    };
                })
            }
        })
    }
})