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
            this.addRangeAtPathChangeListener( "this.data", this, "handleDataChange" );
        }
    },

    handleDataChange:{
        value:function(){
            var self = this;
            //Need set scroll to bottom after ui change, but how should we know UI change is done?
            //Or I think we should do this in the draw cycle too. Have a attribute to set the scrollTop and really set it to UI when draw.
            setTimeout(function(){
                self.templateObjects.list.element.scrollTop = 100000;
            },500);

        }
    }
});
