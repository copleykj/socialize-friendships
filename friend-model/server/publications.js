//Publish friend records with their related user records
Meteor.publish("friends", function (options) {
    if(!this.userId){
        return this.ready();
    }

    options = options || {};

    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip");

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
