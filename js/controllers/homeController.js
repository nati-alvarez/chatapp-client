app.controller("homeController", ["$scope", "$http", "$location", function($scope, $http, $location){
        //if user is already logged in
        if(localStorage.getItem('user')) $location.path("/dashboard");

        $scope.state = "login";
        $scope.errorMessage  = "";
        $scope.successMessage = "";
        //status of ajax request
        $scope.isLoading = false;

        $scope.loginInfo = {
            username: '',
            password: '',
        }

        $scope.signupInfo = {
            username: '',
            email: '',
            password: ''
        }

        $scope.updateState = function(state){
            $scope.errorMessage = "";
            $scope.successMessage = "";
            this.state = state;
        }

        $scope.login = function(){
            $scope.errorMessage = "";
            $scope.isLoading = true;
            $http.post("http://chatrbox-api.fr.openode.io/auth/login", $scope.loginInfo).then(
                function(res){
                    $scope.isLoading = false;
                    var user = JSON.stringify(res.data.user);
                    var token = res.data.token;
                    localStorage.setItem('user', user);
                    localStorage.setItem('token', token);

                    $location.path("/dashboard");
                },
                function(res){
                    $scope.isLoading = false;
                    if(res.status === -1) return $scope.errorMessage = "Error Connecting to Server."
                    console.log(res)
                    var message = res.data.message;
                    var err = res.data.err.sqlMessage || res.data.err;
                    $scope.errorMessage = message + " " + err;
                }
            );
        }

        $scope.signup = function(){
            $scope.errorMessage = "";
            $scope.successMessage = "";
            $scope.isLoading = true;
            $http.post("http://chatrbox-api.fr.openode.io/auth/signup", $scope.signupInfo).then(
                function(res){
                    $scope.isLoading = false;
                    var message = res.data.message;
                    $scope.successMessage = message;
                },
                function(res){
                    $scope.isLoading = false;
                    if(res.status === -1) return $scope.errorMessage = "Error Connecting to Server."
                    var message = res.data.message;
                    var err = res.data.err.sqlMessage || res.data.err;
                    $scope.errorMessage = message + " " + err;
                }
            )
        }


        //background canvas effects
        var canvas = document.getElementById("canvas-bg");
        canvas.width = document.body.clientWidth; //document.width is obsolete
        canvas.height = document.body.clientHeight; //document.height is obsoletecanvas.style.width = "100vw";
        
        ctx = canvas.getContext("2d");

        function Circle(x, y, rad, dx, dy, color){
            this.x = x;
            this.y = y;
            this.rad = rad;
            this.dx= dx;
            this.dy = dy;
            this.color = color;

            this.draw = function(){

                ctx.beginPath()
                ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
                ctx.fillStyle = this.color;
                ctx.fill();
            };

            this.update = function(){
                if(this.x >= canvas.width - this.rad || this.x < this.rad) this.dx = -this.dx;
                if(this.y >= canvas.height - this.rad || this.y < this.rad) this.dy = -this.dy;
                this.x += this.dx;
                this.y += this.dy;
                
                this.draw();
            };
        }

        //instantiate circles with randomized attributes
        var circles = []
        var colors = ["#007F6E", "#8F78AD", "#1C053A", "#00d1b2"];

        for(let i = 0; i < 40; i++){
            var color = Math.round(Math.random() * 3);
            color = colors[color];

            var rad = Math.random() * (85 - 10) + 10;
            var x = Math.random() * (canvas.width - (rad * 2)) + (rad );
            var y = Math.random() * (canvas.height - (rad * 2)) + (rad);
            var dx = (Math.random() > .4)? Math.random() * 1.5: -(Math.random() * 1.2);
            var dy = (Math.random() > .4)? Math.random() * 1.5: -(Math.random() * 1.2);
            var circle = new Circle(x, y, rad, dx, dy, color);
            circles.push(circle);
        }

        function animate(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i <circles.length; i++){
                circles[i].update();
            }
            requestAnimationFrame(animate);    
        }
        animate();

    
}]);