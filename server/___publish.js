Meteor.publish('getAlbums',function(param,limit){
    return Albums.find(param || {},{limit : limit || 50});
});


Meteor.publish('getImagesByAlbum',function(albumId, limit){
    return Images.find({albumId : albumId},{limit : limit||50});
})