Meteor.publish('friendRequests', function(options){
    if(!this.userId){
        return this.ready();
    }
    
    //only allow the limit and skip options
    options = _.pick(options, "limit", "skip");

    new SimplePublication({
        subHandle:this,
        collection:RequestsCollection,
        selector:{$or:[{userId:this.userId}, {requesterId:this.userId}]},
        options: options,
        dependant: new SimplePublication({
            subHandle:this,
            collection:Meteor.users,
            foreignKey:"requesterId",
            inverted:true
        })
    }).start();
});