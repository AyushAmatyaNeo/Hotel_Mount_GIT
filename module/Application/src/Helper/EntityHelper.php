<?php

namespace Application\Helper;

use Exception;
use ReflectionClass;
use Setup\Model\Branch;
use Setup\Model\Company;
use Setup\Model\Department;
use Setup\Model\Designation;
use Setup\Model\Gender;
use Setup\Model\HrEmployees;
use Setup\Model\Position;
use Setup\Model\ServiceEventType;
use Setup\Model\ServiceType;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Select;
use Zend\Db\TableGateway\TableGateway;

class EntityHelper {

    const STATUS_ENABLED = 'E';
    const STATUS_DISABLED = 'D';
    const ORACLE_FUNCTION_INITCAP = 'INITCAP';

    public static function getTableKVList(AdapterInterface $adapter, $tableName, $key = null, array $values, $where = null, $concatWith = null, $emptyColumn = false, $orderBy = null, $orderAs = null, $initCap = false) {
        $gateway = new TableGateway($tableName, $adapter);
        $resultset = $gateway->select(function(Select $select) use ($key, $values, $where, $orderBy, $orderAs, $initCap) {
            if ($key !== null) {
                array_push($values, $key);
            }
            if ($initCap) {
                $tempValues = [];
                foreach ($values as $key => $value) {
                    $tempValues[$key] = "INITCAP({$value}) AS {$value}";
                }
                $values = $tempValues;
            }
            $select->columns($values, false);
            if ($where !== null) {
                $select->where($where);
            }

            if ($orderBy !== null) {
                $select->order([$orderBy => ($orderAs !== null) ? $orderAs : Select::ORDER_ASCENDING]);
            }
        });
        $concatWith = ($concatWith == null) ? " " : ($concatWith == null) ? "" : $concatWith;

        $entitiesArray = array();
        if ($emptyColumn) {
            if (gettype($emptyColumn) == 'array') {
                foreach ($emptyColumn as $k => $v) {
                    $entitiesArray[$k] = $v;
                }
            } else {
                $entitiesArray[null] = "----";
            }
        }
        foreach ($resultset as $result) {
            $concattedValue = "";
            for ($i = 0; $i < count($values); $i++) {
                if ($i == 0) {
                    $concattedValue = $result[$values[$i]];
                    continue;
                }
                $concattedValue = $concattedValue . $concatWith . $result[$values[$i]];
            }
            if ($key == null) {
                array_push($entitiesArray, $concattedValue);
            } else {
                $entitiesArray[$result[$key]] = $concattedValue;
            }
        }
        return $entitiesArray;
    }

    public static function getTableKVListWithSortOption(AdapterInterface $adapter, $tableName, $key, array $values, $where = null, $orderBy = null, $orderAs = null, $concatWith = null, $emptyColumn = false, $initCap = false) {
        return self::getTableKVList($adapter, $tableName, $key, $values, $where, $concatWith, $emptyColumn, $orderBy, $orderAs, $initCap);
    }

    public static function rawQueryResult(AdapterInterface $adapter, string $sql) {
        $statement = $adapter->query($sql);
        return $statement->execute();
    }

    public static function getTableList(AdapterInterface $adapter, string $tableName, array $columnList, array $where = null, string $predicate = Predicate::OP_AND) {
        $gateway = new TableGateway($tableName, $adapter);
        $zendResult = $gateway->select(function(Select $select) use($columnList, $where, $predicate) {
            $select->columns($columnList, false);
            if ($where != null) {
                $select->where($where, $predicate);
            }
        });
        return Helper::extractDbData($zendResult, true);
    }

