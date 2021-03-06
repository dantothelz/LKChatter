<!doctype html>
<html ng-app='LKChat'>
  <head>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="bower_components/angularLocalStorage/src/angularLocalStorage.js"></script>
    <script src="js/LKChat.js"></script>
    <style type='text/css'>
      html {
        width: 480px;
      }
      body {
        width: 100%;
        font-family: sans-serif;
      }
      #chatlog textarea{
        width: 480px;
        margin: 0px;
        padding: 0px;
        height: 400px;
      }
      #chatinput input{
        width: 400px;
        padding-right: 10px;
        margin: 0px;
      }
      #chatinput button{
        padding-left: 10px;
        margin: 0px;
        width: 60px;
      }
    </style>
  </head>
  <body>
    <div id='chatclient' ng-controller='ChatClient'>
      <div id='chatHanleDiv'><label for='chatHandle'>Your Name:</label><input id='chatHandle' type='text' ng-model='chatHandle' /></div>
      <div id='chatlog'><textarea ng-model='chatLog'></textarea></div>
      <div id='chatinput'>
        <form>
          <input type='text' ng-model='chatMsg' />
          <button ng-click='sendMessage()'>Send</button>
        </form>
      </div>
    </div>
  </body>
</html>