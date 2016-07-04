app = angular.module("LKChat", ['angularLocalStorage']);

var SERVER = {
  _address: "www.duleone.com/pridesocket",
  // _port: "443",
  getURI: function () {
    // return "wss://" + this._address + ":" + this._port;
    return "wss://" + this._address;
  }
};


//http://stackoverflow.com/questions/3313875/javascript-date-ensure-getminutes-gethours-getseconds-puts-0-in-front-i
function pad(n) { return ("0" + n).slice(-2); }
Number.prototype.pad = function (len) {
    return (new Array(len+1).join("0") + this).slice(-len);
}

app.controller('ChatClient', function ($scope, storage) {
  var t = new Date();
  $scope.chatLog = "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Connecting to chat server...\n";

  $scope.appendMessage = function (msg, apply) {
    $scope.chatLog += "[" + msg.time + "] <" + msg.nick + "> " + msg.text + "\n";
    if ( (typeof apply != 'undefiled') && (apply == 'true') ) {
      $scope.$apply();
    }

  };

  storage.bind($scope, 'chatHandle');

  var conn = new WebSocket(SERVER.getURI());

  var connHandler = {
    onopen: function(e) {
      console.log("Connection established!");
    },
    onmessage: function(e) {
      text = e.data;
      console.log('INCOMING!');
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
      var t = new Date();
      $scope.chatLog += "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Disconnected from chat server...\n";
      $scope.$apply();
      conn = new WebSocket(SERVER.getURI());
      $scope.chatLog += "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Reconnecting to chat server...\n";
      $scope.$apply();
      var conn_check = setInterval(
        function () {
          console.log("Attempting to reconnect...");
          if (conn.readyState == 1) {
            conn.onopen = this.onopen;
            conn.onmessage = this.onmessage;
            conn.onclose = this.onclose;
            $scope.chatLog += "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Now entering chatroom!\n";
            $scope.$apply();
            console.log("Connection established.");
            clearInterval(conn_check);
          }
        },
        1000
      );
    }
  };

  var conn_check = setInterval(
    function () {
      console.log("Attempting to connect...");
      if (conn.readyState == 1) {
        var t = new Date();
        conn.onopen = connHandler.onopen;
        conn.onmessage = connHandler.onmessage;
        conn.onclose = connHandler.onclose;
        $scope.chatLog += "[" + t.getHours().pad(2) + ":" + t.getMinutes().pad(2) + "] Now entering chatroom!\n";
        $scope.$apply();
        console.log("Connection established.");
        clearInterval(conn_check);
      }
    },
    1000
  );


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


///app.directive('ChatBuffer', function ($scope) {