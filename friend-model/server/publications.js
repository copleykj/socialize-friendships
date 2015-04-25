//Publish friend records with their related user records
Meteor.publish("friends", function (options) {
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip", "sort");



    Meteor.publishWithRelations({
        handle: this,
        collection: Meteor.friends,
        filter: {userId:this.userId, friendId:{$ne:this.userId}},
        options:options,
        mappings: [{
            key: 'friendId',
            collection: Meteor.users,
            options:{fields:{username:true, avatarId:true}}
        }]
    });
});
