
DECLARE
V_HISTORY_ID NUMBER(7,0);
BEGIN

FOR JOB_LIST IN (SELECT * FROM HR_EMPLOYEE_JOB_HISTORY)
LOOP
SELECT NVL(MAX(JOB_HISTORY_ID),0)+1 INTO V_HISTORY_ID FROM HRIS_JOB_HISTORY;
DBMS_OUTPUT.PUT_LINE(V_HISTORY_ID);


INSERT INTO HRIS_JOB_HISTORY
(
JOB_HISTORY_ID,
EMPLOYEE_ID,
START_DATE,
END_DATE,
TO_BRANCH_ID,
TO_DEPARTMENT_ID,
TO_DESIGNATION_ID,
TO_POSITION_ID,
TO_SERVICE_TYPE_ID,
STATUS,
--CREATED_BY,
CREATED_DT,
TO_COMPANY_ID,
TO_SALARY,
RETIRED_FLAG,
DISABLED_FLAG,
EVENT_DATE
)
VALUES
(
V_HISTORY_ID,
JOB_LIST.EMPLOYEE_CODE,
JOB_LIST.FROM_DATE,     
JOB_LIST.TO_DATE,
JOB_LIST.SAL_SHEET_CODE,
JOB_LIST.DEPARTMENT_CODE,
JOB_LIST.DESIGNATION_CODE,
JOB_LIST.GRADE_CODE,
JOB_LIST.EMPLOYEE_TYPE,
'E',
TRUNC(SYSDATE),
JOB_LIST.COMPANY_CODE,
JOB_LIST.BASIC_SALARY,
'N',
'N',
JOB_LIST.FROM_DATE          
);



END LOOP;



END;