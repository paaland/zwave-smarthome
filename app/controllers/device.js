/**
 * @overview This controller handles devices submenus – Z-Wave, Camera and EnOcean.
 * @author Martin Vach
 */

/**
 * Device root controller
 * @class DeviceController
 *
 */
myAppController.controller('DeviceController', function($scope, dataFactory) {
    $scope.enocean = {
        installed: false,
        active: false,
        alert: {message: false}
    };

    $scope.rf433 = {
        installed: false,
        active: false,
        alert: {message: false}
    };
     /**
     * Load ext. Peripherals modules (EnOcean, Rf433)
     */
    $scope.loadperipheralsModules = function() {
        dataFactory.getApi('instances',false,true).then(function(response) {
            var EnOcean_module = _.findWhere(response.data.data,{moduleId:'EnOcean'});
            if(EnOcean_module){
                $scope.enocean.installed = true;
                if (!EnOcean_module.active) {
                    $scope.enocean.alert = {message: $scope._t('enocean_not_active'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.enocean.active = true;
            }

            var RF433_module = _.findWhere(response.data.data,{moduleId:'RF433'});
            if(RF433_module){
                $scope.rf433.installed = true;
                if (!RF433_module.active) {
                    $scope.rf433.alert = {message: $scope._t('rf433_not_active'), status: 'alert-warning', icon: 'fa-exclamation-circle'};
                    return;
                }
                $scope.rf433.active = true;
            }

        });
    };

    $scope.loadperipheralsModules();
});