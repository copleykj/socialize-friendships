//Configurable number of days to restrict a user from re-requesting a friendship
User.restrictRequestDays = 30;

User.methods({
    /**
     * Get the friend requests the user currently has
     * @param   {Number}       limit     The maximum number of requests to return
     * @param   {Number}       skip      The number of records to skip
     * @param   {String}       sortBy    The key to sort on
     * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
     * @returns {Mongo.Cursor} A cursor which returns request instances
     */
    requests: function (limit, skip) {
        var options = {limit:limit, skip:skip};
        return RequestsCollection.find({userId:this._id, denied:{$exists:false}, ignored:{$exists:false}}, options);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @method numPendingRequests
     * @returns {Number} The number of pending requests
     */
    numRequests: function () {
        return this.requests().count();
    },

    /**
     * Get the pending requests from this user to other users
     * @param   {Number}       limit     The maximum number of requests to return
     * @param   {Number}       skip      The number of records to skip
     * @param   {String}       sortBy    The key to sort on
     * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
     *                                   @returns {Mongo.Cursor} A cursor which returns request instances
     */
    pendingRequests: function (limit, skip) {
        var options = {limit:limit, skip:skip};
        return RequestsCollection.find({requesterId:this._id, denied:{$exists:false}, ignored:{$exists:false}}, options);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @method numPendingRequests
     * @returns {Number} The number of pending requests
     */
    numPendingRequests: function () {
        return this.pendingRequests().count();
    },

    /**
     * Check if the user has a pending request from someone
     * @method hasRequstForm
     * @param   {Object}  user The user to check if there is a request from
     * @returns {Boolean} Whether or not there is a pending request
     */
    hasRequestFrom: function (user) {
        var request = RequestsCollection.findOne({userId:this._id, requesterId:user._id}, {fields:{_id:true, denied:true}});

        if(request){
            var minDate =  request.denied && request.denied.getTime() + (3600000 * 24 * User.restrictRequestDays);
            if(!request.denied || minDate > Date.now()){
                return true;
            }
        }
    },

    /**
     * Send a freindship request to a user
     * @method requestFriendship
     */
    requestFriendship: function () {
        //insert the request, simple-schema takes care of default fields and values and allow takes care of permissions
        new Request({userId:this._id}).save();
    },

    /**
     * Cancel a friendship request sent to the user
     * @method cancelFrienshipRequest
     */
    cancelFriendshipRequest: function () {
        var request = Meteor.requests.findOne({requesterId:Meteor.userId(), userId:this._id});
        request && request.cancel();
    },

    /**
     * Accept frienship request from the user
     * @method  acceptFriendshipRequest
     */
    acceptFriendshipRequest: function() {
        var request = Meteor.requests.findOne({requesterId:this._id, userId:Meteor.userId()});
        request && request.accept();
    },

    /**
     * Deny friendship request from the user
     * @method denyFriendshipRequest
     */
    denyFriendshipRequest: function() {
        var request = Meteor.requests.findOne({requesterId:this._id, userId:Meteor.userId()});
        request && request.deny();
    },

    /**
     * Ignore friendship request from the user
     * @method ignoreFriendshipRequest
     */
    ignoreFriendshipRequest: function() {
        var request = Meteor.requests.findOne({requesterId:this._id, userId:Meteor.userId()});
        request && request.ignore();
    }
});
