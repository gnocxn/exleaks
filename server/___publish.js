Meteor.publish('getAlbums',function(limit){
    return Albums.find({},{limit : limit || 50});
});

Meteor.publish('getImagesByAlbum',function(albumId, limit){
    return Images.find({albumId : albumId},{limit : limit||50});
})