angular.module('starter.controllers', [])

  .controller('LoginCtrl', function ($scope, $state, Chats) {
    var vm = this;
    vm.username = '';
    vm.login = login;
    var ionicIoAppKey = 'a5fa8ce8';

    var savedUser = null;

    function login() {

      if (vm.username) {
        InitializeUser(vm.username);
      }
    }

    function InitializeUser(username) {
      Ionic.io();
      Ionic.User.load(username).then(successUserLoad, failureToLoadUser);
    }

    function successUserLoad(loadedUser) {
      console.log('successfuly user loaded');
      
      Ionic.User.current(loadedUser);
      savedUser = Ionic.User.current();
      
      if (!!savedUser.id) {
        successUserInitialize();
      }
    }

    function failureToLoadUser() {
      console.log('failure in user loading');
      //If user not saved in cloud, create one and save
      //TODO: is there a way to clear registered user from localstorage? Something like Ionic.User.Clear() ?
      
      clearCurrentUser();

      savedUser = Ionic.User.current();
      savedUser.id = vm.username;
      savedUser.save().then(successUserInitialize, failedUserSave);
    }

    function successUserInitialize() {
      alert('Current saved user: ' + savedUser);
      if (!!savedUser) {
        InitializePushNotifications(savedUser);
        $state.go('tab.message');
      }
    }

    function InitializePushNotifications(user) {
      var push = new Ionic.Push({
        "debug": true,
        "onNotification": function (notification) {
          var payload = notification.payload;
          console.log('onNotification: ' + notification.title + '\n' + notification.text + '\n\nPayload: ' + payload);
          alert('onNotification: ' + notification.title + '\n' + notification.text + '\n\nPayload: ' + payload);
        },
        "onRegister": function (data) {
          console.log('onRegister token: \n' + data.token);
          alert('onRegister token: \n' + data.token);
          user.addPushToken(data);
          user.save().then(successUserSave, failedUserSave);
        },
        "pluginConfig": {
          "ios": {
            "badge": true,
            "sound": true
          },
          "android": {
            "iconColor": "#343434"
          }
        }
      });

      push.register();
    }

    function successUserSave() {
      console.log('Successfully saved the user.');
    }

    function failedUserSave(err) {
      alert('Something went wrong saving the user.');
    }

    function clearCurrentUser() {
      localStorage.removeItem('ionic_io_push_token');
      localStorage.removeItem('ionic_io_user_' + ionicIoAppKey);
    }

  })

  .controller('MessageCtrl', function ($scope, $http) {
    var vm = this;
    vm.sendTo = '';
    vm.content = '';
    vm.send = send;

    var secretKey_encrypted = 'MzllNmYxOWE0ZmY3NmFkMDY5OTJhZTVkZjhhMGE1MTVhZWMyZDlhMWFhMDM3OWY2Og';

    function send() {

      var req = {
        method: 'POST',
        url: 'https://push.ionic.io/api/v1/push',
        headers: {
          'Content-Type': 'application/json',
          'X-Ionic-Application-Id': 'a5fa8ce8',
          'Authorization': ('Basic ' + secretKey_encrypted)
        },
        data: {
          "user_ids": [vm.sendTo],
          "notification": {
            "alert": vm.content,
            "ios": {
              "badge": 1,
              "sound": "ping.aiff",
              "expiry": 1423238641,
              "priority": 10,
              "contentAvailable": true,
              "payload": {
                "sendTo": vm.sendTo,
                "key": 143
              }
            },
            "android": {
              "collapseKey": "foo",
              "delayWhileIdle": true,
              "timeToLive": 300,
              "payload": {
                "sendTo": vm.sendTo
              }
            }
          }
        }
      }

      $http(req).then(function () {
        alert('Successfully Sent the request to ' + vm.sendTo);
      }, function () {
        alert('Request failed to ' + vm.sendTo);
      });
    }
  });
