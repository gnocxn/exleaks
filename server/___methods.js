if (Meteor.isServer) {
    Meteor.methods({
        searchAlbum: function (methods, term, page, limit) {
            console.log('search...', methods);
            try {
                var rs = Async.runSync(function (done) {
                    async.concat(methods, function (method, cb) {
                        var result = Meteor.call(method, term, limit, page);
                        cb(null, result || [])
                    }, function (error, result) {
                        if (error) done(error, null);
                        if (result) {
                            done(null, result)
                        }
                    })
                });

                if (rs.error) throw new Meteor.Error(rs.error);
                if (rs.result) return rs.result;
            } catch (ex) {
                throw new Meteor.Error(ex);
            }
        },

        fetchAlbum: function (album) {
            try{
                if(album.source === 'IMAGEFAP'){
                    return Meteor.call('imagefap_fetchAlbum', album.id, album.title);
                }else{
                    return Meteor.call('xhamster_fetchAlbum', album.id, album.title, album.href);
                }
            }catch(ex){
                throw new Meteor.Error(ex);
            }
        },

        importAlbum: function (album) {
            try {
                var result = false;
                check(album, {
                    _albumId: String,
                    title: String,
                    description: String,
                    tags: [String],
                    source: String,
                    images: [Object]
                });
                var existsAlbum = Albums.findOne({_albumId: album._albumId, source: album.source});
                if (!existsAlbum) {
                    var updatedAt = new Date();
                    var cover = album.images[0].src;
                    var aId = Albums.insert(_.extend(_.omit(album, 'images'), {cover: cover, updatedAt: updatedAt}));
                    _.each(album.images, function (image) {
                        updatedAt = new Date();

                        var imageBuff = Meteor.call('imageToBuffer',image.image);
                        var rs = Async.runSync(function(done){
                            lwip.open(imageBuff,'jpg',function(error, img){
                                console.log(error,img);
                                img.batch()
                                    .scale('0.5')
                                    .toBuffer('jpg',function(error, buff){
                                        done(error, buff);
                                    })
                            })
                        });
                        console.log(rs.result);
                        if(rs.result){
                            Images.upsert({imageId: image.imageId, albumId: aId}, {
                                albumId: aId,
                                imageId: image.imageId,
                                thumb: image.thumb,
                                src: image.image,
                                updatedAt: updatedAt
                            });
                            ImageThumbs.insert(rs.result, function(error, fileObj){
                                /*Images.update({imageId : image.imageId},{
                                 $set : {
                                 thumbId : fileObj._id
                                 }
                                 });*/
                                if(error) console.log('Upload Error', error);
                                if(fileObj) console.log(fileObj);
                            })
                        }

                    });
                    result = true;
                }
                console.log('imported?', result)
                return result;
            } catch (ex) {
                console.log(ex);
                throw new Meteor.Error(ex);
            }
        },
        imageToBuffer : function(imageUrl) {
            var result = request.getSync(imageUrl, {encoding: null});
            return result.body;
            //return new Buffer(result.body).toString('base64');
        }
    })
}