/**
 * The Friend Class
 * @class Friend
 * @param {Object} document An object representing a Friend ususally a Mongo document
 */
Friend =  BaseModel.extend();

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

//Create the friends collection and assign it to Friend.prototype._collection so BaseModel knows how to access it
FriendsCollection = Friend.prototype._collection = new Mongo.Collection('friends', {
    // Transform the document into an instance of Friend
    transform: function (doc) {
        return new Friend(doc);
    }
});

Meteor.friends = FriendsCollection;

//Create the schema for a friend
var FriendSchema = new SimpleSchema({
    "userId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id,
        autoValue:function () {
            if(this.isInsert && !this.isSet){
                return Meteor.userId();
            }
        },
        optional:true,
        denyUpdate:true
    },
    "friendId":{
        type:String,
        regEx:SimpleSchema.RegEx.Id
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
    }
});

//Attach the schema to the FriendsCollection
FriendsCollection.attachSchema(FriendSchema);
