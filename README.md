# Friendships #

Provides social network style Friend Requests and Friendships.


## Requests ##

Requests are created by calling `user.requestFriendship` where `user` is an instance fo the user class. When retrieved from the database records are converted to instances of the `Request` class which gives access to the methods of the class. [User Extensions]

### Request (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ###

To gain access the methods of a request you must first have an instance of a request. You can obtain an instance by performing a query on the requests collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration. Ways of obtaining instances that belong to the current user are provided as extensions to the `User` class and are detail in the [User Extensions][] section of this document

```javascript
var request = Meteor.requests.findOne(); //instance of Request

var requests = Meteor.requests.find();  //cursor which returns Request instances
```
#### Instance Methods ####

_**all examples assume an instance of `Request` as `request`**_

**requester** - Get the user instance for the user who requested the friendship.

```javascript
var requester = request.requester(); //instance of user for person making the request
```

**user** - Get the user instance for the user who's friendship is being requested.

```javascript
var user = request.user(); //instance of user who the request was sent to
```

**accept** - Accept a friend request. Only works if the user of the request is the currenly logged in user.

```javascript
request.accept(); //accept the request
```

**deny** - Deny a friend request. Only works if the user of the request is the currenly logged in user. Request won't be allowed to be re-made for `User.restrictRequestDays` Days. Default is 30 days.

```javascript
request.deny(); //deny the request
```

**cancel** - Cancel a friend request. Only works if the requester of the request is the currently logged in user.

```javascript
request.cancel(); //cancel the friend request
```

**isDenied** - Check to see if the request has been denied.

```javascript
request.isDenied(); //true if the request was denied
```


## Friends ##

### Friend (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ###

To gain access the methods of a friend you must first have an instance of a friend. You can obtain an instance by performing a query on the friend collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration. Ways of obtaining instances that belong to the current user are provided as extensions to the `User` class and are detailed in the [User Extensions][] section of this document

```javascript
var request = Meteor.friends.findOne(); //instance of Request

var requests = Meteor.friends.find();  //cursor which returns Request instances
```
#### Instance Methods ####

_**all examples assume an instance of `Friend` as `friend`**_

**user** - The User instance for the friend.

```javascript
friend.user(); //the user instance for the friend instance.
```

## User Extensions ##
This package extends the [socialize:user-model](https://github.com/copleykj/socialize-user-model) package with properties and methods that apply the the user in the context of friends and friend requests.

_**All code examples assume an instance of `User` as `currentUser`**_

```javascript
var currentUser = Meteor.user();
```

### Instance Methods ###

**requests(limit, skip, sortBy, sortOrder)** - Get the requests for the user. Returns a Mongo.Cursor which yields `Request` instances.

```html
{{#each currentUser.requests}}
    <p>{{user.username}}</p>
    <p><a href="#" data-action="accept">Accept</a> <a href="#" data-action="deny">Deny</a></p>
{{/each}}
```

**numPendingRequests** - Get the number of requests that have not been responded to.

```javascript
var requestCount = currentUser.numPendingRequests();
```
```html
<div id="requestCount" class="badge">
    {{currentUser.numPendingRequests}}
</div>
```

**hasRequestFrom(user)** - Check if the user already has a request from someone.

```html
<!-- assuming data context is user instance -->
{{#if currentUser.hasRequestFrom this}}
    <div class="btn primary" data-action="accept">Accept Request</div>
{{/if}}

```

**requestFriendship** - Make a friend request from the current user.

```javascript
Template.userProfile.events({
    'click [data-action=request]': function() {
        //assumes context is a instance of a user
        this.requestFriendship();
    }
});
```

**User.prototype.friends** - Get friends for the user. Returns a Mongo.Cursor which yields Friend instances

```html
{{#each currentUser.friends}}
    <!-- instance of Friend not User -->
    <p>{{user.username}}</p>
{{/each}}
```

**friendsAsUsers(limit, sortBy, sortOrder, online)** - Get friends for user as the users they represent. Returns a Mongo.Cursor which yields User instances.

```html
{{#each currentUser.friendsAsUsers}}
    <!-- User instances this time instead of Friend instances -->
    <p>{{username}}</p>
{{/each}}
```

**unfriend** - Sever the friendship connection between the user and the current user.

```javascript
Template.userProfile.events({
    'click [data-action=unfriend]': function() {
        //assumes context is a instance of a user
        this.unfriend();
    }
});
```

**block** - block a user.

```javascript
Template.userProfile.events({
    'click [data-action=block]': function() {
        //assumes context is a instance of a user
        this.block();
    }
});
```
**unblock** - unblock a user.

```javascript
Template.userProfile.events({
    'click [data-action=unblock]': function() {
        //assumes context is a instance of a user
        this.unblock();
    }
});
```
**blocksUser(user)** - Check if one user blocks another. Check include by _id by default. Other blocking checks can be registred using `User.registerBlockingHook`.

```html
<!-- assuming data context is user instance -->
{{#if currentUser.blocksUser this}}
    <div class="btn danger" data-action="unblock">Unblock</div>
{{/if}}
```

### Static Properties ###

**User.restrictRequestDays** - The number of days to restrict a user from making another friend request to the same person.

### Static Methods ###

**User.registerBlockingHook(hook)** - Register a function that when returns true signifies that a user is blocked. Hook function is passed a User instance to check against and the context is the calling user instance.

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
