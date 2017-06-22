ALTER TABLE HRIS_EMPLOYEES ADD FULL_NAME VARCHAR2(255 BYTE);

DECLARE
  V_EMPLOYEE_ID NUMBER(7,0);
  V_FIRST_NAME  VARCHAR2(255 BYTE);
  V_MIDDLE_NAME VARCHAR2(255 BYTE);
  V_LAST_NAME   VARCHAR2(255 BYTE);
  V_FULL_NAME   VARCHAR(255 BYTE);
  CURSOR EMPLOYEES
  IS
    (SELECT EMPLOYEE_ID, FIRST_NAME,MIDDLE_NAME,LAST_NAME FROM HRIS_EMPLOYEES
    );
BEGIN
  OPEN EMPLOYEES;
  LOOP
    EXIT
  WHEN EMPLOYEES%NOTFOUND;
    FETCH EMPLOYEES INTO V_EMPLOYEE_ID,V_FIRST_NAME,V_MIDDLE_NAME,V_LAST_NAME;
    UPDATE HRIS_EMPLOYEES
    SET FULL_NAME= CONCAT(CONCAT(CONCAT(TRIM(V_FIRST_NAME),' '),
      CASE
        WHEN V_MIDDLE_NAME IS NOT NULL
        THEN CONCAT(TRIM(V_MIDDLE_NAME), ' ')
        ELSE ''
      END ),TRIM(V_LAST_NAME))
    WHERE EMPLOYEE_ID=V_EMPLOYEE_ID;
    NULL;
  END LOOP;
  CLOSE EMPLOYEES;
END;



CREATE TABLE HRIS_ATTENDANCE_PENALTY
  (
    ATTENDANCE_DT DATE,
    EMPLOYEE_ID   NUMBER(7,0),
    REASON        CHAR(1 BYTE) NOT NULL CHECK(REASON IN ('B','T')),
    ACTION        CHAR(1 BYTE) NOT NULL CHECK(ACTION IN ('A'))
  );
ALTER TABLE HRIS_ATTENDANCE_PENALTY ADD CONSTRAINT FK_ATTEN_PEN_EMP FOREIGN KEY(EMPLOYEE_ID) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID);

-- 2
UPDATE HRIS_MENUS SET MENU_NAME='Asset Issue' WHERE MENU_NAME='Asset' AND MENU_ID=133;
UPDATE HRIS_MENUS SET MENU_NAME='Asset Issue Report' WHERE MENU_NAME='Issue' AND MENU_ID=135;

Insert into HRIS_MENUS (MENU_ID,MENU_NAME,PARENT_MENU,ROUTE,STATUS,CREATED_DT,ICON_CLASS,ACTION,MENU_INDEX,IS_VISIBLE) values 
(319,'View',133,'assetIssue','E',trunc(sysdate),'fa fa-pencil','view',3,'N');


DROP TABLE HRIS_ATTENDANCE_PENALTY;

ALTER TABLE HRIS_ATTENDANCE_DETAIL ADD OVERALL_STATUS CHAR(2 BYTE) DEFAULT 'AB' NOT NULL CHECK(OVERALL_STATUS IN ('DO','HD','LV','TV','TN','PR','AB','WD','WH','BA','LA','TP','LP','VP'));   

======= punam changes

ALTER TABLE HRIS_APPRAISAL_KPI
MODIFY SELF_RATING FLOAT;

ALTER TABLE HRIS_APPRAISAL_KPI
MODIFY APPRAISER_RATING FLOAT;

ALTER TABLE HRIS_APPRAISAL_KPI
MODIFY REVIEWER_RATING FLOAT;

