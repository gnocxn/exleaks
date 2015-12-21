Template.home.viewmodel({
    isReady: false,
    Limit: 50,
    Loaded: 0,
    hasMoreAlbums: function () {
        return this.albums().count() >= this.Limit();
    },
    loadMoreAlbums: function (e) {
        e.preventDefault();
        var limit = this.Limit();
        limit += 50;
        this.Limit(limit);
    },
    albums: function () {
        return Albums.find({}, {limit: this.Loaded(), sort: {updatedAt: -1}});
    },
    autorun: function () {
        var subs = this.templateInstance.subscribe('getAlbums', {}, this.Limit());
        if (subs.ready()) {
            this.Loaded(this.Limit());
        }
    }

});
