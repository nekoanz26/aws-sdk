Package.describe({
    name: 'nekoanz:aws-sdk',
    version: '0.0.3',
    // Brief, one-line summary of the package.
    summary: 'meteor remove npm-container <br> meteor update meteorhacks:npm',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/nekoanz26/aws-sdk',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');
    api.use([
        'ecmascript',
        'meteorhacks:npm@1.5.0'
    ]);
    api.addFiles('aws-sdk.js', 'server');
    api.export('S3','server');
});

Package.onTest(function(api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('nekoanz:aws-sdk');
    api.addFiles('aws-sdk-tests.js');
});

Npm.depends({
    "promised-io": "0.3.5",
    "aws-sdk": "2.2.21"
});