    public static function getColumnNameArrayWithOracleFns(string $requestedName, array $initCapColumnList = null, array $dateColumnList = null, array $timeColumnList = null, array $timeIntervalColumnList = null, array $otherColumnList = null, string $shortForm = null, $selectedOnly = false, $inStringForm = false, array $minuteToHourColumnList = null, array $customCols = null) {
        $refl = new ReflectionClass($requestedName);
        $table = $refl->newInstanceArgs();

        $objAttrs = array_keys(get_object_vars($table));
        $objCols = [];

        foreach ($objAttrs as $objAttr) {
            if ('mappings' === $objAttr) {
                continue;
            }
            $tempCol = $table->mappings[$objAttr];
            if ($initCapColumnList !== null && in_array($tempCol, $initCapColumnList)) {
                $initCapExpression = Helper::columnExpression($tempCol, $shortForm, self::ORACLE_FUNCTION_INITCAP);
                array_push($objCols, $inStringForm ? $initCapExpression->getExpression() : $initCapExpression);
                continue;
            }

            if ($dateColumnList !== null && in_array($tempCol, $dateColumnList)) {
                $dateExpression = self::formatColumn($tempCol, $shortForm, Helper::ORACLE_DATE_FORMAT);
                array_push($objCols, $inStringForm ? $dateExpression->getExpression() : $dateExpression);
                continue;
            }
            if ($timeColumnList !== null && in_array($tempCol, $timeColumnList)) {
                $timeExpression = self::formatColumn($tempCol, $shortForm, Helper::ORACLE_TIME_FORMAT);
                array_push($objCols, $inStringForm ? $timeExpression->getExpression() : $timeExpression);
                continue;
            }
            if ($timeIntervalColumnList !== null && in_array($tempCol, $timeIntervalColumnList)) {
                $timeIntervalExpression = self::formatColumn($tempCol, $shortForm, Helper::ORACLE_TIMESTAMP_FORMAT);
                array_push($objCols, $inStringForm ? $timeIntervalExpression->getExpression() : $timeIntervalExpression);
                continue;
            }
            if ($otherColumnList !== null && in_array($tempCol, $otherColumnList)) {
                array_push($objCols, $tempCol);
                continue;
            }
            if ($minuteToHourColumnList != null && in_array($tempCol, $minuteToHourColumnList)) {
                $minuteToHour = self::minuteToHourColumn($tempCol, $shortForm);
                array_push($objCols, $inStringForm ? $minuteToHour->getExpression() : $minuteToHour);
                continue;
            }

            if (!$selectedOnly) {
                array_push($objCols, Helper::columnExpression($tempCol, $shortForm));
            }
        }
        if ($customCols != null && sizeof($customCols) > 0) {
            $objCols = array_merge($objCols, $customCols);
        }
        return $objCols;
    }

    public static function formatColumn($columnName, $shortForm = null, $format) {
        $pre = "";
        if ($shortForm != null && sizeof($shortForm) != 0) {
            $pre = $shortForm . ".";
        }
        return "INITCAP(TO_CHAR({$pre}{$columnName}, '{$format}')) AS {$columnName}";
    }

    public static function minuteToHourColumn($columnName, $shortForm = null) {
        $pre = "";
        if ($shortForm != null && sizeof($shortForm) != 0) {
            $pre = $shortForm . ".";
        }
        return "NVL2({$pre}{$columnName},LPAD(TRUNC({$pre}{$columnName}/60,0),2, 0)||':'||LPAD(MOD({$pre}{$columnName},60),2, 0),null) AS {$columnName}";
    }

