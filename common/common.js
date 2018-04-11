/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { BaseModel } from 'meteor/socialize:base-model';
import { ServerTime } from 'meteor/socialize:server-time';
import { Request, RequestsCollection } from 'meteor/socialize:requestable';
import { User } from 'meteor/socialize:user-model';
/* eslint-enable import/no-unresolved */

import extendUser from './user-extensions';
import addHooks from './request-hooks';
import construct from './friend-model.js';

const { Friend, FriendsCollection } = construct({ Meteor, Mongo, BaseModel, ServerTime });

addHooks({ Request, User, Friend });
extendUser({ Meteor, User, Request, RequestsCollection, FriendsCollection });


export { Friend, FriendsCollection };
