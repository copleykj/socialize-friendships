## Friends ##

### Friend (class) - Extends [BaseModel](https://github.com/copleykj/socialize-base-model)  ###

To gain access the methods of a friend you must first have an instance of a friend. You can obtain an instance by performing a query on the friend collection. A `findOne` will return an instance and a `find` will return a cursor which when iterated over will return an instance for each iteration.

Other methods for retaining information about friends or interacting with friends pertaining to the current user are also available on the User class and are detailed in the [User Extensions](#user-extensions) section of this document.

```javascript
var request = Meteor.friends.findOne(); //instance of Request

var requests = Meteor.friends.find();  //cursor which returns Request instances
```

_**All code examples in this section assume an instance of `Friend` as `friend`**_

**user** - The User instance for the friend.

```javascript
friend.user(); //the user instance for the friend instance.
```

## User Extensions ##
This package extends the [socialize:user-model](https://github.com/copleykj/socialize-user-model) package with properties and methods that apply the the user in the context of friends and friend requests.

_**All code examples in this section assume an instance of `User` as `currentUser`**_

```javascript
var currentUser = Meteor.user();
```

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

**denyFriendshipRequest** - Deny a friend request made from this user to the currentUser. Request won't be allowed to be re-made for `User.restrictFriendshipRequestDays` Days. Default is 30 days but you can modify this to suit your needs.

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

**isFriendsWith(user)** - Check if the current user has send a friendship request to the given user.

```html
{{#if currentUser.isFriendsWith this}}
<p>You are friends with this user</p>
{{/if}}
```

### Static Properties ###

**User.restrictFriendshipRequestDays** - The number of days to restrict a user from making another friend request to the same person.

```javascript
User.restrictFriendshipRequestDays = 365; //don't allow new requests for a year.
```