    public static function getSearchData($adapter) {
        /* search values */
        $companyList = self::getTableList($adapter, Company::TABLE_NAME, [Company::COMPANY_ID, Company::COMPANY_NAME], [Company::STATUS => "E"]);
        $branchList = self::getTableList($adapter, Branch::TABLE_NAME, [Branch::BRANCH_ID, Branch::BRANCH_NAME, Branch::COMPANY_ID], [Branch::STATUS => "E"]);
        $departmentList = self::getTableList($adapter, Department::TABLE_NAME, [Department::DEPARTMENT_ID, Department::DEPARTMENT_NAME, Department::COMPANY_ID, Department::BRANCH_ID], [Department::STATUS => "E"]);
        $designationList = self::getTableList($adapter, Designation::TABLE_NAME, [Designation::DESIGNATION_ID, Designation::DESIGNATION_TITLE, Designation::COMPANY_ID], [Designation::STATUS => 'E']);
        $positionList = self::getTableList($adapter, Position::TABLE_NAME, [Position::POSITION_ID, Position::POSITION_NAME, Position::COMPANY_ID], [Position::STATUS => "E"]);
        $serviceTypeList = self::getTableList($adapter, ServiceType::TABLE_NAME, [ServiceType::SERVICE_TYPE_ID, ServiceType::SERVICE_TYPE_NAME], [ServiceType::STATUS => "E"]);
        $serviceEventTypeList = self::getTableList($adapter, ServiceEventType::TABLE_NAME, [ServiceEventType::SERVICE_EVENT_TYPE_ID, ServiceEventType::SERVICE_EVENT_TYPE_NAME], [ServiceEventType::STATUS => "E"]);
        $genderList = self::getTableList($adapter, Gender::TABLE_NAME, [Gender::GENDER_ID, Gender::GENDER_NAME], [Gender::STATUS => "E"]);
        $employeeList = self::getTableList($adapter, HrEmployees::TABLE_NAME, [
                    HrEmployees::EMPLOYEE_ID,
                    HrEmployees::FULL_NAME,
                    HrEmployees::FIRST_NAME,
                    HrEmployees::MIDDLE_NAME,
                    HrEmployees::LAST_NAME,
                    HrEmployees::COMPANY_ID,
                    HrEmployees::BRANCH_ID,
                    HrEmployees::DEPARTMENT_ID,
                    HrEmployees::DESIGNATION_ID,
                    HrEmployees::POSITION_ID,
                    HrEmployees::SERVICE_TYPE_ID,
                    HrEmployees::SERVICE_EVENT_TYPE_ID,
                    HrEmployees::GENDER_ID,
                    HrEmployees::EMPLOYEE_TYPE,
                        ], [HrEmployees::STATUS => "E"]);

        $searchValues = [
            'company' => $companyList,
            'branch' => $branchList,
            'department' => $departmentList,
            'designation' => $designationList,
            'position' => $positionList,
            'serviceType' => $serviceTypeList,
            'serviceEventType' => $serviceEventTypeList,
            'gender' => $genderList,
            'employeeType' => [['EMPLOYEE_TYPE_KEY' => 'R', 'EMPLOYEE_TYPE_VALUE' => 'Employee'], ['EMPLOYEE_TYPE_KEY' => 'C', 'EMPLOYEE_TYPE_VALUE' => 'Worker']],
            'employee' => $employeeList
        ];
        /* end of search values */

        return $searchValues;
    }

    public static function batchSQL($fn) {
        self::rawQueryResult($this->adapter, "SAVEPOINT multipleEmployeeAssign");
        try {
            $fn();
        } catch (Exception $e) {
            self::rawQueryResult($this->adapter, "ROLLBACK TO SAVEPOINT multipleEmployeeAssign");
        }
        self::rawQueryResult($this->adapter, "COMMIT");
    }

    public static function employeesIn($companyId = null, $branchId = null, $departmentId = null, $positionId = null, $designationId = null, $serviceTypeId = null, $serviceEventTypeId = null, $employeeTypeId = null, $employeeId = null) {
        $companyCondition = '';
        $branchCondition = '';
        $departmentCondition = '';
        $designationCondition = '';
        $positionCondition = '';
        $serviceTypeCondition = '';
        $serviceEventtypeCondition = '';
        $employeeTypeCondition = '';
        $employeeCondition = '';

        if ($companyId != null && $companyId != -1) {
            $companyCondition = " AND E.COMPANY_ID ={$companyId} ";
        }
        if ($branchId != null && $branchId != -1) {
            $branchCondition = " AND E.BRANCH_ID ={$branchId} ";
        }
        if ($departmentId != null && $departmentId != -1) {
            $departmentCondition = " AND E.DEPARTMENT_ID ={$departmentId} ";
        }
        if ($designationId != null && $designationId != -1) {
            $designationCondition = " AND E.DESIGNATION_ID ={$designationId} ";
        }
        if ($positionId != null && $positionId != -1) {
            $positionCondition = " AND E.POSITION_ID ={$positionId} ";
        }
        if ($serviceTypeId != null && $serviceTypeId != -1) {
            $serviceTypeCondition = " AND E.SERVICE_TYPE_ID ={$serviceTypeId} ";
        }
        if ($serviceEventTypeId != null && $serviceEventTypeId != -1) {
            $serviceEventtypeCondition = " AND E.SERVICE_EVENT_TYPE_ID ={$serviceEventTypeId} ";
        }
        if ($employeeTypeId != null && $employeeTypeId != -1) {
            $employeeTypeCondition = " AND E.EMPLOYEE_TYPE = '{$employeeTypeId}' ";
        }
        if ($employeeId != null && $employeeId != -1) {
            $employeeCondition = " AND A.EMPLOYEE_ID ={$employeeId} ";
        }

        return "SELECT E.EMPLOYEE_ID FROM HRIS_EMPLOYEES E WHERE 1=1 {$companyCondition}{$branchCondition}{$departmentCondition}{$designationCondition}{$positionCondition}{$serviceTypeCondition}{$serviceEventtypeCondition}{$employeeTypeCondition}{$employeeCondition}";
    }

