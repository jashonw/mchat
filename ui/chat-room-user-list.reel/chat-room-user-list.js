/**
 * @module ui/chat-room-user-list.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class UserList
 * @extends Component
 */
exports.ChatRoomUserList = Component.specialize(/** @lends ChatRoomUserList# */ {
    constructor: {
        value: function ChatRoomUserList() {
            this.super();
        }
    },

    contentController: {
        value: null
    },

    templateDidLoad: {
        value: function() {

        }
    }
});