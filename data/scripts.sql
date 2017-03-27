
-- NEO_HRIS | 23-MAR-2017 | prabin
-- 
ALTER TABLE HRIS_DEPARTMENTS
ADD COMPANY_ID NUMBER(7,0) DEFAULT 1 NOT NULL;


ALTER TABLE HRIS_DEPARTMENTS 
ADD CONSTRAINT FK_DEPT_COMP_COMP_ID 
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);
-- 
-- HRIS_MODERN | 23-MAR-2017 | ukesh
-- HRIS_JWL | 23-MAR-2017 | ukesh

-- CREATE TABLE FOR TRAVEL EXPENSE DETAIL
CREATE TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL
(
	ID			                    NUMBER(7,0) NOT NULL,	
	TRAVEL_ID			              NUMBER(7,0) NOT NULL,
	DEPARTURE_DATE              DATE NOT NULL,
  DEPARTURE_TIME              TIMESTAMP(6) NOT NULL,
  DEPARTURE_PLACE             VARCHAR2(255 BYTE) NOT NULL,
  DESTINATION_DATE            DATE NOT NULL,
  DESTINATION_TIME            TIMESTAMP(6) NOT NULL,
  DESTINATION_PLACE           VARCHAR2(255 BYTE) NOT NULL,
  TRANSPORT_TYPE              CHAR(2 BYTE) NOT NULL,
  FARE                        FLOAT NOT NULL,
  ALLOWANCE                   FLOAT NOT NULL,
  LOCAL_CONVEYENCE            FLOAT NOT NULL,
  MISC_EXPENSES               FLOAT NOT NULL,
  TOTAL_AMOUNT                FLOAT NOT NULL,
  REAMRKS                     VARCHAR2(255 BYTE),
	COMPANY_ID          	      NUMBER(7,0),	
	BRANCH_ID           	      NUMBER(7,0),
	CREATED_BY                  NUMBER(7,0),
	CREATED_DATE                DATE DEFAULT SYSDATE,
	MODIFIED_BY		              NUMBER(7,0),
	MODIFIED_DATE		            DATE,
	CHECKED					            VARCHAR2(1 BYTE) DEFAULT 'N',
	APPROVED_BY				          NUMBER(7,0),
	APPROVED_DATE			          DATE DEFAULT SYSDATE,
	APPROVED				            VARCHAR2(1 BYTE) DEFAULT 'N',
	STATUS        			        CHAR(1 BYTE),
	CONSTRAINT FK_TRL_EXP_DTL_COM_COM_ID FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID),
	CONSTRAINT FK_TRL_EXP_DTL_BRN_BNC_ID FOREIGN KEY(BRANCH_ID) REFERENCES HRIS_BRANCHES(BRANCH_ID),
	CONSTRAINT PK_TRL_EXP_DTL PRIMARY KEY (ID),
	CONSTRAINT FK_TRL_EXP_DTL FOREIGN KEY(TRAVEL_ID) REFERENCES HRIS_EMPLOYEE_TRAVEL_REQUEST(TRAVEL_ID),
	CONSTRAINT FK_TRL_EXP_DTL_EMP_EMP_ID FOREIGN KEY(CREATED_BY) REFERENCES 	HRIS_EMPLOYEES(EMPLOYEE_ID),
	CONSTRAINT FK_TRL_EXP_DTL_EMP_EMP_ID2 FOREIGN KEY(MODIFIED_BY) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID),
	CONSTRAINT FK_TRL_EXP_DTL_EMP_EMP_ID3 FOREIGN KEY(APPROVED_BY) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID)
);


ALTER TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL 
ADD
CONSTRAINT CHEK_TRANS CHECK (TRANSPORT_TYPE IN ('AP','OV','TI','BS'));


--AP=> AERO PLANE, OV=>OFFICE VEHICLES, TI=>TAXI,BS=>BUS

-- FOR EXPENSE REQUEST ON TRAVEL REQUEST
ALTER TABLE HRIS_EMPLOYEE_TRAVEL_REQUEST
ADD ( TRANSPORT_TYPE      CHAR(2 BYTE),
      DEPARTURE_DATE      DATE,
      RETURED_DATE        DATE
);


