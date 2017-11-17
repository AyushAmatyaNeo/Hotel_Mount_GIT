CREATE OR REPLACE TRIGGER HRIS_AFTER_LEAVE_ADDITION AFTER
  INSERT OR
  DELETE ON HRIS_EMPLOYEE_LEAVE_ADDITION FOR EACH ROW BEGIN IF INSERTING THEN
  UPDATE HRIS_EMPLOYEE_LEAVE_ASSIGN
  SET BALANCE       = BALANCE+:new.NO_OF_DAYS
  WHERE EMPLOYEE_ID =:new.EMPLOYEE_ID
  AND LEAVE_ID      = :new.LEAVE_ID;
END IF;
IF DELETING THEN
  UPDATE HRIS_EMPLOYEE_LEAVE_ASSIGN
  SET BALANCE       = BALANCE-:new.NO_OF_DAYS
  WHERE EMPLOYEE_ID =:new.EMPLOYEE_ID
  AND LEAVE_ID      = :new.LEAVE_ID;
END IF;
END;
/