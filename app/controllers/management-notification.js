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
        all: [
            {
                id: 1,
                name: 'Conto 1',
                email: ['info@email.com', '2info@email.com'],
                push: ['2. Mobile device', '3. Mobile device']
            },
            {
                id: 2,
                name: 'Conto 2',
                email: ['info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '3. Mobile device']
            },
            {
                id: 3,
                name: 'Conto 3',
                email: ['2info@email.com', '3info@email.com'],
                push: ['2. Mobile device', '3. Mobile device']
            }
        ]
    };
    /**
     * Delete notification from data holder
     */
    $scope.deleteNotification = function (index,message) {
        alertify.confirm(message, function () {
            $scope.managementNotification.all.splice(index, 1);
        });


    };

});

/**
 * The controller that renders and handles notification.
 * @class ManagementNotificationIdController
 */
myAppController.controller('ManagementNotificationIdController', function ($scope, $routeParams, $filter, dataFactory, dataService) {
    $scope.managementNotification = {
        input: {
            id: 0,
            name: '',
            email: [],
            push: []
        },
        emails: ['info@email.com', 'name.lastname@email.com', 'hello@email.com', '3info@email.com', '2info@email.com'],
        pushes: ['1. Mobile device', '2. Mobile device', '3. Mobile device', '4. Mobile device', '5. Mobile device'],
        all: [
            {
                id: 1,
                name: 'Conto 1',
                email: ['info@email.com', '2info@email.com'],
                push: ['2. Mobile device', '3. Mobile device']
            },
            {
                id: 2,
                name: 'Conto 2',
                email: ['info@email.com', '3info@email.com'],
                push: ['1. Mobile device', '3. Mobile device']
            },
            {
                id: 3,
                name: 'Conto 3',
                email: ['2info@email.com', '3info@email.com'],
                push: ['2. Mobile device', '3. Mobile device']
            }
        ]
    };
    $scope.masterModel = angular.copy($scope.managementNotification.input);


    /**
     * Load notification
     */
    $scope.loadNotificaion = function () {
        var data = _.findWhere($scope.managementNotification.all, {id: $filter('toInt')($routeParams.id)});
        if(data){
            console.log('data', data)
            $scope.managementNotification.input = data;
        }

        //console.log($scope.managementNotification.input)

    };
    $scope.loadNotificaion();


    /**
     * Assign email to list
     */
    $scope.assignImail = function (v) {
        if ($scope.managementNotification.input.email.indexOf(v) === -1) {
            $scope.managementNotification.input.email.push(v);
        }
    };

    /**
     * Remove email from the list
     */
    $scope.removeEmail = function (index) {
        $scope.managementNotification.input.email.splice(index, 1);
        return;
    };

    /**
     * Create email
     */
    $scope.createEmail = function () {
        var email = $scope.managementNotification.input.email_add;
        console.log('createEmail', email)
        if ($scope.managementNotification.emails.indexOf(email) > -1 || email === '') {
            console.log('return', email)
            return;
        }

        $scope.managementNotification.emails.push(email);
        $scope.managementNotification.input.email.push(email);
        $scope.managementNotification.input.email_add = '';


    };

    /**
     * Delete email from data holder
     */
    $scope.deleteEmail = function (index,message) {
        alertify.confirm(message, function () {
            $scope.managementNotification.emails.splice(index, 1);
        });


    };

    /**
     * Assign push device to list
     */
    $scope.assignPush = function (v) {
        if ($scope.managementNotification.input.push.indexOf(v) === -1) {
            $scope.managementNotification.input.push.push(v);
        }
    };

    /**
     * Remove push device from the list
     */
    $scope.removePush = function (index) {
        $scope.managementNotification.input.push.splice(index, 1);
        return;
    };

    /**
     * Create/Update an item
     */
    $scope.storeNotification = function (form) {
        if (form.$invalid) {
            return;
        }
        console.log('Store: ',$scope.managementNotification.input)
        window.location = '#/admin';

    };


});
