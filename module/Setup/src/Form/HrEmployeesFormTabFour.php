<?php

namespace Setup\Form;

use Application\Model\Model;
use Zend\Form\Annotation;

class HrEmployeesFormTabFour extends Model {

    /**
     * @Annotation\Required(true)
     * @Annotation\Type("Zend\Form\Element\Text")
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"label":"Join Date"})
     * @Annotation\Attributes({"class":"form-control","id":"joinDate" })
     */
    public $joinDate;

    /**
     * @Annotation\Required(false)
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"label":"Salary"})
     * @Annotation\Validator({"name":"StringLength", "options":{"max":"9"}})
     * @Annotation\Attributes({ "id":"salary", "class":"form-control" })
     */
    public $salary;

    /**
     * @Annotation\Required(false)
     * @Annotation\Type("Zend\Form\Element\Number")
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"label":"Salary PF"})
     * @Annotation\Validator({"name":"StringLength", "options":{"max":"9"}})
     * @Annotation\Attributes({ "id":"salaryPf", "class":"form-control","min":"1" })
     */
    public $salaryPf;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Service Type Name"})
     * @Annotation\Attributes({ "id":"serviceTypeId","class":"form-control"})
     */
    public $serviceTypeId;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Position Name"})
     * @Annotation\Attributes({ "id":"positionId","class":"form-control"})
     */
    public $positionId;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Designation Name"})
     * @Annotation\Attributes({ "id":"designationId","class":"form-control"})
     */
    public $designationId;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Department Name"})
     * @Annotation\Attributes({ "id":"departmentId","class":"form-control"})
     */
    public $departmentId;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Branch Name"})
     * @Annotation\Attributes({ "id":"branchId","class":"form-control"})
     */
    public $branchId;

    /**
     * @Annotation\Type("Zend\Form\Element\Radio")
     * @Annotation\Required(false)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"label":"HR Flag","value_options":{"Y":"Yes","N":"No"}})
     * @Annotation\Attributes({"id":"isHr","value":"N"})
     */
    public $isHR;

    /**
     * @Annotation\Type("Zend\Form\Element\Select")
     * @Annotation\Required(False)
     * @Annotation\Filter({"name":"StringTrim","name":"StripTags"})
     * @Annotation\Options({"disable_inarray_validator":"true","label":"Employee Type"})
     * @Annotation\Attributes({ "id":"employeeType","class":"form-control"})
     */
    public $employeeType;
    public $modifiedBy;
    public $modifiedDt;
    public $mappings = [
        'joinDate' => 'JOIN_DATE',
        'salary' => 'SALARY',
        'salaryPf' => 'SALARY_PF',
        'branchId' => 'BRANCH_ID',
        'departmentId' => 'DEPARTMENT_ID',
        'designationId' => 'DESIGNATION_ID',
        'positionId' => 'POSITION_ID',
        'serviceTypeId' => 'SERVICE_TYPE_ID',
        'employeeType' => 'EMPLOYEE_TYPE',
        'modifiedBy' => 'MODIFIED_BY',
        'modifiedDt' => 'MODIFIED_DT',
        'isHR' => 'IS_HR'
    ];

}
