/* eslint-disable import/no-unresolved */
import { Request } from 'meteor/socialize:requestable';
import { User } from 'meteor/socialize:user-model';
/* eslint-enable import/no-unresolved */

import { Friend } from './friend-model.js';

Request.onAccepted(User, function onAcceptedHook() {
    if (this.type === 'friend') {
        new Friend({ friendId: this.requesterId }).save({
            channel: `friends::${this.linkedObjectId}`,
        });
    }
});

Request.registerRequestType('friend');
