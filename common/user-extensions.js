/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { RequestsCollection, Request } from 'meteor/socialize:requestable';

/* eslint-enable import/no-unresolved */

import { FriendsCollection } from './friend-model';

// Configurable number of days to restrict a user from re-requesting a friendship
User.restrictFriendshipRequestDays = 30;

User.methods({
    /**
     * Retrieve a list of friend connections
     * @param  {Object} [options={ sort: { date: -1 } }]  Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor}  A cursor of which returns Friend instances
     */
    friends(options = { sort: { date: -1 } }) {
        return FriendsCollection.find({ userId: this._id }, options);
    },

    /**
     * Retrieves friend connections as the users they represent
     * @param  {Object} [options={}] Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor} A cursor which returns user instances
     */
    friendsAsUsers(options = {}) {
        const ids = this.friends(options).map(friend => friend.friendId);

        return Meteor.users.find({ _id: { $in: ids } });
    },

    /**
     * Remove the friendship connection between the user and the logged in user
     */
    unfriend() {
        const friend = FriendsCollection.findOne({ userId: Meteor.userId(), friendId: this._id });

        // if we have a friend record, remove it. FriendsCollection.after.remove will
        // take care of removing reverse friend connection for other user
        friend && friend.remove();
    },

    /**
     * Check if the user is friends with another
     * @param   {Object}  User The user to check
     * @returns {Boolean} Whether the user is friends with the other
     */
    isFriendsWith(user) {
        const userId = user._id || Meteor.userId();
        return !!FriendsCollection.findOne({ userId: this._id, friendId: userId });
    },
    /**
     * Get the friend requests the user currently has
     * @param  {Object} [options={}] Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor} A cursor which returns request instances
     */
    friendRequests(options = {}) {
        const newOptions = {
            ...options,
            namespace: `friendRequests::${this._id}`,
        };
        return RequestsCollection.find({ ...this.getLinkObject(), type: 'friend', denied: { $exists: false }, ignored: { $exists: false } }, newOptions);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @returns {Number} The number of pending requests
     */
    numFriendRequests() {
        return this.friendRequests().count();
    },

    /**
     * Get the pending requests from this user to other users
     * @param  {Object} [options={}] Mongo style options object which is passed to Collection.find()
     * @returns {Mongo.Cursor} A cursor which returns request instances
     */
    pendingFriendRequests(options = {}) {
        const newOptions = {
            ...options,
            namespace: `pendingFriendRequests::${this._id}`,
        };
        return RequestsCollection.find({ requesterId: this._id, type: 'friend', denied: { $exists: false }, ignored: { $exists: false } }, newOptions);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @returns {Number} The number of pending requests
     */
    numPendingFriendRequests() {
        return this.pendingFriendRequests().count();
    },

    /**
     * Check if the user has a pending request from someone
     * @param   {Object}  user The user to check if there is a request from
     * @returns {Boolean} Whether or not there is a pending request
     */
    hasFriendshipRequestFrom(user) {
        const request = RequestsCollection.findOne({ ...this.getLinkObject(), type: 'friend', requesterId: user._id }, { fields: { _id: true, denied: true } });

        if (request) {
            const minDate = request.denied && request.denied.getTime() + (3600000 * 24 * User.restrictFrienshipRequestDays);
            if (!request.denied || minDate > Date.now()) {
                return true;
            }
        }
        return false;
    },

    /**
     * Send a freindship request to a user
     */
    requestFriendship() {
        // insert the request, simple-schema takes care of default fields and values and allow takes care of permissions
        new Request({ ...this.getLinkObject(), type: 'friend' }).save({
            namespaces: [`friendRequests::${this._id}`, `pendingFriendRequests::${Meteor.userId()}`],
        });
    },

    /**
     * Cancel a friendship request that the current logged in user sent to the user
     */
    cancelFriendshipRequest() {
        const request = RequestsCollection.findOne({ ...this.getLinkObject(), type: 'friend', requesterId: Meteor.userId() });
        request && request.cancel({
            namespaces: [`friendRequests::${Meteor.userId()}`, `pendingFriendRequests::${this._id}`],
        });
    },

    /**
     * Accept friendship request from the user
     */
    acceptFriendshipRequest() {
        const request = RequestsCollection.findOne({
            type: 'friend',
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.accept();
    },

    /**
     * Deny friendship request from the user
     */
    denyFriendshipRequest() {
        const request = RequestsCollection.findOne({
            type: 'friend',
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.deny({
            namespaces: [`friendRequests::${Meteor.userId()}`, `pendingFriendRequests::${this._id}`],
        });
    },

    /**
     * Ignore friendship request from the user
     */
    ignoreFriendshipRequest() {
        const request = RequestsCollection.findOne({
            type: 'friend',
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.ignore({
            namespaces: [`friendRequests::${Meteor.userId()}`, `pendingFriendRequests::${this._id}`],
        });
    },

});
