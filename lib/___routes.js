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

FlowRouter.route('/money/imagefap',{
    name : 'admin_imagefap',
    action : function(p,q){
        BlazeLayout.render('defaultLayout',{
            main : 'imagefap'
        })
    }
})