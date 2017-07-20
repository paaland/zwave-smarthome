/**
 * @overview  The controller that renders and handles notifications.
 * @author Martin Vach
 */
/**
 * The controller that renders  notifications list.
 * @class ManagementNotificationController
 */
myAppController.controller('ManagementNotificationController', function ($scope, $route, dataFactory, dataService) {
    $scope.managementNotification = {
        input: {},
        emails: ['info@email.com', 'name.lastname@email.com', 'hello@email.com'],
        pushes: ['1. Mobile device', '2. Mobile device', '3. Mobile device'],
        all: [
            {
                id: 1,
                name: 'Conto 1',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            },
            {
                id: 2,
                name: 'Conto 2',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            },
            {
                id: 3,
                name: 'Conto 3',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            }
        ]
    };
    $scope.masterModel = angular.copy($scope.managementNotification.input);

    /*$scope.managementNotification = {
     input:{
     type: '',
     name: '',
     email: '',
     push: ''
     }
     };*/


    /**
     * Change type
     */
    $scope.changeType = function () {
        if (!$scope.managementNotification.input.type) {
            $scope.resetNotification();
        } else {
            angular.copy({type: $scope.managementNotification.input.type}, $scope.managementNotification.input);
        }

    };

    /**
     * Add new email
     */
    $scope.addEmail = function () {
        var email = $scope.managementNotification.input.email_add;
        console.log(email)
        if ($scope.managementNotification.emails.indexOf(email) === -1) {
            $scope.managementNotification.emails.push(email);
        }

        $scope.managementNotification.input.contact = email;
        $scope.managementNotification.input.email_add = '';
        //$route.reload();

    };

    /**
     * Reset notification
     */
    $scope.resetNotification = function () {
        angular.copy($scope.masterModel, $scope.managementNotification.input);
    };

    /**
     * Create notification
     */
    $scope.createNotification = function () {
        console.log($scope.managementNotification)
    };

});

/**
 * The controller that renders and handles notification.
 * @class ManagementNotificationIdController
 */
myAppController.controller('ManagementNotificationIdController', function ($scope, $routeParams, $filter,dataFactory, dataService) {
    $scope.managementNotification = {
        input: {},
        emails: ['info@email.com', 'name.lastname@email.com', 'hello@email.com'],
        pushes: ['1. Mobile device', '2. Mobile device', '3. Mobile device'],
        all: [
            {
                id: 1,
                name: 'Conto 1',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            },
            {
                id: 2,
                name: 'Conto 2',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            },
            {
                id: 3,
                name: 'Conto 3',
                email: ['info@email.com', '2info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '2. Mobile device', '3. Mobile device']
            }
        ]
    };
    $scope.masterModel = angular.copy($scope.managementNotification.input);


    /**
     * Load notification
     */
    $scope.loadNotificaion = function () {
        $scope.managementNotification.input = _.findWhere($scope.managementNotification.all,{id:$filter('toInt')($routeParams.id)});
        console.log($scope.managementNotification.input)

    };
    $scope.loadNotificaion();


    /**
     * Change type
     */
    $scope.changeType = function () {
        if (!$scope.managementNotification.input.type) {
            $scope.resetNotification();
        } else {
            angular.copy({type: $scope.managementNotification.input.type}, $scope.managementNotification.input);
        }

    };

    /**
     * Add new email
     */
    $scope.addEmail = function () {
        var email = $scope.managementNotification.input.email_add;
        console.log(email)
        if ($scope.managementNotification.emails.indexOf(email) === -1) {
            $scope.managementNotification.emails.push(email);
        }

        $scope.managementNotification.input.contact = email;
        $scope.managementNotification.input.email_add = '';
        //$route.reload();

    };

    /**
     * Reset notification
     */
    $scope.resetNotification = function () {
        angular.copy($scope.masterModel, $scope.managementNotification.input);
    };

    /**
     * Create notification
     */
    $scope.createNotification = function () {
        console.log($scope.managementNotification)
    };

});
