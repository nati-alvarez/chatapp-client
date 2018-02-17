app.controller("dashboardController", ["$scope", "$location", "$rootScope", function($scope, $location, $rootScope){
    //user auth stuff
    $scope.user = JSON.parse(localStorage.getItem("user"))|| null;
    $scope.token = localStorage.getItem("token") || null;
    if(!$scope.user){
        $location.path("/");
    }

    //for various err/success messages
    $scope.notificationText;
    $scope.notificationErrText;
    
    //clears notifcation text
    $scope.clearNotification = function(){
        $scope.notificationText = "";
        $scope.notificationErrText = "";
    }

    //keeps track of which ui component to display
    $scope.currentTab = "messages";
    $scope.chatroomId;
    $scope.chattingWith;

    //pass in friend object if tab is chatroom
    //info is needed to retrieve chat messages

    $scope.changeTab = function(tabName){
        $scope.currentTab = tabName;
        switch($scope.currentTab){
            case "chatroom":
                var friend = arguments[1];
                var chatroomId = (friend.friend.id < $scope.user.id)? `${friend.friend.id}-${$scope.user.id}`: `${$scope.user.id}-${friend.friend.id}`;
                $scope.chatroomId = chatroomId;
                $scope.chattingWith = friend;
                $rootScope.$emit('changeChatroom', {chatroomId: $scope.chatroomId, chattingWith: friend});
        }
    }

    $scope.logout = function(){
        localStorage.clear();
        $scope.user.token = null;
        $scope.user = null;
        $location.path("/");
    }
}]);