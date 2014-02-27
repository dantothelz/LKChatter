app = angular.module("LKChat", ['angularLocalStorage']);

var SERVER = {
  _address: "www.duleone.com",
  _port: "8000",
  getURI: function() {
    return "ws://" + this._address + ":" + this._port;
  }
};

//http://stackoverflow.com/questions/3313875/javascript-date-ensure-getminutes-gethours-getseconds-puts-0-in-front-i
function pad(n) {
  return ("0" + n).slice(-2);
}
Number.prototype.pad = function(len) {
  return (new Array(len + 1).join("0") + this).slice(-len);
}



function ChatAppFactory($scope) {

  var appObj = {
    log: function(msg) {
      console.log(msg);
    }
  };

  var getTimeStamp = function() {
    var t = new Date();
    return t.getHours().pad(2) + ":" + t.getMinutes().pad(2);
  };

  appObj.formatBufferEntry = function(msg, handle) {
    if (typeof handle != 'undefined') {
      return "[" + getTimeStamp() + "] <" + handle + "> " + msg + "\n";
    } else {
      return "[" + getTimeStamp() + "] " + msg + "\n";
    }
  };

  appObj.appendBufferEntry = function(entry, handle) {
    if (typeof handle != 'undefined') {
      $scope.chatLog += appObj.formatBufferEntry(entry, handle);
    } else {
      $scope.chatLog += appObj.formatBufferEntry(entry);
    }
  };

  appObj.attachHandlers = function() {
    appObj.conn.onopen = function(e) {
      appObj.log("Connection established!");
    };

    appObj.conn.onmessage = function(e) {
      text = e.data;
      try {
        var msg = JSON.parse(text);
        $scope.$apply(appObj.appendBufferEntry(msg.text, msg.nick));
      } catch (err) {
        // Invalid Message.
        appObj.log("Invalid message received! [" + text + "]");
        appObj.log("Error! " + err);
      }
    };

    appObj.conn.onclose = function(e) {
      appObj.log("Connection lost!");
      $scope.$apply(appObj.appendBufferEntry("Disconnected from chat server!"));
      appObj.createConnection(this);
    };
  };

  appObj.createConnection = function() {
    appObj.conn = new WebSocket(SERVER.getURI());
    appObj.appendBufferEntry("Connecting to chat server...");
    var conn_check = setInterval(
      function() {
        appObj.log("Attempting to connect...");
        if (appObj.conn.readyState == 1) {
          appObj.attachHandlers();
          $scope.$apply(appObj.appendBufferEntry("Now entering chatroom!"));
          appObj.log("Connection established.");
          clearInterval(conn_check);
        }
      },
      1000
    );
  };

  return appObj;
};


app.controller('ChatClient', function($scope, storage) {
  $scope.chatLog = "";
  var ChatApp = ChatAppFactory($scope);

  storage.bind($scope, 'chatHandle');

  ChatApp.createConnection();

  var MsgPacket = function() {
    var t = new Date();
    return {
      "nick": $scope.chatHandle,
      "time": t.getHours().pad(2) + ":" + t.getMinutes().pad(2),
      "text": $scope.chatMsg
    };
  }


  $scope.sendMessage = function() {
    msg = new MsgPacket();

    ChatApp.log('send message: ' + $scope.chatMsg);
    $scope.chatMsg = "";
    ChatApp.appendBufferEntry(msg.text, msg.nick);
    ChatApp.conn.send(JSON.stringify(msg));
  }
});


///app.directive('ChatBuffer', function ($scope) {