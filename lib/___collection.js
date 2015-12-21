Albums = new Mongo.Collection('albums');
Images = new Mongo.Collection('images');
Tags = new Mongo.Collection('tags');

if(Meteor.isServer){
    var AmazonWs = Meteor.settings.private.AmazonWs;
    var imageStore = new FS.Store.S3('imageThumbs',{
        accessKeyId: AmazonWs.AWSAccessKeyId,
        secretAccessKey: AmazonWs.AWSSecretAccessKey,
        bucket: AmazonWs.AWSBucket
    });

    ImageThumbs = new FS.Collection("ImageThumbs", {
        stores: [imageStore],
        filter: {
            allow: {
                contentTypes: ['image/*']
            }
        }
    });
}

if (Meteor.isClient) {
    var imageStore = new FS.Store.S3("images");
    ImageThumbs = new FS.Collection("imageThumbs", {
        stores: [imageStore],
        filter: {
            allow: {
                contentTypes: ['image/*']
            },
            onInvalid: function(message) {
                toastr.error(message);
            }
        }
    });
}

ImageThumbs.allow({
    insert: function() { return true; },
    update: function() { return true; },
    download: function() { return true; }
});