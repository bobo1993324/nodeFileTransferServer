var globalScope;


var nodeFileUploadApp = angular.module('nodeFileUploadApp', []);

nodeFileUploadApp.controller("NodeFileUploadAppController", function($scope, $http, $location) {
    globalScope = $scope;
    $scope.path = "/";
    $scope.showHiddenFile = false;

    $scope.listDir = function(path) {
        $http({
            method: "GET",
            url: "http://" + $location.host() + ":" + $location.port() +"/api/list?path=" + path
        }).success(function(data, status, headers, config) {
            $scope.files = data;
            path = path.replace("//", "/");
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

    $scope.fileClicked = function(file) {
        if (file.isDirectory) {
            $scope.listDir($scope.path + '/' + file.name)
        }
    };

    $scope.listDir($scope.path);
});