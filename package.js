/* eslint-disable no-undef */
Package.describe({
    name: 'socialize:friendships',
    summary: 'A social friendship package',
    version: '1.1.2',
    git: 'https://github.com/copleykj/socialize-friendships.git',
});

Package.onUse(function _(api) {
    api.versionsFrom(['1.10.2', '2.3']);

    api.use([
        'check',
        'reywood:publish-composite@1.7.3',
        'socialize:user-blocking@1.0.6',
        'socialize:requestable@1.0.6',
    ]);

    api.imply('socialize:user-blocking');

    api.mainModule('server/server.js', 'server');
    api.mainModule('common/common.js', 'client');
});
