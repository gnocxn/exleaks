if(Meteor.isClient){
    BlazeLayout.setRoot('body');
}

FlowRouter.route('/',{
    name : 'home',
    action : function(p,q){
        BlazeLayout.render('defaultLayout',{
            main : 'home'
        })
    }
});

FlowRouter.route('/album/:id',{
    name : 'album',
    action : function(p, q){
        BlazeLayout.render('defaultLayout',{
            main : 'album_test'
        })
    }
})

FlowRouter.route('/money/imagefap',{
    name : 'admin_imagefap',
    action : function(p,q){
        BlazeLayout.render('defaultLayout',{
            main : 'imagefap'
        })
    }
})