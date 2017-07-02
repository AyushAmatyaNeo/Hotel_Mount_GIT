/**
 * Created by punam on 9/30/16.
 */
angular.module('hris', [])
        .controller('leaveRequestController', function ($scope, $http) {

            var employeeId1 = angular.element(document.getElementById('employeeId')).val();
            var halfDay = angular.element(document.getElementById('halfDay'));

            var toggleSubstituteEmployee = function ($flag) {
                if ($flag) {
                    $('#substituteEmployeeCol').show();
                    $('#leaveSubstitute').prop('disabled', false);
                } else {
                    $('#substituteEmployeeCol').hide();
                    $('#leaveSubstitute').prop('disabled', true);
                }
            };
            var toggleGracePeriod  = function ($flag) {
                if ($flag) {
                    $('#gracePeriodCol').show();
                    $('#gracePeriod').prop('disabled', false);
                } else {
                    $('#gracePeriodCol').hide();
                    $('#gracePeriod').prop('disabled', true);
                }
            };

            toggleSubstituteEmployee(true);
            toggleGracePeriod(false);


            window.app.floatingProfile.setDataFromRemote(employeeId1);

            $scope.change = function () {
                var leaveId = angular.element(document.getElementById('leaveId')).val();
                var employeeId = angular.element(document.getElementById('employeeId')).val();
                window.app.pullDataById(document.url, {
                    action: 'pullLeaveDetail',
                    data: {
                        'leaveId': leaveId,
                        'employeeId': employeeId
                    }
                }).then(function (success) {
                    $scope.$apply(function () {
                        var temp = success.data;
                        $scope.availableDays = temp.BALANCE;

                        var availableDays = parseInt(temp.BALANCE);
                        var newValue = parseInt($("#noOfDays").val());

                        if ((availableDays != "" && newValue != "") && newValue > availableDays) {
                            $("#errorMsg").html("* Applied days can't be more than available days");
                            $("#request").attr("disabled", "disabled");
                        } else if ((availableDays != "" && newValue != "") && (newValue <= availableDays)) {
                            $("#errorMsg").html("");
                            $("#request").removeAttr("disabled");
                        }

                    });
                    if (success.data.ALLOW_GRACE_LEAVE == "Y") {
                        toggleSubstituteEmployee(false);
                        toggleGracePeriod(true);
                    } else {
                        toggleSubstituteEmployee(true);
                        toggleGracePeriod(false);
                    }






                }, function (failure) {
                    console.log(failure);
                });
            }

            $scope.employeeChange = function () {
                var employeeId = angular.element(document.getElementById('employeeId')).val();

                window.app.floatingProfile.setDataFromRemote(employeeId);

                window.app.pullDataById(document.url, {
                    action: 'pullLeaveDetailWidEmployeeId',
                    data: {
                        'employeeId': employeeId
                    }
                }).then(function (success) {
                    $scope.$apply(function () {
                        var temp = success.data;
                        var length = (success.leaveList).length;

                        $scope.leaveList = success.leaveList;
                        $scope.leaveId = $scope.leaveList[0];
                        $scope.availableDays = temp.BALANCE;


                        var availableDays = parseInt(temp.BALANCE);
                        var newValue = parseInt($("#noOfDays").val());

                        if ((availableDays != "" && newValue != "") && newValue > availableDays) {
                            $("#errorMsg").html("* Applied days can't be more than available days");
                            $("#request").attr("disabled", "disabled");
                        } else if ((availableDays != "" && newValue != "") && (newValue <= availableDays)) {
                            $("#errorMsg").html("");
                            $("#request").removeAttr("disabled");
                        }
                    });

                    if (success.data.ALLOW_GRACE_LEAVE == 'Y') {
                        toggleSubstituteEmployee(false);
                        toggleGracePeriod(true);
                    } else {
                        toggleSubstituteEmployee(true);
                        toggleGracePeriod(false);
                    }
                }, function (failure) {
                    console.log(failure);
                });

            }
        });


$(function () {
    $('body').on('keydown', '#form-recommendedRemarks', function (e) {
        if (e.which === 32 && e.target.selectionStart === 0) {
            return false;
        }
    });
});

$(function () {
    $('body').on('keydown', '#form-approvedRemarks', function (e) {
        if (e.which === 32 && e.target.selectionStart === 0) {
            return false;
        }
    });
});