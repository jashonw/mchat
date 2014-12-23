/**
 * @module ui/chat-room-message-list.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ChatRoomMessageList
 * @extends Component
 */
exports.ChatRoomMessageList = Component.specialize(/** @lends ChatRoomMessageList# */ {
    constructor: {
        value: function ChatRoomMessageList() {
            this.super();

        }
    },
    _data:{value:false},
    data:{
        set:function(v){
            this._data = v;
        },
        get:function(){
            return this._data;
        }
    },
    templateDidLoad:{
        value:function(){
            var rangeController = this.templateObjects.rangeController;
            rangeController.content = this.data;
        }
    }
});
