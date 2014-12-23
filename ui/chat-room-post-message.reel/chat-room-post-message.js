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
            this._sendMessage(ms);
            //console.log("Fallback action handler invoked as there is no specific handler for this button");
        }
    },

    _sendMessage:{
        value:function(msg){
            if(!msg || msg.length<=0) return;
            this.parentComponent.chatService.sendMessage(msg);
            this.templateObjects.message.element.value = '';
            this.templateObjects.message.element.focus();
        }
    },

    didDraw:{
        value:function(firstTime){
            var message = this.templateObjects.message.element;
            message.addEventListener("keydown", this);
        }
    },

    handleEvent:{
        value:function(event){
            if(event._event.which == 13){
                this._sendMessage(this.templateObjects.message.value);
            }
        }
    }
});
