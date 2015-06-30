/**
 * The Friend Class
 * @class Friend
 * @param {Object} document An object representing a Friend ususally a Mongo document
 */
Friend =  BaseModel.extendAndSetupCollection("friends");

/**
 * Get the User instance for the friend
 * @function user
 * @memberof Friend
 */
Friend.prototype.user = function () {
    if(this.friendId){
        return  Meteor.users.findOne(this.friendId);
    }
};

FriendsCollection = Friend.collection;

//Create the schema for a friend
Friend.appendSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert && !this.isSet){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    "friendId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id
    },
    "date":{
        type:Date,
        autoValue:function() {
            if(this.isInsert || !this.isFromTrustedCode){
                return new Date();
            }
        },
        denyUpdate:true
    }
});
