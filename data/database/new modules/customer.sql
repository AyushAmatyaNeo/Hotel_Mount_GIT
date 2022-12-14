

CREATE TABLE HRIS_CUSTOMER
  (
    CUSTOMER_ID         NUMBER(7,0) PRIMARY KEY,
    CUSTOMER_CODE       VARCHAR2(15 BYTE),
    CUSTOMER_ENAME      VARCHAR2(150 BYTE) NOT NULL,
    CUSTOMER_LNAME      VARCHAR2(150 BYTE),
    ADDRESS             VARCHAR2(150 BYTE),
    PHONE_NO            VARCHAR2(30 BYTE),
    CONTACT_PERSON_NAME VARCHAR2(150 BYTE),
    PAN_NO 		VARCHAR2(150 BYTE),
    CREATED_BY          NUMBER(7,0) ,
    CREATED_DT          DATE DEFAULT TRUNC(SYSDATE),
    MODIFIED_BY         NUMBER(7,0),
    MODIFIED_DT         DATE,
    REMARKS             VARCHAR2(512 BYTE),
    STATUS              CHAR(1 BYTE) DEFAULT 'E' NOT NULL CHECK(STATUS IN ('E','D'))
  );
--
CREATE TABLE HRIS_CUST_CONTRACT_WEEKDAYS
  (
    CONTRACT_ID NUMBER(7,0) NOT NULL,
    WEEKDAY     NUMBER(1,0) NOT NULL,
    CONSTRAINT CUSTOMER_CONTRACT_WEEKDAYS_FK FOREIGN KEY(CONTRACT_ID) REFERENCES HRIS_CUSTOMER_CONTRACT(CONTRACT_ID)
  );

CREATE TABLE HRIS_CUST_CONTRACT_MONTHDAYS
  (
    CONTRACT_ID NUMBER(7,0) NOT NULL,
    MONTHDAY    NUMBER(2,0) NOT NULL,
    CONSTRAINT CUSTOMER_CONTRACT_MONTHDAYS_FK FOREIGN KEY(CONTRACT_ID) REFERENCES HRIS_CUSTOMER_CONTRACT(CONTRACT_ID)
  );
  
CREATE TABLE HRIS_CUST_CONTRACT_DATES
  (
    CONTRACT_ID  NUMBER(7,0) NOT NULL,
    MANUAL_DATE DATE NOT NULL,
    CONSTRAINT CUSTOMER_CONTRACT_DATES_FK FOREIGN KEY(CONTRACT_ID) REFERENCES HRIS_CUSTOMER_CONTRACT(CONTRACT_ID)
  );
  
CREATE TABLE HRIS_CUSTOMER_CONTRACT
  (
    CONTRACT_ID NUMBER(7,0) PRIMARY KEY,
    CUSTOMER_ID NUMBER(7,0) NOT NULL,
    START_DATE  DATE NOT NULL,
    END_DATE    DATE NOT NULL,
    IN_TIME     TIMESTAMP NOT NULL,
    OUT_TIME    TIMESTAMP NOT NULL,
    WORKING_HOURS FLOAT(126) NOT NULL,
    WORKING_CYCLE CHAR(1 BYTE) NOT NULL CHECK(WORKING_CYCLE IN ('W','M','R')),
    CHARGE_TYPE   CHAR(1 BYTE) NOT NULL CHECK(CHARGE_TYPE   IN ('H','D','W','M')),
    CHARGE_RATE   NUMBER(8,2),
    CREATED_BY    NUMBER(7,0) ,
    CREATED_DT    DATE DEFAULT TRUNC(SYSDATE),
    MODIFIED_BY   NUMBER(7,0),
    MODIFIED_DT   DATE,
    REMARKS       VARCHAR2(512 BYTE),
    STATUS        CHAR(1 BYTE) DEFAULT 'E' NOT NULL CHECK(STATUS IN ('E','D')),
    CONSTRAINT CUSTOMER_CONTRACT_FK FOREIGN KEY(CUSTOMER_ID) REFERENCES HRIS_CUSTOMER(CUSTOMER_ID)
  );
--

CREATE TABLE HRIS_CUST_CONTRACT_EMP(
    CONTRACT_ID     NUMBER(7,0) NOT NULL,
    EMPLOYEE_ID     NUMBER(7,0) NOT NULL,
    START_DATE      DATE ,
    END_DATE        DATE ,
    START_TIME		TIMESTAMP NOT NULL,
    END_TIME		TIMESTAMP NOT NULL,
    WORKING_HOUR	NUMBER(4,0) NOT NULL,
    ASSIGNED_DATE     DATE NOT NULL,
    OLD_EMPLOYEE_ID NUMBER(7,0),
    MONTH_CODE_ID NUMBER(7,0) NOT NULL,
    NEPALI_MONTH NUMBER(2,0) , 
    NEPALI_YEAR NUMBER(4,0) ,
    CONSTRAINT CUSTOMER_CONTRACT_EMPLOYEES_FK FOREIGN KEY(CONTRACT_ID) REFERENCES HRIS_CUSTOMER_CONTRACT(CONTRACT_ID)
  );


--menu insert quries

INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'customer',
NULL,
'javascript::',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select max(menu_index)+1 from hris_menus where parent_menu is null),
'Y'
);



INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'customer Setup',
342,
'customer-setup',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select nvl(max(menu_index),0)+1 from hris_menus where parent_menu=342),
'Y'
);


select * from hris_menus;


INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'customer Contract',
342,
'customer-contract',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select nvl(max(menu_index),0)+1 from hris_menus where parent_menu=342),
'Y'
);



CREATE TABLE HRIS_SERVICE_EMPLOYEES(
  EMPLOYEE_ID NUMBER(7,0),
  EMPLOYEE_CODE NUMBER(7,0),
	FIRST_NAME VARCHAR2(255 BYTE) NOT NULL,
	MIDDLE_NAME VARCHAR2(255 BYTE),
	LAST_NAME VARCHAR2(255 BYTE) NOT NULL,
	FULL_NAME VARCHAR2(255 BYTE) NOT NULL,
	GENDER_ID NUMBER(7,0) NOT NULL,
	BLOOD_GROUP_ID NUMBER(7,0),
	EMPLOYEE_TYPE CHAR(1 BYTE),
	EMAIL VARCHAR2(150),
	TELEPHONE_NO NUMBER(10,0),
	MOBILE_NO NUMBER(10,0),
	CITIZENSHIP_NO VARCHAR2(50 BYTE),
	CITIZENSHIP_ISSUE_DATE DATE,
	CITIZENSHIP_ISSUE_PLACE VARCHAR2(255 BYTE),
	PERMANENT_ZONE_ID NUMBER(2,0),
	PERMANENT_DISTRICT_ID NUMBER(2,0),
	TEMPORARY_ZONE_ID NUMBER(2,0),
	TEMPORARY_DISTRICT_ID NUMBER(2,0),
	ACCOUNT_NO VARCHAR2(255 BYTE),
	BRANCH_ID NUMBER(7,0),
	DEPARTMENT_ID NUMBER(7,0),
	DESIGNATION_ID NUMBER(7,0),
	POSITION_ID NUMBER(7,0),
  STATUS CHAR(1 BYTE) DEFAULT 'E' NOT NULL,
  CREATED_BY NUMBER(7,0),
  CREATED_DT DATE DEFAULT TRUNC(SYSDATE) NOT NULL,
  MODIFIED_BY NUMBER(7,0),
  MODIFIED_DT DATE,
  REMARKS VARCHAR2(255)
);


INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'Service Employee',
342,
'service-employee',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select nvl(max(menu_index),0)+1 from hris_menus where parent_menu=342),
'Y'
);

alter table HRIS_CUSTOMER_CONTRACT
add CONTRACT_NAME VARCHAR2(255);



INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'Contract Attendance',
(select menu_id from hris_menus where lower(menu_name) like lower('customer%') and parent_menu is null),
'contract-attendance',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select nvl(max(menu_index),0)+1 from hris_menus where parent_menu=(select menu_id from hris_menus where lower(menu_name) like lower('customer%') and parent_menu is null)),
'Y'
);


INSERT INTO HRIS_MENUS
(MENU_ID,
MENU_NAME,
PARENT_MENU,
ROUTE,
STATUS,
CREATED_DT,
ICON_CLASS,
ACTION,
MENU_INDEX,
IS_VISIBLE)
VALUES
((SELECT MAX(MENU_ID)+1 FROM HRIS_MENUS),
'Contract Employees Assign',
(select menu_id from hris_menus where lower(menu_name) like lower('customer%') and parent_menu is null),
'contract-employees',
'E',
TRUNC(SYSDATE),
'fa fa-pencil',
'index',
(select nvl(max(menu_index),0)+1 from hris_menus where parent_menu=(select menu_id from hris_menus where lower(menu_name) like lower('customer%') and parent_menu is null)),
'Y'
);


CREATE TABLE HRIS_CUST_CONTRACT_ATTENDANCE(
	CONTRACT_ID NUMBER(7,0) NOT NULL,
	EMPLOYEE_ID NUMBER(7,0) NOT NULL,
	ATTENDANCE_DT DATE NOT NULL,
	IN_TIME TIMESTAMP,
	OUT_TIME TIMESTAMP,
	NORMARL_HOUR FLOAT(126),
	PT_HOUR FLOAT(126),
	OT_HOUR FLOAT(126),
	TOTAL_HOUR FLOAT(126),
  MONTH_CODE_ID NUMBER(7,0) NOT NULL
 );


ALTER TABLE HRIS_CUSTOMER_CONTRACT DROP column IN_TIME;
ALTER TABLE HRIS_CUSTOMER_CONTRACT DROP column OUT_TIME;
ALTER TABLE HRIS_CUSTOMER_CONTRACT DROP column WORKING_HOURS;

ALTER TABLE HRIS_CUST_CONTRACT_ATTENDANCE 
ADD IS_ABSENT CHAR(1 BYTE);

ALTER TABLE HRIS_CUST_CONTRACT_ATTENDANCE 
ADD IS_SUBSTITUTE CHAR(1 BYTE) DEFAULT 'N';


