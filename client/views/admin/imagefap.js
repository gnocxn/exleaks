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
    }
});


Template.imagefap_result_item.rendered = function () {
    $('.album-name')
        .popup();
}

Template.imagefap_result_item.viewmodel({
    fetchImages: function (e) {
        e.preventDefault();
        /*var album = this.data().thumbs[0],
            albumId = this.data().id;
        var albumTpl = _.template('<%=href%>?pgid=&gid=<%=albumId%>&page=0'),
            albumUrl = albumTpl({href: album.href, albumId: albumId});
        console.warn(albumUrl);
        Meteor.call('imagefap_fetchAlbum', albumUrl, function (error, data) {
            if (error) console.error(error);
            if (data) {
                console.info(data);
            }
        })*/

        var albumId = this.data().id;
        var albumTpl = _.template('http://www.imagefap.com/pictures/<%=albumId%>/?gid=<%=albumId%>&view=2'),
            albumUrl = albumTpl({albumId : albumId});
        console.log(albumUrl);
        Meteor.call('imagefap_fetchAlbum', albumUrl, function (error, data) {
            if (error) console.error(error);
            if (data) {
                console.info(data);
            }
        })
    }
})