(function ($, app) {
    'use strict';


    $(document).ready(function () {
        

        app.addDatePicker($('#issueDate'));
        app.addDatePicker($('#requestDate'));
        app.addDatePicker($('#returnDate'));
        
        $("form").submit(function() {
          App.blockUI({target: "form"});
        });

    });

})(window.jQuery, window.app);


angular.module('hris', [])
        .controller('setupController', function ($scope, $http) {


            $scope.assetIssue = function (assetname, assetId) {
//                console.log(assetname);
//                console.log(assetId);
                $scope.asset = assetId;
                $scope.assetNameView = assetname;

                window.app.pullDataById(document.restfulUrl, {
                    action: 'pullAssetBalance',
                    data: {
                        assetId: $scope.asset
                    }

                }).then(function (success) {
                    $scope.$apply(function () {
                        if(success.data==null||success.data==0||success.data=='undefined'){
                        $('#IssueSubmitBtn').attr('disabled','disabled');
                        }else{
                            $('#IssueSubmitBtn').attr('disabled',false);
                        }
                        $scope.rQ = 'REM BALANCE: ' + success.data;
                        $scope.bal = success.data;
                        $("#quantity").attr({"max": success.data, "min": 1});
                    });
                }, function (error) {
                    console.log("error", error);
                })


            }
            
            
            $scope.radioClik = function () {
                console.log('sdfdsf');
                console.log($scope.rdChk);
                if ($scope.rdChk == false) {
                    $("#returnDate").prop('required', false);
                    $scope.rdTxt = '';
                } else {
                    $("#returnDate").prop('required', true);
                }
            }
            
            $scope.rdClk=function(){
                $scope.radioClik();
            }
            

            
            $("#assetSetupTable").on("click", "#btnIssue", function () {
                $('#returnedDate').val('');
                var issueButton =$(this);
                var selectedassetId=issueButton.attr('data-assetid');
                var selectedassetName=issueButton.attr('data-asset');
                
                $('#requestDate').val('');
                $('#issueDate').val('');
                $('#quantity').val('');
                $('#purposeTA').val('');
                $('#remarks').val('');
                $("#returnDate").val('');
                
                
                $scope.$apply(function(){
                $scope.assetIssue(selectedassetName, selectedassetId);
                });
            });



            $scope.astChange = function () {
                window.app.pullDataById(document.restfulUrl, {
                    action: 'pullAssetBalance',
                    data: {
                        assetId: $scope.asset
                    }

                }).then(function (success) {
                    $scope.$apply(function () {
                        $scope.rQ = 'REM BALANCE: ' + success.data;
                        $scope.bal = success.data;
                        $("#quantity").attr({"max": success.data, "min": 1});
                    });
                }, function (error) {
                    console.log("error", error);
                })
            };



            




        }).directive('assetissue', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var selector = attrs.selector;
            var fun = $parse(attrs.assetissue);
            element.on('click', selector, function (e) {
                // no need to create a jQuery object to get the attribute 
                var idx = e.target.getAttribute('data-index');
                fun(scope)(idx);
//            console.log(e);
            });

        }
    };
});


// var selector = attrs.selector;
//            var fun = $parse(attrs.clickChildren);
//            element.on('click', selector, function (e) {
//                // no need to create a jQuery object to get the attribute 
//                var idx = e.target.getAttribute('data-index');
//                fun(scope)(idx);
//            });
