
angular.module('planningBoardDemo', []).controller('demoCtrl', function ($scope) {
    'use strict';
    
    $scope.canMoveMyItem = function(id){
        console.log('canMoveItem ' + id);
    }
    $scope.moveMyItem = function(id){
        console.log('moveItem ' + id);
    }
    
}).directive('board', function () {
    return {
        restrict: 'E',
        //   controller: 'genBoardCtrl',
        scope: {
            name: '=',
            data: '=',
            layout: '=',
            canMoveItem: '&',
            moveItem: '&'
        },
        template: '<div style="margin: 20px; padding: 20px; border: 2px solid blue; width: 400px; display: flex; justify-content: space-around;">'+
        '<button ng-click="canMoveItem({id:42})">Call canMoveItem</button><button ng-click="moveItem({id:42})">Call moveItem</button></div>',
        link: function ($scope, $element) {
            $scope.$parent[name] = {
                refresh: function(){
                    console.log('refresh called!');
                }
            }
            
            $scope.callCanMoveItem = function(){
                $scope.canMoveItem({id: 42});
            }

        }
    };
});


