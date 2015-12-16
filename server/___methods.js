if (Meteor.isServer) {
    Meteor.methods({
        importAlbum: function (album) {
            try {
                check(album,{
                    _albumId : String,
                    title : String,
                    description : String,
                    tags : [String],
                    source : String,
                    images : [Object]
                });
                var existsAlbum = Albums.findOne({_albumId : album._albumId, source : album.source});
                if(!existsAlbum){
                    var updatedAt = new Date();
                    var cover = album.images[0].thumb;
                    var aId = Albums.insert(_.extend(_.omit(album,'images'),{cover : cover,updatedAt : updatedAt}));
                    _.each(album.images, function(image){
                        updatedAt = new Date();
                        Images.upsert({imageId : image.imageId, albumId : aId},{
                            albumId : aId,
                            imageId : image.imageId,
                            thumb : image.thumb,
                            src : image.image,
                            updatedAt : updatedAt
                        })
                    })
                    return true;
                }
                return false;
            } catch (ex) {
                console.log(ex);
                throw new Meteor.Error(ex);
            }
        }
    })
}