RequestsCollection.allow({
    insert: function (userId, request) {
        if(userId){
            var user = Meteor.users.findOne(request.userId);
            var requester = Meteor.users.findOne(request.requesterId);

            if(!user.isSelf() && !user.isFriendsWith(requester)){
                if(!(user.blocksUser(requester) || requester.blocksUserById(user))){
                    if(!(user.hasRequestFrom(requester) || requester.hasRequestFrom(user))){
                        return true;
                    }
                }
            }
        }
    },
    update: function (userId, request) {
        if(userId){
            request = new Request(request);
            //let the update happen if the request belongs to the user. simple-schema takes
            //care of making sure that they can't change fields they aren't supposed to
            return request.checkOwnership();
        }
    },
    remove: function (userId, request) {
        if(userId){
            //allow the request to be canceled if the currentUser is the requester
            //and the other user has not denied the request
            return request.requesterId === userId && !request.isDenied();
        }
    }
});
