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
            if(this.isInsert || !this.isFromTrustedCode){
                return Meteor.userId();
            }
        },
        denyUpdate:true
    },
    "blockedUserId":{
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
