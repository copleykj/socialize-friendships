# Friendships #

Provides social network style Friend Requests and Friendships.

## Supporting the Project ##
In the spirit of keeping this and all of the packages in the [Socialize](https://atmospherejs.com/socialize) set alive, I ask that if you find this package useful, please donate to it's development.

[Bitcoin](https://www.coinbase.com/checkouts/4a52f56a76e565c552b6ecf118461287) / [Patreon](https://www.patreon.com/user?u=4866588) / [Paypal](https://www.paypal.me/copleykj)

## Installation ##

```shell
$ meteor add socialize:messaging
```


## Basic Usage ##

```javascript
Meteor.users.findOne({username:'copleykj'}).requestFriendship();

Meteor.users.findOne({username:'storytellercz'}).acceptFriendshipRequest();

Meteor.user().requests().fetch(); // fetch all the requests from other users
Meteor.user().pendingRequests().fetch() // fetch all requests to other users
```

## Requests ##

This package implements the [socialize:requestable](https://github.com/copleykj/socialize-requestable) package to allow friendship requests between users

Requests are created by calling `user.requestFriendship` where `user` is an instance of the User class. The request will be created as a request from the currently logged in user to the user represented by `user`.

Other methods for retaining information about requests or interacting with requests pertaining to the current user are also available on the User class and are detailed in the [User Extensions](#user-extensions) section of this document.

## Blocking ##

This package also implements blocking of other users through the [socialize:user-blocking](https://github.com/copleykj/socialize-user-blocking) package and will not allow requests from blocked users. Also if a user is blocked and the user is a friend at the time of blocking, the friendship will be severed as well.

For a more in depth explanation of how to use this package see [API.md](API.md)

## Publications ##

Previous versions of this package provided convenient publications for publishing related data. Over the life of the package though, I have come to realize that publications are too application specific and you should not be locked in to a specific join package for the publications to be pre packaged. Instead publication examples can be found on the [github wiki page for this package](https://github.com/copleykj/socialize-friendships/wiki/Publications).
