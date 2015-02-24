/**
 * The Block Class
 * @class Block
 * @param {Object} document An object representing a Block ususally a Mongo document
 */
Block = BaseModel.extend();

//create the BlocksCollection and assign a reference to Block.prototype._collection so BaseModel knows where to find it
BlocksCollection = Meteor.blocks = Block.prototype._collection = new Mongo.Collection("blocks", {
    transform: function (document) {
        return new Block(document);
    }
});

//Create the schema for a Block
var BlockSchema = new SimpleSchema({
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

//Attach the schema to the BlocksCollection
BlocksCollection.attachSchema(BlockSchema);
