/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { User } from 'meteor/socialize:user-model';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { RequestsCollection } from 'meteor/socialize:requestable';

const optionsArgumentCheck = {
    limit: Match.Optional(Number),
    skip: Match.Optional(Number),
    sort: Match.Optional(Object),
};

publishComposite('socialize.friends', function publishFriends(userId, options = { limit: 20, sort: { createdAt: -1 } }) {
    check(userId, String);
    check(options, optionsArgumentCheck);
    if (!this.userId) {
        return this.ready();
    }
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
                        return Meteor.users.find({ _id: friend.friendId }, { fields: User.fieldsToPublish });
                    },
                },
            ],
        };
    }
    return undefined;
});

publishComposite('socialize.friendRequests', function publishFriends(options = { limit: 10, sort: { createdAt: -1 } }) {
    check(options, optionsArgumentCheck);
    if (!this.userId) {
        return this.ready();
    }

    const currentUser = User.createEmpty(this.userId);

    return {
        find() {
            return currentUser.friendRequests(options);
        },
        children: [
            {
                find(request) {
                    return Meteor.users.find({ _id: request.requesterId }, { fields: User.fieldsToPublish });
                },
            },
        ],
    };
});

publishComposite('socialize.pendingFriendRequests', function publishFriends(options = { limit: 10, sort: { createdAt: -1 } }) {
    check(options, optionsArgumentCheck);
    if (!this.userId) {
        return this.ready();
    }

    const currentUser = User.createEmpty(this.userId);

    return {
        find() {
            return currentUser.pendingFriendRequests(options);
        },
        children: [
            {
                find(request) {
                    return Meteor.users.find({ _id: request.linkedObjectId }, { fields: User.fieldsToPublish });
                },
            },
        ],
    };
});

Meteor.publish('socialize.hasFriendshipRequest', function(requestedUser) {
    check(requestedUser, String);

    const userToPublish = Meteor.users.findOne({ _id: requestedUser });

    return RequestsCollection.find({
        $or: [
            { linkedObjectId: this.userId, requesterId: userToPublish._id },
            { linkedObjectId: userToPublish._id, requesterId: this.userId }
        ],
        type: 'friend'
    });
});
