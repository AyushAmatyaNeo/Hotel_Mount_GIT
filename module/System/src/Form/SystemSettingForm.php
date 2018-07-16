<?php

namespace System\Form;

use Zend\Form\Annotation;

/**
 * @Annotation\Hydrator("Zend\Hydrator\ObjectProperty")
 * @Annotation\Name("system-setting")
 */
class SystemSettingForm {

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Allow System Attendance"})
     * @Annotation\Attributes({ "id":"allowSystemAttendance"})
     */
    public $allowSystemAttendance;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Late Check In Approval"})
     * @Annotation\Attributes({ "id":"needApprovalForLateCheckIn"})
     */
    public $needApprovalForLateCheckIn;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Allow Account Lock"})
     * @Annotation\Attributes({ "id":"allowAccountLock"})
     */
    public $allowAccountLock;

    /**
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Options({"label":"Account Lock Try Chance"})
     * @Annotation\Attributes({ "id":"accountLockTryNumber", "class":" form-control","min":"0"})
     */
    public $accountLockTryNumber;

    /**
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Options({"label":"Account Lock Try Second"})
     * @Annotation\Attributes({ "id":"accountLockTrySecond", "class":" form-control","min":"0"})
     */
    public $accountLockTrySecond;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Force Password Renew"})
     * @Annotation\Attributes({ "id":"forcePasswordRenew"})
     */
    public $forcePasswordRenew;

    /**
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Options({"label":"Force Password Renew In"})
     * @Annotation\Attributes({ "id":"forcePasswordRenewDay", "class":" form-control","min":"0"})
     */
    public $forcePasswordRenewDay;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Show Address Book"})
     * @Annotation\Attributes({ "id":"showAddressBook"})
     */
    public $showAddressBook;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"S":"Single","M":"Multiple"},"label":"Notice Type"})
     * @Annotation\Attributes({ "id":"noticeType"})
     */
    public $noticeType;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"O":"Oracle","M":"Mysql","N":"None"},"label":"Old Payslip Type"})
     * @Annotation\Attributes({ "id":"oldPayslipType"})
     */
    public $oldPayslipType;

    /**
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Options({"label":"Late Penalty Leave Deduction"})
     * @Annotation\Attributes({ "id":"latePenaltyLeaveDeduction", "class":" form-control","step":"0.5","min":"0","max":"100"})
     */
    public $latePenaltyLeaveDeduction;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Enable Previous Month Leave Request"})
     * @Annotation\Attributes({ "id":"enablePrevMthLeaveReq"})
     */
    public $enablePrevMthLeaveReq;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Include Dayoff As Leave"})
     * @Annotation\Attributes({ "id":"includeDayoffAsLeave"})
     */
    public $includeDayoffAsLeave;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Include Holiday As Leave"})
     * @Annotation\Attributes({ "id":"includeHolidayAsLeave"})
     */
    public $includeHolidayAsLeave;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Employee Code"})
     * @Annotation\Attributes({ "id":"includeEmployeeCode"})
     */
    public $includeEmployeeCode;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Company"})
     * @Annotation\Attributes({ "id":"includeCompany"})
     */
    public $includeCompany;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Branch"})
     * @Annotation\Attributes({ "id":"includeBranch"})
     */
    public $includeBranch;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"First Time Password Renew"})
     * @Annotation\Attributes({ "id":"firstTimePwdRenew","value":"N"})
     */
    public $firstTimePwdRenew;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Order By Name"})
     * @Annotation\Attributes({ "id":"orderByName","value":"Y"})
     */
    public $orderByName;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Order By Position"})
     * @Annotation\Attributes({ "id":"orderByPosition","value":"N"})
     */
    public $orderByPosition;
    
    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Options({"value_options":{"Y":"Yes","N":"No"},"label":"Order By JoinDate"})
     * @Annotation\Attributes({ "id":"orderByJoinDate","value":"N"})
     */
    public $orderByJoinDate;


    /**
     * @Annotation\Type("Zend\Form\Element\Submit")
     * @Annotation\Attributes({"value":"Submit","class":"btn btn-success","id":"btnSubmit"})
     */
    public $submit;

}
