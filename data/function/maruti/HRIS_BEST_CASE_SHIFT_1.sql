create or replace FUNCTION HRIS_BEST_CASE_SHIFT(
    P_EMPLOYEE_ID HRIS_EMPLOYEES.EMPLOYEE_ID%TYPE,
    P_ATTENDANCE_DT DATE)
  RETURN NUMBER
AS
  V_SHIFT_ID HRIS_SHIFTS.SHIFT_ID%TYPE;
  V_IN_TIME           DATE;
  V_SHIFT_IN_TIME     DATE;
  V_IN_TIME_DIFF      NUMBER;
  V_IN_TIME_DIFF_MIN  NUMBER;
  V_MIN_IN_TIME       NUMBER;
  V_OUT_TIME          DATE;
  V_SHIFT_OUT_TIME    DATE;
  V_OUT_TIME_DIFF     NUMBER;
  V_OUT_TIME_DIFF_MIN NUMBER;
  V_MIN_IN_OUT_TIME   NUMBER;
  V_IN_TIME_MIN  TIMESTAMP;
  V_OUT_TIME_MAX  TIMESTAMP;
  V_IN_TIME_IN DATE :=NULL;
  V_OUT_TIME_OUT DATE :=NULL;
  V_IN_TIME_CHECK NUMBER;
BEGIN


select 
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||'05:00 PM','DD-MON-YYYY HH:MI AM'),
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT+1,'DD-MON-YYYY')||'12:30 PM','DD-MON-YYYY HH:MI AM')
  INTO
V_IN_TIME_MIN,
V_OUT_TIME_MAX
  FROM DUAL;

  SELECT MIN(TO_DATE(TO_CHAR(ATTENDANCE_TIME,'HH:MI AM'),'HH:MI AM')) AS IN_TIME,
    MAX(TO_DATE(TO_CHAR(ATTENDANCE_TIME,'HH:MI AM'),'HH:MI AM'))      AS OUT_TIME
  INTO V_IN_TIME,
    V_OUT_TIME
  FROM HRIS_ATTENDANCE
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  AND ATTENDANCE_DT = P_ATTENDANCE_DT;



  -- TO CHECK IN OUT ACCOURDING TO IN DEVICE AND OUT DEVICE START

  select 
  MIN(TO_DATE(TO_CHAR(A.ATTENDANCE_TIME,'HH:MI AM'),'HH:MI AM'))
  INTO V_IN_TIME_IN
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='IN'
  AND ATTENDANCE_DT = P_ATTENDANCE_DT;

  IF V_IN_TIME_MIN IS NOT NULL THEN

  select 
EXTRACT (HOUR FROM (V_IN_TIME_IN-V_IN_TIME_MIN))*60+
EXTRACT (MINUTE FROM (V_IN_TIME_IN-V_IN_TIME_MIN)) 
INTO V_IN_TIME_CHECK
  FROM DUAL;
  
  if V_IN_TIME_CHECK > 0
  then
select 
  MAX(TO_DATE(TO_CHAR(A.ATTENDANCE_TIME,'HH:MI AM'),'HH:MI AM'))
  INTO V_OUT_TIME_OUT
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='OUT'
  AND A.ATTENDANCE_TIME > V_IN_TIME_MIN
  and A.ATTENDANCE_TIME < V_OUT_TIME_MAX;
   
  
  end if;
  
    V_IN_TIME:=V_IN_TIME_IN;
    V_OUT_TIME:=V_OUT_TIME_OUT;
 


  END IF;




  -- TO CHECK IN OUT ACCOURDING TO IN DEVICE AND OUT DEVICE END



  --
  FOR shift IN
  (SELECT S.*
  FROM HRIS_EMPLOYEE_SHIFTS ES
  JOIN HRIS_SHIFTS S
  ON (ES.SHIFT_ID      = S.SHIFT_ID)
  WHERE ES.EMPLOYEE_ID = P_EMPLOYEE_ID
  AND (P_ATTENDANCE_DT BETWEEN ES.START_DATE AND ES.END_DATE)
  AND S.STATUS ='E'
  )
  LOOP
    V_SHIFT_IN_TIME    := shift.START_TIME+(.000694*NVL(shift.LATE_IN,0));
    V_SHIFT_IN_TIME    :=TO_DATE(TO_CHAR(V_SHIFT_IN_TIME,'HH:MI AM'),'HH:MI AM');
    V_IN_TIME_DIFF     :=ABS(V_SHIFT_IN_TIME-V_IN_TIME);
    V_IN_TIME_DIFF_MIN :=V_IN_TIME_DIFF     *24*60;
    --
    IF(V_IN_TIME          = V_OUT_TIME) THEN
      IF V_MIN_IN_TIME   IS NULL THEN
        V_MIN_IN_TIME    :=V_IN_TIME_DIFF;
        V_SHIFT_ID       :=shift.SHIFT_ID;
      ELSIF V_IN_TIME_DIFF<V_MIN_IN_TIME THEN
        V_MIN_IN_TIME    :=V_IN_TIME_DIFF;
        V_SHIFT_ID       :=shift.SHIFT_ID;
      END IF;
      CONTINUE;
    END IF;
    --
    V_SHIFT_OUT_TIME                       := shift.END_TIME-(.000694*NVL(shift.EARLY_OUT,0));
    V_SHIFT_OUT_TIME                       :=TO_DATE(TO_CHAR(V_SHIFT_OUT_TIME,'HH:MI AM'),'HH:MI AM');
    V_OUT_TIME_DIFF                        :=ABS(V_SHIFT_OUT_TIME-V_OUT_TIME);
    V_OUT_TIME_DIFF_MIN                    := V_OUT_TIME_DIFF    *24*60;
    IF(V_MIN_IN_OUT_TIME                   IS NULL ) THEN
      V_MIN_IN_OUT_TIME                    :=V_IN_TIME_DIFF+V_OUT_TIME_DIFF;
      V_SHIFT_ID                           :=shift.SHIFT_ID;
    ELSIF (V_IN_TIME_DIFF                                  +V_OUT_TIME_DIFF) <V_MIN_IN_OUT_TIME THEN
      V_MIN_IN_OUT_TIME                    :=V_IN_TIME_DIFF+V_OUT_TIME_DIFF;
      V_SHIFT_ID                           :=shift.SHIFT_ID;
    END IF;
  END LOOP;
RETURN V_SHIFT_ID;
END;