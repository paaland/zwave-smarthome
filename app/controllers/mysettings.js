/**
 * @overview Handles user actions.
 * @author Martin Vach
 */

/**
 * The controller that renders and handles user data.
 * @class MySettingsController
 */
myAppController.controller('MySettingsController', function($scope, $window, $cookies,$timeout,$filter,$q,cfg,dataFactory, dataService, myCache) {
    $scope.id = $scope.user.id;
    $scope.devices = {};
    $scope.input = false;
    $scope.newPassword = null;
    $scope.trustMyNetwork = true;
    $scope.lastEmail = "";

    /**
     * Load all promises
     */
    $scope.allSettled = function () {
        var promises = [
            dataFactory.getApi('profiles', '/' + $scope.id, true),
            dataFactory.getApi('devices', null, true)
        ];

        $q.allSettled(promises).then(function (response) {
            var profile = response[0];
            var devices = response[1];

            $scope.loading = false;
            // Error message
            if (profile.state === 'rejected') {
                $scope.loading = false;
                alertify.alertError($scope._t('error_load_data'));
                return;
            }
            // Success - profile
            if (profile.state === 'fulfilled') {
                $scope.input = profile.value.data.data;
                $scope.lastEmail = profile.value.data.data.email;
            }
            // Success - devices
            if (devices.state === 'fulfilled') {
                $scope.devices = devices.value.data.data.devices;
            }
        });
    };
    $scope.allSettled();

    /**
     * Assign device to the list
     */
    $scope.assignDevice = function(assign) {
        $scope.input.hide_single_device_events.push(assign);
        return;
    };

    /**
     * Remove device from the list
     */
    $scope.removeDevice = function(deviceId) {
        var oldList = $scope.input.hide_single_device_events;
        $scope.input.hide_single_device_events = [];
        angular.forEach(oldList, function(v, k) {
            if (v != deviceId) {
                $scope.input.hide_single_device_events.push(v);
            }
        });
        return;
    };

    /**
     * Create/Update a profile
     */
    $scope.store = function(form,input) {
        if (form.$invalid) {
            return;
        }

        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataFactory.putApi('profiles', input.id, input).then(function(response) {
            var data = response.data.data;
            if (!data) {
                alertify.alertError($scope._t('error_update_data'));
                $scope.loading = false;
                return;
            }

            // Email change --> update e-mail cloudbackup if instance exist
            if($scope.user.role == 1) {
                if($scope.lastEmail != input.email) {
                    var promises = [
                        dataFactory.getApi('instances', '/CloudBackup')
                    ];

                    $q.allSettled(promises).then(function (response) {
                        var instance = response[0];

                        if (instance.state === 'rejected') {
                            return;
                        }

                        if (instance.state === 'fulfilled') {
                            var instanceData = instance.value.data.data[0];
                            instanceData.params.email = input.email;
                            dataFactory.putApi('instances', instanceData.id, instanceData).then(function (response) {
                                $scope.lastEmail = input.email
                            }, function (error) {
                                alertify.alertError($scope._t('error_update_data'));
                            });
                        }
                    });
                }
            }

            $scope.loading = false;
            $cookies.lang = input.lang;
            myCache.remove('profiles');
            dataService.setUser(data);
            dataService.showNotifier({message: $scope._t('success_updated')});
            $timeout(function () {
                $scope.loading = {status: 'loading-spin', icon: '--', message: $scope._t('reloading_page')};
                alertify.dismissAll();
                $window.location.reload();
            }, 2000);

        }, function(error) {
            var message = $scope._t('error_update_data');
            if (error.status == 409) {
                message = ($filter('hasNode')(error, 'data.error') ? $scope._t(error.data.error) : message);
            }
            alertify.alertError(message);
            $scope.loading = false;
        });
    };


    /**
     * Change password
     */
    $scope.changePassword = function(form,newPassword) {
        if (form.$invalid) {
            return;
        }
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        var input = {
            id: $scope.id,
            password: newPassword

        };
        dataFactory.putApi('profiles_auth_update', input.id, input).then(function(response) {
            var data = response.data.data;
            if (!data) {
                alertify.alertError($scope._t('error_update_data'));
                $scope.loading = false;
                return;
            }
            dataService.showNotifier({message: $scope._t('success_updated')});
            dataService.goBack();

        }, function(error) {
            alertify.alertError($scope._t('error_update_data'));
            $scope.loading = false;
        });

    };

    /// --- Private functions --- ///
    /**
     * Load devices
     */
    function loadDevices() {
        dataFactory.getApi('devices').then(function(response) {
            $scope.devices = response.data.data.devices;
        }, function(error) {});
    }
    ;

});

/**
 * The controller that renders QR code.
 * @class ManagementAddMobileDevice
 */

myAppController.controller('ManagementAddMobileDevice', function ($scope) {
    $scope.qrcode = $scope.user.qrcode;
});
