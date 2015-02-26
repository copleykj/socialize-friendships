Package.describe({
    name: "socialize:friendships",
    summary: "A social friendship package",
    version: "0.3.0",
});

Package.onUse(function(api) {
    api.versionsFrom("1.0.2.1");

    api.use([
        "meteor", "mongo", "underscore", "socialize:user-model@0.1.0", "socialize:base-model@0.1.0",
        "copleykj:simple-publish@1.0.4", "aldeed:simple-schema@1.3.0", "aldeed:collection2@2.3.2",
        "matb33:collection-hooks@0.7.9", "meteorhacks:unblock@1.1.0"
    ]);

    api.imply("socialize:user-model");

    //Add the friend-model files
    api.addFiles("friend-model/common/friend-model.js");
    api.addFiles("friend-model/common/user-extensions.js");
    api.addFiles("friend-model/server/publications.js", "server");
    api.addFiles("friend-model/server/server.js", "server");

    //Add the request-model files
    api.addFiles("request-model/common/request-model.js");
    api.addFiles("request-model/common/user-extensions.js");
    api.addFiles("request-model/server/publications.js", "server");
    api.addFiles("request-model/server/server.js", "server");

    //Add the block-model files
    api.addFiles("block-model/common/block-model.js");
    api.addFiles("block-model/common/user-extensions.js");
    api.addFiles("block-model/server/publications.js", "server");
    api.addFiles("block-model/server/server.js", "server");

    api.export(["Friend", "Request", "Block"]);
});
