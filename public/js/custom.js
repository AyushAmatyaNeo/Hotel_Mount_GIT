window.app = (function ($, toastr, App) {
    "use strict";
    $(document).ready(function () {
        App.setAssetsPath(document.basePath + '/assets/');
    });

    var format = "dd-M-yyyy";
    window.toastr.options = {"positionClass": "toast-bottom-right"};


    var pullDataById = function (url, data) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                data: data,
                type: 'POST',
                error: function (error) {
                    reject(error);
                },
                success: function (data) {
                    resolve(data);
                }

            });
        });
    };

    var populateSelectElement = function (element, data, selectedId) {
        element.html('');
        for (var key in data) {
            var $option = $('<option>', {value: key, text: data[key]});
            if (typeof selectedId !== 'undefined' && selectedId != null && key == selectedId) {
                $option.prop('selected', true);
            }
            element.append($option);
        }
    };

    var fetchAndPopulate = function (url, id, element, callback) {
        pullDataById(url, {id: id}).then(function (data) {
            console.log('data', data);
            populateSelectElement(element, data);
            if (typeof callback !== 'undefined') {
                callback();
            }
        }, function (error) {
            console.log("Error fetching Districts", error);
        });
    }


    var addDatePicker = function () {
        for (var x in arguments) {
            arguments[x].datepicker({
                format: format,
                todayHighlight: true,
                autoclose: true,
                setDate: new Date()
            });

        }
    };
    var addComboTimePicker = function () {
        for (var x in arguments) {
            arguments[x].combodate({
                minuteStep: 1
            });
        }
    }
    var floatToRound = function round(value, exp) {
        if (typeof exp === 'undefined' || +exp === 0)
            return Math.round(value);

        value = +value;
        exp = +exp;

        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
            return NaN;

        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
    }

    var startEndDatePicker = function (fromDate, toDate, fn) {
        if (typeof fromDate === 'undefined' || fromDate == null || typeof toDate === 'undefined' || toDate == null) {
            return;
        }
        var $fromDate = $("#" + fromDate);
        var $toDate = $("#" + toDate);
        $fromDate.datepicker({
            format: format,
            todayHighlight: true,
            autoclose: true,
        }).on('changeDate', function (selected) {
            var minDate = new Date(selected.date.valueOf());
            $toDate.datepicker('setStartDate', minDate);
            if (typeof fn !== "undefined" && fn != null && typeof $fromDate !== "undefined" &&
                    $fromDate.val() != "" && typeof $toDate !== "undefined" && $toDate.val() != "") {
                fn(getDate($fromDate.val()), getDate($toDate.val()));
            }
        });

        $toDate.datepicker({
            format: format,
            todayHighlight: true,
            autoclose: true
        }).on('changeDate', function (selected) {
            var maxDate = new Date(selected.date.valueOf());
            $fromDate.datepicker('setEndDate', maxDate);
            if (typeof fn !== "undefined" && fn != null && typeof $fromDate !== "undefined" &&
                    $fromDate.val() != "" && typeof $toDate !== "undefined" && $toDate.val() != "") {
                fn(getDate($fromDate.val()), getDate($toDate.val()));
            }
        });
    };

    var startEndDatePickerWithNepali = function (fromNepali, fromEnglish, toNepali, toEnglish, fn, setToDate) {

        var $fromNepaliDate = $('#' + fromNepali);
        var $fromEnglishDate = $('#' + fromEnglish);
        var $toNepaliDate = $('#' + toNepali);
        var $toEnglishDate = $('#' + toEnglish);

        var oldFromNepali = null;
        var oldtoNepali = null;

        $fromNepaliDate.nepaliDatePicker({
            npdMonth: true,
            npdYear: true,
            onChange: function () {
                var toVal = $toNepaliDate.val();
                if (toVal === 'undefined' || toVal == '') {
                    var temp = nepaliDatePickerExt.fromNepaliToEnglish($fromNepaliDate.val());
                    $fromEnglishDate.val(temp);
                    $toEnglishDate.datepicker('setStartDate', nepaliDatePickerExt.getDate(temp));
                    oldFromNepali = $fromNepaliDate.val();

                    //to set value of to date from value of from date
                    if (typeof setToDate !== "undefined" && setToDate != null && setToDate != false) {
                        $toEnglishDate.val(temp);
                        $toNepaliDate.val(oldFromNepali);
                    }
                } else {
                    var fromDate = nepaliDatePickerExt.fromNepaliToEnglish($fromNepaliDate.val());
                    var toDate = nepaliDatePickerExt.fromNepaliToEnglish($toNepaliDate.val());
                    try {
                        var fromEnglishStartDate = $fromEnglishDate.datepicker('getStartDate');
//                        if (fromEnglishStartDate !== -Infinity && (fromEnglishStartDate.getTime() > nepaliDatePickerExt.getDate(fromDate).getTime())) {
                        if (fromEnglishStartDate !== -Infinity && daysBetween(nepaliDatePickerExt.getDate(fromDate), fromEnglishStartDate) > 0) {
                            throw {message: 'The Selected Date cannot be less than ' + fromEnglishStartDate};
                        }
                        var fromEnglishEndDate = $fromEnglishDate.datepicker('getEndDate');
//                        if (fromEnglishEndDate !== Infinity && (fromEnglishEndDate.getTime() < nepaliDatePickerExt.getDate(fromDate).getTime())) {
                        if (fromEnglishEndDate !== Infinity && daysBetween(fromEnglishEndDate, nepaliDatePickerExt.getDate(fromDate)) > 0) {
                            throw {message: 'The Selected Date cannot be more than ' + fromEnglishEndDate};
                        }

//                        if (nepaliDatePickerExt.getDate(toDate).getTime() > nepaliDatePickerExt.getDate(fromDate).getTime()) {
                        if (daysBetween(nepaliDatePickerExt.getDate(fromDate), nepaliDatePickerExt.getDate(toDate)) >= 0) {
                            var temp = nepaliDatePickerExt.fromNepaliToEnglish($fromNepaliDate.val());
                            $fromEnglishDate.val(temp);
                            $toEnglishDate.datepicker('setStartDate', nepaliDatePickerExt.getDate(temp));
                            oldFromNepali = $fromNepaliDate.val();

                            if (typeof fn !== "undefined" && fn != null && typeof $fromEnglishDate !== "undefined" &&
                                    $fromEnglishDate.val() != "" && typeof $toEnglishDate !== "undefined" && $toEnglishDate.val() != "") {
                                fn(getDate($fromEnglishDate.val()), getDate($toEnglishDate.val()), $fromEnglishDate.val(), $toEnglishDate.val());
                            }

                        } else {
                            throw {message: "Selected Date should not exceed more than " + toVal};
                        }

                    } catch (e) {
                        errorMessage(e.message);
                        $fromNepaliDate.focus();
                        $fromNepaliDate.val(oldFromNepali);
                    }
                }
            }
        });

        $fromEnglishDate.datepicker({
            format: 'dd-M-yyyy',
            todayHighlight: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($(this).val() != null && $(this).val() !== "") {
                oldFromNepali = nepaliDatePickerExt.fromEnglishToNepali($(this).val());
                $fromNepaliDate.val(oldFromNepali);
                var minDate = nepaliDatePickerExt.getDate($(this).val());
                $toEnglishDate.datepicker('setStartDate', minDate);
            }
            //to set value of to date from value of from date
            if (typeof setToDate !== "undefined" && setToDate != null && setToDate != false) {
                $toEnglishDate.datepicker('update', $(this).val());
                oldtoNepali = nepaliDatePickerExt.fromEnglishToNepali($(this).val())
                $toNepaliDate.val(oldtoNepali);
            }

            if (typeof fn !== "undefined" && fn != null && typeof $fromEnglishDate !== "undefined" &&
                    $fromEnglishDate.val() != "" && typeof $toEnglishDate !== "undefined" && $toEnglishDate.val() != "") {
                fn(getDate($fromEnglishDate.val()), getDate($toEnglishDate.val()), $fromEnglishDate.val(), $toEnglishDate.val());
            }

        });

        $toNepaliDate.nepaliDatePicker({
            npdMonth: true,
            npdYear: true,
            onChange: function () {
                var fromVal = $fromNepaliDate.val();
                if (fromVal === 'undefined' || fromVal == '') {
                    var temp = nepaliDatePickerExt.fromNepaliToEnglish($toNepaliDate.val());
                    $toEnglishDate.val(temp);
                    $fromEnglishDate.datepicker('setEndDate', nepaliDatePickerExt.getDate(temp));
                    oldtoNepali = $toNepaliDate.val();
                } else {
                    var fromDate = nepaliDatePickerExt.fromNepaliToEnglish($fromNepaliDate.val());
                    var toDate = nepaliDatePickerExt.fromNepaliToEnglish($toNepaliDate.val());

                    try {
                        var toEnglishStartDate = $toEnglishDate.datepicker('getStartDate');
//                        if ((toEnglishStartDate !== -Infinity) && (toEnglishStartDate.getTime() > nepaliDatePickerExt.getDate(toDate).getTime())) {
                        if ((toEnglishStartDate !== -Infinity) && daysBetween(nepaliDatePickerExt.getDate(toDate), toEnglishStartDate) > 0) {
                            throw {message: 'The Selected Date cannot be less than ' + toEnglishStartDate};
                        }
                        var toEnglishEndDate = $toEnglishDate.datepicker('getEndDate');
//                        if (toEnglishEndDate !== Infinity && (toEnglishEndDate.getTime() < nepaliDatePickerExt.getDate(toDate).getTime())) {
                        if (toEnglishEndDate !== Infinity && daysBetween(toEnglishEndDate, nepaliDatePickerExt.getDate(toDate)) > 0) {
                            throw {message: 'The Selected Date cannot be more than ' + toEnglishEndDate};
                        }

//                        if (nepaliDatePickerExt.getDate(toDate).getTime() > nepaliDatePickerExt.getDate(fromDate).getTime()) {
                        if (daysBetween(nepaliDatePickerExt.getDate(fromDate), nepaliDatePickerExt.getDate(toDate)) >= 0) {
                            var temp = nepaliDatePickerExt.fromNepaliToEnglish($toNepaliDate.val());
                            $toEnglishDate.val(temp);
                            $fromEnglishDate.datepicker('setEndDate', nepaliDatePickerExt.getDate(temp));
                            oldtoNepali = $toNepaliDate.val();

                            if (typeof fn !== "undefined" && fn != null && typeof $fromEnglishDate !== "undefined" &&
                                    $fromEnglishDate.val() != "" && typeof $toEnglishDate !== "undefined" && $toEnglishDate.val() != "") {
                                fn(getDate($fromEnglishDate.val()), getDate($toEnglishDate.val()), $fromEnglishDate.val(), $toEnglishDate.val());
                            }

                        } else {
                            throw {message: "Selected Date should not preceed more than " + fromVal};
                        }

                    } catch (e) {
                        errorMessage(e.message);
                        $toNepaliDate.focus();
                        $toNepaliDate.val(oldtoNepali);
                    }


                }
            }
        });

        $toEnglishDate.datepicker({
            format: 'dd-M-yyyy',
            todayHighlight: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($(this).val() != null && $(this).val() !== "") {
                oldtoNepali = nepaliDatePickerExt.fromEnglishToNepali($(this).val())
                $toNepaliDate.val(oldtoNepali);
                var maxDate = nepaliDatePickerExt.getDate($(this).val());
                $fromEnglishDate.datepicker('setEndDate', maxDate);
            }
            if (typeof fn !== "undefined" && fn != null && typeof $fromEnglishDate !== "undefined" &&
                    $fromEnglishDate.val() != "" && typeof $toEnglishDate !== "undefined" && $toEnglishDate.val() != "") {
                fn(getDate($fromEnglishDate.val()), getDate($toEnglishDate.val()), $fromEnglishDate.val(), $toEnglishDate.val());
            }
        });

        $fromNepaliDate.on('input', function () {
            console.log('changed', this);
        });

        /*
         * 
         * check for fromEnglish input and toEnglish input is set or not and setting nepalidate.
         */
        var fromEnglishDateValue = $fromEnglishDate.val();
        var toEnglishDateValue = $toEnglishDate.val();
        if (typeof fromEnglishDateValue !== 'undefined' && fromEnglishDateValue !== null && fromEnglishDateValue !== '') {
            $fromNepaliDate.val(nepaliDatePickerExt.fromEnglishToNepali(fromEnglishDateValue));
        }
        if (typeof toEnglishDateValue !== 'undefined' && toEnglishDateValue !== null && toEnglishDateValue !== '') {
            $toNepaliDate.val(nepaliDatePickerExt.fromEnglishToNepali(toEnglishDateValue));
        }
        /*
         * 
         */

    };

    var datePickerWithNepali = function (englishDate, nepaliDate) {
        var $nepaliDate = $('#' + nepaliDate);
        var $englishDate = $('#' + englishDate);
        var oldNepali = null;

        $nepaliDate.nepaliDatePicker({
            npdMonth: true,
            npdYear: true,
            onChange: function () {
                var temp = nepaliDatePickerExt.fromNepaliToEnglish($nepaliDate.val());
                var englishStartDate = $englishDate.datepicker('getStartDate');
                var englishEndDate = $englishDate.datepicker('getEndDate');
                try {
                    if (englishStartDate !== -Infinity && englishStartDate.getTime() >= nepaliDatePickerExt.getDate(temp).getTime()) {
                        throw {message: 'The Selected Date cannot be less than ' + englishStartDate};
                    }
                    if (englishEndDate !== Infinity && englishEndDate.getTime() <= nepaliDatePickerExt.getDate(temp).getTime()) {
                        throw {message: 'The Selected Date cannot be more than ' + englishEndDate};
                    }

                    $englishDate.val(temp);
                    oldNepali = $nepaliDate.val();

                } catch (e) {
                    errorMessage(e.message);
                    $nepaliDate.focus();
                    $nepaliDate.val(oldNepali);
                }


            }
        });

        $englishDate.datepicker({
            format: 'dd-M-yyyy',
            todayHighlight: true,
            autoclose: true
        }).on('changeDate', function () {
            $nepaliDate.val(nepaliDatePickerExt.fromEnglishToNepali($(this).val()));
        });

        var englishDateValue = $englishDate.val();
        if (typeof englishDateValue !== 'undefined' && englishDateValue !== null && englishDateValue !== '') {
            $nepaliDate.val(nepaliDatePickerExt.fromEnglishToNepali(englishDateValue));
        }

    };

    var addTimePicker = function () {
        for (var x in arguments) {
            arguments[x].timepicker({
                minuteStep: 1
            });
        }
    }

    var angularDatePicker = function () {
        $(this).datepicker({
            format: format,
            todayHighlight: true,
            autoclose: true,
            setDate: new Date()
        });
    };

    var successMessage = function (message, title) {
        if (typeof title === 'undefined') {
            title = "Notifications";
        }
        if (message && (message.length > 0)) {
            window.toastr.success(message[0], title);
        }
    };

    successMessage(document.messages);

    var errorMessage = function (message, title) {
        if (message) {
            window.toastr.error(message, title);
        }
    }
    var showMessage = function (message, type, title) {
        try {
            if (typeof message === 'undefined') {
                throw {message: 'No message provided.'};
            }
            if (typeof type === 'undefined') {
                type = 'info';
            } else if ($.inArray(type, ['info', 'success', 'error', 'warning']) === -1) {
                throw {message: 'Type defined must be info,success,error or warning.'};
            }
            if (typeof title === 'undefined') {
                title = "System Information";
            }

            window.toastr[type](message, title);

        } catch (e) {
            console.log('showMessage()=>', e.message);
        }
    };

    var floatingProfile = {
        minStatus: false,
        obj: document.querySelector('#floating-profile'),
        view: {
            name: $('#floating-profile  #name'),
            mobileNo: $('#floating-profile #mobileNo'),
            appDate: $('#floating-profile #appDate'),
            appBranch: $('#floating-profile #appBranch'),
            appDepartment: $('#floating-profile #appDepartment'),
            appDesignation: $('#floating-profile #appDesignation'),
            appPosition: $('#floating-profile #appPosition'),
            appServiceType: $('#floating-profile #appServiceType'),
            appServiceEventType: $('#floating-profile #appServiceEventType'),
            branch: $('#floating-profile #branch'),
            department: $('#floating-profile #department'),
            designation: $('#floating-profile #designation'),
            position: $('#floating-profile #position'),
            serviceType: $('#floating-profile #serviceType'),
            serviceEventType: $('#floating-profile #serviceEventType'),
            recommenderName: $('#floating-profile #recommenderName'),
            approverName: $('#floating-profile #approverName'),
            image: $('#floating-profile #profile-image'),
            header: $('#floating-profile #profile-header'),
            body: $('#floating-profile #profile-body'),
            minMaxBtn: $('#floating-profile #min-max-btn')
        },
        data: {
            employeeId: null,
            firstName: null,
            middleName: null,
            lastName: null,
            apptDate: null,
            appBranch: null,
            appDepartment: null,
            appDesignation: null,
            appPosition: null,
            appServiceType: null,
            appServiceEventType: null,
            branch: null,
            department: null,
            designation: null,
            position: null,
            serviceType: null,
            serviceEventType: null,
            mobileNo: null,
            recommenderName: null,
            approverName: null,
            recommenderId: null,
            approverId: null,
            imageFilePath: null
        },
        registeredFunctions: [],
        makeDraggable: function () {
            $(this.obj).draggable();
        },
        show: function () {
            $(this.obj).show();
        },
        hide: function () {
            $(this.obj).hide();
        },
        setDataFromRemote: function (empId) {
            if (typeof empId === "undefined" || empId == null || empId < 0) {
                console.log("Unknown Employee Id");
                return;
            }
            pullDataById(document.restfulUrl, {
                action: 'pullEmployeeDetailById',
                data: {employeeId: empId}
            }).then(function (response) {
                if (!response.success || typeof response.data === "undefined" || response.data === null) {
                    return;
                }
                this.data.employeeId = response.data['EMPLOYEE_ID'];
                this.data.firstName = response.data['FIRST_NAME'];
                this.data.middleName = (response.data['MIDDLE_NAME'] == null) ? "" : response.data['MIDDLE_NAME'];
                this.data.lastName = response.data['LAST_NAME'];
                this.data.appDate = response.data['JOIN_DATE'];

                this.data.appBranch = response.data['APP_BRANCH'];
                this.data.appDepartment = response.data['APP_DEPARTMENT'];
                this.data.appDesignation = response.data['APP_DESIGNATION'];
                this.data.appPosition = (response.data['APP_POSITION'] == null) ? "" : response.data['APP_POSITION'];
                this.data.appServiceType = (response.data['APP_SERVICE_TYPE'] == null) ? "" : response.data['APP_SERVICE_TYPE'];
                this.data.appServiceEventType = (response.data['APP_SERVICE_EVENT_TYPE'] == null) ? "" : response.data['APP_SERVICE_EVENT_TYPE'];

                this.data.branch = (response.data['BRANCH'] == null) ? "" : response.data['BRANCH'];
                this.data.department = response.data['DEPARTMENT'];
                this.data.designation = response.data['DESIGNATION'];
                this.data.position = (response.data['POSITION'] == null) ? "" : response.data['POSITION'];
                this.data.serviceType = (response.data['SERVICE_TYPE'] == null) ? "" : response.data['SERVICE_TYPE'];
                this.data.serviceEventType = (response.data['SERVICE_EVENT_TYPE'] == null) ? "" : response.data['SERVICE_EVENT_TYPE'];

                this.data.mobileNo = (response.data['MOBILE_NO'] == null) ? "" : response.data['MOBILE_NO'];
                this.data.imageFilePath = (response.data['FILE_NAME'] == null) ? "" : response.data['FILE_NAME'];
                this.data.recommenderName = (response.data['RECOMMENDER'] == null) ? "" : response.data['RECOMMENDER'];
                this.data.approverName = (response.data['APPROVER'] == null) ? "" : response.data['APPROVER'];
                this.data.recommenderId = (response.data['RECOMMENDER_ID'] == null) ? "" : response.data['RECOMMENDER_ID'];
                this.data.approverId = (response.data['APPROVER_ID'] == null) ? "" : response.data['APPROVER_ID'];
                this.refreshView();
                this.show();
                for (var i = 0; i < this.registeredFunctions.length; i++) {
                    this.registeredFunctions[i](this.data);
                }
            }.bind(this), function (failure) {
                console.log(failure);
            });
        },
        setData: function (emp) {
            this.data = emp;
        },
        refreshView: function () {
            this.view.name.text(this.data.firstName + " " + this.data.middleName + " " + this.data.lastName);
            //this.view.gender.text(this.data.genderId == 1 ? "Male" : this.data.genderId == 2 ? "Female" : "Other");

            this.view.appDate.text(this.data.appDate);

            this.view.appBranch.text(this.data.appBranch);
            this.view.appDepartment.text(this.data.appDepartment);
            this.view.appDesignation.text(this.data.appDesignation);
            this.view.appPosition.text(this.data.appPosition);
            this.view.appServiceType.text(this.data.appServiceType);
            this.view.appServiceEventType.text(this.data.appServiceEventType);

            this.view.branch.text(this.data.branch);
            this.view.department.text(this.data.department);
            this.view.designation.text(this.data.designation);
            this.view.position.text(this.data.position);
            this.view.serviceType.text(this.data.serviceType);
            this.view.serviceEventType.text(this.data.serviceEventType);
            this.view.recommenderName.text(this.data.recommenderName);
            this.view.approverName.text(this.data.approverName);

            this.view.mobileNo.text(this.data.mobileNo);
            if (this.data.imageFilePath != null && (typeof this.data.imageFilePath !== "undefined") && this.data.imageFilePath.length >= 4) {
                this.view.image.attr('src', document.basePath + "/uploads/" + this.data.imageFilePath);
            } else {
                this.view.image.attr('src', document.basePath + "/img/profile_empty.jpg");
            }
        },
        minimize: function () {
            this.view.body.hide();
            this.view.minMaxBtn.removeClass("fa-minus");
            this.view.minMaxBtn.addClass("fa-plus");
//            $(this.obj).css("height", 20);
            this.view.body.hide();
            this.minStatus = true;
        },
        maximize: function () {
            this.view.body.show();
            this.view.minMaxBtn.removeClass("fa-plus");
            this.view.minMaxBtn.addClass("fa-minus");
//            $(this.obj).css("height", 320);
            this.view.body.show();
            this.minStatus = false;
        },
        initialize: function () {
//            this.makeDraggable();
            this.view.minMaxBtn.on("click", function () {
                if (this.minStatus) {
                    this.maximize();
                } else {
                    this.minimize();
                }
            }.bind(this));
        },
        registerListener: function (fn) {
            this.registeredFunctions.push(fn);
        }
    };
    floatingProfile.initialize();

    var checkUniqueConstraints = function (inputFieldId, formId, tableName, columnName, checkColumnName, selfId, onSubmitFormSuccessfully) {
        $('#' + inputFieldId).on("blur", function () {
            var id = $(this);
            var nameValue = id.val();
            var parentId = id.parent(".form-group");
            var childId = parentId.children(".errorMsg");
            var columnsWidValues = {};
            columnsWidValues[columnName] = nameValue;
            var displayErrorMessage = function (formGroup, check, message, id) {
                var flag = formGroup.find('span.errorMsg').length > 0;
                if (flag) {
                    var errorMsgSpan = formGroup.find('span.errorMsg');
                    errorMsgSpan.each(function () {
                        if (check > 0) {
                            $(this).html(message);
                            id.focus();
                        } else {
                            $(this).remove();
                        }
                    });
                } else {
                    if (check > 0) {
                        var errorMsgSpan = $('<span />', {
                            "class": 'errorMsg',
                            text: message
                        });
                        formGroup.append(errorMsgSpan);
                        id.focus();
                    }
                }
            };

            window.app.pullDataById(document.restfulUrl, {
                action: 'checkUniqueConstraint',
                data: {
                    tableName: tableName,
                    selfId: selfId,
                    checkColumnName: checkColumnName,
                    columnsWidValues: columnsWidValues
                }
            }).then(function (success) {
                console.log("checkUniqueConstraint res", success);
                displayErrorMessage(parentId, parseInt(success.data), success.msg, id);
            }, function (failure) {
                console.log("checkUniqueConstraint failure", failure);
            });
        });

        $('#' + formId).submit(function (e) {
            var err = [];
            $(".errorMsg").each(function () {
                var erroMsg = $.trim($(this).html());
                if (erroMsg !== "") {
                    err.push("error");
                }
            });
            if (err.length > 0)
            {
                return false;
            }
            if (typeof onSubmitFormSuccessfully !== 'undefined') {
                var returnVal = onSubmitFormSuccessfully();
                if (typeof returnVal !== 'undefined') {
                    return returnVal;
                }
            }

        });
    };
    var setLoadingOnSubmit = function (formId, callback) {
        var $form = $('#' + formId);
        $form.submit(function (e) {
            if (typeof callback !== "undefined") {
                var returnBool = callback($form);
                if (!returnBool) {
                    return false;
                }
            }

            App.blockUI({target: "#hris-page-content"});
        });
    }
    var checkErrorSpan = function (formId) {
        $('#' + formId).submit(function (e) {
            var err = [];
            $(".errorMsg").each(function () {
                var erroMsg = $.trim($(this).html());
                if (erroMsg !== "") {
                    err.push("error");
                }
            });
            if (err.length > 0)
            {
                return false;
            }
        });
    }
    var removeByAttr = function (arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i]
                    && arr[i].hasOwnProperty(attr)
                    && (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    };


    (function () {
        $(".page-content").on("click", ".confirmation", function (e) {
            e.preventDefault();
            var $this = $(this);
            $this.confirmation({
                onConfirm: function () {
                    location.href = $this.attr('href');
                },
                onCancel: function () {
                }, });
        });
    })();

    var displayErrorMessage = function (formGroup, check, message) {
        var flag = formGroup.find('span.errorMsg').length > 0;
        if (flag) {
            var errorMsgSpan = formGroup.find('span.errorMsg');
            errorMsgSpan.each(function () {
                if (check > 0) {
                    $(this).html(message);
                } else {
                    $(this).remove();
                }
            });
        } else {
            if (check > 0) {
                var errorMsgSpan = $('<span />', {
                    "class": 'errorMsg',
                    text: message
                });
                formGroup.append(errorMsgSpan);
            }
        }
    };

    function getDate(formattedDate) {
        var monthsInStringFormat = {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec'
        };
        monthsInStringFormat.getKeyByValue = function (value) {
            for (var prop in this) {
                if (this.hasOwnProperty(prop)) {
                    if (this[ prop ].toUpperCase() === value.toUpperCase())
                        return prop;
                }
            }
        };
        var splittedDate = formattedDate.split("-");
//        return new Date(splittedDate[2], monthsInStringFormat.getKeyByValue(splittedDate[1]) - 1, parseInt(splittedDate[0]) + 1);
        return new Date(splittedDate[2], monthsInStringFormat.getKeyByValue(splittedDate[1]) - 1, parseInt(splittedDate[0]));
    }
    /* functionality not implemented */
    var $sidebarSearch = $('#sidebar-search');
    $sidebarSearch.on('submit', function (e) {
        errorMessage("Functionality not implemented!", "Notification");
        return false;
    });
    /* end of functionality not implemented */

    var getServerDate = function () {
        if (typeof document.restfulUrl === 'undefined') {
            console.log("Need to define restfulUrl first");
            return null;
        } else {
            var action = "getServerDate";
            return pullDataById(document.restfulUrl, {
                action: action
            });
        }
    };
    var scrollTo = function (id) {
        var $id = null;
        if (id instanceof jQuery) {
            $id = id;
        } else {
            $id = $("#" + id);
        }
        $('html,body').animate({
            scrollTop: $id.offset().top - 50},
                500);
    };

    var daysBetween = function (first, second) {

        // Copy date parts of the timestamps, discarding the time parts.
        var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
        var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

        // Do the math.
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = two.getTime() - one.getTime();
        var days = millisBetween / millisecondsPerDay;

        // Round down.
        return Math.floor(days);
    }

    var searchTable = function (kendoId, searchFields, isHidden) {
        var $kendoId = null;
        if (kendoId instanceof jQuery) {
            $kendoId = kendoId;
        } else {
            $kendoId = $("#" + kendoId);
        }
        var $searchHtml = $("<div class='row search' id='searchFieldDiv'>"
                + "<div class='col-sm-12'>"
                + "<input class='form-group pull-right' placeholder='search here' type='text' id='kendoSearchField' style='width:136px;padding:2px;font-size:12px;'/>"
                + "</div>"
                + "</div>");


        $searchHtml.insertBefore($kendoId);

        if (typeof isHidden !== "undefined" && isHidden) {
            $("#searchFieldDiv").hide();
        }
        $("#kendoSearchField").keyup(function () {
            var val = $(this).val();
            var filters = [];
            for (var i = 0; i < searchFields.length; i++) {
                filters.push({
                    field: searchFields[i],
                    operator: "contains",
                    value: val
                });
            }

            $kendoId.data("kendoGrid").dataSource.filter({
                logic: "or",
                filters: filters
            });
        });


    }


    var pdfExport = function (kendoId, col, fn) {
        var pageSizeValue;
        if (kendoId == 'employeeTable') {
            pageSizeValue = '4A0';
        } else {
            pageSizeValue = 'A3';
        }

//             to create export pdf button
        var $pdfExportButton = $("<li>"
                + "<a href='javascript:;' id='exportPdf'>"
                + "<i class='fa fa-file-pdf-o' ></i> Export to PDF</a>"
                + "</li>");


        $pdfExportButton.insertAfter($("#export").parent());

        $("#exportPdf").click(function () {
            var widthData = [];
            var bodyHeader = [];
            $.each(col, function (key, value) {
                widthData.push('auto');
                bodyHeader.push(value);
            });

            var dataSource = $("#" + kendoId).data("kendoGrid").dataSource;
            var filteredDataSource = new kendo.data.DataSource({
                data: dataSource.data(),
                filter: dataSource.filter()
            });
            filteredDataSource.read();
            var data = filteredDataSource.view();


            var exportData = [];
            exportData.push(bodyHeader);
            for (var i = 0; i < data.length; i++) {
                var tempData = [];
                $.each(col, function (key, value) {
                    if (typeof (data[i][key]) == 'undefined' || data[i][key] == null) {
                        tempData.push('-');
                    } else {
                        if (typeof fn !== 'undefined') {
                            tempData.push(fn(data[i][key], key));
                        } else {
                            tempData.push(data[i][key]);
                        }
                    }
                });
                exportData.push(tempData);
            }



            var docDefinition = {
                pageSize: pageSizeValue,
                pageOrientation: 'landscape',
                content: [
                    {
                        table: {
                            headerRows: 1,
                            widths: widthData,
                            body: exportData
                        }
                    }
                ]
            };

            pdfMake.createPdf(docDefinition).download(kendoId + '.pdf');
        });

    };
    var exportToPDF = function ($table, col, fileName, pageSize, fn) {
        if (!checkForFileExt(fileName)) {
            fileName = fileName + ".pdf";
        }
        var colWidths = [];
        var head = [];
        $.each(col, function (key, value) {
            colWidths.push('auto');
            head.push(value);
        });

        var data = [];
        if (Array.isArray($table)) {
            data = $table;
        } else {
            var dataSource = $table.data("kendoGrid").dataSource;
            var filteredDataSource = new kendo.data.DataSource({
                data: dataSource.data(),
                filter: dataSource.filter()
            });
            filteredDataSource.read();
            var data = filteredDataSource.view();
        }

        var body = [];
        body.push(head);
        for (var i = 0; i < data.length; i++) {
            var row = [];
            $.each(col, function (key, value) {
                if (typeof (data[i][key]) == 'undefined' || data[i][key] == null) {
                    row.push('-');
                } else {
                    if (typeof fn !== 'undefined') {
                        row.push(fn(data[i][key], key));
                    } else {
                        row.push(data[i][key]);
                    }
                }
            });
            body.push(row);
        }



        var docDefinition = {
            pageSize: typeof pageSize === "undefined" ? "A3" : pageSize,
            pageOrientation: 'landscape',
            content: [
                {
                    table: {
                        headerRows: 1,
                        widths: colWidths,
                        body: body
                    }
                }
            ]
        };

        pdfMake.createPdf(docDefinition).download(fileName);
    };

    var excelExport = function ($table, col, fileName) {
        if (!checkForFileExt(fileName)) {
            fileName = fileName + ".xlsx";
        }
        var header = [];
        var cellWidths = [];
        $.each(col, function (key, value) {
            header.push({value: value});
            cellWidths.push({autoWidth: true});
        });
        var rows = [{
                cells: header
            }];

        var data = [];
        if (Array.isArray($table)) {
            data = $table;
        } else {
            var dataSource = $table.data("kendoGrid").dataSource;
            var filteredDataSource = new kendo.data.DataSource({
                data: dataSource.data(),
                filter: dataSource.filter()
            });
            filteredDataSource.read();
            var data = filteredDataSource.view();
        }

        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var row = [];
            $.each(col, function (key, value) {
                row.push({value: dataItem[key]});
            });
            rows.push({
                cells: row
            });
        }
        var workbook = new kendo.ooxml.Workbook({
            sheets: [
                {
                    columns: cellWidths,
                    title: fileName,
                    rows: rows
                }
            ]
        });
        kendo.saveAs({dataURI: workbook.toDataURL(), fileName: fileName});
    };

    var checkForFileExt = function (file) {
        return (file.indexOf('.') >= 0);
    };

    (function () {
        $('.hris-export-to-excel').on("click", function () {
            try {
                var $this = $(this);
                var targetId = $this.attr("hris-export-to-excel-target");
                if (typeof targetId === "undefined") {
                    throw {message: "attribute => hris-export-to-excel-target not defined."};
                }
                var $target = $("#" + targetId);
                if ($target.length === 0) {
                    throw {message: "hris-export-to-excel-target is not found."};
                }

                var grid = $target.data("kendoGrid");
                if (typeof grid === "undefined") {
                    showMessage("No Table to export data.", "error");
                    throw{message: "No Table to export data."};
                }
                grid.saveAsExcel();
            } catch (e) {
                console.log(e.message);
            }

        });
    })();

    var populateSelect = function ($element, list, id, value, defaultMessage, defaultValue, selectedId, isMandatory) {
        if (typeof defaultValue === 'undefined') {
            defaultValue = -1;
        }
        if (typeof defaultMessage === "undefined" || defaultMessage === null) {
            defaultMessage = "";
        }
        $element.html('');
        var $defaultOption = $("<option></option>").val(defaultValue).text(defaultMessage);
        if (typeof isMandatory !== 'undefined' && isMandatory !== null && isMandatory) {
            $defaultOption.prop('disabled', true);
        }
        $element.append($defaultOption);
        var concatArray = function (keyList, list, concatWith) {
            var temp = '';
            if (typeof concatWith === 'undefined') {
                concatWith = ' ';
            }
            for (var i in keyList) {
                var listValue = list[keyList[i]];
                if (i == (keyList.length - 1)) {
                    temp = temp + ((listValue === null) ? '' : listValue);
                    continue;
                }
                temp = temp + ((listValue === null) ? '' : listValue) + concatWith;
            }

            return temp;
        };
        for (var i in list) {
            var text = null;
            if (typeof value === 'object') {
                text = concatArray(value, list[i], ' ');
            } else {
                text = list[i][value];
            }
            if (typeof selectedId !== 'undefined' && selectedId != null && selectedId == list[i][id]) {
                $element.append($("<option selected='selected'></option>").val(list[i][id]).text(text));
            } else {
                $element.append($("<option></option>").val(list[i][id]).text(text));
            }
        }
    };

    var lockField = function (flag, fields) {
        $.each(fields, function (k, v) {
            var $v = $('#' + v);
            if ($v.prev().is('div')) {
                $v.css('pointer-events', 'none');
            } else {
                $v.prop('disabled', flag);
            }
        });
    };
    var minToHour = function (min) {
        var hour = Math.floor(min / 60);
        var min = min % 60;
        return hour + ":" + min;
    };
    var initializeKendoGrid = function ($table, columns, detail, bulkOptions, config) {
        if (typeof bulkOptions !== 'undefined' && bulkOptions !== null) {
            var template = "<input type='checkbox' class='k-checkbox row-checkbox'><label class='k-checkbox-label'></label>";
            var column = {
                title: 'Select All',
                headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>",
                template: template,
                width: 80,
                sortable: false,
                filterable: false
            };
            if (bulkOptions.id !== 'undefined' && bulkOptions.id !== null) {
                column.field = bulkOptions.id;
                column.template = "<input id='#:" + bulkOptions.id + "#' type='checkbox' class='k-checkbox row-checkbox'><label class='k-checkbox-label'></label>";
            }
            if (bulkOptions.atLast !== 'undefined' && bulkOptions.atLast !== null && bulkOptions.atLast === true) {
                columns.push(column);
            } else {
                columns.splice(0, 0, column);
            }

        }
        var kendoConfig = {
            height: 500,
            scrollable: true,
            sortable: true,
            filterable: true,
            groupable: true,
            dataBound: function (e) {
                var grid = e.sender;
                if (grid.dataSource.total() === 0) {
                    var colCount = grid.columns.length;
                    $(e.sender.wrapper)
                            .find('tbody')
                            .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">There is no data to show in the grid.</td></tr>');
                }
            },
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: columns
        };
        if (typeof config !== "undefined" && config !== null) {
            for (var key in config) {
                kendoConfig[key] = config[key];
            }
        }

        if (typeof detail !== 'undefined' && detail !== null) {
            kendoConfig['detailInit'] = detail;
        }
        $table.kendoGrid(kendoConfig);

        var tableId = $table.attr('id');
        var selectedRows = {};
        $table.on("click", ".k-checkbox", function () {
            var checked = this.checked,
                    row = $(this).closest("tr"),
                    grid = $table.data("kendoGrid"),
                    dataItem = grid.dataItem(row);

            if (checked) {
                row.addClass("k-state-selected");
                selectedRows[dataItem.uid] = dataItem;
            } else {
                row.removeClass("k-state-selected");
                delete selectedRows[dataItem.uid];
            }

            if (typeof bulkOptions !== 'undefined' && bulkOptions !== null && typeof bulkOptions.fn !== 'undefined' && bulkOptions.fn !== null) {
                var checkedNo = $('.k-state-selected').length;
                if (checkedNo > 0) {
                    bulkOptions.fn(true);
                } else {
                    bulkOptions.fn(false);
                }
            }
        });
        $('#' + tableId + ' ' + '#header-chb').change(function (ev) {
            var checked = ev.target.checked;
            $('#' + tableId + ' ' + '.row-checkbox').each(function (idx, item) {
                if (checked) {
                    if (!($(item).closest('tr').is('.k-state-selected'))) {
                        $(item).click();
                    }
                } else {
                    if ($(item).closest('tr').is('.k-state-selected')) {
                        $(item).click();
                    }
                }
            });
        });

        return {
            getSelected: function () {
                var cleanData = [];
                for (var key in  selectedRows) {
                    var cleanItem = selectedRows[key];
                    delete cleanItem.uid;
                    cleanData.push(cleanItem);
                }
                return JSON.parse(JSON.stringify(cleanData));
            }, clearSelected: function () {
                selectedRows = {};
            }

        }
    }
    var renderKendoGrid = function ($table, data) {
        var dataSource = new kendo.data.DataSource({data: data, pageSize: 20});
        var grid = $table.data("kendoGrid");
        dataSource.read();
        grid.setDataSource(dataSource);
    }

    var genKendoActionTemplate = function (config) {
        try {
            if (typeof config === "undefined")
                throw {message: "no config provided"};

            var viewLink = "";
            if (typeof config.view !== 'undefined') {
                var iParams = config.update['params'];
                var url = config.update['url'];
                for (var i in iParams) {
                    url += `/#: ${iParams[i]} #`;
                }
                var viewLink = `
                <a class="btn-edit" title="View" href="${url}" style="height:17px;">
                    <i class="fa fa-search-plus"></i>
                </a>`;
            }

            var editLink = "";
            if (config.update['ALLOW_UPDATE'] === "Y") {
                var iParams = config.update['params'];
                var url = config.update['url'];
                for (var i in iParams) {
                    url += `/#: ${iParams[i]} #`;
                }
                var editLink = `
                <a class="btn-edit" title="Edit" href="${url}" style="height:17px;">
                    <i class="fa fa-edit"></i>
                </a>`;
            }
            var deleteLink = "";
            if (config.delete['ALLOW_DELETE'] === "Y") {
                var iParams = config.delete['params'];
                var url = config.delete['url'];
                for (var i in iParams) {
                    url += `/#: ${iParams[i]} #`;
                }
                var deleteLink = `
                <a class="confirmation btn-delete" title="Delete" href="${url}" style="height:17px;">
                    <i class="fa fa-trash-o"></i>
                </a>`;
            }

            var template = viewLink + editLink + deleteLink;
            return template;
        } catch (e) {
            console.log("error", e.message);
        }
    };

    var getDateRangeBetween = function (first, second) {
        var diff = daysBetween(first, second);
        var range = [];
        for (var i = 0; i <= diff; i++) {
            var rangeDate = new Date(first.getFullYear(), first.getMonth(), first.getDate());
            rangeDate.setDate(rangeDate.getDate() + i)
            range.push(rangeDate);
        }
        return range;
    }

    var exportDomToPdf = function (divName, cssUrl) {
        var printContents = document.getElementById(divName).innerHTML;
        var popupWin = window.open('', '_blank', 'width=1000,height=500,toolbar=0,scrollbars=0,status=0');
        popupWin.document.open();
        popupWin.document.write('<style>@page{size:landscape;}</style><html><head><link rel="stylesheet" type="text/css" href="' + cssUrl + '" /></head><body onload="window.print()">' + printContents + '</body></html>');
        popupWin.document.close();
    };

    var bulkServerRequest = function (link, dataList, completeFn, errorFn) {
        (function (dataList) {
            var counter = 0;
            var length = dataList.length;
            var addShift = function (data) {
                serverRequest(link, data).then(function (response) {
                    NProgress.set((counter + 1) / length);
                    counter++;
                    if (!response.success) {
                        if (typeof errorFn !== 'undefined' && errorFn !== null) {
                            errorFn(data);
                        }
                    }
                    if (counter >= length) {
                        if (typeof completeFn !== 'undefined' && completeFn !== null) {
                            completeFn();
                        }
                        return;
                    }
                    addShift(dataList[counter]);
                }, function (error) {
                    if (typeof errorFn !== 'undefined' && errorFn !== null) {
                        errorFn(data, error);
                    }
                });

            };
            NProgress.start();
            addShift(dataList[counter]);
        })(dataList);
    };

    var serverRequest = function (link, data) {
        return new Promise(function (resolve, reject) {
            App.blockUI({target: "#hris-page-content"});
            pullDataById(link, data).then(function (response) {
                App.unblockUI("#hris-page-content");
                resolve(response);
            }, function (error) {
                App.unblockUI("#hris-page-content");
                reject(error);
            });

        });
    };

    return {
        format: format,
        pullDataById: pullDataById,
        populateSelectElement: populateSelectElement,
        addDatePicker: addDatePicker,
        addTimePicker: addTimePicker,
        fetchAndPopulate: fetchAndPopulate,
        successMessage: successMessage,
        checkErrorSpan: checkErrorSpan,
        errorMessage: errorMessage,
        floatingProfile: floatingProfile,
        checkUniqueConstraints: checkUniqueConstraints,
        displayErrorMessage: displayErrorMessage,
        startEndDatePicker: startEndDatePicker,
        startEndDatePickerWithNepali: startEndDatePickerWithNepali,
        datePickerWithNepali: datePickerWithNepali,
        getSystemDate: getDate,
        addComboTimePicker: addComboTimePicker,
        getServerDate: getServerDate,
        setLoadingOnSubmit: setLoadingOnSubmit,
        scrollTo: scrollTo,
        showMessage: showMessage,
        daysBetween: daysBetween,
        searchTable: searchTable,
        pdfExport: pdfExport,
        exportToPDF: exportToPDF,
        excelExport: excelExport,
        populateSelect: populateSelect,
        floatToRound: floatToRound,
        lockField: lockField,
        minToHour: minToHour,
        initializeKendoGrid: initializeKendoGrid,
        renderKendoGrid: renderKendoGrid,
        genKendoActionTemplate: genKendoActionTemplate,
        getDateRangeBetween: getDateRangeBetween,
        exportDomToPdf: exportDomToPdf,
        serverRequest: serverRequest,
        bulkServerRequest: bulkServerRequest


    };
})(window.jQuery, window.toastr, window.App);
