User.methods({

    /**
     * Retrieve a list of friend connections
     * @method friends
     * @param   {Number}        The number of records to limit the result set too
     * @param   {number}        The number of records to skip
     * @returns {Mongo.Cursor}  A cursor of which returns Friend instances
     */
    friends:function (limit, skip) {
        var options = {limit:limit, skip:skip, sort:{date:-1}};
        return FriendsCollection.find({userId:this._id}, options);
    },

    /**
     * Retrieves friend connections as the users they represent
     * @method friendsAsUsers
     * @param   {Number}       limit     The maximum number or friends to return
     * @param   {Number}       skip      The number of records to skip
     * @returns {Mongo.Cursor} A cursor which returns user instances
     */
    friendsAsUsers:function (limit, skip) {
        var ids = this.friends(limit, skip).map(function(friend){
            return friend.friendId;
        });

        return Meteor.users.find({_id:{$in:ids}});
    },

    /**
     * Remove the friendship connection between the user and the logged in user
     * @method unfriend
     */
    unfriend:function () {
        var friend = FriendsCollection.findOne({userId:Meteor.userId(), friendId:this._id});

        //if we have a friend record, remove it. FriendsCollection.after.remove will
        //take care of removing reverse friend connection for other user
        friend && friend.remove();
    },

    /**
     * Check if the user is friends with another
     * @method isFriendsWith
     * @param   {Object}  user The user to check
     * @returns {Boolean} Whether the user is friends with the other
     */
    isFriendsWith: function (user) {
        var userId = user._id || Meteor.userId();
        return !!FriendsCollection.findOne({userId:this._id, friendId:userId});
    }

});