    public static function conditionBuilder($colValue, $colName, $conditonType, $isString = false) {
        if (gettype($colValue) === "array") {
            $valuesinCSV = "";
            for ($i = 0; $i < sizeof($colValue); $i++) {
                $value = $isString ? "'{$colValue[$i]}'" : $colValue[$i];
                if ($i + 1 == sizeof($colValue)) {
                    $valuesinCSV .= "{$value}";
                } else {
                    $valuesinCSV .= "{$value},";
                }
            }
            return " {$conditonType} {$colName} IN ({$valuesinCSV})";
        } else {
            return " {$conditonType} {$colName} = {$colValue}";
        }
    }

    public static function getSearchConditon($companyId, $branchId, $departmentId, $positionId, $designationId, $serviceTypeId, $serviceEventTypeId, $employeeTypeId, $employeeId) {
        $conditon = "";
        if ($companyId != null && $companyId != -1) {
            $conditon .= self::conditionBuilder($companyId, "E.COMPANY_ID", "AND");
        }
        if ($branchId != null && $branchId != -1) {
            $conditon .= self::conditionBuilder($branchId, "E.BRANCH_ID", "AND");
        }
        if ($departmentId != null && $departmentId != -1) {
            $conditon .= self::conditionBuilder($departmentId, "E.DEPARTMENT_ID", "AND");
        }
        if ($positionId != null && $positionId != -1) {
            $conditon .= self::conditionBuilder($positionId, "E.POSITION_ID", "AND");
        }
        if ($designationId != null && $designationId != -1) {
            $conditon .= self::conditionBuilder($designationId, "E.DESIGNATION_ID", "AND");
        }
        if ($serviceTypeId != null && $serviceTypeId != -1) {
            $conditon .= self::conditionBuilder($serviceTypeId, "E.SERVICE_TYPE_ID", "AND");
        }
        if ($serviceEventTypeId != null && $serviceEventTypeId != -1) {
            $conditon .= self::conditionBuilder($serviceEventTypeId, "E.SERVICE_EVENT_TYPE_ID", "AND");
        }
        if ($employeeTypeId != null && $employeeTypeId != -1) {
            $conditon .= self::conditionBuilder($employeeTypeId, "E.EMPLOYEE_TYPE", "AND", true);
        }
        if ($employeeId != null && $employeeId != -1) {
            $conditon .= self::conditionBuilder($employeeId, "E.EMPLOYEE_ID", "AND");
        }
        return $conditon;
    }

    public static function getAttendanceStatusSelectElement() {
        $statusFormElement = new \Zend\Form\Element\Select();
        $statusFormElement->setName("status");
        $status = array(
            "P" => "Present Only",
            "A" => "Absent Only",
            "H" => "On Holiday",
            "L" => "On Leave",
            "T" => "On Training",
            "TVL" => "On Travel",
            "WOH" => "Work on Holiday",
            "WOD" => "Work on DAYOFF",
        );
        $statusFormElement->setValueOptions($status);
        $statusFormElement->setAttributes(["id" => "statusId", "class" => "form-control", "multiple" => "multiple"]);
        $statusFormElement->setLabel("Status");
        return $statusFormElement;
    }

    public static function getAttendancePresentStatusSelectElement() {
        $statusFormElement = new \Zend\Form\Element\Select();
        $statusFormElement->setName("presentStatus");
        $status = array(
            "LI" => "Late In",
            "EO" => "Early Out",
            "MP" => "Missed Punched",
        );
        $statusFormElement->setValueOptions($status);
        $statusFormElement->setAttributes(["id" => "presentStatusId", "class" => "form-control", "multiple" => "multiple"]);
        $statusFormElement->setLabel("Present Status");
        return $statusFormElement;
    }

}
