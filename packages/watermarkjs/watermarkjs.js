// Write your package code here!
if(Meteor.isServer){
    watermark = Npm.require('watermarkjs');
}

if(Meteor.isClient){
    var src = '/packages/gnocxn_watermarkjs/.npm/package/node_modules/watermarkjs/dist/watermark.min.js';
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.getElementsByTagName('head')[0].appendChild(script);
}
