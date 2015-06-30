//Configurable number of days to restrict a user from re-requesting a friendship
User.restrictRequestDays = 30;

/**
 * Get the friend requests the user currently has
 * @param   {Number}       limit     The maximum number of requests to return
 * @param   {Number}       skip      The number of records to skip
 * @param   {String}       sortBy    The key to sort on
 * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
 *                                   @returns {Mongo.Cursor} A cursor which returns request instances
 */
User.prototype.requests = function (limit, skip, sortBy, sortOrder) {
    var options = {};
    var sort = {};
    if(limit){
        options.limit = limit;
    }
    if(sortBy && sortOrder){
        sort[sortBy] = sortOrder;
        options.sort = sort;
    }
    return RequestsCollection.find({userId:this._id}, options);
};

/**
 * Retrieve the number of pending friend requests the user has
 * @method numPendingRequests
 * @returns {Number} The number of pending requests
 */
User.prototype.numRequests = function () {
    return RequestsCollection.find({userId:this._id}).count();
};

/**
 * Get the pending requests from this user to other users
 * @param   {Number}       limit     The maximum number of requests to return
 * @param   {Number}       skip      The number of records to skip
 * @param   {String}       sortBy    The key to sort on
 * @param   {Number}       sortOrder The order in which to sort the result. 1 for ascending, -1 for descending
 *                                   @returns {Mongo.Cursor} A cursor which returns request instances
 */
User.prototype.pendingRequests = function (limit, skip, sortBy, sortOrder) {
    var options = {};
    var sort = {};
    if(limit){
        options.limit = limit;
    }
    if(sortBy && sortOrder){
        sort[sortBy] = sortOrder;
        options.sort = sort;
    }
    return RequestsCollection.find({requesterId:this._id}, options);
};

/**
 * Retrieve the number of pending friend requests the user has
 * @method numPendingRequests
 * @returns {Number} The number of pending requests
 */
User.prototype.numPendingRequests = function () {
    return RequestsCollection.find({requesterId:this._id}).count();
};

/**
 * Check if the user has a pending request from someone
 * @method hasRequstForm
 * @param   {Object}  user The user to check if there is a request from
 * @returns {Boolean} Whether or not there is a pending request
 */
User.prototype.hasRequestFrom = function (user) {
    var request = RequestsCollection.findOne({userId:this._id, requesterId:user._id}, {fields:{_id:true, denied:true}});

    if(request){
        var minDate =  request.denied && request.denied.getTime() + (3600000 * 24 * User.restrictRequestDays);
        if(!request.denied || minDate > Date.now()){
            return true;
        }
    }
};

/**
 * Send a freindship request to a user
 * @method requestFriendship
 */
User.prototype.requestFriendship = function () {
    //insert the request, simple-schema takes care of default fields and values and allow takes care of permissions
    new Request({userId:this._id}).save();
};