ALTER TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL
RENAME COLUMN REAMRKS TO REMARKS;

-- HRIS_NEO | 23-MAR-2017 | UKESH
-- HRIS_JWL | 23-MAR-2017 | UKESH
-- HRIS_MODERN | 23-MAR-2017 | UKESH
HRIS_ATTENDANCE_DEVICE ADDED;

-- HRIS_NEO | 23-MAR-2017 | UKESH
-- HRIS_JWL | 23-MAR-2017 | UKESH
-- HRIS_MODERN | 23-MAR-2017 | UKESH
--
ALTER TABLE HRIS_EMPLOYEES ADD OVERTIME_FLAG CHAR(1 BYTE) DEFAULT 'N' NOT NULL CHECK (OVERTIME_FLAG IN ('Y','N')); 
-- 


-- HRIS_NEO | 23-MAR-2017 | UKESH
-- HRIS_JWL | 23-MAR-2017 | UKESH
-- HRIS_MODERN | 23-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_SHIFTS ADD TOTAL_WORKING_HR TIMESTAMP; 

ALTER TABLE HRIS_SHIFTS ADD ACTUAL_WORKING_HR TIMESTAMP; 
-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_ADVANCE_MASTER_SETUP 
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_ADVANCE_MASTER_SETUP
ADD CONSTRAINT FK_ADV_MAS_SET_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);
--

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_DESIGNATIONS 
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_DESIGNATIONS
ADD CONSTRAINT FK_DEGIGNATION_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_EMAIL_TEMPLATE
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_EMAIL_TEMPLATE
ADD CONSTRAINT FK_EMAIL_TEMP_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_LEAVE_MASTER_SETUP
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_LEAVE_MASTER_SETUP
ADD CONSTRAINT LEAVE_MASTER_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_LOAN_MASTER_SETUP
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_LOAN_MASTER_SETUP
ADD CONSTRAINT FK_LOAN_MASTER_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 


-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 
ALTER TABLE HRIS_POSITIONS
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_POSITIONS
ADD CONSTRAINT FK_POSITIONS_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
-- 

ALTER TABLE HRIS_SHIFTS
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_SHIFTS
ADD CONSTRAINT FK_SHIFTS_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
--
ALTER TABLE HRIS_TRAINING_MASTER_SETUP
ADD COMPANY_ID NUMBER(7,0);

ALTER TABLE HRIS_TRAINING_MASTER_SETUP
ADD CONSTRAINT FK_TRA_MAS_SET_EMP_EMP_ID
FOREIGN KEY(COMPANY_ID) REFERENCES HRIS_COMPANY(COMPANY_ID);

--  

-- HRIS_NEO | 26-MAR-2017 | UKESH
--
ALTER TABLE HRIS_SHIFTS
DROP COLUMN LATE_IN;

ALTER TABLE HRIS_SHIFTS
ADD LATE_IN TIMESTAMP;

ALTER TABLE HRIS_SHIFTS
DROP COLUMN EARLY_OUT;

ALTER TABLE HRIS_SHIFTS
ADD EARLY_OUT TIMESTAMP;
-- 

-- HRIS_NEO | 26-MAR-2017 | UKESH
--
ALTER TABLE HRIS_SHIFTS
DROP COLUMN TOTAL_WORKING_HR;

ALTER TABLE HRIS_SHIFTS
ADD TOTAL_WORKING_HR TIMESTAMP DEFAULT TO_TIMESTAMP('00:00','HH24:MI') NOT NULL ;

ALTER TABLE HRIS_SHIFTS 
DROP COLUMN ACTUAL_WORKING_HR;

ALTER TABLE HRIS_SHIFTS
ADD ACTUAL_WORKING_HR TIMESTAMP DEFAULT TO_TIMESTAMP('00:00','HH24:MI') NOT NULL;

-- 

-- HRIS_NEO | 27-MAR-2017 | SOMKALA
ALTER TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL
MODIFY ALLOWANCE FLOAT NULL;


ALTER TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL
MODIFY LOCAL_CONVEYENCE FLOAT NULL;

ALTER TABLE HRIS_EMP_TRAVEL_EXPENSE_DTL
MODIFY MISC_EXPENSES FLOAT NULL;
--



