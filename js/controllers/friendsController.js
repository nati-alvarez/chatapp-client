app.controller("friendController", ["$scope", "$http", "$interval", "socket", function($scope, $http, $interval, socket){
    $scope.friends = [];
    $scope.socket = socket.connect("http://chatrbox-api.fr.openode.io/ws-friends");
    //IIFE to get users friends on load
    (function getFriends(){
        $http.get("http://chatrbox-api.fr.openode.io/friends", {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                $scope.friends = result.data.friends;
                $interval(function(){
                    $scope.socket.emit('getFriends', {user: $scope.$parent.user, friends: $scope.friends});
                }, 5000);
            },
            function(result){
                console.log(result);
                $interval(function(){
                    $scope.socket.emit('getFriends', {user: $scope.$parent.user, friends: $scope.friends});
                }, 5000);
            }
        )
    })();

    $scope.socket.on("returnFriends", function(data){
        console.log(data);
        if(data.new === true){
            //no fucking clue why but $scope.$apply is needed because
            //the person's friendlist who accepted the request will be updated but not the fucking sender's
            $scope.$apply(function(){
                $scope.friends = data.friends;
            });
        }
    });
}]);