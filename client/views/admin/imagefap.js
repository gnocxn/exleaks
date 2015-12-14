var SearchResult = new Mongo.Collection(null);
Template.imagefap.viewmodel({
    Term: '',
    isSearching: false,
    isFound: false,
    SearchImage: function (e) {
        this.isSearching(true);
        SearchResult.remove({});
        var self = this;
        Meteor.call('imagefap_Search', this.Term(), function (error, data) {
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