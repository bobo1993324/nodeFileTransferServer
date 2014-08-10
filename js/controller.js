var nodeFileUploadApp = angular.module('nodeFileUploadApp', []);

nodeFileUploadApp.controller("NodeFileUploadAppController", function($scope, $http, $location) {
    $scope.path = "/";
    
    $scope.listDir = function(path) {
        $http({
            method: "GET",
            url: "http://" + $location.host() + ":" + $location.port() +"/api/list?path=" + path
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.files = data;
            $scope.path = path;
        }).error(function(data, status, headers, config) {
            console.log("listDir error");
        });
    }

    $scope.getParentPath = function(path) {
        var parentPath = path.substring(0, path.lastIndexOf("/"));
        if (parentPath === "")
            parentPath = "/";
        return parentPath;
    }

    $scope.listDir($scope.path);
});