<?php

namespace Application\Controller;

use Application\Helper\Helper;
use Application\Model\HrisAuthStorage;
use Application\Model\User;
use Application\Model\UserLog;
use Application\Repository\MonthRepository;
use Application\Repository\UserLogRepository;
use AttendanceManagement\Model\Attendance;
use AttendanceManagement\Repository\AttendanceDetailRepository;
use AttendanceManagement\Repository\AttendanceRepository;
use DateTime;
use Exception;
use Zend\Authentication\AuthenticationService;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\Sql\Expression;
use Zend\EventManager\EventManagerInterface;
use Zend\Form\Annotation\AnnotationBuilder;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class AuthController extends AbstractActionController {

    protected $form;
    protected $storage;
    protected $authservice;
    protected $adapter;

    public function __construct(AuthenticationService $authService, AdapterInterface $adapter) {
        $this->authservice = $authService;
        $this->storage = $authService->getStorage();
        $this->adapter = $adapter;
    }

    public function setEventManager(EventManagerInterface $events) {
        parent::setEventManager($events);
        $controller = $this;
        $events->attach('dispatch', function ($e) use ($controller) {
            $controller->layout('layout/login');
        }, 100);
    }

    public function getAuthService() {
        if (!$this->authservice) {
            $this->authservice = $this->getServiceLocator()
                    ->get('AuthService');
        }
        return $this->authservice;
    }

    public function getSessionStorage() {
        if (!$this->storage) {
            $this->storage = $this->getServiceLocator()
                    ->get(HrisAuthStorage::class);
        }
        return $this->storage;
    }

    public function getForm() {
        if (!$this->form) {
            $user = new User();
            $builder = new AnnotationBuilder();
            $this->form = $builder->createForm($user);
        }

        return $this->form;
    }

    public function loginAction() {
        //to make register attendance by default checked on login page:: condition start
        $type = (($this->params()->fromRoute('type'))!==null)?($this->params()->fromRoute('type')):null;
        if($type!==null){
            $this->getSessionStorage()->forgetMe();
            $this->getAuthService()->clearIdentity();
        }
        //end
        
        if ($this->getAuthService()->hasIdentity()) {
            return $this->redirect()->toRoute('dashboard');
        }
        $form = $this->getForm();
        return new ViewModel([
            'form' => $form,
            'type'=> $type,
            'messages' => $this->flashmessenger()->getMessages()
        ]);
    }

    public function authenticateAction() {
        $form = $this->getForm();
        $redirect = 'login';
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            if ($form->isValid()) {
                //check authentication...
                $this->getAuthService()->getAdapter()
                        ->setIdentity($request->getPost('username'))
//                        ->setCredential(md5($request->getPost('password')))
                        ->setCredential($request->getPost('password'));
                $result = $this->getAuthService()->authenticate();
                foreach ($result->getMessages() as $message) {
                    //save message temporary into flashmessenger
                    $this->flashmessenger()->addMessage($message);
                }
                if ($result->isValid()) {
                    //after authentication success get the user specific details
                    $resultRow = $this->getAuthService()->getAdapter()->getResultRowObject();
                    
                    $attendanceRepo = new AttendanceRepository($this->adapter);
                    $attendanceDetailRepo = new AttendanceDetailRepository($this->adapter);

                    $employeeId = $resultRow->EMPLOYEE_ID;

                    $todayAttendance = $attendanceDetailRepo->fetchByEmpIdAttendanceDT($employeeId, 'TRUNC(SYSDATE)');
                    $inTime = $todayAttendance['IN_TIME'];
                    
                    
                    $attendanceType=($inTime)?"OUT":"IN";
                    $redirect = 'dashboard';
                    //check if it has rememberMe :
                    if (1 == $request->getPost('rememberme')) {
                        $this->getSessionStorage()
                                ->setRememberMe(1);
                        //set storage again
                        $this->getAuthService()->setStorage($this->getSessionStorage());
                    }
                    if (1 == $request->getPost('checkIn')) {
                        

                        $shiftDetails = $attendanceDetailRepo->fetchEmployeeShfitDetails($employeeId);
                        if (!$shiftDetails) {
                            $shiftDetails = $attendanceDetailRepo->fetchEmployeeDefaultShift($employeeId);
                        }

                        $currentTimeDatabase = $shiftDetails['CURRENT_TIME'];
                        $checkInTimeDatabase = $shiftDetails['CHECKIN_TIME'];
                        $checkOutTimeDatabase = $shiftDetails['CHECKOUT_TIME'];

                        $currentDateTime = new DateTime($currentTimeDatabase);
                        $checkInDateTime = new DateTime($checkInTimeDatabase);
                        $checkOutDateTime = new DateTime($checkOutTimeDatabase);
                        
                        if ($inTime) {
                            $diff = date_diff($checkOutDateTime, $currentDateTime);
                        } else {
                            $diff = date_diff($currentDateTime, $checkInDateTime);
                        }
                            $diffNegative = $diff->format("%r");
                        if ($diffNegative == '-') {
                            return $this->redirect()->toRoute('checkin', ['action' => 'index', 'userId' => $resultRow->USER_ID, 'type' => $attendanceType]);
                        }
                        $result = $attendanceDetailRepo->getDtlWidEmpIdDate($employeeId, date(Helper::PHP_DATE_FORMAT));
                        if (!isset($result)) {
                            throw new Exception("Today's Attendance of employee with employeeId :$employeeId is not found.");
                        }
                        $attendanceModel = new Attendance();
                        $attendanceModel->employeeId = $employeeId;
                        $attendanceModel->attendanceDt = new Expression("TRUNC(SYSDATE)");
                        $attendanceModel->attendanceTime = new Expression("SYSDATE");
                        $attendanceModel->ipAddress = $request->getServer('REMOTE_ADDR');
                        $attendanceModel->attendanceFrom = 'WEB';
                        $attendanceRepo->add($attendanceModel);
                    }
//                    $employeeRepo = new EmployeeRepository($this->adapter);
//                    $employeeDetail = $employeeRepo->getById($resultRow->EMPLOYEE_ID);
                    $monthRepo = new MonthRepository($this->adapter);
                    $fiscalYear = $monthRepo->getCurrentFiscalYear();

                    $this->getAuthService()->getStorage()->write([
                        "user_name" => $request->getPost('username'),
                        "user_id" => $resultRow->USER_ID,
                        "employee_id" => $resultRow->EMPLOYEE_ID,
                        "role_id" => $resultRow->ROLE_ID,
                        'register_attendance'=>$attendanceType,
//                        "role_id" => 8,
//                        "employee_detail" => $employeeDetail,
                        "fiscal_year" => $fiscalYear
                    ]);


                    // to add user log details in HRIS_USER_LOG
                    $this->setUserLog($this->adapter, $request->getServer('REMOTE_ADDR'), $resultRow->USER_ID);
                }
            }
        }
        return $this->redirect()->toRoute($redirect);
    }

    public function checkinAuthAction() {
        $form = $this->getForm();
        $redirect = 'checkin';
        $request = $this->getRequest();
        if ($request->isPost()) {
            $form->setData($request->getPost());
            //check authentication...
            $this->getAuthService()->getAdapter()
                    ->setIdentity($request->getPost('username'))
//                        ->setCredential(md5($request->getPost('password')))
                    ->setCredential($request->getPost('password'));
            $result = $this->getAuthService()->authenticate();
            foreach ($result->getMessages() as $message) {
                //save message temporary into flashmessenger
                $this->flashmessenger()->addMessage($message);
            }
            if ($result->isValid()) {
                //after authentication success get the user specific details
                $resultRow = $this->getAuthService()->getAdapter()->getResultRowObject();
                $redirect = 'dashboard';
                $attendanceRepo = new AttendanceRepository($this->adapter);
                $attendanceDetailRepo = new AttendanceDetailRepository($this->adapter);

                $employeeId = $resultRow->EMPLOYEE_ID;

                $attendanceModel = new Attendance();
                $attendanceModel->employeeId = $employeeId;
                $attendanceModel->attendanceDt = new Expression("TRUNC(SYSDATE)");
                $attendanceModel->attendanceTime = new Expression("SYSDATE");
                $attendanceModel->ipAddress = $request->getServer('REMOTE_ADDR');
                $attendanceModel->attendanceFrom = 'WEB';
                $attendanceModel->remarks = $this->request->getPost('checkInRemarks');
                $attendanceRepo->add($attendanceModel);

//                    $employeeRepo = new EmployeeRepository($this->adapter);
//                    $employeeDetail = $employeeRepo->getById($resultRow->EMPLOYEE_ID);

                $monthRepo = new MonthRepository($this->adapter);
                $fiscalYear = $monthRepo->getCurrentFiscalYear();

                $this->getAuthService()->getStorage()->write([
                    "user_name" => $request->getPost('username'),
                    "user_id" => $resultRow->USER_ID,
                    "employee_id" => $resultRow->EMPLOYEE_ID,
                    "role_id" => $resultRow->ROLE_ID,
                    'register_attendance'=>'OUT',
//                        "role_id" => 8,
//                        "employee_detail" => $employeeDetail,
                    "fiscal_year" => $fiscalYear
                ]);

                // to add user log details in HRIS_USER_LOG
                $this->setUserLog($this->adapter, $request->getServer('REMOTE_ADDR'), $resultRow->USER_ID);
            }
        }
        return $this->redirect()->toRoute($redirect);
    }

    private function setUserLog(AdapterInterface $adapter, $clientIp, $userId) {
        $userLogRepo = new UserLogRepository($adapter);

        $userLog = new UserLog();
        $userLog->loginIp = $clientIp;
        $userLog->userId = $userId;

        $userLogRepo->add($userLog);
    }

    public function logoutAction() {
        $this->getSessionStorage()->forgetMe();
        $this->getAuthService()->clearIdentity();

        $this->flashmessenger()->addMessage("You've been logged out");
        return $this->redirect()->toRoute('login');
    }

    public function checkoutAction() {
        $employeeId = $this->storage->read()['employee_id'];

        $attendanceDetailRepo = new AttendanceDetailRepository($this->adapter);
        $shiftDetails = $attendanceDetailRepo->fetchEmployeeShfitDetails($employeeId);
        if (!$shiftDetails) {
            $shiftDetails = $attendanceDetailRepo->fetchEmployeeDefaultShift();
        }
        $todayAttendance = $attendanceDetailRepo->fetchByEmpIdAttendanceDT($employeeId, 'TRUNC(SYSDATE)');
        $inTime = $todayAttendance['IN_TIME'];
        

        $currentTimeDatabase = $shiftDetails['CURRENT_TIME'];
        $checkInTimeDatabase = $shiftDetails['CHECKIN_TIME'];
        $checkOutTimeDatabase = $shiftDetails['CHECKOUT_TIME'];

        $currentDateTime = new DateTime($currentTimeDatabase);
        $checkInDateTime = new DateTime($checkInTimeDatabase);
        $checkOutDateTime = new DateTime($checkOutTimeDatabase);

        $attendanceType = 'IN';
        if ($inTime) {
            $attendanceType = 'OUT';
            $diff = date_diff($checkOutDateTime, $currentDateTime);
        } else {
            $diff = date_diff($currentDateTime, $checkInDateTime);
        }
        $diffNegative = $diff->format("%r");

        $request = $this->getRequest();
        $remarks = '';

        if ($diffNegative == '-') {
            if (!$request->isPost()) {
                return Helper::addFlashMessagesToArray($this, [
                    'type'=>$attendanceType
                ]);
            } else {
                $postData = $request->getPost();
                $remarks = $postData['remarks'];
            }
        }

        $attendanceRepo = new AttendanceRepository($this->adapter);
        $attendanceModel = new Attendance();

        $attendanceModel->employeeId = $this->getAuthService()->getStorage()->read()['employee_id'];
        $attendanceModel->attendanceDt = new Expression("TRUNC(SYSDATE)");
        $attendanceModel->attendanceTime = new Expression("SYSDATE");
        $attendanceModel->ipAddress = $request->getServer('REMOTE_ADDR');
        $attendanceModel->attendanceFrom = 'WEB';
        $attendanceModel->remarks = $remarks;
        $attendanceRepo->add($attendanceModel);

        $this->getSessionStorage()->forgetMe();
        $this->getAuthService()->clearIdentity();
        $this->flashmessenger()->addMessage("You've been logged out");
        return $this->redirect()->toRoute('login');
    }

}
