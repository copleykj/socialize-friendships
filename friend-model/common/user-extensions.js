/**
 * Retrieve a list of friend connections
 * @method friends
 * @param   {Boolean}      includeSelf Whether to includ the user in the list
 * @returns {Mongo.Cursor} A cursor of which returns Friend instances
 */
User.prototype.friends = function (includeSelf) {
    var selector = { userId:this._id };

    if(!includeSelf){
        selector.friendId = {$ne:this._id};
    }

    return FriendsCollection.find(selector);
};

/**
 * Retrieves friend connections as the users they represent
 * @method friendsAsUsers
 * @param   {Number}       limit     The maximum number or friends to return
 * @param   {Number}       skip      The number of records to skip
 * @param   {String}       sortBy    The key to sort on
 * @param   {Number}       sortOrder The order in which to sort 1 for ascending, -1 for descending
 * @param   {Boolean}      online    Whether to only fetch friends that are currently online
 * @returns {Mongo.Cursor} A cursor which returns user instances
 */
User.prototype.friendsAsUsers = function (limit, skip, sortBy, sortOrder, online) {
    var options = {};
    var sort = {};
    var selector;

    var ids = this.friends().map(function(friend){
        return friend.friendId;
    });

    selector = {_id:{$in:ids}};

    if(limit){
        options.limit = limit;
    }

    if(skip){
        options.skip = skip;
    }

    if(sortBy && sortOrder){
        sort[sortBy] = sortOrder;
        options.sort = sort;
    }
    if(online){
        selector['profile.online'] = {$ne:false};
    }

    return Meteor.users.find(selector, options);
};

/**
 * Remove the friendship connection between the user and the logged in user
 * @method unfriend
 */
User.prototype.unfriend = function () {
    var friend = FriendsCollection.findOne({userId:Meteor.userId(), friendId:this._id});

    //if we have a friend record, remove it. FriendsCollection.after.remove will
    //take care of removing reverse friend connection for other user
    friend && friend.remove();
};

/**
 * Check if the user is friends with another
 * @method isFriendsWith
 * @param   {Object}  user The user to check
 * @returns {Boolean} Whether the user is friends with the other
 */
User.prototype.isFriendsWith = function (user) {
    var userId = user._id || Meteor.userId();
    return !!FriendsCollection.findOne({userId:this._id, friendId:userId});
};
