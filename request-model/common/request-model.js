/**
 * The Request Class
 * @class Request
 * @param {Object} document An object representing a request, usually a Mongo document
 */
Request = BaseModel.extendAndSetupCollection("requests");

/**
 * Get the User instance for the user who made the request
 * @returns {User} The user who made the request
 */
Request.prototype.requester = function () {
    return Meteor.users.findOne(this.requesterId);
};

/**
 * Get the User instance for the user who is recieving the request
 * @returns {User} The user who recieved the request
 */
Request.prototype.user = function () {
    return Meteor.users.findOne(this.userId);
};

/**
 * Accept the friend request
 * @method approve
 */
Request.prototype.accept = function () {
    FriendsCollection.insert({userId:this.userId, friendId:this.requesterId});
};

/**
 * Deny the friend request
 * @method deny
 */
Request.prototype.deny = function() {
    this.update({$set:{denied:new Date()}});
};

/**
 * Cancel the friend request
 * @method cancel
 */
Request.prototype.cancel = function () {
    this.remove();
};

/**
 * Check if the request had been denied
 * @returns {Boolean} Whether the request has been denied
 */
Request.prototype.isDenied = function() {
    return !!this.denied;
};

RequestsCollection = Request.collection;

//Create the schema for a friend
Request.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        denyUpdate:true
    },
    "requesterId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert){
                return Meteor.userId();
            }else{
                this.unset();
            }
        },
        optional:true,
        denyUpdate:true
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert){
                return new Date();
            }
        },
        optional:true,
        denyUpdate:true
    },
    "denied":{
        type:Date,
        optional:true
    }
});
