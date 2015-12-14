// Write your package code here!
if (Meteor.isServer) {
    Meteor.methods({
        imagefap_Search: function (term, limit, page) {
            try {
                check(term, String);
                var searchUrlTpl = _.template('http://www.imagefap.com/gallery.php?type=1&gen=0&search=<%=term%>&sort=quality&perpage=<%=limit%>&order=1&page=<%=page%>'),
                    searchUrl = searchUrlTpl({term: encodeURI(term), limit: limit || 50, page : page || 0});

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
                            thumbs: ['img.gal_thumb@src']
                        }])
                    })(function (error, data) {
                        if (error)done(error, null);
                        var items = [];
                        if (data && data.items && data.items2) {
                            var i = 0;
                            _.each(data.items, function (j) {
                                var k = data.items2[i] || {thumbs : []};
                                items.push(_.extend(j, {thumbs: k.thumbs, source : 'IMAGEFAP'}));
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
        }
    })
}