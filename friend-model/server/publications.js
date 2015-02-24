//Publish friend records with their related user records
Meteor.publish("friends", function (options) {
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip");

    options.fields = {username:1, createdAt:1, "profile.online":1, "profile.tagline":1, "profile.photo":1};

    new SimplePublication({
        subHandle:this,
        collection:FriendsCollection,
        selector:{userId:this.userId, friendId:{$ne:this.userId}},
        options:options,
        dependant:new SimplePublication({
            subHandle:this,
            collection:Meteor.users,
            options:{fields:{"username":true, "profile":true}},
            foreignKey:"friendId",
            inverted:true,
        })
    }).start();
});
