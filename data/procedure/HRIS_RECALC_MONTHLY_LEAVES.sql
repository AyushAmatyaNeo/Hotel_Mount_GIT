create or replace PROCEDURE HRIS_RECALC_MONTHLY_LEAVES
AS
V_BALANCE                     NUMBER(3,1);
BEGIN
  UPDATE HRIS_EMPLOYEE_LEAVE_ASSIGN
  SET BALANCE     =TOTAL_DAYS
  WHERE LEAVE_ID IN
    (SELECT LEAVE_ID FROM HRIS_LEAVE_MASTER_SETUP WHERE IS_MONTHLY='Y'
    );

    -- TO UPDATE MONTHYLY_LEAVE WHERE   CARYY FORWARD IS NO
  FOR leave IN
  (SELECT R.EMPLOYEE_ID,
    R.LEAVE_ID,
    M.LEAVE_YEAR_MONTH_NO,
    SUM(R.NO_OF_DAYS) AS TOTAL_NO_OF_DAYS
  FROM HRIS_EMPLOYEE_LEAVE_REQUEST R
  JOIN HRIS_LEAVE_MASTER_SETUP L
  ON (R.LEAVE_ID = L.LEAVE_ID),
    HRIS_LEAVE_MONTH_CODE M
  WHERE R.STATUS   = 'AP'
  AND L.IS_MONTHLY = 'Y'
  AND L.CARRY_FORWARD='N'
  AND R.START_DATE BETWEEN M.FROM_DATE AND M.TO_DATE
  GROUP BY R.EMPLOYEE_ID,
    R.LEAVE_ID,
    M.LEAVE_YEAR_MONTH_NO
  )
  LOOP
    UPDATE HRIS_EMPLOYEE_LEAVE_ASSIGN
    SET BALANCE             = TOTAL_DAYS - leave.TOTAL_NO_OF_DAYS
    WHERE EMPLOYEE_ID       = leave.EMPLOYEE_ID
    AND LEAVE_ID            = leave.LEAVE_ID
    AND FISCAL_YEAR_MONTH_NO=leave.LEAVE_YEAR_MONTH_NO;
  END LOOP;


  -- TO UPDATE MONTHYLY_LEAVE WHERE   CARYY FORWARD IS YES

  FOR leave IN
  (SELECT EMPLOYEE_ID,LEAVE_ID,
SUM(TOTAL_NO_OF_DAYS ) AS TOTAL_NO_OF_DAYS FROM (
SELECT R.EMPLOYEE_ID,
    R.LEAVE_ID,
    SUM(R.NO_OF_DAYS) AS TOTAL_NO_OF_DAYS
  FROM HRIS_EMPLOYEE_LEAVE_REQUEST R
  JOIN HRIS_LEAVE_MASTER_SETUP L
  ON (R.LEAVE_ID = L.LEAVE_ID)
    LEFT JOIN (SELECT * FROM  HRIS_LEAVE_YEARS WHERE TRUNC(SYSDATE) BETWEEN START_DATE AND END_DATE )LY ON (1=1) 
  WHERE R.STATUS   = 'AP'
  AND L.IS_MONTHLY = 'Y'
  AND L.CARRY_FORWARD='Y' 
  AND R.HALF_DAY NOT IN ('F','S')
  GROUP BY R.EMPLOYEE_ID,
    R.LEAVE_ID
    UNION ALL
    SELECT R.EMPLOYEE_ID,
    R.LEAVE_ID,
    SUM(R.NO_OF_DAYS)/2 AS TOTAL_NO_OF_DAYS
  FROM HRIS_EMPLOYEE_LEAVE_REQUEST R
  JOIN HRIS_LEAVE_MASTER_SETUP L
  ON (R.LEAVE_ID = L.LEAVE_ID)
    LEFT JOIN (SELECT * FROM  HRIS_LEAVE_YEARS WHERE TRUNC(SYSDATE) BETWEEN START_DATE AND END_DATE )LY ON (1=1) 
  WHERE R.STATUS   = 'AP'
  AND L.IS_MONTHLY = 'Y'
  AND L.CARRY_FORWARD='Y' 
  AND R.HALF_DAY IN ('F','S')
  GROUP BY R.EMPLOYEE_ID,
    R.LEAVE_ID) GROUP BY EMPLOYEE_ID,LEAVE_ID)
  LOOP

   FOR LEAVE_ASSIGN_DTL IN (
          SELECT
            *
          FROM
            HRIS_EMPLOYEE_LEAVE_ASSIGN
          WHERE
              EMPLOYEE_ID =leave.EMPLOYEE_ID
            AND
              LEAVE_ID =leave.LEAVE_ID
          ORDER BY FISCAL_YEAR_MONTH_NO
        ) LOOP
          IF
            (leave.TOTAL_NO_OF_DAYS >= LEAVE_ASSIGN_DTL.TOTAL_DAYS)
          THEN
            V_BALANCE := 0;
          ELSE
            V_BALANCE := LEAVE_ASSIGN_DTL.BALANCE-leave.TOTAL_NO_OF_DAYS;
          END IF;

          UPDATE HRIS_EMPLOYEE_LEAVE_ASSIGN
            SET
              BALANCE = V_BALANCE
          WHERE
              EMPLOYEE_ID = LEAVE_ASSIGN_DTL.EMPLOYEE_ID
            AND
              LEAVE_ID = LEAVE_ASSIGN_DTL.LEAVE_ID
            AND
              FISCAL_YEAR_MONTH_NO = LEAVE_ASSIGN_DTL.FISCAL_YEAR_MONTH_NO;

        END LOOP;


  END LOOP;





END;