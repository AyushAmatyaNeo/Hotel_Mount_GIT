CREATE OR REPLACE FUNCTION HRIS_IS_EMP_IN(
    P_EMPLOYEE_ID  NUMBER,
    P_TABLE_NAME   VARCHAR2,
    P_COLUMN_NAME  VARCHAR2,
    P_COLUMN_VALUE NUMBER )
  RETURN CHAR
AS
  V_COMPANY       VARCHAR2(4000 BYTE);
  V_BRANCH        VARCHAR2(4000 BYTE);
  V_DEPARTMENT    VARCHAR2(4000 BYTE);
  V_DESIGNATION   VARCHAR2(4000 BYTE);
  V_POSITION      VARCHAR2(4000 BYTE);
  V_SERVICE_TYPE  VARCHAR2(4000 BYTE);
  V_EMPLOYEE_TYPE VARCHAR2(4000 BYTE);
  V_GENDER        VARCHAR2(4000 BYTE);
  V_EMPLOYEE      VARCHAR2(4000 BYTE);
  V_QUERY_FIRST   VARCHAR2(4000 BYTE);
  V_QUERY_SECOND  VARCHAR2(4000 BYTE);
  V_RETURN        CHAR(1 BYTE);
BEGIN
  V_QUERY_FIRST :='SELECT COMPANY_ID,BRANCH_ID,DEPARTMENT_ID,DESIGNATION_ID,POSITION_ID,SERVICE_TYPE_ID,EMPLOYEE_TYPE,GENDER_ID,EMPLOYEE_ID FROM '||P_TABLE_NAME||' WHERE '||P_COLUMN_NAME||' ='||P_COLUMN_VALUE;
  EXECUTE IMMEDIATE V_QUERY_FIRST INTO V_COMPANY, V_BRANCH, V_DEPARTMENT,V_DESIGNATION, V_POSITION, V_SERVICE_TYPE, V_EMPLOYEE_TYPE, V_GENDER, V_EMPLOYEE;
  V_QUERY_SECOND   :='SELECT EMPLOYEE_ID FROM HRIS_EMPLOYEES WHERE 1=1';
  IF(V_COMPANY     IS NOT NULL) THEN
    V_QUERY_SECOND := V_QUERY_SECOND||' AND COMPANY_ID IN ('||V_COMPANY||')';
  END IF;
IF(V_BRANCH      IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND BRANCH_ID IN ('||V_BRANCH||')';
END IF;
IF(V_DEPARTMENT  IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND DEPARTMENT_ID IN ('||V_DEPARTMENT||')';
END IF;
IF(V_DESIGNATION IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND DESIGNATION_ID IN ('||V_DESIGNATION||')';
END IF;
IF(V_POSITION    IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND POSITION_ID IN ('||V_POSITION||')';
END IF;
IF(V_SERVICE_TYPE IS NOT NULL) THEN
  V_QUERY_SECOND  := V_QUERY_SECOND||' AND SERVICE_TYPE_ID IN ('||V_SERVICE_TYPE||')';
END IF;
IF(V_EMPLOYEE_TYPE IS NOT NULL) THEN
  V_QUERY_SECOND   := V_QUERY_SECOND||' AND EMPLOYEE_TYPE IN ('||V_EMPLOYEE_TYPE||')';
END IF;
IF(V_GENDER      IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND GENDER_ID IN ('||V_GENDER||')';
END IF;
IF(V_EMPLOYEE    IS NOT NULL) THEN
  V_QUERY_SECOND := V_QUERY_SECOND||' AND EMPLOYEE_ID IN ('||V_EMPLOYEE||')';
END IF;
EXECUTE IMMEDIATE 'SELECT (CASE WHEN COUNT(*) >0 THEN  ''Y'' ELSE ''N'' END) FROM ('||V_QUERY_SECOND||') WHERE EMPLOYEE_ID = '||P_EMPLOYEE_ID INTO V_RETURN;
RETURN V_RETURN;
END;