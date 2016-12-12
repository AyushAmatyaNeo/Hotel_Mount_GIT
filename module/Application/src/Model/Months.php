<?php

namespace Application\Model;

class Months extends Model {

    const TABLE_NAME = "HR_MONTH_CODE";
    const FISCAL_YEAR_ID = "FISCAL_YEAR_ID";
    const MONTH_ID = "MONTH_ID";
    const MONTH_EDESC = "MONTH_EDESC";
    const MONTH_NDESC = "MONTH_NDESC";
    const FROM_DATE = "FROM_DATE";
    const TO_DATE = "TO_DATE";
    const REMARKS = "REMARKS";
    const CREATED_DT = "CREATED_DT";
    const MODIFIED_DT = "MODIFIED_DT";
    const STATUS = "STATUS";

    public $fiscalYearId;
    public $monthId;
    public $monthEdesc;
    public $monthNdesc;
    public $fromDate;
    public $toDate;
    public $remarks;
    public $createdDt;
    public $modifiedDt;
    public $status;
    public $mappings = [
        'fiscalYearId' => self::FISCAL_YEAR_ID,
        'monthId' => self::MONTH_ID,
        'monthEdesc' => self::MONTH_EDESC,
        'monthNdesc' => self::MONTH_NDESC,
        'fromDate' => self::FROM_DATE,
        'toDate' => self::TO_DATE,
        'remarks' => self::REMARKS,
        'createdDt' => self::CREATED_DT,
        'modifiedDt' => self::MODIFIED_DT,
        'status' => self::STATUS,
    ];

}
