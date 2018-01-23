<?php

namespace Application\Controller;

use Application\Helper\Helper;
use ReflectionClass;
use Zend\Authentication\Storage\StorageInterface;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Form\Annotation\AnnotationBuilder;
use Zend\Form\Element\Select;
use Zend\Http\Request;
use Zend\Mvc\Controller\AbstractActionController;

class HrisController extends AbstractActionController {

    protected $adapter;
    protected $employeeId;
    protected $storageData;
    protected $acl;
    protected $form;
    protected $repository;
    protected $status = [
        '-1' => 'All Status',
        'RQ' => 'Pending',
        'RC' => 'Recommended',
        'AP' => 'Approved',
        'R' => 'Rejected',
        'C' => 'Cancelled',
    ];

    function __construct(AdapterInterface $adapter, StorageInterface $storage) {
        $this->adapter = $adapter;
        $this->storageData = $storage->read();
        $this->acl = $this->storageData['acl'];
        $this->employeeId = $this->storageData['employee_id'];
    }

    protected function stickFlashMessagesTo($return) {
        $flashMessenger = $this->flashMessenger();
        if ($flashMessenger->hasMessages()) {
            $return['messages'] = $flashMessenger->getMessages();
        }
        return $return;
    }

    protected function initializeForm(string $formClass) {
        $builder = new AnnotationBuilder();
        $refl = new ReflectionClass($formClass);
        $formObject = $refl->newInstanceArgs();
        $this->form = $builder->createForm($formObject);
    }

    protected function initializeRepository(string $repositoryClass) {
        $refl = new ReflectionClass($repositoryClass);
        $this->repository = $refl->newInstanceArgs([$this->adapter]);
    }

    protected function getStatusSelectElement(array $config) {
        return $this->getSelectElement($config, $this->status);
    }

    protected function getSelectElement($config, $options) {
        $selectFE = new Select();
        $selectFE->setName($config['name']);
        $selectFE->setValueOptions($options);
        $selectFE->setAttributes(["id" => $config['id'], "class" => $config['class']]);
        $selectFE->setLabel($config['label']);
        return $selectFE;
    }

    protected function listValueToKV($list, $key, $value) {
        $output = [];
        foreach ($list as $item) {
            $output[$item[$key]] = $item[$value];
        }
        return $output;
    }

    protected function getACLFilter() {
        $filter = [];
        switch ($this->acl['CONTROL']) {
            case 'C':
                $filter['companyId'] = $this->storageData['employee_detail']['COMPANY_ID'];
                break;
            case 'B':
                $filter['branchId'] = $this->storageData['employee_detail']['BRANCH_ID'];
                break;
            case 'U':
                $filter['employeeId'] = $this->storageData['employee_detail']['EMPLOYEE_ID'];
                break;
        }
        return $filter;
    }

    protected function uploadFile(Request $request) {
        $files = $request->getFiles()->toArray();
        if (sizeof($files) > 0) {
            $ext = pathinfo($files['file']['name'], PATHINFO_EXTENSION);
            $fileName = pathinfo($files['file']['name'], PATHINFO_FILENAME);
            $unique = Helper::generateUniqueName();
            $newFileName = $unique . "." . $ext;
            $success = move_uploaded_file($files['file']['tmp_name'], Helper::UPLOAD_DIR . "/" . $newFileName);
        }
    }

}
