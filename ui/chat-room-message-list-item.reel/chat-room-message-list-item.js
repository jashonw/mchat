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

    value: {
        value: null
    },

    draw: {
        value: function () {
            this.templateObjects.message.element.innerHTML = this.value.message ? this.value.message : "";
            this.templateObjects.userName.element.innerHTML = this.value.user_name ? this.value.user_name : "";
        }
    }
});
