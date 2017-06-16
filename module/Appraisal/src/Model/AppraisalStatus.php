<?php
namespace Appraisal\Model;

use Application\Model\Model;

class AppraisalStatus extends Model{
    const TABLE_NAME="HRIS_APPRAISAL_STATUS";
    const EMPLOYEE_ID="EMPLOYEE_ID";
    const APPRAISAL_ID="APPRAISAL_ID";
    const ANNUAL_RATING_KPI="ANNUAL_RATING_KPI";
    const ANNUAL_RATING_COMPETENCY="ANNUAL_RATING_COMPETENCY";
    const APPRAISER_OVERALL_RATING="APPRAISER_OVERALL_RATING";
    const REVIEWER_AGREE="REVIEWER_AGREE";
    const APPRAISEE_AGREE="APPRAISEE_AGREE";
    const APPRAISED_BY="APPRAISED_BY";
    const REVIEWED_BY="REVIEWED_BY";
    const CREATED_BY="CREATED_BY";
    const CREATED_DATE="CREATED_DATE";
    const MODIFIED_BY="MODIFIED_BY";
    const MODIFIED_DATE="MODIFIED_DATE";
    
    public $employeeId;
    public $appraisalId;
    public $annualRatingKPI;
    public $annualRatingCompetency;
    public $appraiserOverallRating;
    public $reviewerAgree;
    public $appraiseeAgree;
    public $appraisedBy;
    public $reviewedBy;
    public $createdBy;
    public $createdDate;
    public $modifiedBy;
    public $modifiedDate;
    
    public $mappings = [
        'employeeId'=>self::EMPLOYEE_ID,
        'appraisalId'=>self::APPRAISAL_ID,
        'annualRatingKPI'=>self::ANNUAL_RATING_KPI,
        'annualRatingCompetency'=>self::ANNUAL_RATING_COMPETENCY,
        'appraiserOverallRating'=>self::APPRAISER_OVERALL_RATING,
        'reviewerAgree'=>self::REVIEWER_AGREE,
        'appraiseeAgree'=>self::APPRAISEE_AGREE,
        'appraisedBy'=>self::APPRAISED_BY,
        'reviewedBy'=>self::REVIEWED_BY,
        'createdBy'=>self::CREATED_BY,
        'createdDate'=>self::CREATED_DATE,
        'modifiedBy'=>self::MODIFIED_BY,
        'modifiedDate'=>self::MODIFIED_DATE
    ];
}

