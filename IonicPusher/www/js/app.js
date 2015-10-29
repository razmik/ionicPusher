// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'starter.controllers', 'starter.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

      InitializePlugins();
      var user = InitializeUser('user_1');
      InitializePushNotifications(user);

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

      function InitializePlugins() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
      }

      function InitializeUser(username) {
        Ionic.io();
        var user = Ionic.User.current();
        if (!user.id) {
          //user.id = Ionic.User.anonymousId();
          user.id = username;
          user.save().then(successUserSave, failedUserSave);
        }
        return user;
      }
      
      function successUserSave(){
        alert('Successfully saved the user.');
      }

      function failedUserSave(){
        alert('Something went wrong saving the user.');
      }
      
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as vm'
      })

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })

      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-chats': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      .state('tab.message', {
        url: '/message',
        views: {
          'tab-message': {
            templateUrl: 'templates/tab-message.html',
            controller: 'MessageCtrl as vm'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
