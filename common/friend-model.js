/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { BaseModel } from 'meteor/socialize:base-model';
import { ServerTime } from 'meteor/socialize:server-time';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/* eslint-enable import/no-unresolved */

export const FriendsCollection = new Mongo.Collection('socialize:friends');

if (FriendsCollection.configureRedisOplog) {
    FriendsCollection.configureRedisOplog({
        mutation(options, { selector, doc }) {
            let userId = (selector && selector.userId) || (doc && doc.userId);

            if (!userId && selector._id) {
                const friend = FriendsCollection.findOne({ _id: selector._id }, { fields: { userId: 1 } });
                userId = friend && friend.userId;
            }

            if (userId) {
                Object.assign(options, {
                    namespace: userId,
                });
            }
        },
        cursor(options, selector) {
            if (selector.userId) {
                Object.assign(options, {
                    namespace: selector.userId,
                });
            }
        },
    });
}

export class Friend extends BaseModel {
    /**
     * Get the User instance for the friend
     * @function user
     * @memberof Friend
     */
    user() {
        return Meteor.users.findOne({ _id: this.friendId });
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
    createdAt: {
        type: Date,
        autoValue() {
            if (this.isInsert) {
                return ServerTime.date();
            }
            return undefined;
        },
        denyUpdate: true,
    },
}));
