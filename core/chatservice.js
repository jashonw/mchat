/**
 * Created by Jashon on 2014/12/19.
 */
var Montage = require("montage").Montage;
require("core/strophe");
var log = function (data) {
    console.log(data);
}

exports.chatService = Montage.specialize({
    constructor: {
        value: function () {
            this.init();
        }
    },

    rawInput: {
        value: function (data) {
            log('RECV: ' + data);
        }
    },
    rawOutput: {
        value: function (data) {
            log('SENT: ' + data);
        }
    },
    BOSH_SERVICE: {
        value: 'http://JW:7070/http-bind/'
    },
    connection: {
        value: null
    },
    userJID: {
        value: null
    },
    roomID: {
        value: null
    },
    roomSuffix: {
        value: "room.jw"
    },
    msgFrom: {
        value: null
    },
    msgTo: {
        value: null
    },
    msgContent: {
        value: null
    },
    init: {
        value: function () {
            var self = this;
            connection = new Strophe.Connection(this.BOSH_SERVICE);
            connection.rawInput = this.rawInput;
            connection.rawOutput = this.rawOutput;
            connection.addHandler(function (msgXML) {
                var to = msgXML.getAttribute('to');
                var from = msgXML.getAttribute('from');
                var fromBareJid = Strophe.getBareJidFromJid(from);
                var type = msgXML.getAttribute('type');
                var elems = msgXML.getElementsByTagName('body');
                var text = Strophe.getText(elems[0]);
                self.msgFrom = from;
                self.msgTo = to;
                self.msgContent = text;
                log("========From:" + from + ":    " + text);
                return true;
            }, null, "message");
            connection.muc.init(connection);
        }
    },
    connectionStatus: {
        value: null
    },
    connect: {
        value: function () {
            var self = this;
            connection.connect(this.userJID, "welcome", function (status) {
                self.connectionStatus = status;
                if (status == Strophe.Status.CONNECTING) {
                    log('Strophe is connecting.');
                } else if (status == Strophe.Status.CONNFAIL) {
                    log('Strophe failed to connect.');
                } else if (status == Strophe.Status.DISCONNECTING) {
                    log('Strophe is disconnecting.');
                } else if (status == Strophe.Status.DISCONNECTED) {
                    log('Strophe is disconnected.');
                } else if (status == Strophe.Status.CONNECTED) {
                    log('Strophe is connected.');
                }
            });
        }
    },
    joinRoom: {
        value: function (room, nick, rosterfn) {
            var self = this;
            connection.muc.join(room, nick, function (msg, opt) {
            }, function (data, pre) {
                log("Joined " + room + " successfully.");
            }, rosterfn, "welcome", null);
        }
    },
    leaveRoom:{
       value:function(room,nick){
           connection.muc.leave(room,nick,null,null);
       }
    },
    createRoom: {
        value: function () {
            var self = this;
            if (self.connectionStatus != Strophe.Status.CONNECTED) {
                self.connect();
                return;
            }

            var roominfo = self.roomID + "@" + self.roomSuffix;
            var d = $pres({
                "from": self.userJID,
                "to": roominfo + "/" + self.userJID.replace('@', '_')
            })
                .c("x", {"xmlns": "http://jabber.org/protocol/muc"});

            connection.send(d.tree());

            var roomrel = connection.muc.createInstantRoom(roominfo, function () {
                log("Create " + roominfo + " successfully.");
            }, function (err) {
                log("Create chat room failed. Err:" + err);
                //self.leaveRoom(roominfo,self.userJID);
                setTimeout(function () {
                    self.joinRoom(roominfo, self.userJID.replace('@', '_'), function (data, opt) {
                        log("Join " + roominfo + " room successfully.");
                    });
                }, 1000);

            });
            log("After create room, return :" + roomrel);
        }
    },
    queryOccupants:{
       value:function(){
           var self=this;
           if (connection){
               var roominfo=self.roomID+"@"+self.roomSuffix;
                connection.muc.queryOccupants(roominfo,function(data){
                    debugger
                },function(err){
                    debugger
                });
           }
           else
               log("You didn't connect to server yet.");
       }
    },
    sendMessage: {
        value: function (msg) {
            var self = this;
            if (connection)
                connection.muc.groupchat(self.roomID + "@" + self.roomSuffix, msg, "<p>" + msg + "</p>");
            else
                log("You didn't connect to server yet.");
        }
    }
});