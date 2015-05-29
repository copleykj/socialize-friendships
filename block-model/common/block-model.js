/**
 * The Block Class
 * @class Block
 * @param {Object} document An object representing a Block ususally a Mongo document
 */
Block = BaseModel.extendAndSetupCollection("blocks");

BlocksCollection = Block.collection;

//Create the schema for a Block
Block.appendSchema({
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
    "blockedUserId":{
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
