Meteor.publish('friendRequests', function(options){
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip", "sort");

    Meteor.publishWithRelations({
        handle: this,
        collection: Meteor.requests,
        filter: {userId:this.userId},
        options:options,
        mappings: [{
            key: 'requesterId',
            collection: Meteor.users,
            options:{fields:{username:true, avatarId:true}}
        }]
    });

});

Meteor.publish('outgoingFriendRequests', function(options){
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip", "sort");

    Meteor.publishWithRelations({
        handle: this,
        collection: Meteor.requests,
        filter: {requesterId:this.userId},
        options:options,
        mappings: [{
            key: 'requesterId',
            collection: Meteor.users,
            options:{fields:{username:true, avatarId:true}}
        }]
    });

});
