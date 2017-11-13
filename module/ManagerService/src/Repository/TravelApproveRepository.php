<?php

namespace ManagerService\Repository;

use Application\Helper\EntityHelper;
use Application\Model\Model;
use Application\Repository\RepositoryInterface;
use SelfService\Model\TravelRequest;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\TableGateway;

class TravelApproveRepository implements RepositoryInterface {

    private $tableGateway;
    private $adapter;

    public function __construct(AdapterInterface $adapter) {
        $this->adapter = $adapter;
        $this->tableGateway = new TableGateway(TravelRequest::TABLE_NAME, $adapter);
    }

    public function add(Model $model) {
        
    }

    public function delete($id) {
        
    }

    public function getAllWidStatus($id, $status) {
        
    }

    public function edit(Model $model, $id) {
        $temp = $model->getArrayCopyForDB();
        $this->tableGateway->update($temp, [TravelRequest::TRAVEL_ID => $id]);
        EntityHelper::rawQueryResult($this->adapter, "
                DECLARE
                  V_FROM_DATE HRIS_EMPLOYEE_TRAVEL_REQUEST.FROM_DATE%TYPE;
                  V_EMPLOYEE_ID HRIS_EMPLOYEE_TRAVEL_REQUEST.EMPLOYEE_ID%TYPE;
                  V_STATUS HRIS_EMPLOYEE_TRAVEL_REQUEST.STATUS%TYPE;
                  V_TRAVEL_ID HRIS_EMPLOYEE_TRAVEL_REQUEST.TRAVEL_ID%TYPE:= {$id};
                BEGIN
                  SELECT FROM_DATE ,
                    EMPLOYEE_ID,
                    STATUS
                  INTO V_FROM_DATE,
                    V_EMPLOYEE_ID,
                    V_STATUS
                  FROM HRIS_EMPLOYEE_TRAVEL_REQUEST
                  WHERE TRAVEL_ID =V_TRAVEL_ID;
                  --
                  IF V_STATUS IN ('AP','C') AND V_FROM_DATE <TRUNC(SYSDATE) THEN
                    HRIS_REATTENDANCE(V_FROM_DATE,V_EMPLOYEE_ID);
                  END IF;
                EXCEPTION
                WHEN NO_DATA_FOUND THEN
                  DBMS_OUTPUT.PUT('NO DATA FOUND FOR ID =>'|| V_TRAVEL_ID);
                END;
");
    }

    public function fetchAll() {
        
    }

    public function fetchById($id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            new Expression("TR.EMPLOYEE_ID AS EMPLOYEE_ID"),
            new Expression("TR.TRAVEL_ID AS TRAVEL_ID"),
            new Expression("TR.TRAVEL_CODE AS TRAVEL_CODE"),
            new Expression("TR.DESTINATION AS DESTINATION"),
            new Expression("TR.REQUESTED_AMOUNT AS REQUESTED_AMOUNT"),
            new Expression("TR.PURPOSE AS PURPOSE"),
            new Expression("TR.TRANSPORT_TYPE AS TRANSPORT_TYPE"),
            new Expression("(CASE WHEN TR.TRANSPORT_TYPE = 'AP' THEN 'Aeroplane' WHEN TR.TRANSPORT_TYPE = 'OV' THEN 'Office Vehicles' WHEN TR.TRANSPORT_TYPE = 'TI' THEN 'Taxi' WHEN TR.TRANSPORT_TYPE = 'BS' THEN 'Bus' END) AS TRANSPORT_TYPE_DETAIL"),
            new Expression("TR.REQUESTED_TYPE AS REQUESTED_TYPE"),
            new Expression("(CASE WHEN LOWER(TR.REQUESTED_TYPE) = 'ap' THEN 'Advance' ELSE 'Expense' END) AS REQUESTED_TYPE_DETAIL"),
            new Expression("INITCAP(TO_CHAR(TR.DEPARTURE_DATE, 'DD-MON-YYYY')) AS DEPARTURE_DATE"),
            new Expression("INITCAP(TO_CHAR(TR.RETURNED_DATE, 'DD-MON-YYYY')) AS RETURNED_DATE"),
            new Expression("INITCAP(TO_CHAR(TR.FROM_DATE, 'DD-MON-YYYY')) AS FROM_DATE"),
            new Expression("INITCAP(TO_CHAR(TR.TO_DATE, 'DD-MON-YYYY')) AS TO_DATE"),
            new Expression("(TR.TO_DATE)-TRUNC(TR.FROM_DATE) AS DURATION"),
            new Expression("INITCAP(TO_CHAR(TR.REQUESTED_DATE, 'DD-MON-YYYY')) AS REQUESTED_DATE"),
            new Expression("TR.REMARKS AS REMARKS"),
            new Expression("TR.STATUS AS STATUS"),
            new Expression("LEAVE_STATUS_DESC(TR.STATUS) AS STATUS_DETAIL"),
            new Expression("TR.RECOMMENDED_BY AS RECOMMENDED_BY"),
            new Expression("INITCAP(TO_CHAR(TR.RECOMMENDED_DATE, 'DD-MON-YYYY')) AS RECOMMENDED_DATE"),
            new Expression("TR.RECOMMENDED_REMARKS AS RECOMMENDED_REMARKS"),
            new Expression("TR.APPROVED_BY AS APPROVED_BY"),
            new Expression("INITCAP(TO_CHAR(TR.APPROVED_DATE, 'DD-MON-YYYY')) AS APPROVED_DATE"),
            new Expression("TR.APPROVED_REMARKS AS APPROVED_REMARKS"),
            new Expression("TR.REFERENCE_TRAVEL_ID AS REFERENCE_TRAVEL_ID"),
                ], true);

