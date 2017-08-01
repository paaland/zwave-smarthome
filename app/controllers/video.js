/**
 * @overview Controllers that handle Video surveillance actions.
 * @author Martin Vach
 */

/**
 * The controller that renders a list of the Video surveillance devices.
 * @class VideoController
 */
myAppController.controller('VideoController', function ($scope, $sce,dataFactory, dataService, _) {
    $scope.videos = {
        all:[],
        find: {}
    };

    $scope.videosAll = function(){
        $scope.videos.all = [
            {
                id: 1,
                name: 'Video surveillance name 1',
                src: $sce.trustAsResourceUrl('https://www.youtube.com/embed/4i_GFrlaStQ'),
                roomId: 1,
                roomName: 'Room 1'
            },
            {
                id: 2,
                name: 'Video surveillance name 2',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/Vl2JuGkyDJk'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 3,
                name: 'Video surveillance name 3',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/xq16iF8RXlA'),
                roomId: 1,
                roomName: 'Room 1'
            },
            {
                id: 4,
                name: 'Video surveillance name 4',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/XGTGILp7rBU'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 5,
                name: 'Video surveillance name 5',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/zvfsEIb7lcA'),
                roomId: 3,
                roomName: 'Room 3'
            },
            {
                id: 6,
                name: 'Video surveillance name 6',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/IKbxMIWCto0'),
                roomId: 4,
                roomName: 'Room 4'
            },
            {
                id: 7,
                name: 'Video surveillance name 7',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/R8XAlSp838Y'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 8,
                name: 'Video surveillance name 8',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/zY99Eqagwj0'),
                roomId: 1,
                roomName: 'Room 1'
            }
        ];
    };
    $scope.videosAll();

    $scope.videosFind = function(video){
        console.log(video)
    }
});

