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
        xhamster_fetchAlbum : function(albumId, title){
            try{
                var albumTpl = _.template('http://xhamster.com/photos/ajax.php?act=slide&gid=<%=albumId%>'),
                    albumUrl = albumTpl({albumId: albumId});
                var r = request.getSync(albumUrl);
                var images = JSON.parse(r.body);
                return images;
            }catch(ex){
                throw new Meteor.Error(ex);
            }
        }
    })
}