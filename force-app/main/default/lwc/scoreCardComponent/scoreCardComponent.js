import { LightningElement, wire, track, api } from 'lwc';
//import axios from "@salesforce/resourceUrl/axios";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import scoreCardData from '@salesforce/apex/ScoreCardController.getScoreCardData';
import getEployeeRcrdDetails from '@salesforce/apex/ScoreCardController.getEployeeRcrdDetails';
import downloadPDF from '@salesforce/apex/ScoreCardController.downloadPDF';
import uploadFile from '@salesforce/apex/ScoreCardController.uploadFile';
import reservationScan from '@salesforce/apex/ScoreCardController.reservationScan';
import mobileCapture from '@salesforce/apex/ScoreCardController.mobileCapture';
//import uploadDocuSign from '@salesforce/apex/ScoreCardController.uploadDocuSign';

export default class ScoreCardComponent extends LightningElement {

    @track showMsg = false;
    @track showScan = false;
    @track showMobileCapture = false;
    @track popHeaderEmploy = true;
//errorMsg;
    @track hideButton = false;
    @track reservationId;
    @track bcsId;
    @track showPopInformation = true;


    @track pdf;
    @track previewUrl;
    base64;
    @api recordId;
    showPopupSpinner = false;
    showChildBlock = false;
    showSpinner = true;
    firstTimeEnter = true;
    che = false;
    @track showPopup = false;
    employName;
    docSignPopup = false;
    value;
    documentFile;
    recordDetails;
    @track record = {};
    uiArray = [];
    @track tableData;
    tempQuerySelectorData;
    @track fileData;

    connectedCallback(){
        console.log('record id => '+this.recordId);
    }
    renderedCallback(){
        console.log('record id2 => '+this.recordId);
    }

    showAddContent() {
        console.log('method called');
        this.showPopup = true;
        console.log('this.showPopup', this.showPopup);
    }

    // callVfPage() {
    //     console.log('#### => ', this.fileData.base64);
    //     console.log('enter a main blaock######');
    //     let fff = '/apex/viewPdfFromLwc?id=' + this.fileData.base64;
    //     window.open(fff);
    //     /* this[NavigationMixin.GenerateUrl]({
    //          type: 'standard__navItemPage',
    //          attributes: {
    //              apiName: "customTabName",
    //          },
    //          // query string parameters
    //          state: {
    //              c__showPanel: 'true' // Value must be a string
    //          }
    //      }).then(url => {
    //          window.open(url)
    //      });*/
    // }

    async submitData() {
        if (this.fileData) {
            this.showPopupSpinner = true;
            this.getAllInput();
            let file = this.fileData.base64;
            let name = this.fileData.filename;
            //const {base64, filename} = this.fileData;
            let employeData = JSON.stringify(this.record);

            await uploadFile({ recordId: this.recordId, base64: file, filename: name, employeRecord: JSON.stringify(this.record), addContent: true }).then(data => {
                this.showPopupSpinner = false;
                this.showPopup = false;
                console.log('reslut => ', data)
                this.toast('Successfully', 'Document uploaded', 'success');
                window.location.reload();

            }).catch(error => {
                this.showPopupSpinner = false;
                this.showPopup = false;
                this.toast('Error', 'Internal server error', 'error');
            });
        }
        else {
            this.toast('Error', 'Uploading File is required', 'error');
        }

    }

    async submitDocuSign() {
        console.log('here');
        // if (this.fileData) {
        // this.showPopupSpinner = true;
        this.getDocuSignInput();
        // let file = this.fileData.base64;
        // let name = this.fileData.filename;
        let employeDataDocSign = JSON.stringify(this.record);
        console.log('employeDataDocSign: ', employeDataDocSign);

        await uploadFile({ recordId: this.recordId, base64: null, filename: null, employeRecord: JSON.stringify(this.record), addContent: false }).then(data => {
            //this.showPopupSpinner = false;
            this.docSignPopup = false;
            console.log('reslut => ', data)
            this.toast('Successfully', 'DocuSign Uploaded', 'success');
            //window.location.reload();
        }).catch(error => {
            //this.showPopupSpinner = false;
            this.docSignPopup = false;
            this.toast('Error', 'Internal server error', 'error');
        });
        // }
        // else {
        //     this.toast('Error', 'Uploading File is required', 'error');
        // }
    }

    getDocuSignInput() {
        this.record.employeeLastName = this.template.querySelector('[data-name="EmployeeLastName"]').value;
        this.record.employeeFirstName = this.template.querySelector('[data-name="EmployeeFirstName"]').value;
        this.record.employeeEmail = this.template.querySelector('[data-name="EmployeeEmail"]').value;
        this.record.employeeID = this.template.querySelector('[data-name="EmployeeID"]').value;

    }

