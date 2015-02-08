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
 * @param   {String}       sortBy    The key to sort on
 * @param   {Number}       sortOrder The order in which to sort 1 for ascending, -1 for descending
 * @param   {Boolean}      online    Whether to only fetch friends that are currently online
 * @returns {Mongo.Cursor} A cursor which returns user instances
 */
User.prototype.friendsAsUsers = function (limit, sortBy, sortOrder, online) {
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
    if(sortBy && sortOrder){
        sort[sortBy] = sortOrder;
        options.sort = sort;
    }
    if(online){
        selector['profile.online'] = {$ne:false};
    }

    return Meteor.users.find(selector, options);
};

User.prototype.unfriend = function () {
    FriendsCollection.findOne({userId:Meteor.userId(), friendId:this._id}).remove();
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

//Array to store additional blocking check functions
var blockHooks = [];

/**
 * Register a new function that if returns true signifies that a user is blocked
 * @param {Function} hook A function which returns true if the user should be considered blocked
 */
User.registerBlockingHook = function(hook) {
    if(_.isFunction(hook)){
        //add the hook to the blockHooks array
        blockHooks.push(hook);
    }
};

/**
 * Check if the user blocks another and run additional checks which
 * have been registered with User.registerBlockingHook()
 * @method blocksUser
 * @param   {Object}  [user=Meteor.user()] The user instance to check. Defaults to
 *                                       Meteor.user()
 * @returns {Boolean} Whether or not the user is blocked
 */
User.prototype.blocksUser =  function (user) {
    var self = this;
    user = user || Meteor.user();

    if(!this.isSelf(user) && !this.isFriendsWith(user._id)){
        _.all(blockHooks, function (hook) {
            if(hook.call(self, user)){
                return;
            }
        });
        return this.blocksUserById(user);
    }
};

User.registerBlockingHook(function (user) {
    var userId = user._id;

    if(this.profile && this.profile.blockedUsers && _(this.profile.blockedUsers).indexOf(userId) !== -1){
        return true;
    }
});