BEGIN

FOR M_LIST IN (
select md.*,e.employee_id,e.full_name,ms.MTH_ID,MC.MONTH_ID from HR_MONTHLY_VALUE_DETAIL@EMPNEW md
join hris_employees e on (to_number(md.employee_code)=e.employee_id)
join HRIS_MONTHLY_VALUE_SETUP ms on (ms.MTH_CODE=md.mth_code)
JOIN (select * from HRIS_MONTH_CODE where FISCAL_YEAR_ID=2) MC ON (MC.FISCAL_YEAR_MONTH_NO=MD.PERIOD_DT_CODE)
)
LOOP

INSERT INTO HRIS_MONTHLY_VALUE_DETAIL VALUES
(
M_LIST.MTH_ID,
M_LIST.EMPLOYEE_ID,
M_LIST.MTH_VALUE,
TRUNC(SYSDATE),
NULL,
2,
M_LIST.MONTH_ID
);

END LOOP;


END;