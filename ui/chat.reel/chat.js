/**
 * @module ui/chat-room.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component,
    ChatService = require("core/chat-service").ChatService;

/**
 * @class ChatRoom
 * @extends Component
 */
exports.Chat = Component.specialize(/** @lends ChatRoom# */ {
    constructor: {
        value: function ChatRoom() {
            this.super();
            this.messageListData = [];
        }
    },

    chatServiceUrl: {
        value: null
    },

    chatService: {
        value: null
    },

    BOSH_SERVICE: {
        value: 'http://115.28.165.154:7070/http-bind/'
    },

    chatRoomName: {
        value: null
    },

    chatUserName: {
        value: null
    },

    chatRoomTitle: {
        value: null
    },

    _init: {
        value: function () {
            if (!this.chatService) {
                this.chatService = new ChatService();
                this.chatService.userJid = this.chatUserName;
                this.chatService.roomID = this.chatRoomName;
                this.chatService.BOSH_SERVICE = this.BOSH_SERVICE;
                this.addPathChangeListener("this.chatService.messageContent", this, "handleMessageIncome");
            }
        }
    },

    handleMessageIncome: {
        value: function () {
            if (this.chatService && this.chatService.messageContent) {
                var currentDate = this.chatService.messageTime;
                var dateTime = currentDate.getFullYear() + '/'
                    + (currentDate.getMonth() + 1) + '/'
                    + currentDate.getDate() + ' '
                    + currentDate.getHours() + ':'
                    + currentDate.getMinutes() + ':'
                    + currentDate.getSeconds();
                var messageParts = this.chatService.messageFrom.split('/');
                var messageAuthor = messageParts.length > 1 ? messageParts[1] : this.chatService.messageFrom;
                this.messageListData.push(
                    {
                        "user_name": messageAuthor + ':',
                        "post_time": dateTime,
                        "message": this.chatService.messageContent
                    }
                );
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            var self = this;
            this.chatService.connect(function (stat) {
                if (stat == Strophe.Status.CONNECTING) {
                    self.chatRoomTitle = 'Connecting to server';
                } else if (stat == Strophe.Status.CONNFAIL) {
                    self.chatRoomTitle = 'Failed to connect server';
                } else if (stat == Strophe.Status.DISCONNECTING) {
                    self.chatRoomTitle = 'Disconnecting from server';
                } else if (stat == Strophe.Status.DISCONNECTED) {
                    self.chatRoomTitle = 'Disconnected from server';
                } else if (stat == Strophe.Status.CONNECTED) {
                    self.chatRoomTitle = 'Connecting to room ' + self.chatRoomName;
                    self.chatService.createRoom(function () {
                        self.chatRoomTitle = 'You are in the room ' + self.chatRoomName + ' now';
                    }, function (errorMsg) {
                        self.chatRoomTitle = 'Failed to connect room ' + self.chatRoomName + ', message:' + errorMsg;
                        //self.chatRoomTitle = 'You are in the room ' + self.chatRoomName + ' now';
                    });
                }
                else {
                    self.chatRoomTitle = 'Unknown status: ' + stat;
                }
            });
        }
    },

    templateDidLoad: {
        value: function (firstTime) {
            this._init();
        }
    }


});
