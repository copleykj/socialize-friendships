# Friendships #

Provides social network style Friend Requests and Friendships.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

[Bitcoin](https://www.coinbase.com/checkouts/4a52f56a76e565c552b6ecf118461287) / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Installation ##

This package relies on the npm package `simpl-schema` so you will need to make sure it is installed as well.

```shell
$ meteor npm install --save simpl-schema
$ meteor add socialize:messaging
```


## Basic Usage ##

```javascript
Meteor.users.findOne({username:'copleykj'}).requestFriendship();

Meteor.users.findOne({username:'storytellercz'}).acceptFriendshipRequest();

Meteor.user().requests().fetch(); // fetch all the requests from other users
Meteor.user().pendingRequests().fetch() // fetch all requests to other users
```

For a more in depth explanation of how to use this package see [API.md](API.md) 

## Requests ##

This package implements the [socialize:requestable][2] package to allow friendship requests between users

Requests are created by calling `user.requestFriendship` where `user` is an instance of the User class. The request will be created as a request from the currently logged in user to the user represented by `user`.

Other methods for retaining information about requests or interacting with requests pertaining to the current user are also available on the User class and are detailed in the [User Extensions](API.md/#user-extensions) section of API.md.

## Blocking ##

This package also implements blocking of other users through the [socialize:user-blocking][3] package and will not allow requests from blocked users. Also if a user is blocked and the user is a friend at the time of blocking, the friendship will be severed as well. For more information about the user-blocking API, refer to it's package documentation;

## Scalability - Redis Oplog ##

This package contains a preliminary implementation of [cultofcoders:redis-oplog][1]'s namespaces to provide reactive scalability as an alternative to Meteor's `livedata`. Use of redis-oplog is not required and will not engage until you install the [cultofcoders:redis-oplog][1] package and configure it.

Due to the preliminary nature of this implementation, you may run into minor issues. Please report any issues you find to GitHub so that they can be fixed.

[1]:https://github.com/cultofcoders/redis-oplog
[2]:https://github.com/copleykj/socialize-requestable
[3]:https://github.com/copleykj/socialize-user-blocking
