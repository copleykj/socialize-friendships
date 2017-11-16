/* eslint-disable no-undef */
Package.describe({
    name: 'socialize:friendships',
    summary: 'A social friendship package',
    version: '1.0.0',
    git: 'https://github.com/copleykj/socialize-friendships.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use([
        'socialize:user-blocking@1.0.0',
        'socialize:requestable@1.0.0',
    ]);

    api.imply('socialize:user-model');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js');
});
