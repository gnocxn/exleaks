Package.describe({
    name: 'me:x-ray',
    version: '2.0.2',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"x-ray" : "2.0.2"});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.addFiles('x-ray.js',['server']);
    api.export('Xray',['server'])
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('me:x-ray');
    api.addFiles('x-ray-tests.js');
});