    getAllInput() {
        this.record.employeeLastName = this.template.querySelector('[data-name="EmployeeLastName"]').value;
        this.record.employeeFirstName = this.template.querySelector('[data-name="EmployeeFirstName"]').value;
        this.record.employeeEmail = this.template.querySelector('[data-name="EmployeeEmail"]').value;
        // this.record.supervisorLastName = this.template.querySelector('[data-name="SupervisorLastName"]').value;
        // this.record.supervisorFirstName = this.template.querySelector('[data-name="SupervisorFirstName"]').value;
        // this.record.supervisorEmail = this.template.querySelector('[data-name="SupervisorEmail"]').value;
        this.record.progress = this.template.querySelector('[data-name="progress"]').value;
        console.log('this.record.progress $$$$$$$$$$$$$$4', this.record.progress);
        this.record.dateOfHire = this.template.querySelector('[data-name="DateOfHire"]').value;
        this.record.department = this.template.querySelector('[data-name="Department"]').value;
        this.record.dob = this.template.querySelector('[data-name="DOB"]').value;
        if (this.record.dob == '') {
            console.log('enter blank ');
            this.record.dob = null;
        }
        if (this.record.dateOfHire == '') {
            console.log('enter blank ');
            this.record.dateOfHire = null;
        }
        console.log('this.record.dob', this.record.dob);
        console.log('record => ', JSON.parse(JSON.stringify(this.record)));
    }

    get options() {
        return [
            { label: 'Enterprise Security Policy Ack Form', value: 'Enterprise Security Policy Ack Form' },
            { label: 'Drivers License', value: 'Drivers License' },
            { label: 'Handbook Acknowledgement', value: 'Handbook Acknowledgement' },
            { label: 'New Hire Agency Policies', value: 'New Hire Agency Policies' },
            { label: 'New Hire Opening Page', value: 'New Hire Opening Page' },
            { label: 'Personal Data Sheet', value: 'Personal Data Sheet' },
        ];
    }

    handleChange(event) {
        // console.log('selected value ->', event.target.value);

    }

    @wire(scoreCardData, { recordId: '$recordId' })
    cardData({ data, error }) {
        console.log('enter first data');
        if (data) {
            console.log('enter a data');
           // console.log('data::::::: ', data);
            // if(data[0].showError){
            //     console.log('data.showError : ',data[0].showError);
            //     this.showSpinner = false;
            //     this.errorMsg =  'Your username and password of BCSiconnect are not available in database';
            // }else{
           //let d = JSON.parse(JSON.stringify(data));
           // console.log('data => ',);
            if(data[0].rightData == true){
                this.tableData = data;
                this.showMsg = false;
            }else{
                this.showMsg = true;
            }
            this.showSpinner = false;
           
           // console.log('data@@@', this.tableData);

        }
        else if (error) {
            console.log('enter a error');
            this.showSpinner = false;
            console.log('error#############', error);
        }
    }

    // redirectPdf() {
    //     console.log('above', `data:application/pdf;base64,${this.fileData.base64}`);
    //     window.open(`data:application/pdf;base64,${this.fileData.base64}`);
    //     console.log('below');
    // }


    openfileUpload(event) {
        const file = event.target.files[0];
        console.log('enter a blog');
        console.log('file  => ', file);

        var reader = new FileReader()
        reader.onload = (e) => {
            console.log(e.target.result);
            this.base64 = e.target.result.split(',')[1];
            this.fileData = {
                'filename': file.name,
                'base64': this.base64
            }
            console.log('base64', this.base64);
            // console.log(e.target.result);
        }

        reader.onerror = (e) => {
            console.log(e);
        }

        //console.log('URL.createObjectURL(file)', URL.createObjectURL(file));
        this.previewUrl = URL.createObjectURL(file);
        //console.log('this.previewUrl', this.previewUrl);
        reader.readAsDataURL(file);
        //console.log('this.fileData.base64', this.fileData.base64);
        // this.pdf = `data:application/pdf;base64,${base64}`;\
        // this.pdf = `data:application/pdf;base64,${this.base64}`;
        // console.log('this.pdf', this.pdf);
    }


    pdfSrc() {

    }

    handleDocuSign() {

        this.docSignPopup = true;
        this.getEmpDetails();
    }

    showFormPopup(event) {
        this.showPopInformation = true;
        this.hideButton = false;
        this.showScan = false;
        this.showMobileCapture = false;
        this.popHeaderEmploy = true;
        this.value = event.currentTarget.dataset.parent;
        this.showPopup = true;
        this.getEmpDetails();

    }

