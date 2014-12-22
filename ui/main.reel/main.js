/**
 * @module ui/main.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var chatService=require("../../core/chatservice").chatService;
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
                //var chatcli=new chatService();
                //chatcli.userJID="kkk";
                //chatcli.roomID="TestRoom";
                //chatcli.connect();
                //setTimeout(function(){
                //    chatcli.createRoom();
                //    setInterval(function(){
                //        chatcli.sendMessage("KDJFKDJFKDFJDKFDJFD");
                //        //chatcli.queryOccupants();
                //    },10000);
                //},5000);
            }
        }
    }

});
