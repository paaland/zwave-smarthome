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
                screen: '1-video.PNG',
                src: $sce.trustAsResourceUrl('https://www.youtube.com/embed/4i_GFrlaStQ?autoplay=1'),
                roomId: 1,
                roomName: 'Room 1'
            },
            {
                id: 2,
                name: 'Video surveillance name 2',
                screen: '2-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/Vl2JuGkyDJk?autoplay=1'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 3,
                name: 'Video surveillance name 3',
                screen: '3-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/xq16iF8RXlA?autoplay=1'),
                roomId: 1,
                roomName: 'Room 1'
            },
            {
                id: 4,
                name: 'Video surveillance name 4',
                screen: '4-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/XGTGILp7rBU?autoplay=1'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 5,
                name: 'Video surveillance name 5',
                screen: '5-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/zvfsEIb7lcA?autoplay=1'),
                roomId: 3,
                roomName: 'Room 3'
            },
            {
                id: 6,
                name: 'Video surveillance name 6',
                screen: '6-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/IKbxMIWCto0?autoplay=1'),
                roomId: 4,
                roomName: 'Room 4'
            },
            {
                id: 7,
                name: 'Video surveillance name 7',
                screen: '7-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/R8XAlSp838Y?autoplay=1'),
                roomId: 2,
                roomName: 'Room 2'
            },
            {
                id: 8,
                name: 'Video surveillance name 8',
                screen: '8-video.PNG',
                src:$sce.trustAsResourceUrl('https://www.youtube.com/embed/zY99Eqagwj0?autoplay=1'),
                roomId: 1,
                roomName: 'Room 1'
            }
        ];
    };
    $scope.videosAll();

    $scope.videoFind = function(v){
        console.log(v.src)
    }

    /**
     * Open a modal window and load a video
     * @returns {undefined}
     */
    $scope.handleVideoModal = function (v,modal,event) {
        $scope.videos.find = v;
        $scope.handleModal(modal, event);

    };
});

