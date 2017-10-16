//<grid-screen resource="api/data.json" table-calbacks="tableCallbacks">
//  <grid-columns>
//      <grid-column title="Name"     field="name"></grid-column>
//      <grid-column title="Street"   field="street"></grid-column>
//      <grid-column title="Zip"       field="zip"></grid-column>
//  </grid-columns>
//  <grid></grid>
//</grid-screen>

(function(modul){
   modul.directive('gridScreen', ['$http', function($http){
       return{
           restrict:"E",
           controller:function($scope){
               this.setColumns = function(cols){
                   $scope.cols = cols;
               }
           },
           link(scope, element, attr){
               $http.get(attr.resource).then(function(response){
                   scope.rows = response.data.data;
                
                   scope.$broadcast('ready-to-render', scope.rows, scope.cols);
               }, function(error){
                   console.log(error);
               });
               console.log('gridScreen link');
           }
       }
   }])
   modul.directive('gridColumns', [function(){
       return{
           restrict:"E",
           require: ['^gridScreen', 'gridColumns'],
           controller:function(){
               var cols = []
               this.setColumn = function(col){
                   cols.push(col);
               }
               this.getColumns = function(){
                   return cols;
               }
               console.log("cols", cols)
           },
           link(scope, element, attr, controllers){
               var gridScreenController = controllers[0];
               var gridColumnsController = controllers[1];
               gridScreenController.setColumns(gridColumnsController.getColumns())
               console.log('gridColumns link');
           }
       }
   }]) 
   modul.directive('gridColumn', [function(){
       return{
           restrict:"E",
           require:'^gridColumns',
           link(scope, element, attr, gridColumnsController){
               let obj = {
                   title:attr.title,
                   field:attr.field
               }
               gridColumnsController.setColumn(obj)
              console.log('gridColumn link'); 
           }
       }
   }]) 
   modul.directive('grid', [function(){
       return{
           restrict:"E",
           templateUrl:'./component/app.grid.html',
           link(scope, element, attr){
               scope.$on('ready-to-render', function($event, rows, cols){
                   console.log("rows, cols", rows, cols);
                   scope.rows = rows;
                   scope.cols = cols;
            
               });
               console.log('Grid link'); 
           }
       }
   }]) 
})(angular.module('app'));