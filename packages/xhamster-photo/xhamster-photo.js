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
                        done(error, data.items || []);
                    })
                });

                if(rs.error) throw new Meteor.Error(rs.error);
                if(rs.result) return rs.result;
            }catch(ex){
                console.log(ex);
                throw new Meteor.Error(ex);
            }
        }
    })
}