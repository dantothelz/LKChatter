app = angular.module("LKChat", ['angularLocalStorage']);

//http://stackoverflow.com/questions/3313875/javascript-date-ensure-getminutes-gethours-getseconds-puts-0-in-front-i
function pad(n) { return ("0" + n).slice(-2); }
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
}

app.controller('ChatClient', function ($scope, storage) {
  var t = new Date();
  $scope.chatLog = "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Now entering chatroom...\n";

  $scope.appendMessage = function (msg, apply) {
    $scope.chatLog += "[" + msg.time + "] <" + msg.nick + "> " + msg.text + "\n";
    if ( (typeof apply != 'undefiled') && (apply == 'true') ) {
      $scope.$apply();
    }
    var chatLog = document.getElementById("chatLog");
    var buffer = chatLog.getElementsByTagName('div')[0];
    buffer.scrollTop = buffer.scrollHeight;
  }

  storage.bind($scope, 'chatHandle');

  var conn = new WebSocket('ws://www.duleone.com:8888');


  var connHandler = {
    onopen: function(e) {
      console.log("Connection established!");
    }, 
    onmessage: function(e) {
      text = e.data;
      console.log(text);
      try {
        var msg = JSON.parse(text);
        $scope.appendMessage(msg, 'true');
      } catch (err) {
        console.log("Invalid message received! " + text);
        console.log("Error! " + err);
        // Invalid Message.
      }
    },
    onclose: function(e) {
      console.log("Connection lost!");
      conn = new WebSocket('ws://www.duleone.com:8888');
      conn.onopen = this.onopen;
      conn.onmessage = this.onmessage;
      conn.onclose = this.onclose;
    }
  };




  
  conn.onopen = function(e) {
    connHandler.onopen(e);
  };

  conn.onmessage = function(e) {
    connHandler.onmessage(e);
  };

  conn.onclose = function(e) {
    connHandler.onclose(e);
  }


  var MsgPacket = function () {
    var t = new Date();
    return {
      "nick": $scope.chatHandle,
      "time": t.getHours().pad(2) + ":" + t.getMinutes().pad(2),
      "text": $scope.chatMsg
    };
  }


  $scope.sendMessage = function () {
    msg = new MsgPacket();

    console.log('send message: ' + $scope.chatMsg);
    $scope.chatMsg = "";
    $scope.appendMessage(msg);
    conn.send(JSON.stringify(msg));
  }
});