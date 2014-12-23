/**
 * Created by Jashon on 2014/12/19.
 */
var Montage = require("montage").Montage;
var X2JS = require("core/xml2json.min").X2JS;
require("core/strophe");

var log = function (data) {
    console.log(data);
}

exports.ChatService = Montage.specialize({
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
        value: 'http://115.28.165.154:7070/http-bind/'
    },

    connection: {
        value: null
    },

    userJid: {
        value: null
    },

    roomID: {
        value: null
    },

    roomSuffix: {
        value: "room.jw"
    },

    messageFrom: {
        value: null
    },

    messageTo: {
        value: null
    },

    messageContent: {
        value: null
    },

    userList: {
        value: []
    },

    joinRoomFlag: {
        value: false
    },

    joinRoomFailFunction: {
        value: null
    },

    joinRoomSuccessFunction: {
        value: null
    },

    xml2json: {
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
                self.messageFrom = from;
                self.messageTo = to;
                self.messageContent = text;
                log("========From:" + from + ":    " + text);
                return true;
            }, null, "message");
            connection.addHandler(function (preXML) {
                debugger
                if (!self.xml2json) {
                    self.xml2json = new X2JS();
                }
                var jsonstr = self.xml2json.xml2json(preXML);
                if (jsonstr._type != "error") {
                    if (self.joinRoomFlag) self.joinRoomFlag = false;
                    self.addOrRemoveUser(preXML);
                }
                else if (self.joinRoomFlag && jsonstr._type == "error") {
                    self.joinRoomFlag = false;
                    debugger
                    var errmsg = "Same user name in the room already. Please try again later.";
                    self.joinRoomFailFunction(errmsg);
                    self.joinRoomFailFunction = null;
                }
                return true;
            }, null, "presence");
            connection.muc.init(connection);
        }
    },

    connectionStatus: {
        value: null
    },

    connect: {
        value: function (onconnect) {
            var self = this;
            connection.connect(this.userJid, "welcome", function (status) {
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
                if (onconnect)
                    onconnect(status);
            });
        }
    },

    addOrRemoveUser: {
        value: function (preXML) {
            var self = this;
            if (!self.xml2json) {
                self.xml2json = new X2JS();
            }
            var jsonstr = self.xml2json.xml2json(preXML);
            var username = Strophe.getResourceFromJid(jsonstr._from);
            if (jsonstr._type == "unavailable") {
                for (var i = 0, len = self.userList.length; i < len; i++) {
                    if (self.userList[i] == username) {
                        self.userList.splice(i, 1);
                        break;
                    }
                }
            }
            else {
                //self.userList.push(username);
                var found = false;
                for (var i = 0, len = self.userList.length; i < len; i++) {
                    if (self.userList[i] == username) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    self.userList.push(username);
                }
            }
        }
    },

    joinRoom: {
        value: function (room, nick, rosterfn) {
            var self = this;
            connection.muc.join(room, nick, function (msg, opt) {
                debugger
            }, function (data, pre) {
                self.addOrRemoveUser(data);
                debugger
                if (self.joinRoomSuccessFunction)
                    self.joinRoomSuccessFunction();
                //log("Joined " + room + " successfully.");
            }, rosterfn, "welcome", null);
        }
    },

    leaveRoom: {
        value: function (room, nick) {
            connection.muc.leave(room, nick, null, null);
        }
    },

    createRoom: {
        value: function (successfn, failfn) {
            var self = this;
            if (self.connectionStatus != Strophe.Status.CONNECTED) {
                self.connect();
                return;
            }

            var roominfo = self.roomID + "@" + self.roomSuffix;
            var d = $pres({
                "from": self.userJid,
                "to": roominfo + "/" + self.userJid.replace('@', '_')
            }).c("x", {"xmlns": "http://jabber.org/protocol/muc"});

            connection.send(d.tree());
            self.joinRoomFlag = true;
            self.joinRoomSuccessFunction = successfn;
            self.joinRoomFailFunction = failfn;
            var roomrel = connection.muc.createInstantRoom(roominfo, function () {
                log("Create " + roominfo + " successfully.");
                if (successfn) {
                    self.joinRoomSuccessFunction = null;
                    successfn();
                }
                self.joinRoomFlag = false;
            }, function (err) {
                log("Create chat room failed. Err:" + err);
                debugger
                self.joinRoomFlag = true;
                //self.leaveRoom(roominfo,self.userJid);
                setTimeout(function () {
                    self.joinRoom(roominfo, self.userJid.replace('@', '_'), function (data, opt) {
                        debugger
                        //log("Join " + roominfo + " room successfully.");
                    });
                }, 1000);
            });
            log("After create room, return :" + roomrel);
        }
    },

    queryOccupants: {
        value: function () {
            var self = this;
            if (connection) {
                var roominfo = self.roomID + "@" + self.roomSuffix;
                connection.muc.queryOccupants(roominfo, function (data) {
                    debugger
                }, function (err) {
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