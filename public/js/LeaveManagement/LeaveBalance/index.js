(function ($, app) {
    'use strict';
    $(document).ready(function () {
        $("select").select2();
        var $table = $("#table");
        var $search = $('#search');
        var columns = [
            {field: "EMPLOYEE_CODE", title: "Code", width: 150, locked: true},
            {field: "FULL_NAME", title: "Employee", width: 150, locked: true},
        ];
        var map = {
            'EMPLOYEE_CODE': 'Code',
            'EMPLOYEE_ID': 'Id', 
            'FULL_NAME': 'Name'
        };

        var columnOptions = [];
        columnOptions.push({'VALUES' : '0', 'COLUMNS' : 'Previous'});
        columnOptions.push({'VALUES' : '1', 'COLUMNS' : 'Total'});
        columnOptions.push({'VALUES' : '2', 'COLUMNS' : 'Taken'});

        var $options = $('#options');
        app.populateSelect($options, columnOptions, 'VALUES', 'COLUMNS');

        var leaveList = document.leaves;

        function reinitializeKendo(optionalColumns){
            columns = [
                {field: "EMPLOYEE_CODE", title: "Code", width: 150, locked: true},
                {field: "FULL_NAME", title: "Employee", width: 150, locked: true},
            ];
            var flag, flag2;
            var columnsList;
            for (var i in leaveList) {
                flag = false;
                flag2 = false;
                columnsList = {
                    title: leaveList[i]['LEAVE_ENAME'],
                    columns: [
                        {
                            title: 'Previous',
                            field: 'L' + leaveList[i]['LEAVE_ID'] + '_' + 'PREVIOUS_YEAR_BAL',
                            width: 100
                        },
                        {
                            title: 'Total',
                            field: 'L' + leaveList[i]['LEAVE_ID'] + '_' + 'TOTAL',
                            width: 100
                        },
                        {
                            title: 'Taken',
                            field: 'L' + leaveList[i]['LEAVE_ID'] + '_' + 'TAKEN',
                            width: 100
                        },
                        {
                            title: 'Balance',
                            field: 'L' + leaveList[i]['LEAVE_ID'] + '_' + 'BALANCE',
                            width: 100
                        }
                    ]
                };
                
                if(optionalColumns.indexOf("0") == -1){
                    columnsList.columns.splice(0,1);
                    flag = true;
                }
                if(optionalColumns.indexOf("1") == -1){
                    flag2 = true;
                    if(flag){
                        columnsList.columns.splice(0,1);
                    } 
                    else{
                        columnsList.columns.splice(1,1);
                    }
                }
                if(optionalColumns.indexOf("2") == -1){
                    if(flag == true && flag2 == true){
                        columnsList.columns.splice(0,1);
                    }
                    else if(flag == false && flag2 == false){
                        columnsList.columns.splice(2,1);
                    }
                    else{
                        columnsList.columns.splice(1,1);
                    }
                }
                
                columns.push(columnsList);

                if(optionalColumns.indexOf("1") != -1){
                    map['L' + leaveList[i]['LEAVE_ID'] + '_' + 'TOTAL'] = leaveList[i]['LEAVE_ENAME'] + '(Total)';
                }
                if(optionalColumns.indexOf("2") != -1){
                    map['L' + leaveList[i]['LEAVE_ID'] + '_' + 'TAKEN'] = leaveList[i]['LEAVE_ENAME'] + '(Taken)';
                }
            
                map['L' + leaveList[i]['LEAVE_ID'] + '_' + 'BALANCE'] = leaveList[i]['LEAVE_ENAME'] + '(Balance)';
            } 
        }
        reinitializeKendo([]);
        app.initializeKendoGrid($table, columns);
        app.searchTable($table, ['EMPLOYEE_ID', 'EMPLOYEE_CODE','FULL_NAME']);

        $search.on('click', function () {
            var optionalColumns = $options.val();
            $table.empty();
            
            if(optionalColumns != null){ reinitializeKendo(optionalColumns); }
            else{ reinitializeKendo([]); }
            app.initializeKendoGrid($table, columns);

            var q = document.searchManager.getSearchValues();
            App.blockUI({target: "#hris-page-content"});
            app.pullDataById(document.pullLeaveBalanceDetailLink, q).then(function (success) {
                App.unblockUI("#hris-page-content");
                app.renderKendoGrid($table, success.data);
            }, function (failure) {
                App.unblockUI("#hris-page-content");
            });
        });

        $('#excelExport').on("click", function () {
            app.excelExport($table, map, "Employee Leave Balance Report.xlsx");
        });
        $('#pdfExport').on("click", function () {
            app.exportToPDF($table, map, "Employee Leave Balance Report.pdf", 'A2');
        });
        
        $("#reset").on("click", function () {
            $(".form-control").val("");
        });

    });
})(window.jQuery, window.app);
