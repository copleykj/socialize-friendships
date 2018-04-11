/* eslint-disable import/no-unresolved */
import Meteor, { Mongo } from '@socialize/react-native-meteor';
import { BaseModel } from '@socialize/base-model';
import { ServerTime } from '@socialize/server-time';
import { Request, RequestsCollection } from '@socialize/requestable';
import { User } from '@socialize/user-model';
/* eslint-enable import/no-unresolved */

import extendUser from './common/user-extensions';
import addHooks from './common/request-hooks';
import construct from './common/friend-model.js';

const { Friend, FriendsCollection } = construct({ Meteor, Mongo, BaseModel, ServerTime });

addHooks({ Request, User, Friend });
extendUser({ Meteor, User, Request, RequestsCollection, FriendsCollection });


export { Friend, FriendsCollection };