    handleMobileCapture() {
        console.log('Mobile Capture');
        this.getAllInput();
        console.log('this.record.progress $$$$$$$$$$$$$$4', this.record.progress);
        mobileCapture({ recordId: this.recordId, employeRecord: JSON.stringify(this.record) }).then(data => {
            if (data) {
                this.showScan = false;
                this.showMobileCapture = true;
                console.log('data', data);
                this.reservationId = data.reservationId;
                this.bcsId = data.bcsId;
                this.showPopInformation = false;
                this.hideButton = true;
                this.popHeaderEmploy = false;
                this.showPopupSpinner = false;
                //console.log('tempArray => ',data);
            }

            this.toast('Successfully', 'Moblie capture process completed', 'success');

        }).catch(error => {
            this.showPopupSpinner = false;
            this.showPopup = false;
            this.toast('Error', 'Internal server error', 'error');
        });

    }

    async getEmpDetails() {
        await getEployeeRcrdDetails({ recordId: this.recordId })
            .then((result) => {
                this.recordDetails = result;
                this.error = undefined;
                console.log('result', result);
                console.log('this.recordDetails', this.recordDetails);
            })
            .catch((error) => {
                this.error = error;
                this.recordDetails = undefined;
            });
        const name = this.recordDetails.Name;
        this.record.employeeLastName = this.recordDetails.Name.split(' ').slice(-1).join(' ');;
        this.record.employeeFirstName = name.replace(this.record.employeeLastName, ' ');
        this.record.employeeEmail = this.recordDetails.Email_Address__c;
        this.record.dateOfHire = this.recordDetails.Date_of_Hire__c;
        this.record.department = this.recordDetails.Department__c;
        this.record.dob = this.recordDetails.DOB__c;
        this.record.empID = this.recordDetails.EMP_ID__c;
    }

    showChildDocuments(event) {
        this.showPopInformation = true;
        this.hideButton = false;
        this.showScan = false;
        this.showMobileCapture = false;
        this.popHeaderEmploy = true;
        let name = event.currentTarget.dataset.targetId;
        let sav = '[data-target-id="' + name + '"]';
        let target = this.template.querySelectorAll(sav);
        target.forEach(element => { element.classList.value ? element.classList.remove('disply_none') : element.classList.add('disply_none') }
        );

        let indexValue = event.currentTarget.dataset.indexId;
        let sav1 = '[data-target-id="' + indexValue + '"]';
        let target1 = this.template.querySelectorAll(sav1);
        let num = true;
        let conditionTrue = false;
        let tempArray = [];
        target1.forEach(element => {

            if (!this.uiArray.includes(indexValue)) {
                conditionTrue = true;
            }
            if (conditionTrue) {
                if (num) {
                    element.classList.add('disply_none')
                    num = false;
                } else {
                    element.classList.remove('disply_none')
                    this.uiArray.push(indexValue);
                }
            } else {
                if (num) {
                    element.classList.remove('disply_none')
                    num = false;
                } else {
                    element.classList.add('disply_none')
                    this.firstTimeEnter = true;
                    for (let k of this.uiArray) {
                        if (k != indexValue) {
                            tempArray.push(k);
                        }
                    }
                    this.uiArray = new Array();
                    this.uiArray = tempArray;
                }
            }
        }
        );
    }

    getClosePopup() {
        this.showPopup = false;
        this.docSignPopup = false;
    }

    // getDownloadPDF(event) {

    //     let resultId = event.currentTarget.dataset.targetId;
    //     window.open('/apex/ViewPdf?id=' + resultId + '');

    //     downloadPDF({ resultId: resultId }).then(data => {

    //     }).catch(error => {

    //     });
    // }
    toast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title,
            message,
            variant
        })
        this.dispatchEvent(toastEvent)
    }

    async handleReservationScan() {
        this.showPopupSpinner = true;
        this.getAllInput();
        console.log('this.record.progress $$$$$$$$$$$$$$4', this.record.progress);
        await reservationScan({ recordId: this.recordId, employeRecord: JSON.stringify(this.record) }).then(data => {
            if (data) {
                console.log('data', data);
                this.reservationId = data.reservationId;
                this.bcsId = data.bcsId;
                this.showPopInformation = false;
                this.hideButton = true;
                this.showScan = true;
                this.showMobileCapture = false;
                this.popHeaderEmploy = false;
                this.showPopupSpinner = false;
                //console.log('tempArray => ',data);
            }

            this.toast('Successfully', 'Reservation Scan process completed', 'success');

        }).catch(error => {
            this.showPopupSpinner = false;
            this.showPopup = false;
            this.toast('Error', 'Internal server error', 'error');
        });
    }



}