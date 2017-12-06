/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { User } from 'meteor/socialize:user-model';
import { publishComposite } from 'meteor/reywood:publish-composite';

import SimpleSchema from 'simpl-schema';

const publicationOptionsSchema = new SimpleSchema({
    limit: {
        type: Number,
        optional: true,
    },
    skip: {
        type: Number,
        optional: true,
    },
    sort: {
        type: Object,
        optional: true,
        blackbox: true,
    },
});

publishComposite('socialize.friends', function publishFriends(userId, options = {}) {
    if (!this.userId) {
        return this.ready();
    }
    check(userId, String);
    publicationOptionsSchema.validate(options);

    const currentUser = User.createEmpty(this.userId);
    const userToPublish = User.createEmpty(userId);

    if (userToPublish.isSelf(currentUser) || (!currentUser.blocksUser(userToPublish) && !userToPublish.blocksUser(currentUser))) {
        return {
            find() {
                return userToPublish.friends(options);
            },
            children: [
                {
                    find(friend) {
                        return Meteor.users.find({ _id: friend.friendId });
                    },
                },
            ],
        };
    }
    return undefined;
});

publishComposite('socialize.friendRequests', function publishFriends(options = {}) {
    if (!this.userId) {
        return this.ready();
    }
    publicationOptionsSchema.validate(options);

    const currentUser = User.createEmpty(this.userId);

    return {
        find() {
            return currentUser.friendRequests(options);
        },
        children: [
            {
                find(request) {
                    return Meteor.users.find({ _id: request.requesterId });
                },
            },
        ],
    };
});

publishComposite('socialize.pendingFriendRequests', function publishFriends(options = {}) {
    if (!this.userId) {
        return this.ready();
    }
    publicationOptionsSchema.validate(options);

    const currentUser = User.createEmpty(this.userId);

    return {
        find() {
            return currentUser.pendingFriendRequests(options);
        },
        children: [
            {
                find(request) {
                    return Meteor.users.find({ _id: request.linkedObjectId });
                },
            },
        ],
    };
});
