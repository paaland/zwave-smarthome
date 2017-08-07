/**
 * @overviewThe controller that handles firmware update process.
 * @author Martin Vach
 */

/**
 * The controller that handles firmware update process.
 * @class ManagementFirmwareController
 */
myAppController.controller('ManagementFirmwareController', function ($scope, $sce, $timeout, dataFactory, dataService) {
    $scope.firmwareUpdateUrl = $sce.trustAsResourceUrl('http://' + $scope.hostName + ':8084/cgi-bin/main.cgi');
    $scope.firmwareUpdate = {
        show: false,
        loaded: false,
        url: $sce.trustAsResourceUrl('http://' + $scope.hostName + ':8084/cgi-bin/main.cgi')
    };
    /**
     * Set access
     */
    $scope.setAccess = function (param, loader) {
        if (loader) {
            $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        }
        dataFactory.getApi('firmwareupdate', param, true).then(function (response) {
            if (loader) {
                $scope.firmwareUpdate.show = true;
                $timeout(function () {
                    $scope.loading = false;
                    $scope.firmwareUpdate.loaded = true;
                }, 5000);
            }

        }, function (error) {
            $scope.loading = false;
            alertify.alertError($scope._t('error_load_data'));

        });
    };
    /**
     * Load latest version
     */
    $scope.loadRazLatest = function () {
        dataFactory.getRemoteData($scope.cfg.raz_latest_version_url).then(function (response) {
            $scope.controllerInfo.softwareLatestVersion = response;
        }, function (error) {
        });
    };
    //$scope.loadRazLatest();

    /**
     * update device database
     */
    $scope.updateVendorDatabase = function() {
        dataFactory.getApi('update_zwave_vendors').then(function(response) {
            $scope.loading = false;
            res = response.data;
            if(res && res.code === 200) {
                dataService.showNotifier({message: $scope._t('vendors_success_updated')});
            } else {
                alertify.alertError($scope._t('vendors_error_load_data')); // error update vendor database
            }
        }, function(error) {
            $scope.loading = false;
            alertify.alertError($scope._t('vendors_error_load_data')); // error update vendor database
        });
    };

    /**
     * update device database
     */
    $scope.updateDeviceDatabase = function() {
        var success = [];
        var failed = [];
        var count = 0;
        dataFactory.getApi('update_device_database').then(function(response) {
            $scope.loading = false;
            res = response.data.data;
            if(res !== "" && !_.isEmpty(res)) {
                count = res.length;
                _.each(res, function(lang) {
                    if(lang[Object.keys(lang)[0]]) {
                        success.push(Object.keys(lang)[0]);
                    } else {
                        failed.push(Object.keys(lang)[0]);
                    }
                });

                if(failed.length == 0) {
                    // update device database successfull
                    dataService.showNotifier({message: $scope._t('devices_success_updated')});
                } else {
                    // check if all failed
                    if(failed.length !== 0 && failed.length === count && success.length === 0) {
                        alertify.alertWarning($scope._t('update_device_database_failed'));
                    } else {
                        strSuccess = success.join(', ');
                        strFailed = failed.join(', ');
                        alertify.alertWarning($scope._t('update_device_database_failed_for', {
                            __success__: strSuccess,
                            __failed__: strFailed
                        }));
                    }
                }
            } else {
                alertify.alertError($scope._t('update_device_database_failed')); // error update device database
            }
        }, function(error) {
            $scope.loading = false;
            alertify.alertError($scope._t('update_device_database_failed')); // error update device database
        });
    };

    $scope.updateDatabases = function() {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};

        $scope.updateVendorDatabase();
        $scope.updateDeviceDatabase();

        alertify.dismissAll();
    };
});

