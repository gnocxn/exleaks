Package.describe({
    name: 'gnocxn:watermarkjs',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"watermarkjs" : "1.1.0"});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.addAssets('.npm/package/node_modules/watermarkjs/dist/watermark.min.js','client');
    api.addFiles('watermarkjs.js',['server','client']);
    api.export('watermark','server');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('gnocxn:watermarkjs');
    api.addFiles('watermarkjs-tests.js');
});
