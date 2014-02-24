<!doctype html>
<html ng-app='LKChat'>
  <head>
    <script src="bower_components/angular/angular.js"></script>
    <script src="js/LKChat.js"></script>
    <style type='text/css'>
      #chatlog textarea{
        width: 80%;
        height: 400px;
      }
    </style>
  </head>
  <body>
    <div id='chatclient' ng-controller='ChatClient'>
      <div id='chatHanleDiv'><label for='chatHandle'>Your Name:</label><input id='chatHandle' type='text' ng-model='chatHandle' /></div>
      <div id='chatlog'><textarea ng-model='chatLog'></textarea></div>
      <div id='chatinput'>
        <input type='text' ng-model='chatMsg' />
        <button ng-click='sendMessage()'>Send</button>
      </div>
    </div>
  </body>
</html>