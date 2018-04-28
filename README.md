# Friendships

Provides social network style Friend Requests and Friendships.

>This is a [Meteor][meteor] package with part of it's code published as a companion NPM package made to work with React Native. This allows your Meteor and React Native projects that use this package to share code between them to give you a competitive advantage when bringing your mobile and web application to market.

<!-- TOC START min:1 max:3 link:true update:true -->
- [Friendships](#friendships)
  - [Supporting the Project](#supporting-the-project)
  - [Installation](#installation)
  - [React Native Installation](#react-native-installation)
  - [Basic Usage](#basic-usage)
  - [Requests](#requests)
  - [Blocking](#blocking)
  - [Scalability - Redis Oplog](#scalability---redis-oplog)

<!-- TOC END -->

## Supporting the Project
In the spirit of keeping this and all of the packages in the [Socialize][socialize] set alive, I ask that if you find this package useful, please donate to it's development.

Litecoin: LXLBD9sC5dV79eQkwj7tFusUHvJA5nhuD3 / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Installation

This package relies on the npm package `simpl-schema` so when using with Meteor, you will need to make sure it is installed as well.

```shell
$ meteor npm install --save simpl-schema
$ meteor add socialize:messaging
```

## React Native Installation

When using this package with React Native, the dependency tree ensures that `simpl-schema` is loaded so there's no need to install it as when using within Meteor.

```shell
$ npm install --save @socialize/user-friendships
```
> **Note**
>
>  When using with React Native, you'll need to connect to a server which hosts the server side Meteor code for your app using `Meteor.connect` as per the [@socialize/react-native-meteor](https://www.npmjs.com/package/@socialize/react-native-meteor#example-usage) documentation.

## Basic Usage

When using this package with React Native you will need to import the package to cause the user class to be properly extended. This way new instances of the `User` class returned from `Meteor.users` `find` and `findOne` methods as well as `Meteor.user()` will have this packages methods available on them.

```javascript
import '@socialize/friendships';
```

```javascript
Meteor.users.findOne({username:'copleykj'}).requestFriendship();

Meteor.users.findOne({username:'storytellercz'}).acceptFriendshipRequest();

Meteor.user().requests().fetch(); // fetch all the requests from other users
Meteor.user().pendingRequests().fetch() // fetch all requests to other users
```

For a more in depth explanation of how to use this package see [API.md](api)

## Requests

This package implements the [socialize:requestable][socialize-requestable] package to allow friendship requests between users

Requests are created by calling `user.requestFriendship` where `user` is an instance of the User class. The request will be created as a request from the currently logged in user to the user represented by `user`.

Other methods for retaining information about requests or interacting with requests pertaining to the current user are also available on the User class and are detailed in the [User Extensions](API.md/#user-extensions) section of [API.md][api].

## Blocking

This package also implements blocking of other users through the [socialize:user-blocking][socialize-user-blocking] package and will not allow requests from blocked users. Also if a user is blocked and the user is a friend at the time of blocking, the friendship will be severed as well. For more information about the user-blocking API, refer to it's package documentation.

## Scalability - Redis Oplog

This package implements [cultofcoders:redis-oplog][redis-oplog]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][redis-oplog] package and configure it.


[redis-oplog]:https://github.com/cultofcoders/redis-oplog
[socialize-requestable]:https://github.com/copleykj/socialize-requestable
[socialize-user-blocking]:https://github.com/copleykj/socialize-user-blocking
[socialize]: https://atmospherejs.com/socialize
[api]: https://github.com/copleykj/socialize-friendships/blob/master/API.md
[user-extensions]: https://github.com/copleykj/socialize-friendships/blob/master/API.md/#user-extensions
[meteor]: https://meteor.com
