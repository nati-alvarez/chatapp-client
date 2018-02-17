app.controller("accountSettings", ["$scope", "$http", function($scope, $http){
    $scope.username = $scope.$parent.user.username;
    $scope.profilePicture = $scope.$parent.user.profilePicture;
    $scope.isLoading = false;
    
    $scope.updateProfile = function(){
        $scope.isLoading = true;

        //if the username has not been changed, do not send it to the api
        //sending it to the api would cause a duplicate sql error
        if($scope.username === $scope.$parent.user.username) $scope.username = null;

        $http.put(`http://chatrbox-api.fr.openode.io/users/${$scope.$parent.user.username}`, {profilePicture: $scope.profilePicture, username: $scope.username}, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.$parent.user.profilePicture = $scope.profilePicture;
                    if($scope.username !== null){
                         $scope.$parent.user.username = $scope.username;
                    }

                    $scope.username = $scope.$parent.user.username;
                    localStorage.setItem('user', JSON.stringify($scope.$parent.user));

                    $scope.isLoading = false;
                }
            },
            function(result){
                console.log(result);
                $scope.isLoading = false;
            }
        );
    }
}]);