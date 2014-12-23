/**
 * @module ui/chat-list-item.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ChatRoomMessageListItem
 * @extends Component
 */
exports.ChatRoomMessageListItem = Component.specialize(/** @lends ChatRoomMessageListItem# */ {
    constructor: {
        value: function ChatRoomMessageListItem() {
            this.super();
        }
    },
    value:{value:null}
});
