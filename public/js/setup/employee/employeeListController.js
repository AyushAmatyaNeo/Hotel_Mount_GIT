//angular.module('hris', ["kendo.directives"])
(function ($, app) {
    'use strict';
    $(document).ready(function () {
        $("select").select2();
    });
})(window.jQuery, window.app);

angular.module('hris', [])
        .controller('employeeListController', function ($scope, $http) {
//            $scope.gridData = new kendo.data.ObservableArray([
//            ]);
//            $scope.gridColumns = [
//                {field: "employeeCode", title: "Employee Code"},
//                {field: "firstName", title: "Name"},
//                {field: "birthDate", title: "Birth Date"},
//                {field: "mobileNo", title: "Mobile No"},
//                {field: "emailOfficial", title: "Email Official"},
//                {title: "Action"}
//            ];
//            $scope.kendoGridOptions = {
//                height: 550,
//                scrollable: true,
//                sortable: true,
//                filterable: true,
//                rowTemplate: kendo.template($("#rowTemplate").html()),
//                pageable: {
//                    input: true,
//                    numeric: false
//                },
//            };
            $scope.view = function () {
                var employeeId = angular.element(document.getElementById('employeeId')).val();
                var branchId = angular.element(document.getElementById('branchId')).val();
                var departmentId = angular.element(document.getElementById('departmentId')).val();
                var designationId = angular.element(document.getElementById('designationId')).val();
                var positionId = angular.element(document.getElementById('positionId')).val();
                var serviceTypeId = angular.element(document.getElementById('serviceTypeId')).val();
                var serviceEventTypeId = angular.element(document.getElementById('serviceEventTypeId')).val();

                window.app.pullDataById(document.url, {
                    action: 'pullEmployeeList',
                    data: {
                        'employeeId': employeeId,
                        'branchId': branchId,
                        'departmentId': departmentId,
                        'designationId': designationId,
                        'positionId': positionId,
                        'serviceTypeId': serviceTypeId,
                        'serviceEventTypeId': serviceEventTypeId
                    }
                }).then(function (success) {
                    $scope.initializekendoGrid(success.data);
                    console.log("pullEmployeeList", success.data);
                    $scope.$apply(function () {
//                        $scope.gridData.splice(0, $scope.gridData.length);
//                        angular.forEach(success.data, function (value, key) {
//                            $scope.gridData.push(value);
//                        });

                    });
                }, function (failure) {
                    console.log(failure);
                });
            };

            $scope.initializekendoGrid = function (employees) {
                $("#employeeTable").kendoGrid({
                    excel: {
                        fileName: "EmployeeList.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    dataSource: {
                        data: employees,
                        pageSize: 20,
                    },
                    height: 450,
                    scrollable: true,
                    sortable: true,
                    filterable: true,
                    pageable: {
                        input: true,
                        numeric: false
                    },
                    rowTemplate: kendo.template($("#rowTemplate").html()),
                    columns: [
                        {field: "employeeCode", title: "Employee Code", width: 130},
                        {field: "firstName", title: "Name", width: 220},
                        {field: "birthDate", title: "Birth Date", width: 120},
                        {field: "mobileNo", title: "Mobile No", width: 130},
                        {field: "emailOfficial", title: "Email Official", width: 200},
                        {title: "Action", width: 120}
                    ]
                });

//                $("#export").click(function (e) {
//                    var grid = $("#employeeTable").data("kendoGrid");
//                    grid.saveAsExcel();
//                });

                $("#export").click(function (e) {
                    var rows = [{
                            cells: [
                                {value: "Employee Code"},
                                {value: "Employee Name"},
                                {value: "Name in Nepali"},
                                {value: "Gender"},
                                {value: "Birth Date"},
                                {value: "Coutry"},
                                {value: "Religion"},
                                {value: "Companies"},
                                {value: "Blood Group"},
                                {value: "Mobile No"},
                                {value: "Telephone No"},
                                {value: "Social Activity"},
                                {value: "Extension Number"},
                                {value: "Email Official"},
                                {value: "Email Personal"},
                                {value: "Social Network"},
                                {value: "Permanent House No."},
                                {value: "Permanent Ward No."},
                                {value: "Permanent Street Address"},
                                {value: "Permanent Zone"},
                                {value: "Permanent District"},
                                {value: "Permanent VDC"},
                                {value: "Temporary House No."},
                                {value: "Temporary Ward No."},
                                {value: "Temporary Street Address"},
                                {value: "Temporary Zone"},
                                {value: "Temporary District"},
                                {value: "Temporary VDC"},
                                {value: "Emergency Contact Name"},
                                {value: "Emergency Contact Member Relationship"},
                                {value: "Emergency Address"},
                                {value: "Emergency Phone No."},
                                {value: "Father Name"},
                                {value: "Father Occupation"},
                                {value: "Grand Father Name"},
                                {value: "Marital Status"},
                                {value: "Spouse Name"},
                                {value: "Spouse Occupation"},
                                {value: "Mother Name"},
                                {value: "Mother Occupation"},
                                {value: "Grand Mother Name"},
                                {value: "Spouse Birth Date"},
                                {value: "Wedding Anniversary"},
                                {value: "ID Card No."},
                                {value: "ID Lb Rf."},
                                {value: "ID Bar Code"},
                                {value: "Provident Fund No."},
                                {value: "Driving License No."},
                                {value: "Driving License Expiry"},
                                {value: "Driving License Type"},
                                {value: "Passport No."},
                                {value: "Citizenship No."},
                                {value: "Citizenship Issue Place"},
                                {value: "Thumb ID"},
                                {value: "Pan No."},
                                {value: "Account ID"},
                                {value: "CIT No."},
                                {value: "Citizenship Issue Date"},
                                {value: "Passport Expiry"},
                                {value: "Join Date"},
                                {value: "Salary"},
                                {value: "Salary PF"},
                                {value: "Service Type Name"},
                                {value: "Salary PF"},
                                {value: "Service Type Name"},
                                {value: "Service Event Type Name"},
                                {value: "Position Name"},
                                {value: "Designation Name"},
                                {value: "Department Name"},
                                {value: "Branch Name"},
                            ]
                        }];
                    var dataSource = $("#employeeTable").data("kendoGrid").dataSource;
                    var filteredDataSource = new kendo.data.DataSource({
                        data: dataSource.data(),
                        filter: dataSource.filter()
                    });

                    filteredDataSource.read();
                    var data = filteredDataSource.view();

                    for (var i = 0; i < data.length; i++) {
                        var dataItem = data[i];
                        rows.push({
                            cells: [
                                {value: dataItem.SN},
                                {value: dataItem.POSITION_NAME},
                                {value: dataItem.REMARKS}
                            ]
                        });
                    }
                    excelExport(rows);
                    e.preventDefault();
                });

                function excelExport(rows) {
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [
                            {
                                columns: [
                                    {autoWidth: true},
                                    {autoWidth: true},
                                    {autoWidth: true}
                                ],
                                title: "Employee",
                                rows: rows
                            }
                        ]
                    });
                    kendo.saveAs({dataURI: workbook.toDataURL(), fileName: "EmployeeList.xlsx"});
                }

                window.app.UIConfirmations();
            };

        });

