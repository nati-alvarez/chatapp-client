app.controller("friendRequestController", ["$scope", "$timeout", "$interval", "$http", "socket", function($scope, $timeout, $interval, $http, socket){
    $scope.friendRequests = [];
    $scope.socket = socket.connect("http://chatrbox-api.fr.openode.io/friendRequests");

    //IIFE to get intial friend requests
    (function(){
        $http.get("http://chatrbox-api.fr.openode.io/friend-requests", {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.friendRequests = result.data.friendRequests;
                }
                //start websocket requests
                $interval(function(){
                    $scope.socket.emit('getFriendRequests', {friendRequests: $scope.friendRequests, user: $scope.$parent.user});
                }, 5000);
            },
            function(result){
                console.log(result);
                //start websocket requests
                $interval(function(){
                    $scope.socket.emit('getFriendRequests', {friendRequests: $scope.friendRequests, user: $scope.$parent.user});
                }, 5000);
            }
        )
    })();

    $scope.acceptFriendRequest = function(requestId){
        $http.post(`http://chatrbox-api.fr.openode.io/friend-requests/accept/${requestId}`, {}, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                //show success notification and pop request off friendRequests array
                if(result.data.success === true){
                    $scope.friendRequests = $scope.friendRequests.filter(request=> request.id !== requestId);
                    $scope.$parent.notificationText = result.data.message;
                }
            },
            function(result){
                if(result.data.success === false){
                     $scope.$parent.notificationErrText = result.data.message;
                }
                console.log(result);
            }
        );
    }

    $scope.declineFriendRequest = function(requestId){
        $http.post(`http://chatrbox-api.fr.openode.io/friend-requests/decline/${requestId}`, {}, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.friendRequests = $scope.friendRequests.filter(request=> request.id !== requestId);
                    $scope.$parent.notificationText = result.data.message;
                }
            },
            function(result){
                if(result.data.success === false){
                    $scope.$parent.notificationErrText = result.data.message;
                }
                console.log(result);
            }
        );
    }
 

    //response from server from frequest on all new friend requests
    $scope.socket.on("returnFriendRequests", function(data){
        if(data.new === true){
            $scope.friendRequests = data.friendRequests;

            //temporarily store class in scope for animation
            $scope.notificationAnimation = "rubberBand";
            $timeout(()=>{$scope.notificationAnimation = "";}, 2000);
        }
    });
}])
