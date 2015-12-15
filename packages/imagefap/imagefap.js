// Write your package code here!
if (Meteor.isServer) {
    Meteor.methods({
        imagefap_Search: function (term, limit, page) {
            try {
                check(term, String);
                var searchUrlTpl = _.template('http://www.imagefap.com/gallery.php?type=1&gen=0&search=<%=term%>&sort=quality&perpage=<%=limit%>&order=1&page=<%=page%>'),
                    searchUrl = searchUrlTpl({term: encodeURI(term), limit: limit || 50, page: page || 0});

                var rs = Async.runSync(function (done) {
                    var x = Xray();
                    x(searchUrl, {
                        items: x('tr[id]', [{
                                id: "@id",
                                title: 'tr[id] a.gal_title b',
                                href: 'tr[id] a.gal_title@href',
                                count: 'tr[id] td:nth-child(2) center',
                                quality: 'tr[id] td:nth-child(3) img@alt'
                            }]
                        ),
                        items2: x('tr[valign]', [{
                            thumbs: x('a[title]', [{
                                href: '@href',
                                src: 'img.gal_thumb@src'
                            }])
                        }])
                    })(function (error, data) {
                        if (error)done(error, null);
                        var items = [];
                        if (data && data.items && data.items2) {
                            var i = 0;
                            _.each(data.items, function (j) {
                                var k = data.items2[i] || {thumbs: []};
                                var c = parseInt(j.count.trim());
                                items.push(_.extend(j, {count: c, thumbs: k.thumbs, source: 'IMAGEFAP'}));
                                i++;
                            })
                        }
                        done(null, items);
                    })
                });
                if (rs.error) throw new Meteor.Error(rs.error);
                if (rs.result) return rs.result;
            } catch (ex) {
                //console.log('Error', ex);
                throw new Meteor.Error(ex);
            }
        },

        imagefap_fetchAlbum: function (albumHref) {
            try {
                var rs = Async.runSync(function (done) {
                    /*var x = Xray();
                     x(albumHref, {
                     albumId : '#galleryid_input@value',
                     items : x('a[name]',[{
                     imageId : '@name',
                     href : '@href',
                     thumb : 'img@src'
                     }])
                     })(function(error, data){
                     done(error, data);
                     })*/
                    async.waterfall([
                        function (cb) {
                            var x = Xray();
                            x(albumHref, {
                                albumId: '#galleryid_input@value',
                                images: x('a[name]', [{
                                    imageId: '@name',
                                    href: '@href',
                                    thumb: 'img@src'
                                }])
                            })(function (error, data) {
                                cb(error, data);
                            })
                        },
                        function (rs1, cb1) {
                            var urlTpl = _.template('http://www.imagefap.com/photo/<%=firstImageId%>/?gid=<%=albumId%>&idx=<%=page%>&partial=true');
                            var firstImage = rs1.images[0],
                                albumId = rs1.albumId;
                            if (rs1.images.length <= 24) {
                                var url = urlTpl({
                                    firstImageId : firstImage.imageId,
                                    albumId : albumId,
                                    page : 0
                                });
                                var x = Xray();
                                x(url,{
                                    images : x('a[original]',[{
                                        imageId : '@imageid',
                                        image : '@original'
                                    }])
                                })(function(error, data){
                                    var items = data.images || [];
                                    var images = _.map(rs1.images, function(i){
                                        var j = _.findWhere(items,{imageId : i.imageId}) || {};
                                        return _.extend(i, {image : j.image});
                                    })
                                    cb1(error, _.extend(rs1, {images : images}));
                                })
                            } else {
                                var pages = parseInt(rs1.images.length / 24);
                                var urls = [];
                                for (i = 0; i <= pages; i++) {
                                    var url = urlTpl({
                                        firstImageId : firstImage.imageId,
                                        albumId : albumId,
                                        page : i*24
                                    });
                                    urls.push(url);
                                }
                                async.map(urls, function(url, cb){
                                    var x = Xray();
                                    x(url,{
                                        images : x('a[original]',[{
                                            imageId : '@imageid',
                                            image : '@original'
                                        }])
                                    })(function(error, data){
                                        cb(error, data.images || []);
                                    })
                                }, function(error, result){
                                    var items = _.flatten(result);
                                    var images = _.map(rs1.images, function(i){
                                        var j = _.findWhere(items,{imageId : i.imageId}) || {};
                                        return _.extend(i, {image : j.image});
                                    })
                                   cb1(error, _.extend(rs1, {images : images}));
                                })
                            }
                        }
                    ], function (error, result) {
                        done(error, result);
                    })
                });

                if (rs.error) throw new Meteor.Error(rs.error);
                if (rs.result)return rs.result;
            } catch (ex) {
                throw new Meteor.Error(ex);
            }
        }
    })
}