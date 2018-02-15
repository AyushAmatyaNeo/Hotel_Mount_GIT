CREATE OR REPLACE PROCEDURE HRIS_TRAVEL_SETTLEMENT_EQUAL(
    COMPANY_CODE      VARCHAR2,
    FORM_CODE         VARCHAR2,
    TRANSACTION_DATE  DATE,
    BRANCH_CODE       VARCHAR2,
    CREATED_BY        VARCHAR2,
    CREATED_DATE      DATE,
    DR_ACC_CODE       VARCHAR2,
    CR_ACC_CODE       VARCHAR2,
    PARTICULARS       VARCHAR2,
    SETTLEMENT_AMOUNT NUMBER,
    SUB_CODE          VARCHAR2,
    VOUCHER_NO        VARCHAR2)
IS
  SESSION_ROWID NUMBER           :=-1;
  CURRENCY_CODE VARCHAR2(3 BYTE) :='NRS';
  EXCHANGE_RATE NUMBER           :=1;
  SERIAL_NO_1   NUMBER(5)        :=1;
  SERIAL_NO_2   NUMBER(5)        :=2;
BEGIN
  SAVEPOINT START_OF_FUNCTION;
  SELECT MYSEQUENCE.NEXTVAL INTO SESSION_ROWID FROM DUAL;
  INSERT
  INTO MASTER_TRANSACTION
    (
      VOUCHER_NO,
      VOUCHER_DATE,
      VOUCHER_AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      DELETED_FLAG,
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    )
    VALUES
    (
      VOUCHER_NO,
      TRANSACTION_DATE,
      SETTLEMENT_AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      'N',
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    );
  INSERT
  INTO FA_DOUBLE_VOUCHER
    (
      VOUCHER_NO,
      VOUCHER_DATE,
      SERIAL_NO,
      ACC_CODE,
      PARTICULARS,
      TRANSACTION_TYPE,
      AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      DELETED_FLAG,
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    )
    VALUES
    (
      VOUCHER_NO,
      TRANSACTION_DATE,
      SERIAL_NO_1,
      DR_ACC_CODE,
      PARTICULARS,
      'DR',
      SETTLEMENT_AMOUNT ,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      'N',
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    );
  INSERT
  INTO FA_DOUBLE_VOUCHER
    (
      VOUCHER_NO,
      VOUCHER_DATE,
      SERIAL_NO,
      ACC_CODE,
      PARTICULARS,
      TRANSACTION_TYPE,
      AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      DELETED_FLAG,
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    )
    VALUES
    (
      VOUCHER_NO,
      TRANSACTION_DATE,
      SERIAL_NO_2 ,
      CR_ACC_CODE,
      PARTICULARS,
      'CR',
      SETTLEMENT_AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      'N',
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    );
  INSERT
  INTO FA_VOUCHER_SUB_DETAIL
    (
      VOUCHER_NO,
      SERIAL_NO,
      ACC_CODE,
      TRANSACTION_TYPE,
      SUB_CODE,
      PARTICULARS,
      DR_AMOUNT,
      CR_AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      DELETED_FLAG,
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    )
    VALUES
    (
      VOUCHER_NO,
      SERIAL_NO_2 ,
      CR_ACC_CODE,
      'CR',
      SUB_CODE,
      PARTICULARS,
      0,
      SETTLEMENT_AMOUNT,
      FORM_CODE,
      COMPANY_CODE,
      BRANCH_CODE,
      CREATED_BY,
      CREATED_DATE,
      'N',
      CURRENCY_CODE,
      EXCHANGE_RATE,
      SESSION_ROWID
    );
EXCEPTION
WHEN OTHERS THEN
  ROLLBACK TO START_OF_FUNCTION;
  raise_application_error(-20001,'An error was encountered - '||SQLCODE||' -ERROR- '||SQLERRM);
END;