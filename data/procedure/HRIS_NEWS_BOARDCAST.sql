create or replace PROCEDURE HRIS_NEWS_BROADCAST(
    P_NEWS_DATE HRIS_NEWS.NEWS_DATE%TYPE,
    P_NEWS_TYPE HRIS_NEWS.NEWS_TYPE%TYPE,
    P_SERVICE_TYPE_ID NUMBER,
    P_EMPLOYEE_ID     NUMBER,
    P_DESC HRIS_NEWS.NEWS_EDESC%TYPE)
AS
  P_NEWS_ID HRIS_NEWS.NEWS_ID%TYPE;
  P_NEWS_TITLE HRIS_NEWS.NEWS_TITLE%TYPE;
  P_NEWS_EDESC HRIS_NEWS.NEWS_EDESC%TYPE;
  P_STATUS HRIS_NEWS.STATUS%TYPE:='E';
  P_EMPLOYEE_NAME VARCHAR2(255 BYTE);
BEGIN
  SELECT NVL(MAX (NEWS_ID),0) + 1 INTO P_NEWS_ID FROM HRIS_NEWS;
  SELECT SERVICE_EVENT_TYPE_NAME
  INTO P_NEWS_TITLE
  FROM HRIS_SERVICE_EVENT_TYPES
  WHERE SERVICE_EVENT_TYPE_ID=P_SERVICE_TYPE_ID;
  SELECT (FIRST_NAME
    ||' '
    ||MIDDLE_NAME
    ||' '
    ||LAST_NAME)
  INTO P_EMPLOYEE_NAME
  FROM HRIS_EMPLOYEES
  WHERE EMPLOYEE_ID=P_EMPLOYEE_ID;
  CASE P_SERVICE_TYPE_ID
  WHEN 1 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Been Transfered',P_DESC));
  WHEN 2 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Been Appointed',P_DESC));
  WHEN 3 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Been Pramoted',P_DESC));
  WHEN 4 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Been Demoted',P_DESC));
  WHEN 5 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Resigned',P_DESC));
  WHEN 8 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Retired',P_DESC));
  WHEN 14 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Has Been Suspended',P_DESC));
  WHEN 15 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' is Temporary Assigned',P_DESC));
  WHEN 16 THEN
    P_NEWS_EDESC:=CONCAT(P_EMPLOYEE_NAME,CONCAT(' Awarded',P_DESC));
  ELSE
    P_NEWS_EDESC:=P_NEWS_TITLE;
  END CASE;
  INSERT
  INTO HRIS_NEWS
    (
      NEWS_ID,
      NEWS_DATE,
      NEWS_TYPE,
      NEWS_TITLE,
      NEWS_EDESC,

      CREATED_BY,
      STATUS
    )
    VALUES
    (
      P_NEWS_ID,
      P_NEWS_DATE,
      P_NEWS_TYPE,
      P_NEWS_TITLE,
      P_NEWS_EDESC,

      P_EMPLOYEE_ID,
      P_STATUS
    );
END;