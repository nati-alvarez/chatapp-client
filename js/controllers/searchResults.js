app.controller("searchResults", ["$scope", "$http", function($scope, $http){
    $scope.keyword = "";
    $scope.users = [];

    $scope.searchUsers = function(){
        var query = "?username=" + $scope.keyword;

        $http.get("http://chatrbox-api.fr.openode.io/users" + query, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.users = result.data.users;
                }
            },
            function(result){
                console.log(result);
            } 
        );
    }

    $scope.sendFriendRequest = function(recipientId){
        $http.post(`http://chatrbox-api.fr.openode.io/friend-requests/`, {recipientId}, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.$parent.$parent.notificationText = "Friend request sent!";
                }
            },
            function(result){
                if(result.data.err.sqlState = "23000"){
                    $scope.$parent.$parent.notificationErrText = `${result.data.message}: Request aleady sent.`;
                }
            }
        );
    }
}]);