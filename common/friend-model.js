/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { BaseModel } from 'meteor/socialize:base-model';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/* eslint-enable import/no-unresolved */

export const FriendsCollection = new Mongo.Collection('socialize:friends');

export class Friend extends BaseModel {
    /**
     * Get the User instance for the friend
     * @function user
     * @memberof Friend
     */
    user() {
        return Meteor.users.findOne(this.friendId);
    }
}

Friend.attachCollection(FriendsCollection);

// Create the schema for a friend
FriendsCollection.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        autoValue() {
            if (this.isInsert) {
                if (!this.isSet || !this.isFromTrustedCode) {
                    return this.userId;
                }
            }
            return undefined;
        },
        denyUpdate: true,
    },
    friendId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    date: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return new Date();
            }
            return undefined;
        },
        denyUpdate: true,
    },
}));
