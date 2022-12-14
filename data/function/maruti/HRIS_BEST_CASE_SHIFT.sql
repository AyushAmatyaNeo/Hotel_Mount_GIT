create or replace FUNCTION HRIS_BEST_CASE_SHIFT(
    P_EMPLOYEE_ID HRIS_EMPLOYEES.EMPLOYEE_ID%TYPE,
    P_ATTENDANCE_DT DATE)
  RETURN NUMBER
AS
  V_SHIFT_ID HRIS_SHIFTS.SHIFT_ID%TYPE;
  V_IN_TIME           TIMESTAMP;
  V_SHIFT_IN_TIME     TIMESTAMP;
  V_IN_TIME_DIFF      NUMBER;
  V_IN_TIME_DIFF_MIN  NUMBER;
  V_MIN_IN_TIME       NUMBER;
  V_OUT_TIME          TIMESTAMP;
  V_SHIFT_OUT_TIME    TIMESTAMP;
  V_OUT_TIME_DIFF     NUMBER;
  V_OUT_TIME_DIFF_MIN NUMBER;
  V_MIN_IN_OUT_TIME   NUMBER;
  V_IN_TIME_MIN  TIMESTAMP;
  V_OUT_TIME_MAX  TIMESTAMP;
  V_IN_TIME_IN DATE :=NULL;
  V_OUT_TIME_OUT DATE :=NULL;
  V_IN_TIME_CHECK NUMBER;
  V_YESTERDAY_OUT_TIME TIMESTAMP;
  V_BETN_TWOPM CHAR(5 BYTE);
  V_BETN_TWOPM_OUT TIMESTAMP;
BEGIN

begin
select out_time
INTO V_YESTERDAY_OUT_TIME
from Hris_Attendance_Detail
where Attendance_Dt=trunc(P_ATTENDANCE_DT)-1 and employee_id=P_EMPLOYEE_ID;
EXCEPTION
WHEN no_data_found THEN
NULL;
END;

if(V_YESTERDAY_OUT_TIME is null)
then
V_YESTERDAY_OUT_TIME:=trunc(P_ATTENDANCE_DT)-1;
end if;


select 
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||'04:00 PM','DD-MON-YYYY HH:MI AM'),
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT+1,'DD-MON-YYYY')||'12:30 PM','DD-MON-YYYY HH:MI AM')
  INTO
V_IN_TIME_MIN,
V_OUT_TIME_MAX
  FROM DUAL;

  SELECT MIN(ATTENDANCE_TIME) AS IN_TIME,
    MAX(ATTENDANCE_TIME)      AS OUT_TIME
  INTO V_IN_TIME,
    V_OUT_TIME
  FROM HRIS_ATTENDANCE
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  AND ATTENDANCE_DT = P_ATTENDANCE_DT;



  -- TO CHECK IN OUT ACCOURDING TO IN DEVICE AND OUT DEVICE START

  select 
  MIN(ATTENDANCE_TIME)
  INTO V_IN_TIME_IN
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='IN'
  AND ATTENDANCE_DT = P_ATTENDANCE_DT
  and A.ATTENDANCE_TIME>V_YESTERDAY_OUT_TIME;

  IF V_IN_TIME_MIN IS NOT NULL THEN
   V_IN_TIME:=V_IN_TIME_IN;

  select 
EXTRACT (HOUR FROM (V_IN_TIME_IN-V_IN_TIME_MIN))*60+
EXTRACT (MINUTE FROM (V_IN_TIME_IN-V_IN_TIME_MIN)) 
INTO V_IN_TIME_CHECK
  FROM DUAL;

    if V_IN_TIME_CHECK > 0
  then
select 
  MAX(ATTENDANCE_TIME)
  INTO V_OUT_TIME_OUT
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='OUT'
  AND A.ATTENDANCE_TIME > V_IN_TIME_MIN
  and A.ATTENDANCE_TIME < V_OUT_TIME_MAX;

  else
  select 
  MAX(ATTENDANCE_TIME)
  INTO V_OUT_TIME_OUT
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='OUT'
  AND A.ATTENDANCE_TIME > V_IN_TIME_IN
  AND A.ATTENDANCE_TIME < trunc(P_ATTENDANCE_DT+1);


  end if;
  
  
  -- check to overide out time if punch time is   between 1:30 to 2:30 start


select 
case when 
V_IN_TIME_IN
between 
TO_DATE(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||'01:45 PM','DD-MON-YYYY HH:MI AM')
and
TO_DATE(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||'02:30 PM','DD-MON-YYYY HH:MI AM')
then
'TRUE'
else
'FALSE'
end  into V_BETN_TWOPM
from dual;


IF(V_BETN_TWOPM = 'TRUE')
THEN


  select 
  MAX(ATTENDANCE_TIME)
  INTO V_BETN_TWOPM_OUT
  FROM HRIS_ATTENDANCE a
left join HRIS_ATTD_DEVICE_MASTER adm on (adm.device_ip=a.ip_address) 
  WHERE EMPLOYEE_ID =P_EMPLOYEE_ID
  and adm.PURPOSE='OUT'
  AND A.ATTENDANCE_TIME > V_IN_TIME_IN
  AND (A.ATTENDANCE_TIME BETWEEN
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT+1,'DD-MON-YYYY')||' 5:30 AM','DD-MON-YYYY HH:MI AM') 
  AND
  TO_DATE(TO_CHAR(P_ATTENDANCE_DT+1,'DD-MON-YYYY')||' 6:30 AM','DD-MON-YYYY HH:MI AM'));
  
  IF(V_BETN_TWOPM_OUT IS NOT NULL )
  THEN
  V_OUT_TIME_OUT:=V_BETN_TWOPM_OUT;
  END IF;


END IF;



-- check to overide out time if punch time is   between 1:30 to 2:30 end
  

  if V_OUT_TIME_OUT is not null
  then
   V_OUT_TIME:=V_OUT_TIME_OUT;

  end if;

  --  V_IN_TIME:=V_IN_TIME_IN;
  --  V_OUT_TIME:=V_OUT_TIME_OUT;



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
  V_SHIFT_IN_TIME := TO_timestamp(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||TO_CHAR(shift.START_TIME,'HH:MI AM'),'DD-MON-YYYY HH:MI AM');
    V_IN_TIME_DIFF     :=ABS(cast(V_SHIFT_IN_TIME as date)-cast(V_IN_TIME as date));
    V_IN_TIME_DIFF_MIN :=V_IN_TIME_DIFF*24*60;
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

    if(V_IN_TIME_CHECK > 0)
    then
     V_SHIFT_OUT_TIME                       := TO_timestamp(TO_CHAR(P_ATTENDANCE_DT+1,'DD-MON-YYYY')||TO_CHAR(shift.END_TIME,'HH:MI AM'),'DD-MON-YYYY HH:MI AM');
    else
     V_SHIFT_OUT_TIME                       := TO_timestamp(TO_CHAR(P_ATTENDANCE_DT,'DD-MON-YYYY')||TO_CHAR(shift.END_TIME,'HH:MI AM'),'DD-MON-YYYY HH:MI AM');
    end if;


    V_OUT_TIME_DIFF     :=ABS(cast(V_SHIFT_OUT_TIME as date)-cast(V_OUT_TIME as date));
    V_OUT_TIME_DIFF_MIN                    := V_OUT_TIME_DIFF*24*60;
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