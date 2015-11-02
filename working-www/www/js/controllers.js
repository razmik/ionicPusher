angular.module('starter.controllers', [])

  .controller('LoginCtrl', function ($scope, $state, Chats) {
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.login = login;

    function login() {
      $state.go('tab.dash');
    }
  })

  .controller('DashCtrl', function ($scope) { })

  .controller('ChatsCtrl', function ($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
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
