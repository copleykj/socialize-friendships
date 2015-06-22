FriendsCollection.allow({
    insert:function (userId, friend) {
        if(userId){
            var user = User.createEmpty(userId);
            var requester = User.createEmpty(friend.friendId);
            if(user.hasRequestFrom(requester)) {
                return true;
            }
        }
    },
    remove:function (userId, friend) {
        if(userId){
            return friend.checkOwnership();
        }
    }
});

FriendsCollection.after.insert(function(userId, document){
    var user = User.createEmpty(document.friendId);
    var friend = User.createEmpty(userId);

    //this if is a dirty dirty hack, unfortunately collection-hooks bypasses
    //collection2 with simple-schema when using collection.direct and doesn't
    //insert a proper record since we rely on simple-schema's autoValue feature
    if(friend.hasRequestFrom(user)){ //TODO: find a way around this hack
        //remove the the defunct request
        RequestsCollection.remove({userId:document.userId, requesterId:document.friendId});
        //create a reverse record for the other user
        //so the connection happens for both users
        FriendsCollection.insert({userId:document.friendId, friendId:userId});
    }
});

FriendsCollection.after.remove(function (userId, document) {
    //when a friend record is removed, remove the reverse record for the
    //other users so that the friend connection is terminated on both ends
    FriendsCollection.direct.remove({userId:document.friendId, friendId:userId});
});
