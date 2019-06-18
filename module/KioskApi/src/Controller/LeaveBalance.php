<?php

namespace KioskApi\Controller;

use Exception;
use KioskApi\Repository\LeaveBalanceRepository;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Http\Request;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class LeaveBalance extends AbstractActionController {

    private $adapter;
    private $employeeId;

    public function __construct(AdapterInterface $adapter) {
        $this->adapter = $adapter;
    }

    public function statusAction() {

        try {
            $request = $this->getRequest();

            $this->employeeId = $request->getHeader('EmployeeId')->getFieldValue();
//            $this->employeeId = 728;
            $requestType = $request->getMethod();

            $responseData = [];

            switch ($requestType) {
                case Request::METHOD_GET:
                    $responseData = $this->getStatus($this->employeeId);
                    if ($responseData == NULL) {
                        return new JsonModel(['success' => false, 'data' => $responseData, 'message' => 'No record found']);
                    }
                    break;
                default :
                    throw new Exception('The request is unknown');
            }
            return new JsonModel(['success' => true, 'data' => $responseData, 'message' => $requestType]);
        } catch (Exception $e) {
            return new JsonModel(['success' => false, 'data' => $responseData, 'message' => $e->getMessage()]);
        }
    }

    public function getStatus($employeeId) {
        $statusRepo = new LeaveBalanceRepository($this->adapter);

        return $statusRepo->fetchLeaveDetails($employeeId);
    }

}
