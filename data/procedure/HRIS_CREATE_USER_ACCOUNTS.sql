create or replace PROCEDURE HRIS_CREATE_USER_ACCOUNTS(
    P_PASSWORD HRIS_USERS.PASSWORD%TYPE := 'password@123')
AS
  V_USER_ID  NUMBER :=20;
  V_USERNAME VARCHAR2(255 BYTE);
BEGIN
  FOR CUR_EMP IN
  (SELECT EMPLOYEE_ID,
    FIRST_NAME,
    MIDDLE_NAME,
    LAST_NAME
  FROM HRIS_EMPLOYEES
  WHERE EMPLOYEE_ID NOT IN
    (SELECT EMPLOYEE_ID FROM HRIS_USERS WHERE STATUS ='E'
    )
  )
  LOOP
    BEGIN
      SELECT NVL(MAX(USER_ID),0)+1 INTO V_USER_ID FROM HRIS_USERS;
      V_USERNAME := CONCAT(CONCAT(CONCAT(LOWER(TRIM(CUR_EMP.FIRST_NAME)),'_'),
      CASE
      WHEN CUR_EMP.MIDDLE_NAME IS NOT NULL THEN
        CONCAT(LOWER(TRIM(CUR_EMP.MIDDLE_NAME)), '_')
      ELSE
        ''
      END ),LOWER(TRIM(CUR_EMP.LAST_NAME)));
      INSERT
      INTO HRIS_USERS
        (
          USER_ID,
          EMPLOYEE_ID,
          USER_NAME,
          PASSWORD,
          ROLE_ID,
          STATUS,
          CREATED_DT
        )
        VALUES
        (
          V_USER_ID,
          CUR_EMP.EMPLOYEE_ID,
          V_USERNAME,
          P_PASSWORD,
          11,
          'E',
          TRUNC(SYSDATE)
        );
    END;
  END LOOP;
END;
