/**
 * @overview Controllers that handle the list of elements, dashboar and elements in the room.
 * @author Martin Vach
 */

/**
 * The element root controller
 * @class ElementBaseController
 */
myAppController.controller('ElementBaseController', function ($scope, $q, $interval, $cookies, $filter, cfg,dataFactory, dataService, myCache) {
    $scope.dataHolder = {
        mode: 'default',
        firstLogin: false,
        cnt: {
            devices: 0,
            collection: 0,
            hidden: 0,
            romms: {}
        },
        devices: {
            switchButton: [],
            noDashboard: false,
            noDevices: false,
            noSearch: false,
            show: true,
            all: {},
            byId: {},
            collection: {},
            deviceType: {},
            find: {},
            tags: [],
            filter: ($cookies.filterElements ? angular.fromJson($cookies.filterElements) : {}),
            rooms: {},
            orderBy: ($cookies.orderByElements ? $cookies.orderByElements : 'creationTimeDESC'),
            showHidden: ($cookies.showHiddenEl ? $filter('toBool')($cookies.showHiddenEl) : false),
            notificationsSince: ($filter('unixStartOfDay')('-', (86400 * 6)) * 1000)
        },
        dragdrop:{
            action: $scope.getBodyId(),
            data: []
        }
    };
    $scope.apiDataInterval = null;

    $scope.autocomplete = {
        source: [],
        term: '',
        searchInKeys: 'id,title',
        returnKeys: 'id,title,iconPath',
        strLength: 2,
        resultLength: 10
    };

    /**
     * Cancel interval on page destroy
     */
    $scope.$on('$destroy', function () {
        $interval.cancel($scope.apiDataInterval);
    });

    /**
     * Load all promises
     */
    $scope.allSettled = function (noCache) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        // Notifications since
        //var since = '?since=' + $filter('unixStartOfDay')('-', (86400 * 6));
        var promises = [
            dataFactory.getApi('locations'),
            dataFactory.getApi('devices', null, noCache)
        ];

        $q.allSettled(promises).then(function (response) {
            var locations = response[0];
            var devices = response[1];
            $scope.loading = false;
            // Error message
            if (devices.state === 'rejected') {
                $scope.loading = false;
                alertify.alertError($scope._t('error_load_data'));
                $scope.dataHolder.devices.show = false;
                return;
            }

            // Success - locations
            if (locations.state === 'fulfilled') {
                $scope.dataHolder.devices.rooms = dataService.getRooms(locations.value.data.data).indexBy('id').value();
            }
            // Success - devices
            if (devices.state === 'fulfilled') {
                // Count hidden apps
                $scope.dataHolder.cnt.hidden = _.chain(dataService.getDevicesData(devices.value.data.data.devices, true))
                    .flatten().where({visibility: false})
                    .size()
                    .value();
                // Set devices
                setDevices(dataService.getDevicesData(devices.value.data.data.devices, $scope.dataHolder.devices.showHidden));

            }
        });
    };
    $scope.allSettled(true);

    /**
     * Get device by ID
     */
    $scope.getDeviceById = function (id) {
        var device = _.where($scope.dataHolder.devices.collection, {id: id});
        if (device[0]) {
            angular.extend($scope.dataHolder.devices.byId, device[0]);
        }
    };


    /**
     * Refresh data
     */
    $scope.refreshDevices = function () {
        var refresh = function () {
            dataFactory.refreshApi('devices').then(function (response) {
                if (response.data.data.devices.length > 0) {
                    angular.forEach(response.data.data.devices, function (v, k) {
                        if (v.metrics.level) {
                            v.metrics.level = $filter('numberFixedLen')(v.metrics.level);
                        }
                        var index = _.findIndex($scope.dataHolder.devices.all, {id: v.id});
                        if (!$scope.dataHolder.devices.all[index]) {
                            return;
                        }
                        angular.extend($scope.dataHolder.devices.all[index],
                                {metrics: v.metrics},
                                {progress: false},
                                {iconPath: dataService.assignElementIcon(v)},
                                {updateTime: v.updateTime}
                        );
                        //console.log('Updating from server response: device ID: ' + v.id + ', metrics.level: ' + v.metrics.level + ', updateTime: ' + v.updateTime);
                    });
                }
                if (response.data.data.structureChanged === true) {
                    $scope.allSettled(true);
                }

            }, function (error) {
                $interval.cancel($scope.apiDataInterval);
            });
        };
        $scope.apiDataInterval = $interval(refresh, $scope.cfg.interval);
    };

    $scope.refreshDevices();

    /**
     * Renders search result in the list
     */
    $scope.searchMe = function () {
        $scope.autocomplete.results = dataService.autocomplete($scope.dataHolder.devices.all, $scope.autocomplete);
        // Expand/Collapse the list
        if(!_.isEmpty($scope.autocomplete.results)){
            $scope.expandAutocomplete('searchElements');
        }else{
            $scope.expandAutocomplete();
        }
        // Reset filter q if is input empty
        if ($scope.dataHolder.devices.filter.q && $scope.autocomplete.term.length < 1) {
            $scope.setFilter();
        }
    }

    /**
     * Change view mode - default/edit
     * @param {string} mode
     */
    $scope.changeMode = function (mode) {
        $scope.dataHolder.mode = mode;
        if(mode === 'default'){
            $scope.dataHolder.dragdrop.data = [];
        }
        if($scope.dataHolder.dragdrop.action === 'elements'){
            $scope.setFilter(false);
        }else{
            $scope.allSettled();
        }

    }

    /**
     * Set filter
     */
    $scope.setFilter = function (filter) {
        // Reset data
        $scope.autocomplete.results = [];
        $scope.dataHolder.devices.noSearch = false;
        $scope.expandAutocomplete();
        // Is fiter value empty?
        var empty = (_.values(filter) == '');

        if (!filter || empty) {// Remove filter
            angular.extend($scope.dataHolder.devices, {filter: {}});
            $cookies.filterElements = angular.toJson({});
        } else {// Set filter
            angular.extend($scope.dataHolder.devices, {filter: filter});
            $cookies.filterElements = angular.toJson(filter);
        }
        $scope.allSettled();

        //$scope.reloadData();
    };

    /**
     * Show hidden elements
     */
    $scope.showHiddenEl = function (status) {
        angular.extend($scope.dataHolder.devices, {filter: {}});
        $cookies.filterElements = angular.toJson({});
        status = $filter('toBool')(status);
        angular.extend($scope.dataHolder.devices, {showHidden: status});
        $cookies.showHiddenEl = status;
        $scope.reloadData();
    };

    /**
     * Set order by
     */
    $scope.setOrderBy = function (key) {
        angular.extend($scope.dataHolder.devices, {orderBy: key});
        $cookies.orderByElements = key;
        $scope.reloadData();
    };

    /**
     * Function to run when when a user starts moving an element
     * @param item -  is the item in model which started being moved
     * @param part - is the part from which the $item originates
     * @param index -  is the index of the $item in $part
     * @param helper - is an object which contains the jqLite/jQuery object (as property element) of what is being dragged around
     */
    $scope.dragDropStart = function (item, part, index, helper) {
        angular.element('#' + helper.element.context.id).addClass('dd-on-start');
        //jQuery('#' +  helper.element.context.id).addClass('dd-on-start');


    }
    /**
     * Function to run when elements order has changed after sorting
     * @param item - is the item in model which has been moved
     * @param partFrom - is the part from which the $item originated
     * @param partTo - is the part to which the $item has been moved
     * @param indexFrom -  is the previous index of the $item in $partFrom
     * @param indexTo -  is the index of the $item in $partTo
     */
    $scope.dragDropSort = function (item, partFrom, partTo, indexFrom, indexTo) {
        $scope.dataHolder.dragdrop.data = [];
        angular.forEach(partFrom, function (v, k) {
            $scope.dataHolder.dragdrop.data.push(v.id);

        });


    }

    /**
     * Save drag and drop object
     */
    $scope.dragDropSave = function () {
        /*console.log($scope.dataHolder.dragdrop)*/
        $interval.cancel($scope.apiDataInterval);

        dataFactory.putApi('reorder',false, $scope.dataHolder.dragdrop).then(function (response) {
            $scope.dataHolder.dragdrop.data = [];
            $scope.mode = 'default';
            $scope.setOrderBy('order_elements');
            $scope.reloadData();
            $scope.refreshDevices();
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            $scope.dataHolder.dragdrop.data = [];
            $scope.refreshDevices();
        });
    }

    /**
     * Run command
     */
    $scope.runCmd = function (cmd, id) {
        dataFactory.runApiCmd(cmd).then(function (response) {
            var index = _.findIndex($scope.dataHolder.devices.all, {id: id});
            if ($scope.dataHolder.devices.all[index]) {
                angular.extend($scope.dataHolder.devices.all[index],
                    {progress: true}
                );
            }

        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            $scope.loading = false;
        });
        return;
    };
    /**
     * Reset devicse data holder
     */
    $scope.resetDevices = function (devices) {
        angular.extend($scope.dataHolder.devices, devices);
    };

    /**
     * Delete device history
     */
    $scope.deleteHistory = function (input, message, event) {
        alertify.confirm(message, function () {
            dataFactory.deleteApi('history', input.id).then(function (response) {
                dataService.showNotifier({message: $scope._t('delete_successful')});
                $scope.handleModal('modalHistory', event);
                $scope.reloadData();

            }, function (error) {
                var message = ($filter('hasNode')(error, 'data.error') ? $scope._t(error.data.error.key) : $scope._t('error_delete_data'));
                $scope.loading = false;
                alertify.alertError(message);
            });

        });
    };

    /**
     * Set visibility
     */
    $scope.setVisibility = function (v, visibility) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('updating')};
        dataFactory.putApi('devices', v.id, {visibility: visibility}).then(function (response) {
            $scope.loading = false;
            $scope.reloadData();
        }, function (error) {
            alertify.alertError($scope._t('error_update_data'));
            $scope.loading = false;
        });
    };

    /**
     * Set exact value for the command
     */
    $scope.setExactCmd = function (v, type, run) {
        var count;
        var val = parseFloat(v.metrics.level);
        var min = parseInt(v.minMax.min, 10);
        var max = parseInt(v.minMax.max, 10);
        var step = parseFloat(v.minMax.step);
        switch (type) {
            case '-':
                count = val - step;
                break;
            case '+':
                count = val + step;
                break;
            default:
                count = parseInt(type, 10);
                break;
        }

        if (count < min) {
            count = min;
        }
        if (count > max) {
            count = max;
        }

        var cmd = v.id + '/command/exact?level=' + count;
        v.metrics.level = count;
        //console.log('ElementBaseController.setExactCmd - Sending request: ', cmd)
        //if (run) {
        $scope.runCmd(cmd);
        // }

        //return cmd;
    };

    /// --- Private functions --- ///
    /**
     * Set device
     */
    function setDevices(devices) {
        // Set tags
        _.filter(devices.value(), function (v) {
            if (v.tags.length > 0) {
                angular.forEach(v.tags, function (t) {
                    if ($scope.dataHolder.devices.tags.indexOf(t) === -1) {
                        $scope.dataHolder.devices.tags.push(t);
                    }
                });
            }
        });
        // Set categories
        $scope.dataHolder.devices.deviceType = devices.countBy(function (v) {
            return v.deviceType;
        }).value();

        $scope.dataHolder.cnt.devices = devices.size().value();
        $scope.dataHolder.cnt.rooms =  _.countBy(devices.value(), function (v) {
            return v.location;
        });

        //All devices
        $scope.dataHolder.devices.all = devices.value();
        if (_.isEmpty($scope.dataHolder.devices.all)) {
            $scope.dataHolder.devices.noDevices = true;
            return;
        }
        // Collection
        if ('tag' in $scope.dataHolder.devices.filter) {// Filter by tag
            $scope.dataHolder.devices.collection = _.filter($scope.dataHolder.devices.all, function (v) {
                if (v.tags.indexOf($scope.dataHolder.devices.filter.tag) > -1) {
                    return v;
                }
            });
        } else if ('q' in $scope.dataHolder.devices.filter) {// Filter by query
            //angular.element('#input_search').focus();
            // Set autcomplete term
            $scope.autocomplete.term = $scope.dataHolder.devices.filter.q;
            var searchResult = _.indexBy(dataService.autocomplete($scope.dataHolder.devices.all, $scope.autocomplete), 'id');
            $scope.dataHolder.devices.collection = _.filter($scope.dataHolder.devices.all, function (v) {
                if (searchResult[v.id]) {
                    return v;
                }
            });
        } else {
            $scope.dataHolder.devices.collection = _.where($scope.dataHolder.devices.all, $scope.dataHolder.devices.filter);
        }
        if (_.isEmpty($scope.dataHolder.devices.collection)) {
            if ($scope.routeMatch('/dashboard')) {
                $scope.dataHolder.devices.noDashboard = true;
            } else {
                if ($scope.dataHolder.devices.filter.q) {
                    $scope.dataHolder.devices.noSearch = true;

                } else {
                    $scope.dataHolder.devices.noDevices = true;
                }

            }
        }else{
            if($scope.dataHolder.mode === 'edit'){
                var nodePath = 'order.' + $scope.dataHolder.dragdrop.action;
                $scope.dataHolder.devices.collection = _.sortBy($scope.dataHolder.devices.collection, function(v) {
                    return $filter('hasNode')(v,nodePath) || 0;
                });
            }

        }
        $scope.dataHolder.cnt.collection = _.size($scope.dataHolder.devices.collection);
    }
    ;

});


