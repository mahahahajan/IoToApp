angular.module('ioto', [
  'ionic',
  'ngRoute'
]);

angular.module('ioto').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/dashboard/', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardController',
        activetab: 'dashboard',
        resolve: {
          'userId': ['$route',
            function($route) {
              return $route.current.params.id;
              // return userFactory.getUser($route.current.params.id)
              // .then(function(res){
              //     return res.data;
              // })
              // .catch(function(error){
              //     return null;
              // });
            }
          ]
        }
      })
      .when('/create-campaign', {
        templateUrl: 'views/createCampaign.html',
        controller: 'createCampaignController',
        activetab: 'dashboard'
      })
      .when('/campaigns', {
        templateUrl: 'views/campaigns.html',
        controller: 'campaignsController',
        activetab: 'home'
      })
      .when('/campaign/:id', {
        templateUrl: 'views/campaign.html',
        controller: 'campaignController',
        activetab: 'dashboard',
        resolve: {
          'campaignId': ['$route',
            function($route) {
              return {
                id: $route.current.params.id
              };
              // return campaignFactory.getCampaign($route.current.params.id)
              // .then(function(res){
              //     return res.data;
              // })
              // .catch(function(error){
              //     return null;
              // });
            }
          ]
        }
      })
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeController',
        activetab: 'home'
      })
      .when('/userType', {
        templateUrl: 'views/userType.html',
        controller: 'homeController',
        activetab: 'home'
      })
      .when('/dashboardUser', {
        templateUrl: 'views/dashboardUser.html',
        controller: 'dashboardController',
        activetab: 'dashboard'
      })
  }
]);

angular.module('ioto').factory('iotoFactory',
  function() {
    $(".dropdown-button").dropdown();
  }
);

angular.module('ioto').controller('indexController', ['$scope', '$timeout',
  function($scope, $timeout) {
    /* Initialize Digits for Web using your application's consumer key that Fabric generated */
    Digits.init({
        consumerKey: 'WCrqxqemf1XkOhHx1JhRzaTcV'
      })
      .done(function(res) {
        console.log('digits initialized', res);
      })
      .fail(function(err) {
        console.log('digits failed', err);
      });

    // Init Parse db
    Parse.$ = jQuery;
    Parse.initialize("HMYywLrkuiRvB5DbqdgCE2Fp3xgw9sglabed4uoG", "IpDyUAqrdNqGWEmyFJQGyfYWm5pJh1ord0vNyV7f");

    $scope.bgBlack = false;
  }
]);

