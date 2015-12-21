Package.describe({
    name: 'gnocxn:lwip',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Light Weight Image Processor for NodeJS 0.0.8',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({"lwip" : "0.0.8"});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.addFiles('lwip.js','server');
    api.export('lwip','server');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('gnocxn:lwip');
    api.addFiles('lwip-tests.js');
});
