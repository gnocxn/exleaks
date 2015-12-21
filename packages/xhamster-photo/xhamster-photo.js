// Write your package code here!
if(Meteor.isServer){
    Meteor.methods({
        xhamster_Search : function(term, limit, page){
            try{
                var term = s.words(term).join('+'),
                    page = page || 0;
                var searchTpl = _.template('http://xhamster.com/search.php?q=<%=term%>&qcat=pictures&page=<%=page%>'),
                    searchUrl = searchTpl({term : term, page : page});
                //console.log(searchUrl);
                var rs = Async.runSync(function(done){
                    var x = Xray();
                    x(searchUrl,{
                        items : x('.gallery', [{
                            id : '@id',
                            title : 'a@title',
                            href : 'a@href',
                            count : 'span',
                            thumbs : x('.img',[{
                                src : 'img@src'
                            }])
                        }])
                    })(function(error, data){
                        var items = _.map(data.items, function(i){
                            var id = s.strRight(i.id, '_');
                            return _.extend(i,{id : id, source : 'XHAMSTER'});
                        })
                        done(error, items || []);
                    })
                });

                if(rs.error) throw new Meteor.Error(rs.error);
                if(rs.result) return rs.result;
            }catch(ex){
                console.log(ex);
                throw new Meteor.Error(ex);
            }
        },
        xhamster_fetchAlbum : function(albumId, title, href){
            try{
                check(albumId, String);
                check(title,String);
                check(href, String);
                var imagesAlbumTpl = _.template('http://xhamster.com/photos/ajax.php?act=slide&gid=<%=albumId%>'),
                    imagesAlbumUrl = imagesAlbumTpl({albumId: albumId});
                var rs = Async.runSync(function(done){
                    var x = Xray();
                    x(href,{
                        description : 'meta[name="description"]@content',
                        tags : ['#channels a@text']
                    })
                    (function(error,data){
                        var album = {
                            _albumId : albumId,
                            title : title,
                            description : data.description,
                            tags : _.map(data.tags, function(t){ return t.toLowerCase()})
                        }
                        done(error,album);
                    })
                });

                if(rs.error) throw new Meteor.Error(rs.error);
                if(rs.result){
                    var r = request.getSync(imagesAlbumUrl);
                    var images = _.map(JSON.parse(r.body).list, function(i){
                        return {
                            imageId : i.id,
                            thumb : i.small,
                            image : i.big
                        }
                    });
                    return _.extend(rs.result, {images : images, source : 'XHAMSTER'});
                };

            }catch(ex){
                throw new Meteor.Error(ex);
            }
        }
    })
}