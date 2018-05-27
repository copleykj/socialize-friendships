export default ({ User, Request, Friend }) => {
    Request.onAccepted(User, function onAcceptedHook() {
        if (this.type === 'friend') {
            new Friend({ friendId: this.requesterId }).save();
        }
    });

    Request.registerRequestType('friend');
};
