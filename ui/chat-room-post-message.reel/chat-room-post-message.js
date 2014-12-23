/**
 * @module ui/chat-room-post-message.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ChatRoomPostMessage
 * @extends Component
 */
exports.ChatRoomPostMessage = Component.specialize(/** @lends ChatRoomPostMessage# */ {
    constructor: {
        value: function ChatRoomPostMessage() {
            this.super();
        }
    },
    handleAction: {
        value: function() {
            var ms = this.templateObjects.message.value;
            this.parentComponent.chatService.sendMessage(ms);
            this.templateObjects.message.element.value = '';
            this.templateObjects.message.element.focus();
            //console.log("Fallback action handler invoked as there is no specific handler for this button");
        }
    }
});
