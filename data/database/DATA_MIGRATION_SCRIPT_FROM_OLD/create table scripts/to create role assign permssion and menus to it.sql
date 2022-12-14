
-- to insert into roles
Insert into HRIS_ROLES (ROLE_ID,ROLE_NAME,REMARKS,STATUS,CREATED_DT,MODIFIED_DT,CREATED_BY,MODIFIED_BY,CONTROL,ALLOW_ADD,ALLOW_UPDATE,ALLOW_DELETE) values (1,'Admin','System Administrator','E',to_date('17-OCT-16','DD-MON-RR'),to_date('23-OCT-16','DD-MON-RR'),null,null,'F','Y','Y','Y');


-- to insert into role permsiions
insert into HRIS_ROLE_PERMISSIONS (ROLE_ID,MENU_ID,STATUS,CREATED_DT) (SELECT 1,MENU_ID,'E',TRUNC(SYSDATE) FROM 
	HRIS_MENUS WHERE PARENT_MENU IS NULL AND LOWER(MENU_NAME) LIKE lower('DASHBOARD%'));

insert into HRIS_ROLE_PERMISSIONS (ROLE_ID,MENU_ID,STATUS,CREATED_DT) (SELECT 1,MENU_ID,'E',TRUNC(SYSDATE) FROM HRIS_MENUS WHERE PARENT_MENU IS NULL AND LOWER(MENU_NAME) LIKE lower('system%'));


insert into HRIS_ROLE_PERMISSIONS (ROLE_ID,MENU_ID,STATUS,CREATED_DT) (SELECT 1,MENU_ID,'E',TRUNC(SYSDATE) FROM HRIS_MENUS WHERE LOWER(MENU_NAME) LIKE lower('menu%'));




-- to create a user admin
insert into hris_users (USER_ID,EMPLOYEE_ID,USER_NAME,PASSWORD,ROLE_ID,STATUS,CREATED_DT,IS_LOCKED)
VALUES (1,1,'admin',FN_ENCRYPT_PASSWORD('admin@123'),1,'E',TRUNC(SYSDATE),'N');

