angular.module('ioto', [
  'ionic',
  'ngRoute'
]);

angular.module('ioto').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/dashboard/:id', {
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
                'campaignId': [ '$route',
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
            ]}
        })
        .when('/', {
          templateUrl: 'views/home.html',
          controller: 'homeController',
          activetab: 'home'
        })
	}
]);

angular.module('ioto').factory('iotoFactory',
  function() {

  }
);

angular.module('ioto').controller('indexController', ['$scope', '$timeout',
  function ($scope, $timeout) {
      /* Initialize Digits for Web using your application's consumer key that Fabric generated */
      Digits.init({ consumerKey: 'WCrqxqemf1XkOhHx1JhRzaTcV' })
        .done(function(res) {
          console.log('digits initialized', res);
        })
        .fail(function(err) {
          console.log('digits failed', err);
        });

        // Init Parse db
        Parse.$ = jQuery;
        Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");

        $scope.bgBlack = false;
	}
]);

angular.module('ioto').controller('homeController', ['$scope', '$timeout', '$location',
    function ($scope, $timeout, $location) {
        $scope.$parent.bgBlack = true;

        /* Launch the Login to Digits flow. */
        $scope.login = function () {
            Digits.logIn()
            .done(function (loginResponse) {
                /*handle the response*/
                var oAuthHeaders = parseOAuthHeaders(loginResponse.oauth_echo_headers);
                console.log(loginResponse);
                //setDigitsButton('Signing In…');
                $.ajax({
                    type: 'POST',
                    url: '/digits',
                    data: oAuthHeaders,
                    success: function (res) {
                        //console.log(res);
                        getUserByTwitterId(res);
                    }
                });
            })
            .fail(function () {
                /*handle the error*/
            });
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

        function getUserByTwitterId(twitterUser) {
          console.log(twitterUser.userID);
          var records = Parse.Object.extend("users");
          var query = new Parse.Query(records);
          query.equalTo('twitterId', twitterUser.userID)
            .find({
              success: function(user) {
                console.log(user.length);
                if (user.length) {
                  // user found, log in
                  console.log('user found, redirect', user[0]);
                  $timeout(function() {
                    $location.path('/dashboard/' + user[0].id);
                  });
                } else {
                  // user not in db, create record
                  addTwitterUser(twitterUser);
                }
            },
            error: function(object, error) {
              console.log(object, error);
            }
          });
        }

        function addTwitterUser(twitterUser) {
          var userInfo = Parse.Object.extend("users");
          var user = new userInfo();

          console.log(twitterUser);
          user.set("twitterId", twitterUser.userID);
          user.set("phoneNumber", twitterUser.phoneNumber);

          user.save(null, {
            success: function(res) {
              console.log('save success');
              $timeout(function() {
                $location.path('/dashboard/' + res.id);
              });
            },
            error: function(project, error) {
              console.log(error.message);
              $timeout(function() {
                $location.path('/');
              });
            }
          });
        }
    }

]);

angular.module('ioto').controller('dashboardController', ['$scope', '$timeout', 'userId', '$location',
  function($scope, $timeout, userId, $location) {
    $scope.$parent.bgBlack = true;
    $scope.user = null;
    $scope.campaigns = [];
    Digits.getLoginStatus()
    .done(function (res) {
      console.log(res);
      if (res.status != 'authorized') {
        $timeout(function() {
          $location.path('/');
        });
      } else {
        /*handle the response*/
        var oAuthHeaders = parseOAuthHeaders(res.oauth_echo_headers);
        //setDigitsButton('Signing In…');
        console.log(res, oAuthHeaders);
        $.ajax({
            type: 'POST',
            url: '/digits',
            data: oAuthHeaders,
            success: function (res) {
                console.log(res);
                getUserByTwitterId(res);
            }
        });
      }
    });
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

        function getUserByTwitterId(twitterUser) {
          console.log(twitterUser.userID);
          var records = Parse.Object.extend("users");
          var query = new Parse.Query(records);
          query.equalTo('twitterId', twitterUser.userID)
            .find({
              success: function(user) {
                console.log(user.length);
                if (user.length) {

                  $timeout(function() {
                    $scope.user = user;
                    console.log($scope.user);
                  });
                } else {
                  // user not in db, create record
                  $location.path('/');
                }
            },
            error: function(object, error) {
              console.log(object, error);
            }
          });
        }


    var campaignInfo = Parse.Object.extend("ProjectPage");
    var campaigns = new Parse.Query(campaignInfo);

    campaigns.equalTo('userId', userId).find({
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

    Digits.getLoginStatus()
    .done(function (res) {
      console.log(res);
      if (res.status != 'authorized') {
        $timeout(function() {
          $location.path('/');
        });
      } else {
        /*handle the response*/
        var oAuthHeaders = parseOAuthHeaders(res.oauth_echo_headers);
        //setDigitsButton('Signing In…');
        $.ajax({
            type: 'POST',
            url: '/digits',
            data: oAuthHeaders,
            success: function (res) {
                //console.log(res);
                getUserByTwitterId(res);
            }
        });
      }
    });

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

        function getUserByTwitterId(twitterUser) {
          console.log(twitterUser.userID);
          var records = Parse.Object.extend("users");
          var query = new Parse.Query(records);
          query.equalTo('twitterId', twitterUser.userID)
            .find({
              success: function(user) {
                console.log(user.length);
                if (user.length) {

                  $timeout(function() {
                    $scope.user = user;
                    console.log($scope.user[0]);
                  });
                } else {
                  // user not in db, create record
                  $location.path('/');
                }
            },
            error: function(object, error) {
              console.log(object, error);
            }
          });
        }


        var ProjectInfo = Parse.Object.extend("ProjectPage");
        var project = new ProjectInfo();


        //	project.set("Tag", );
        $scope.submit = function() {
					var Title = document.getElementById("Title").value;
          var Name = document.getElementById("name").value;
          var theDate = document.getElementById("date").value;
          var description = document.getElementById("description").value;
          var Where = document.getElementById("place").value;
          var Money = parseInt(document.getElementById("money").value);

          project.set("title", Title);
          project.set("description", description);
          project.set("when", theDate);
          project.set("where", Where);
          project.set("contact", Name);
          project.set("moneyNeeded", Money);
          project.set("userId", $scope.user[0].id);
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
        var query = new Parse.Query(CampaignInfo);
        query.get(campaignId.id, {
          success: function(campaign) {
            $timeout(function() {
              $scope.campaign = {
                title: campaign.get("title"),
                description: campaign.get("description"),
                time: campaign.get("when"),
                place: campaign.get("where"),
                host: campaign.get("contact"),
                money: campaign.get("moneyNeeded"),
                tag: campaign.get("tag")
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
            },
            {
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
        var query = new Parse.Query(CampaignInfo);
        query.find({
          success: function(campaigns) {
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
