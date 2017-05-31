CREATE TABLE HRIS_SHIFT_ADJUSTMENT
  (
    ADJUSTMENT_ID         NUMBER(7,0) PRIMARY KEY,
    START_TIME            TIMESTAMP,
    END_TIME              TIMESTAMP,
    ADJUSTMENT_START_DATE DATE NOT NULL,
    ADJUSTMENT_END_DATE   DATE NOT NULL,
    CREATED_DT            DATE,
    CREATED_BY            NUMBER(7,0),
    MODIFIED_DT           DATE,
    MODIFIED_BY           NUMBER(7,0)
  );
ALTER TABLE HRIS_SHIFT_ADJUSTMENT ADD CONSTRAINT FK_SHIFT_ADJ_EMP_1 FOREIGN KEY(CREATED_BY) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID);
ALTER TABLE HRIS_SHIFT_ADJUSTMENT ADD CONSTRAINT FK_SHIFT_ADJ_EMP_2 FOREIGN KEY(MODIFIED_BY) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID);
CREATE TABLE HRIS_EMPLOYEE_SHIFT_ADJUSTMENT
  (
    ADJUSTMENT_ID NUMBER(7,0),
    EMPLOYEE_ID   NUMBER(7,0)
  );
ALTER TABLE HRIS_EMPLOYEE_SHIFT_ADJUSTMENT ADD CONSTRAINT FK_EMP_SH_ADJ_SH_ADJ FOREIGN KEY(ADJUSTMENT_ID ) REFERENCES HRIS_SHIFT_ADJUSTMENT(ADJUSTMENT_ID) ON
DELETE CASCADE;
ALTER TABLE HRIS_EMPLOYEE_SHIFT_ADJUSTMENT ADD CONSTRAINT FK_EMP_SH_ADJ_EMP FOREIGN KEY(EMPLOYEE_ID) REFERENCES HRIS_EMPLOYEES(EMPLOYEE_ID);