angular.module('ioto').controller('homeController', ['$scope', '$timeout', '$location',
      function($scope, $timeout, $location) {
        $scope.$parent.bgBlack = true;

        /* Launch the Login to Digits flow. */
        $scope.login = function() {
          $location.path('/userType/');
        }
        $scope.loginToDash = function() {
          $location.path('/dashboard/');
        }

        /**
         * Parse OAuth Echo Headers:
         * 'X-Verify-Credentials-Authorization'
         * 'X-Auth-Service-Provider'
         */
        function parseOAuthHeaders(oAuthEchoHeaders) {
          var credentials = oAuthEchoHeaders['X-Verify-Credentials-Authorization'];
          var apiUrl = oAuthEchoHeaders['X-Auth-Service-Provider'];

          return {
            apiUrl: apiUrl,
            credentials: credentials
          };
        }
      }

      ]);

    angular.module('ioto').controller('dashboardController', ['$scope', '$timeout', '$location',
      function($scope, $timeout, userId, $location) {
        $scope.$parent.bgBlack = true;
        $scope.user = null;
        $scope.campaigns = [];
        /**
         * Parse OAuth Echo Headers:
         * 'X-Verify-Credentials-Authorization'
         * 'X-Auth-Service-Provider'
         */
        function parseOAuthHeaders(oAuthEchoHeaders) {
          var credentials = oAuthEchoHeaders['oauth_echo_header'];
          var apiUrl = oAuthEchoHeaders['oauth_echo_service'];

          return {
            apiUrl: apiUrl,
            credentials: credentials
          };
        }


        var campaignInfo = Parse.Object.extend("ProjectPage");
        var campaigns = new Parse.Query("ProjectPage");

        campaigns.find({
          success: function(campaigns) {
            console.log(campaigns);
            $timeout(function() {
              $scope.campaigns = campaigns;
            });

          },
          error: function(object, error) {
            console.log(object, error);

          }
        });
      }
    ]);


    angular.module('ioto').controller('createCampaignController', ['$scope', '$location', '$timeout',
      function($scope, $location, $timeout) {
        $scope.$parent.bgBlack = false;
        $scope.mode = 'money';


        /**
         * Parse OAuth Echo Headers:
         * 'X-Verify-Credentials-Authorization'
         * 'X-Auth-Service-Provider'
         */
        function parseOAuthHeaders(oAuthEchoHeaders) {
          var credentials = oAuthEchoHeaders['oauth_echo_header'];
          var apiUrl = oAuthEchoHeaders['oauth_echo_service'];

          return {
            apiUrl: apiUrl,
            credentials: credentials
          };
        }
        $scope.setMode = function (mode) {
          $scope.mode = mode;
        }

        var ProjectInfo = Parse.Object.extend("ProjectPage");
        var project = new ProjectInfo();


        //	project.set("Tag", );
        $scope.submit = function(mode) {

          if(mode == 'money'){
            var Title = document.getElementById("Title").value;
            var Money = parseInt(document.getElementById("amount").value);
            var theDate = document.getElementById("date").value;
            var howToMove = document.getElementById("transport").value;
            var who = document.getElementById("name").value;


            project.set("title", Title);
            project.set("amount", Money);
            project.set("when", theDate);
            project.set("where", howToMove);
            project.set("contact", who);

            project.set("userId", "Shelter");
          }
          if(mode == 'food'){
            var Title = document.getElementById("Title").value;
            var Place = document.getElementById("place").value;
            var Name = document.getElementById("name").value;
            var When = document.getElementById("date").value;
            var Describe = document.getElementById("description").value;

            project.set("title", Title);
            project.set("where", Place);
            project.set("host", Name)
            project.set("when", When);
            project.set("description", Describe);
            project.set("userId", "Shelter");

          }
          if(mode == 'clothes'){
            var Title = document.getElementById("Title").value;
            var Place = document.getElementById("place").value;
            var Name = document.getElementById("name").value;
            var When = document.getElementById("date").value;
            var Describe = document.getElementById("description").value;

            project.set("title", Title);
            project.set("where", Place);
            project.set("host", Name)
            project.set("when", When);
            project.set("description", Describe);
            project.set("userId", "Shelter");

          }




          project.save(null, {
            success: function(project) {
              // Execute any logic that should take place after the object is saved.
              //alert('New object created with objectId: ' + project.id);
              $location.path('/campaign/' + project.id);
            },
            error: function(project, error) {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              console.log('Failed to create new object, with error code: ' + error.message);
            }

          });
        }
      }
    ]);

    angular.module('ioto').controller('campaignController', ['$scope', '$timeout', 'campaignId',
      function($scope, $timeout, campaignId) {
        console.log(campaignId);
        $scope.campaign = {

        };
        // Parse.$ = jQuery;

        // Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");
        var CampaignInfo = Parse.Object.extend("ProjectPage");
        var query = new Parse.Query("ProjectPage");
        query.get(campaignId.id, {
          success: function(campaign) {
            $timeout(function() {

              $scope.campaign = {
                title: campaign.get("title"),
                description: campaign.get("description"),
                time: campaign.get("when"),
                place: campaign.get("where"),
                host: campaign.get("host"),
              }

            });
          },
          error: function(object, error) {
            console.log(object, error);
          }
        });


        SimplifyCommerce.hostedPayments(
          function(response) {
            // response handler
          }, {
            color: "#12B830"
          }
        );

      }

    ]);

    angular.module('ioto').controller('campaignsController', ['$scope', '$timeout',
      function($scope, $timeout) {

        $scope.campaigns = [];
        // Parse.$ = jQuery;

        // Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");
        var CampaignInfo = Parse.Object.extend("ProjectPage");
        var query = new Parse.Query("ProjectPage");
        query.find({
          success: function(objectId) {
            $timeout(function() {
              $scope.campaigns = campaigns;

              console.log($scope.campaigns);

            });
          },
          error: function(object, error) {
            console.log(object, error);
          }
        });

      }
    ]);
