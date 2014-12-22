/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var ChatService=require("../../core/chat-service").ChatService;
/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() {
            this.super();
        }
    },
    enterDocument:{
        value:function(isFirsttime){
            if (isFirsttime)
            {
                var chatcli=new ChatService();
                chatcli.userJid="kkk";
                chatcli.roomID="TestRoom";
                chatcli.connect(function(stat){

                });
                setTimeout(function(){
                    chatcli.createRoom(function(){

                    },function(){

                    });
                    setInterval(function(){
                        chatcli.sendMessage("KDJFKDJFKDFJDKFDJFD");
                        //chatcli.queryOccupants();
                    },10000);
                },5000);
            }
        }
    }

});
