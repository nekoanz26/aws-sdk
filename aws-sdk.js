var fs = Npm.require('fs'),
    AWS = Npm.require('aws-sdk'),
    Fiber = Npm.require('fibers'),
    Deferred = Npm.require("promised-io/promise").Deferred;

S3 = {
    settings: {},
    upload: function(params) {
        var deferred = new Deferred();
        var self = this;
        if (!self.settings.aws) {
            self.config();
        }
        var bucket = new AWS.S3({params: {Bucket: self.settings.aws.bucket}});
        bucket.putObject({
            Key: params.directory + '/' + params.basename,
            Body: fs.createReadStream( params.filename )
        }, function (err, data) {
            console.log(err);
            console.log(data);
        });
    },
    download: function(params) {
        var self = this;
        var deferred = new Deferred();
        var file_path = params.directory + '/' + params.basename;
        var bucket = new AWS.S3({params: {Bucket: self.settings.aws.bucket}});
        var file = null;

        function doDownload(callback) {
            var fiber = Fiber.current;
            bucket.getObject({
                Key: file_path
            }, function(err, data) {
                if (err) throw new Error(err.message)
                callback(null, data);
            });
        }

        var asyncDownload = Meteor.wrapAsync(doDownload);
        console.log('start');
        var res = asyncDownload();
        console.log(res.Body);
        return res;
    },
    config: function(settings) {
        this.settings = _.extend(this.settings, settings);

        if (!this.settings.aws || !this.settings.aws.key || !this.settings.aws.secret || !this.settings.aws.bucket) {
            throw new Meteor.Error(400, 'You must provide Amazon S3 credentials (key, secret, region, and bucket).');
        }

        AWS.config.update({accessKeyId: this.settings.aws.key, secretAccessKey: this.settings.aws.secret});

    }
};