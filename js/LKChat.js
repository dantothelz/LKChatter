app = angular.module("LKChat", []);

app.controller('ChatClient', function ($scope) {
  $scope.chatLog = "Now entering chatroom...\n";

  $scope.appendMessage = function (msg, apply) {
    $scope.chatLog += "[" + msg.time + "] <" + msg.nick + "> " + msg.text + "\n";
    if ( (typeof apply != 'undefiled') && (apply == 'true') ) {
      $scope.$apply();
    }
    
  }


  var conn = new WebSocket('ws://www.duleone.com:8080');
  conn.onopen = function(e) {
      console.log("Connection established!");
  };

  conn.onmessage = function(e) {
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
  };


  var MsgPacket = function () {
    var t = new Date();
    return {
      "nick": $scope.chatHandle,
      "time": t.getHours() + ":" + t.getMinutes(),
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