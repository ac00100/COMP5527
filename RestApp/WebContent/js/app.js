/*!
** Todo-Sortable-List Example App
** Licensed under the Apache License v2.0
** http://www.apache.org/licenses/LICENSE-2.0
** Built by Jay Kanakiya ( @techiejayk )
**/
"use strict";

var App = angular.module("todo", ["ui.sortable", "LocalStorageModule"]).config(["$httpProvider", function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);
;

App.controller("TodoCtrl", function ($scope, $http) {
	
	var url = "http://192.168.11.3/RestApp/api/tasks";
	

	$scope.init = function () {
		$http.get(url).success( function(response) {
	    	//console.log(response);
	    	var responseList;
	    	responseList = response;
			$scope.model = [
				{
					name: "Primary", list: responseList
				},
				{
					name: "Secondary", list: [
  						{ taskname: "Create a Task", status: "Open", done: false },
						{ taskname: "Upade Task Name by double click", status: "Open", done: false },
						{ taskname: "Tick the Checkbox as Task Complete", status: "Complete", done: true }
					]
				}
			];
	    });
		
			
		$scope.show = "All";
		$scope.currentShow = 0;
	};

	$scope.addTodo = function () {
		/*Should prepend to array*/
		//$scope.model[$scope.currentShow].list.splice(0, 0, {taskName: $scope.newTodo, isDone: false });
		$http({
		    method: "POST",
		    url: "http://192.168.11.3/RestApp/api/addTask",
		    data: {id:0,taskname: $scope.newTodo ,status:"Open"},
		    headers: {"Content-Type": "application/json"}
		}).success(function (data, status, headers, config) {
			/*Reset the Field*/
			$scope.newTodo = "";
			$scope.init();
        }).error(function (data, status, headers, config) {
        	/*Reset the Field*/
        	$scope.newTodo = "";
        	$scope.init();
        });
		
	};
	
	$scope.updateTask = function (item) {
		console.log("item", item);
		$http({
		    method: "PUT",
		    url: "http://192.168.11.3/RestApp/api/updateTask",
		    data: {
		    	id : item.id,
		    	taskname : item.taskname,
		    	status :(item.done)?"Complete":"Open"
		    },
		    headers: {"Content-Type": "application/json"}
		}).error(function (data, status, headers, config) {
			/*Reload*/
			$scope.init();
        });
		/*Reload*/
		$scope.init();
	};

	$scope.deleteTodo = function (item) {
		$http({
		    method: "DELETE",
		    url: "http://192.168.11.3/RestApp/api/deleteTask/" + item.id,
		    headers: {"Content-Type": "application/json"}
		}).error(function (data, status, headers, config) {
			$scope.init();
        });
		$scope.init();
		//var index = $scope.model[$scope.currentShow].list.indexOf(item);
		//$scope.model[$scope.currentShow].list.splice(index, 1);
	};

	$scope.todoSortable = {
		containment: "parent",//Dont let the user drag outside the parent
		cursor: "move",//Change the cursor icon on drag
		tolerance: "pointer"//Read http://api.jqueryui.com/sortable/#option-tolerance
	};

	$scope.changeTodo = function (i) {
		//console.log("changeTodo",i);
		$scope.currentShow = i;
	};

	/* Filter Function for All | Incomplete | Complete */
	$scope.showFn = function (todo) {
		//console.log("showFn",todo);
		if ($scope.show === "All") {
			return true;
		}else if(todo.done && $scope.show === "Complete"){
			return true;
		}else if(!todo.done && $scope.show === "Incomplete"){
			return true;
		}else{
			return false;
		}
	};

});