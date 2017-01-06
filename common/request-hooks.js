/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Request } from 'meteor/socialize:requestable';
/* eslint-enable import/no-unresolved */

import { Friend } from './friend-model.js';

Request.onAccepted(function onAcceptedHook() {
    if (this.type === 'friend') {
        new Friend({ userId: Meteor.userId(), friendId: this.requesterId }).save();
    }
});
