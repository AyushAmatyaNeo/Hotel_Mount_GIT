(function ($, app) {
    'use strict';
    $(document).ready(function () {
        $("select").select2();
        var $overtimeDate = $("#overtimeDate")
        app.datePickerWithNepali("overtimeDate", "nepaliDate");
        app.getServerDate().then(function (response) {
            $overtimeDate.datepicker('setEndDate', app.getSystemDate(response.data.serverDate));
        }, function (error) {
            console.log("error=>getServerDate", error);
        });
        app.startEndDatePickerWithNepali('nepaliFromDate', 'fromDate', 'nepaliToDate', 'toDate');
    });
})(window.jQuery, window.app);

angular.module('hris', [])
        .controller("attendanceWidOTListController", function ($scope, $http) {
            var $tableContainer = $("#attendanceWidOTTable");
            $scope.view = function () {
                var employeeId = angular.element(document.getElementById('employeeId')).val();
                var companyId = angular.element(document.getElementById('companyId')).val();
                var branchId = angular.element(document.getElementById('branchId')).val();
                var departmentId = angular.element(document.getElementById('departmentId')).val();
                var designationId = angular.element(document.getElementById('designationId')).val();
                var positionId = angular.element(document.getElementById('positionId')).val();
                var serviceTypeId = angular.element(document.getElementById('serviceTypeId')).val();
                var serviceEventTypeId = angular.element(document.getElementById('serviceEventTypeId')).val();
                var fromDate = angular.element(document.getElementById('fromDate')).val();
                var toDate = angular.element(document.getElementById('toDate')).val();
                var status = angular.element(document.getElementById('statusId')).val();
                var employeeTypeId = angular.element(document.getElementById('employeeTypeId')).val();
                var overtimeOnly = 0;
                if(($("#overtimeOnly").is(":checked"))){
                    overtimeOnly=1;
                }
                App.blockUI({target: "#hris-page-content"});
                window.app.pullDataById(document.url, {
                    action: 'pullAttendanceWidOvertimeList',
                    data: {
                        'employeeId': employeeId,
                        'companyId': companyId,
                        'branchId': branchId,
                        'departmentId': departmentId,
                        'designationId': designationId,
                        'positionId': positionId,
                        'serviceTypeId': serviceTypeId,
                        'serviceEventTypeId': serviceEventTypeId,
                        'fromDate': fromDate,
                        'toDate': toDate,
                        'status': status,
                        'employeeTypeId':employeeTypeId,
                        'overtimeOnly':parseInt(overtimeOnly)
                    }
                }).then(function (success) {
                    App.unblockUI("#hris-page-content");
                    console.log(success.data);
                    $scope.initializekendoGrid(success.data);
                    window.app.scrollTo('attendanceWidOTTable');
                }, function (failure) {
                    App.unblockUI("#hris-page-content");
                    console.log(failure);
                });
            };

            $scope.initializekendoGrid = function (attendanceList) {
                $("#attendanceWidOTTable").kendoGrid({
                    excel: {
                        fileName: "AttendanceWidOTList.xlsx",
                        filterable: true,
                        allPages: true
                    },
                    dataSource: {
                        data: attendanceList,
                        pageSize: 20
                    },
                    height: 450,
                    scrollable: true,
                    sortable: true,
                    filterable: true,
                    pageable: {
                        input: true,
                        numeric: false
                    },
                    dataBound: gridDataBound,
                    rowTemplate: kendo.template($("#rowTemplate").html()),
                    columns: [
                        {field: "FIRST_NAME", title: "Employee", width: 160},
                        {field: "ATTENDANCE_DT", title: "Attendance Date", width: 120},
                        {field: "IN_TIME", title: "Check In", width: 80},
                        {field: "OUT_TIME", title: "Check Out", width: 100},
                        {field: "STATUS", title: "Status", width: 80},
                        {field: "DETAILS", title: "Overtime(From-To)", width: 150},
                        {field: "TOTAL_HOUR", title: "Overtime(in Hour)", width: 130},
                        {title: "Action", width: 80}
                    ]
                });
            };
            function gridDataBound(e) {
                var grid = e.sender;
                if (grid.dataSource.total() == 0) {
                    var colCount = grid.columns.length;
                    $(e.sender.wrapper)
                            .find('tbody')
                            .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">There is no data to show in the grid.</td></tr>');
                }
            }
            ;
            $("#export").click(function (e) {
                var rows = [{
                        cells: [
                            {value: "Employee Name"},
                            {value: "Attendance Date"},
                            {value: "Check In Time"},
                            {value: "Check Out Time"},
                            {value: "Late In Reason"},
                            {value: "Late Out Reason"},
                            {value: "Total Hour"},
                            {value: "Overtime(From-To)"},
                            {value: "Overtime(in Hour)"},
                            {value: "Status"}
                        ]
                    }];
                var dataSource = $("#attendanceWidOTTable").data("kendoGrid").dataSource;
                var filteredDataSource = new kendo.data.DataSource({
                    data: dataSource.data(),
                    filter: dataSource.filter()
                });

                filteredDataSource.read();
                var data = filteredDataSource.view();

                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    var middleName = dataItem.MIDDLE_NAME != null ? " " + dataItem.MIDDLE_NAME + " " : " ";
                    var details = [];
                    for (var j = 0; j < dataItem.DETAILS.length; j++) {
                        details.push(dataItem.DETAILS[j].START_TIME + "-" + dataItem.DETAILS[j].END_TIME);
                    }
                    var details1 = details.toString();
                    rows.push({
                        cells: [
                            {value: dataItem.FIRST_NAME + middleName + dataItem.LAST_NAME},
                            {value: dataItem.ATTENDANCE_DT},
                            {value: dataItem.IN_TIME},
                            {value: dataItem.OUT_TIME},
                            {value: dataItem.IN_REMARKS},
                            {value: dataItem.OUT_REMARKS},
                            {value: dataItem.TOTAL_HOUR},
                            {value: details1},
                            {value: dataItem.OVERTIME_IN_HOUR},
                            {value: dataItem.STATUS}
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
                            title: "Attendance Wid Overtime Report",
                            rows: rows
                        }
                    ]
                });
                kendo.saveAs({dataURI: workbook.toDataURL(), fileName: "AttendanceWidOTList.xlsx"});
            }

            window.app.UIConfirmations();

        });
