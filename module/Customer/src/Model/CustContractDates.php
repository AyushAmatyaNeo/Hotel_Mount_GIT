<?php

namespace Customer\Model;

use Application\Model\Model;


class CustContractDates extends Model {

    CONST TABLE_NAME = "HRIS_CUST_CONTRACT_DATES";
    CONST CONTRACT_ID = "CONTRACT_ID";
    CONST MANUAL_DATE = "MANUAL_DATE";

    public $contractId;
    public $manualDate;
    public $mappings = [
        'contractId' => self::CONTRACT_ID,
        'manualDate' => self::MANUAL_DATE,
    ];

}
