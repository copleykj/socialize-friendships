/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { User } from 'meteor/socialize:user-model';
import { RequestsCollection } from 'meteor/socialize:requestable';

/* eslint-enable import/no-unresolved */

import { FriendsCollection } from './friend-model';

// Configurable number of days to restrict a user from re-requesting a friendship
User.restrictRequestDays = 30;

User.methods({

    /**
     * Retrieve a list of friend connections
     * @method friends
     * @param   {Number}        The number of records to limit the result set too
     * @param   {number}        The number of records to skip
     * @returns {Mongo.Cursor}  A cursor of which returns Friend instances
     */
    friends(limit, skip) {
        const options = { limit, skip, sort: { date: -1 } };
        return FriendsCollection.find({ userId: this._id }, options);
    },

    /**
     * Retrieves friend connections as the users they represent
     * @method friendsAsUsers
     * @param   {Number}       limit     The maximum number or friends to return
     * @param   {Number}       skip      The number of records to skip
     * @returns {Mongo.Cursor} A cursor which returns user instances
     */
    friendsAsUsers(limit, skip) {
        const ids = this.friends(limit, skip).map(friend => friend.friendId);

        return Meteor.users.find({ _id: { $in: ids } });
    },

    /**
     * Remove the friendship connection between the user and the logged in user
     * @method unfriend
     */
    unfriend() {
        const friend = FriendsCollection.findOne({ userId: Meteor.userId(), friendId: this._id });

        // if we have a friend record, remove it. FriendsCollection.after.remove will
        // take care of removing reverse friend connection for other user
        friend && friend.remove();
    },

    /**
     * Check if the user is friends with another
     * @method isFriendsWith
     * @param   {Object}  User The user to check
     * @returns {Boolean} Whether the user is friends with the other
     */
    isFriendsWith(user) {
        const userId = user._id || Meteor.userId();
        return !!FriendsCollection.findOne({ userId: this._id, friendId: userId });
    },
    /**
     * Get the friend requests the user currently has
     * @param   {Number}       limit     The maximum number of requests to return
     * @param   {Number}       skip      The number of records to skip
     * @returns {Mongo.Cursor} A cursor which returns request instances
     */
    friendRequests(limit, skip) {
        const options = { limit, skip };
        return RequestsCollection.find({ ...this.getLinkObject(), denied: { $exists: false }, ignored: { $exists: false } }, options);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @method numPendingRequests
     * @returns {Number} The number of pending requests
     */
    numFriendRequests() {
        return this.requests().count();
    },

    /**
     * Get the pending requests from this user to other users
     * @param   {Number}       limit     The maximum number of requests to return
     * @param   {Number}       skip      The number of records to skip
     * @returns {Mongo.Cursor} A cursor which returns request instances
     */
    pendingFriendRequests(limit, skip) {
        const options = { limit, skip };
        return RequestsCollection.find({ ...this.getLinkObject(), denied: { $exists: false }, ignored: { $exists: false } }, options);
    },

    /**
     * Retrieve the number of pending friend requests the user has
     * @method numPendingRequests
     * @returns {Number} The number of pending requests
     */
    numPendingFriendRequests() {
        return this.pendingRequests().count();
    },

    /**
     * Check if the user has a pending request from someone
     * @method hasFriendshipRequestFrom
     * @param   {Object}  user The user to check if there is a request from
     * @returns {Boolean} Whether or not there is a pending request
     */
    hasFriendshipRequestFrom(user) {
        const request = RequestsCollection.findOne({ ...this.getLinkObject(), requesterId: user._id }, { fields: { _id: true, denied: true } });

        if (request) {
            const minDate = request.denied && request.denied.getTime() + (3600000 * 24 * User.restrictRequestDays);
            if (!request.denied || minDate > Date.now()) {
                return true;
            }
        }
        return false;
    },

    /**
     * Send a freindship request to a user
     * @method requestFriendship
     */
    requestFriendship() {
        // insert the request, simple-schema takes care of default fields and values and allow takes care of permissions
        new Request({ ...this.getLinkObject(), type: 'friend' }).save();
    },

    /**
     * Cancel a friendship request sent to the user
     * @method cancelFrienshipRequest
     */
    cancelFriendshipRequest() {
        const request = RequestsCollection.findOne({ ...this.getLinkObject(), requesterId: Meteor.userId() });
        request && request.cancel();
    },

    /**
     * Accept frienship request from the user
     * @method  acceptFriendshipRequest
     */
    acceptFriendshipRequest() {
        const request = RequestsCollection.findOne({
            ...this.getLinkObject(),
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.accept();
    },

    /**
     * Deny friendship request from the user
     * @method denyFriendshipRequest
     */
    denyFriendshipRequest() {
        const request = RequestsCollection.findOne({
            ...this.getLinkObject(),
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.deny();
    },

    /**
     * Ignore friendship request from the user
     * @method ignoreFriendshipRequest
     */
    ignoreFriendshipRequest() {
        const request = RequestsCollection.findOne({
            ...this.getLinkObject(),
            requesterId: this._id,
            linkedObjectId: Meteor.userId(),
        });
        request && request.ignore();
    },

});
