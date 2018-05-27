/* eslint-disable no-undef */
Package.describe({
    name: 'socialize:friendships',
    summary: 'A social friendship package',
    version: '1.0.2',
    git: 'https://github.com/copleykj/socialize-friendships.git',
});

Package.onUse(function _(api) {
    api.versionsFrom('1.3');

    api.use([
        'check',
        'reywood:publish-composite@1.6.0',
        'socialize:user-blocking@1.0.1',
        'socialize:requestable@1.0.3',
    ]);

    api.imply('socialize:user-blocking');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
