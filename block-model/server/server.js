BlocksCollection.allow({
    insert: function (userId, block){
        return block.checkOwnership();
    },
    remove: function (userId, block){
        return block.checkOwnership();
    }
});

BlocksCollection.after.insert(function(userId, document){
    var blockedUser = User.createEmpty(document.blockedUserId);
    //If the users are friends, we need to sever that connection
    blockedUser.unfriend();

    //If there are any requests between the users, clean them up.
    RequestsCollection.remove({$or:[
        {userId:document.userId, requesterId:document.blockedUserId},
        {userId:document.blockedUserId, requesterId:document.userid}
    ]});
});
