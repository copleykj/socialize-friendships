/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { RequestsCollection } from 'meteor/socialize:requestable';

/* eslint-enable import/no-unresolved */

import { FriendsCollection } from '../common/friend-model';

FriendsCollection.allow({
    insert(userId, friend) {
        if (userId) {
            const user = User.createEmpty(userId);
            const requester = User.createEmpty(friend.friendId);
            if (!user.hasRequestFrom(requester)) {
                throw new Meteor.Error('NoRequest', 'User must request friendship before friendship is allowed');
            } else {
                return true;
            }
        }
        return false;
    },
    remove(userId, friend) {
        if (userId) {
            return friend.checkOwnership();
        }
        return false;
    },
});

FriendsCollection.after.insert(function afterInsert(userId, document) {
    const user = User.createEmpty(document.friendId);
    const friend = User.createEmpty(userId);

    // this if is a dirty dirty hack, unfortunately collection-hooks bypasses
    // collection2 with simple-schema when using collection.direct and doesn't
    // insert a proper record since we rely on simple-schema's autoValue feature
    if (friend.hasFriendshipRequestFrom(user)) { // TODO: find a way around this hack
        // remove the the defunct request
        RequestsCollection.remove({ userId: document.userId, requesterId: document.friendId, type: 'friend' });
        // create a reverse record for the other user
        // so the connection happens for both users
        FriendsCollection.insert({ userId: document.friendId, friendId: userId });
    }
});

FriendsCollection.after.remove(function afterRemove(userId, document) {
    // when a friend record is removed, remove the reverse record for the
    // other users so that the friend connection is terminated on both ends
    FriendsCollection.direct.remove({ userId: document.friendId, friendId: userId });
});

RequestsCollection.allow({
    insert(userId, request) {
        if (userId && request.type === 'friend') {
            const user = Meteor.users.findOne(request.linkedObjectId);
            const requester = Meteor.users.findOne(request.requesterId);

            if (!user.isSelf() && !user.isFriendsWith(requester)) {
                if (!(user.blocksUser(requester) || requester.blocksUserById(user))) {
                    if (user.hasFriendshipRequestFrom(requester) || requester.hasFriendshipRequestFrom(user)) {
                        throw new Meteor.Error('RequestExists', 'A request between users already exists');
                    } else {
                        return true;
                    }
                } else {
                    throw new Meteor.Error('Blocked', 'One user is blocking the other');
                }
            } else {
                throw new Meteor.Error('FreindshipExists', 'Either the user is requesting themselves or they are already friends with this user');
            }
        }
        return false;
    },
    update(userId, request) {
        if (userId && request.type === 'friend') {
            // let the update happen if the request belongs to the user. simple-schema takes
            // care of making sure that they can't change fields they aren't supposed to
            return request.linkedObjectId === userId;
        }
        return false;
    },
    remove(userId, request) {
        if (userId && request.type === 'friend') {
            // allow the request to be canceled if the currentUser is the requester
            // and the other user has not denied the request
            return request.requesterId === userId && !request.wasRespondedTo();
        }
        return false;
    },
});


User.onBlocked(function onBlockedHook(userId, blockedUserId) {
    const blockedUser = User.createEmpty(blockedUserId);
    // If the users are friends, we need to sever that connection
    blockedUser.unfriend();

    // If there are any requests between the users, clean them up.
    RequestsCollection.remove({ $or: [
        { userId: document.userId, requesterId: document.blockedUserId },
        { userId: document.blockedUserId, requesterId: document.userid },
    ],
        type: 'friend',
    });
});
