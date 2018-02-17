app.controller("chatroomController", ["$scope", "$http", "$interval", "$rootScope", "socket", function($scope, $http, $interval, $rootScope, socket){
    //notification sound for new messages
    $scope.sfx  = new Audio("audio/newMessage.mp3");
    //watch for update on chatroomId and chattingWith on friends dashboard controller
    //and update chatroom based on that value
    $rootScope.$on('changeChatroom', function (e, data) {
        $scope.friend = data.chattingWith.friend;
        $scope.chatroomId = data.chatroomId;
        $scope.getMessages();
    });

    $scope.chatroomId = $scope.$parent.chatroomId;
    $scope.friend = $scope.$parent.chattingWith.friend;



    $scope.messages = [];
    $scope.messageBody;

    $scope.socket = socket.connect("http://chatrbox-api.fr.openode.io/ws-chatroom");

    $scope.socket.on("returnNewMessages", function(newMessages){
        $scope.messages = newMessages;
        $scope.sfx.play();
        $scope.glued = true;
    });

    //get messages
    $scope.getMessages = function(){
        $http.get(`http://chatrbox-api.fr.openode.io/chatroom/${$scope.chatroomId}`,{headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                if(result.data.success === true){
                    $scope.messages = result.data.chatroomMessages;
                }
                $scope.glued = true;
                $interval(function(){
                    $scope.socket.emit("getNewMessages", {chatroom: $scope.chatroomId, messages: $scope.messages});
                }, 5000);
            },
            function(result){
                console.log(result);
            }
        );
    }
    $scope.getMessages();

    $scope.sendMessage = function(messageBody){
        //$scope.glued will be used to scroll messages to bottom when a new message is sent using angular-scroll-glue directive
        $http.post(`http://chatrbox-api.fr.openode.io/chatroom/${$scope.chatroomId}`, {messageBody, id: $scope.$parent.user.id}, {headers: {"x-access-token": $scope.$parent.token}}).then(
            function(result){
                $scope.messages.push({body: messageBody, id: $scope.$parent.user.id});
                $scope.messageBody = "";
                $scope.glued = true;
            },
            function(result){
                console.log(result);
            }
        );
    }
     
}]);