        $select->from(['TR' => TravelRequest::TABLE_NAME])
                ->join(['TS' => "HRIS_TRAVEL_SUBSTITUTE"], "TR.TRAVEL_ID=TS.TRAVEL_ID", [
                    'SUB_EMPLOYEE_ID' => 'EMPLOYEE_ID',
                    'SUB_APPROVED_DATE' => new Expression("INITCAP(TO_CHAR(TS.APPROVED_DATE, 'DD-MON-YYYY'))"),
                    'SUB_REMARKS' => "REMARKS",
                    'SUB_APPROVED_FLAG' => "APPROVED_FLAG",
                    'SUB_APPROVED_FLAG_DETAIL' => new Expression("(CASE WHEN APPROVED_FLAG = 'Y' THEN 'Approved' WHEN APPROVED_FLAG = 'N' THEN 'Rejected' ELSE 'Pending' END)")
                        ], "left")
                ->join(['TSE' => 'HRIS_EMPLOYEES'], 'TS.EMPLOYEE_ID=TSE.EMPLOYEE_ID', ["SUB_EMPLOYEE_NAME" => new Expression("INITCAP(TSE.FULL_NAME)")], "left")
                ->join(['TSED' => 'HRIS_DESIGNATIONS'], 'TSE.DESIGNATION_ID=TSED.DESIGNATION_ID', ["SUB_DESIGNATION_TITLE" => "DESIGNATION_TITLE"], "left")
                ->join(['E' => 'HRIS_EMPLOYEES'], 'E.EMPLOYEE_ID=TR.EMPLOYEE_ID', ["FULL_NAME" => new Expression("INITCAP(E.FULL_NAME)")], "left")
                ->join(['ED' => 'HRIS_DESIGNATIONS'], 'E.DESIGNATION_ID=ED.DESIGNATION_ID', ["DESIGNATION_TITLE" => "DESIGNATION_TITLE"], "left")
                ->join(['EC' => 'HRIS_COMPANY'], 'E.COMPANY_ID=EC.COMPANY_ID', ["COMPANY_NAME" => "COMPANY_NAME"], "left")
                ->join(['ECF' => 'HRIS_EMPLOYEE_FILE'], 'EC.LOGO=ECF.FILE_CODE', ["COMPANY_FILE_PATH" => "FILE_PATH"], "left")
                ->join(['E2' => "HRIS_EMPLOYEES"], "E2.EMPLOYEE_ID=TR.RECOMMENDED_BY", ['RECOMMENDED_BY_NAME' => new Expression("INITCAP(E2.FULL_NAME)")], "left")
                ->join(['E3' => "HRIS_EMPLOYEES"], "E3.EMPLOYEE_ID=TR.APPROVED_BY", ['APPROVED_BY_NAME' => new Expression("INITCAP(E3.FULL_NAME)")], "left")
                ->join(['RA' => "HRIS_RECOMMENDER_APPROVER"], "RA.EMPLOYEE_ID=TR.EMPLOYEE_ID", ['RECOMMENDER_ID' => 'RECOMMEND_BY', 'APPROVER_ID' => 'APPROVED_BY'], "left")
                ->join(['RECM' => "HRIS_EMPLOYEES"], "RECM.EMPLOYEE_ID=RA.RECOMMEND_BY", ['RECOMMENDER_NAME' => new Expression("INITCAP(RECM.FULL_NAME)")], "left")
                ->join(['APRV' => "HRIS_EMPLOYEES"], "APRV.EMPLOYEE_ID=RA.APPROVED_BY", ['APPROVER_NAME' => new Expression("INITCAP(APRV.FULL_NAME)")], "left");
        $select->where(["TR.TRAVEL_ID" => $id]);
        $select->order("TR.REQUESTED_DATE DESC");
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();
        return $result->current();
    }

    public function getAllRequest($id) {
        $sql = new Sql($this->adapter);
        $select = $sql->select();
        $select->columns([
            new Expression("INITCAP(TO_CHAR(TR.FROM_DATE, 'DD-MON-YYYY')) AS FROM_DATE_AD"),
            new Expression("BS_DATE(TO_CHAR(TR.FROM_DATE, 'DD-MON-YYYY')) AS FROM_DATE_BS"),
            new Expression("INITCAP(TO_CHAR(TR.TO_DATE, 'DD-MON-YYYY')) AS TO_DATE_AD"),
            new Expression("BS_DATE(TO_CHAR(TR.TO_DATE, 'DD-MON-YYYY')) AS TO_DATE_BS"),
            new Expression("TR.STATUS AS STATUS"),
            new Expression("LEAVE_STATUS_DESC(TR.STATUS) AS STATUS_DETAIL"),
            new Expression("TR.DESTINATION AS DESTINATION"),
            new Expression("INITCAP(TO_CHAR(TR.REQUESTED_DATE, 'DD-MON-YYYY')) AS REQUESTED_DATE_AD"),
            new Expression("BS_DATE(TO_CHAR(TR.REQUESTED_DATE, 'DD-MON-YYYY')) AS REQUESTED_DATE_BS"),
            new Expression("INITCAP(TO_CHAR(TR.APPROVED_DATE, 'DD-MON-YYYY')) AS APPROVED_DATE"),
            new Expression("INITCAP(TO_CHAR(TR.RECOMMENDED_DATE, 'DD-MON-YYYY')) AS RECOMMENDED_DATE"),
            new Expression("TR.REQUESTED_AMOUNT AS REQUESTED_AMOUNT"),
            new Expression("TR.TRAVEL_ID AS TRAVEL_ID"),
            new Expression("TR.TRAVEL_CODE AS TRAVEL_CODE"),
            new Expression("TR.PURPOSE AS PURPOSE"),
            new Expression("TR.EMPLOYEE_ID AS EMPLOYEE_ID"),
            new Expression("TR.RECOMMENDED_BY AS RECOMMENDED_BY"),
            new Expression("TR.APPROVED_BY AS APPROVED_BY"),
            new Expression("TR.APPROVED_REMARKS AS APPROVED_REMARKS"),
            new Expression("TR.RECOMMENDED_REMARKS AS RECOMMENDED_REMARKS"),
            new Expression("TR.REMARKS AS REMARKS"),
            new Expression("TR.REQUESTED_TYPE AS REQUESTED_TYPE"),
            new Expression("(CASE WHEN LOWER(TR.REQUESTED_TYPE) = 'ad' THEN 'Advance' ELSE 'Expense' END) AS REQUESTED_TYPE_DETAIL"),
            new Expression("REC_APP_ROLE({$id},RA.RECOMMEND_BY,RA.APPROVED_BY) AS ROLE"),
            new Expression("REC_APP_ROLE_NAME({$id},RA.RECOMMEND_BY,RA.APPROVED_BY) AS YOUR_ROLE"),
                ], true);

        $select->from(['TR' => TravelRequest::TABLE_NAME])
                ->join(['E' => "HRIS_EMPLOYEES"], "E.EMPLOYEE_ID=TR.EMPLOYEE_ID", ["FULL_NAME" => new Expression("INITCAP(E.FULL_NAME)")], "left")
                ->join(['E1' => "HRIS_EMPLOYEES"], "E1.EMPLOYEE_ID=TR.RECOMMENDED_BY", ['RECOMMENDED_BY_NAME' => new Expression("INITCAP(E1.FULL_NAME)")], "left")
                ->join(['E2' => "HRIS_EMPLOYEES"], "E2.EMPLOYEE_ID=TR.APPROVED_BY", ['APPROVED_BY_NAME' => new Expression("INITCAP(E2.FULL_NAME)")], "left")
                ->join(['RA' => "HRIS_RECOMMENDER_APPROVER"], "RA.EMPLOYEE_ID=TR.EMPLOYEE_ID", ['RECOMMENDER_ID' => 'RECOMMEND_BY', 'APPROVER_ID' => 'APPROVED_BY'], "left")
                ->join(['RECM' => "HRIS_EMPLOYEES"], "RECM.EMPLOYEE_ID=RA.RECOMMEND_BY", ['RECOMMENDER_NAME' => new Expression("INITCAP(RECM.FULL_NAME)")], "left")
                ->join(['APRV' => "HRIS_EMPLOYEES"], "APRV.EMPLOYEE_ID=RA.APPROVED_BY", ['APPROVER_NAME' => new Expression("INITCAP(APRV.FULL_NAME)")], "left");
        $select->where(["((RA.RECOMMEND_BY=" . $id . " AND TR.STATUS='RQ') OR (RA.APPROVED_BY=" . $id . " AND TR.STATUS='RC') )"]);

        $select->where([
            "E.STATUS='E'",
            "E.RETIRED_FLAG='N'",
        ]);
        $select->order("E.FULL_NAME ASC");
        $statement = $sql->prepareStatementForSqlObject($select);

        $result = $statement->execute();
        return $result;
    }

}
