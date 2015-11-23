# Friendships #

Provides social network style Friend Requests and Friendships.


## Requests ##

Requests are created by calling `user.requestFriendship` where `user` is an instance fo the user class. The request will be created as a request from the currently logged in user to the user requresented by `user`. When retrieved from the database records are converted to instances of the `Request` class which gives access to the methods of the class.

### Request (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ###

To gain access the methods of a request you must first have an instance of a request. You can obtain an instance by performing a query on the requests collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration. Ways of obtaining instances that belong to the current user are provided as extensions to the `User` class and are detail in the [User Extension](#user-extensions) section of this document

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

**wasRespondedTo** - Check to see if the request has been responded to (denied or ignored).

```javascript
request.wasRespondedTo(); //true if the request was responded to.
```


## Friends ##

### Friend (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ###

To gain access the methods of a friend you must first have an instance of a friend. You can obtain an instance by performing a query on the friend collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration. Ways of obtaining instances that belong to the current user are provided as extensions to the `User` class and are detailed in the [User Extensions](#user-extensions) section of this document

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

**requests(limit, skip)** - Get the requests to the user. Returns a Mongo.Cursor which yields `Request` instances.

```html
{{#each currentUser.requests}}
<div class="request">
    <p>{{requester.username}} would like to be friends</p>
    <p>
        <a href="#" data-action="accept">Accept</a>
        <a href="#" data-action="deny">Deny</a>
        <a href="#" data-action="ignore">Ignore</a>
    </p>
</div>
{{/each}}
```

**numRequests** - The number of remaining requests to the user

```html
<div class="badge success">{{currentUser.numRequests}}</div>
```

**pendingRequests** - A cursor of requests that the user has sent but have not been approved, denied or ignored.

```html
{{#each currentUser.pendingRequests}}
    <p>
        {{user.username}} - <a href="#" data-action="cancel">cance request</a>
    </p>
{{/each}}
```

**numPendingRequests** - Get the number of requests that have not been responded to.

```html
<p>
    You have {{currentUser.numPendingRequests}} requests to other users pending.
</p>
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

**cancelFriendshipRequest** - Cancel request made from the currentUser to this user.

```javascript
Template.userProfile.events({
    'click [data-action=cancel]': function() {
        //assumes context is a instance of a user
        this.cancelFriendshipRequest();
    }
});
```

**acceptFriendshipRequest** - Accept a friend request made from this user to the currentUser.

```javascript
Template.userProfile.events({
    'click [data-action=accept]': function() {
        //assumes context is a instance of a user
        this.acceptFriendshipRequest();
    }
});
```

**denyFriendshipRequest** - Deny a friend request made from this user to the currentUser.

```javascript
Template.userProfile.events({
    'click [data-action=deny]': function() {
        //assumes context is a instance of a user
        this.denyFriendshipRequest();
    }
});
```

**ignoreFriendshipRequest** - Ignores a friend request made from this user to the currentUser

```javascript
Template.userProfile.events({
    'click [data-action=ignore]': function() {
        //assumes context is a instance of a user
        this.ignoreFriendshipRequest();
    }
});
```

**friends(limit, skip)** - Get friends for the user. Returns a Mongo.Cursor which yields Friend instances

```html
{{#each currentUser.friends}}
    <!-- instance of Friend not User -->
    <p>{{user.username}}</p>
{{/each}}
```

**friendsAsUsers(limit, skip)** - Get friends for user as the users they represent. Returns a Mongo.Cursor which yields User instances.

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

**blockedByUserIds(limit, skip)** - Get array of userId's for users that currently block the user.

```javascript
var ids = currentUser.blockedByUserIds();

//return only users that aren't blocking the currentUser
return Meteor.users.find({_id:{$nin:ids}});
```

**blockedByUsers(limit, skip)** - Get a cursor of users that currently block the user.

```javascript
var blockedByUsers = currentUser.blockedByUsers()
```

**blockedUserIds(limit, skip)** - Get an array of userIds for users that are blocked by the the user.

```javascript
var ids = currentUser.blockedUserIds();

//return only users that the current user isn't blocking
return Meteor.users.find({_id:{$nin:ids}});
```

**blockedUsers(limit, skip)** - Get a cursor of users that are blocked by the user

```html
{{#each currentUser.blockedUsers}}
    <div class="btn danger" data-action="unblock">Unblock {{username}}</div>
{{/each}}
```

### Static Properties ###

**User.restrictRequestDays** - The number of days to restrict a user from making another friend request to the same person.

```javascript
User.restrictRequestDays = 365; //don't allow new requests for a year.
```

### Static Methods ###

**User.registerBlockingHook(hook)** - Register a function that when returns true signifies that a user is blocked. Hook function is passed a User instance to check against and the context is the calling user instance.

```javascript
//create a blocking rule that allows users to preemptively block others that may be a nuisance
User.registerBlockingHook(function(user){
    if(currentUser.blockAnnoyingUsers && user.flaggedCount > 10){
        return true;
    }
});
```

## Publications ##

Previous verions of this package provided convenient publications for publishing related data. Over the life of the package though, I have come to realize that publications are too application specific and you should not be locked in to a specific join package for the publications to be pre packaged. Instead publication examples can be found on the [github wiki page for this package](https://github.com/copleykj/socialize-friendships/wiki/Publications).
