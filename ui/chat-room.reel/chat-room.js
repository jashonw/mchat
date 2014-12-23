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
exports.ChatRoom = Component.specialize(/** @lends ChatRoom# */ {
    constructor: {
        value: function ChatRoom() {
            this.super();
            this.messageListData = [];
        }
    },

    _init: {
        value: function () {
            if (!this.chatService) {
                this.chatService = new ChatService();
                this.chatService.userJid = this.chatUserName;
                this.addPathChangeListener("this.chatService.messageContent", this, "handleMessageIncome");
            }
        }
    },

    handleMessageIncome: {
        value: function () {
            if(this.chatService && this.chatService.messageContent){
                var currentDate = new Date();
                var dateTime = currentDate.getDate() + '/'
                    + (currentDate.getMonth() + 1) + '/'
                    + currentDate.getFullYear() + ' '
                    + currentDate.getHours() + ':'
                    + currentDate.getMinutes() + ':'
                    + currentDate.getSeconds();
                var messageParts = this.chatService.messageFrom.split('/');
                debugger
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

    chatService: {
        value: null
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

    templateDidLoad: {
        value: function (firstTime) {
            this._init();
        }
    },

    enterDocument: {
        value: function (firstTime) {
            var self = this;
            this.chatService.connect(function (stat) {
                debugger
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
                        debugger
                        self.chatRoomTitle = 'You are in the room ' + self.chatRoomName + ' now';
                    }, function () {
                        debugger
                        self.chatRoomTitle = 'Failed to connect room ' + self.chatRoomName;
                    });
                }
            });
        }
    }
});