/**
 * The controller that handles elements on the dashboard.
 * @class ElementDashboardController
 */
myAppController.controller('ElementDashboardController', function ($scope, $routeParams) {
    $scope.dataHolder.devices.filter = {onDashboard: true};
    $scope.dataHolder.devices.orderBy = 'order_dashboard';
    $scope.elementDashboard = {
        firstLogin: ($routeParams.firstlogin || false),
        firstFile: ($scope.lang === 'de' ? 'first_login_de.html' : 'first_login_en.html')
    };


});

/**
 * The controller that handles elements in the room.
 * @class ElementRoomController
 */
myAppController.controller('ElementRoomController', function ($scope, $q, $routeParams, $window, $location, $cookies, $filter, cfg, dataFactory, dataService, myCache) {
    $scope.room = {};
    $scope.roomSensors = [];

    $scope.dataHolder.devices.filter = {location: parseInt($routeParams.id)};
    $scope.dataHolder.devices.orderBy = 'order_rooms';

    $scope.allSettled = function () {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('loading')};
        var promises = [
            dataFactory.getApi('locations', '/' + $routeParams.id),
            dataFactory.getApi('devices',null, false)
        ];

        $q.allSettled(promises).then(function (response) {
            var location = response[0];
            var devices = response[1];
            $scope.loading = false;
            // Success - location
            if (location.state === 'fulfilled') {
                $scope.room = dataService.getRooms([location.value.data.data]).value()[0];
            }

            if(devices.state === 'fulfilled') {
                var devices = dataService.getDevicesData(devices.value.data.data.devices, $scope.dataHolder.devices.showHidden);
                $scope.loadRoomSensors(devices.value());
            }
        });
    };
    $scope.allSettled();

    $scope.loadRoomSensors = function(devices) {
        if(!$scope.room.main_sensors) {
            return;
        }
        $scope.roomSensors = _.filter(devices, function(device) {
            if($scope.room.main_sensors.indexOf(device.id) > -1) {
                return device;
            }
        });
    };

});