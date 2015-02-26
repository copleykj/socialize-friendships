# Friendships #

Provides social network style Friend Requests and Friendships.


## Request Model ##

### Request() - Extends BaseModel ###

**Request.prototype.requester()** - Get the user instance for the user who requested the friendship.

**Request.prototype.user()** - Get the user instance for the user who's friendship is being requested.

**Request.prototype.accept()** - Accept a friend request.

**Request.prototype.deny()** - Deny a friend request. Request won't be allowed to be re-made for `User.restrictRequestDays` Days. Default is 30 days.

**Request.prototype.cancel()** - Cancel a friend request.

**Request.prototype.isDenied()** - Check to see if the request has been denied.


## Friend Model ##

### Friend() - Extends BaseModel ###

**Friend.prototype.user()** - The User instance for the friend.

## User Extensions ##
This package extends the socialize:user-model package with properties and methods that apply the the user in the context of friends and friend requests.

### Static Properties ###

**User.restrictRequestDays** - The number of days to restrict a user from making another friend request to the same person.

### Static Methods ###

**User.registerBlockingHook(hook)** - Register a function that when returns true signifies that a user is blocked. Hook function is passed a User instance to check against and the context is the calling user instance.

### Prototypal Methods ###

**User.prototype.requests(limit, skip, sortBy, sortOrder)** - Get the requests for the user. Returns a Mongo.Cursor which yields Request instances.

**User.prototype.numPendingRequests()** - Get the number of requests that have not been responded to.

**User.prototype.hasRequestFrom(user)** - Check if the user already has a request from someone.

**User.prototype.requestFriendship()** - Make a friend request from the current user.


**User.prototype.friends** - Get friends for the user. Returns a Mongo.Cursor which yields Friend instances

**User.prototype.friendsAsUsers(limit, sortBy, sortOrder, online)** - Get friends for user as the users they represent. Returns a Mongo.Cursor which yields User instances.

**User.prototype.unfriend()** - Sever the friendship connection between the user and the current user.

**User.prototype.blocksUser(user)** - Check if one user blocks another. Check include by _id by default. Other blocking checks can be registred using `User.registerBlockingHook`.

## Publications ##

This package provides some publictions for convienience.

**friends  {limit:Number, skip:Number}** - Publishes friend records with their related user records.

```javascript
Meteor.subscribe('friends', {limit:10, skip:10});
```

**friendRequests  {limit:Number, skip:Number}** - Publishes request records with their related user records.

```javascript
Meteor.subscribe('friendRequests', {limit:10, skip:10});
```