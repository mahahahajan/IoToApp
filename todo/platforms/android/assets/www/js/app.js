angular.module('ioto', [
	'ionic',
    'ngRoute'
]);

angular.module('ioto').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/dashboard/:id', {
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController',
            activetab: 'dashboard',
            resolve: {
                'user': [ '$route',
                function($route) {
                    return {
                        id: $route.current.params.id
                    };
                    // return userFactory.getUser($route.current.params.id)
                    // .then(function(res){
                    //     return res.data;
                    // })
                    // .catch(function(error){
                    //     return null;
                    // });
                }
            ]}
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
	function () {

	}
);

angular.module('ioto').controller('indexController', ['$scope', '$timeout', '$ionicModal', '$ionicSideMenuDelegate',
	function ($scope, $timeout, $ionicModal, $ionicSideMenuDelegate) {
        /* Initialize Digits for Web using your application's consumer key that Fabric generated */
            Digits.init({ consumerKey: 'QySjPEFPolsnBA00M4aIpOi27' });
	}
]);

angular.module('ioto').controller('homeController', ['$scope',
    function ($scope) {
        /* Launch the Login to Digits flow. */

				$scope.login = function () {
        Digits.logIn()
            .done(function () {
                /*handle the response*/
            })
            .fail(function () {
                /*handle the error*/
            });
        }
    }
]);

angular.module('ioto').controller('dashboardController', ['$scope',
    function ($scope) {

    }
]);

angular.module('ioto').controller('createCampaignController', ['$scope',
    function ($scope) {
			Parse.$ = jQuery;

			Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");
			var ProjectInfo = Parse.Object.extend("ProjectPage");
		  var project = new ProjectInfo();

			//TODO: Set up form and do project.set("Stuff")

			project.save(null, {
				success: function(project) {
					// Execute any logic that should take place after the object is saved.
					console.log('New object created with objectId: ' + project.id);
				},
				error: function(project, error) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and message.
					console.log('Failed to create new object, with error code: ' + error.message);
				}

			});
    }
]);

angular.module('ioto').controller('campaignController', ['$scope', '$timeout', 'campaignId',
    function ($scope, $timeout, campaignId) {
			console.log(campaignId);
			$scope.campaign = {

			};
			Parse.$ = jQuery;

			Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");
			var CampaignInfo = Parse.Object.extend("ProjectPage");
			var query = new Parse.Query(CampaignInfo);
			query.get(campaignId.id, {
				success: function(campaign) {
					$timeout(function() {
						$scope.campaign = {
							title: campaign.get("Title"),
							description: campaign.get("Description"),
							time: campaign.get("When"),
							place: campaign.get("Where"),
							host: campaign.get("Contact"),
							money: campaign.get("MoneyNeeded"),
							tag: campaign.get("Tag")
						}

					});
				},
				error: function(object, error) {
					console.log(object, error);
				}
			});
    }

]);

angular.module('ioto').controller('campaignsController', ['$scope', '$timeout',
    function ($scope, $timeout) {

			$scope.campaigns = [];
			Parse.$ = jQuery;

			Parse.initialize("wpvbhNsxxZam6HYa63vmudxBgJrasHXLq7WTxkKH", "WhODpEkC35r18jewjzrpw22KJwxLZJxbGQQcyxST");
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
