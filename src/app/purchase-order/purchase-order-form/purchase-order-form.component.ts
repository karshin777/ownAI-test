import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticEnums } from 'src/app/constants/static-enums';
import { PurchaseModel } from 'src/app/model/purchase-model';
import * as $ from 'jquery';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.css']
})
export class PurchaseOrderFormComponent implements OnInit {

  purchaseOrderForm: FormGroup;

  talentDetailForm: FormGroup;

  clientNameList = StaticEnums.clientNameArr;

  purchaseOrderTypeList = StaticEnums.purchaseOrderTypeArr;

  currencyTypeList = StaticEnums.currencyArr;

  jobTitleList = StaticEnums.jobTitleArr;

  isSubmittedFormInvalid = false;

  // getter method for getting form controls and form array values
  get clientName() {
    return this.purchaseOrderForm.get('clientName') as FormControl;
  }

  get purchaseOrderType() {
    return this.purchaseOrderForm.get('purchaseOrderType') as FormControl;
  }

  get currency() {
    return this.purchaseOrderForm.get('currency') as FormControl;
  }

  get talentDetails() {
    return this.purchaseOrderForm.get('talentDetails') as FormArray;
  }

  get purchaseOrderStartDate() {
    return this.purchaseOrderForm.get('purchaseOrderStartDate') as FormControl;
  }

  get purchaseOrderEndDate() {
    return this.purchaseOrderForm.get('purchaseOrderEndDate') as FormControl;
  }

  get purchaseOrderNumber() {
    return this.purchaseOrderForm.get('purchaseOrderNumber') as FormControl;
  }

  get receivedOn() {
    return this.purchaseOrderForm.get('receivedOn') as FormControl;
  }

  get receivedFromName() {
    return this.purchaseOrderForm.get('receivedFromName') as FormControl;
  }

  get receivedFromEmail() {
    return this.purchaseOrderForm.get('receivedFromEmail') as FormControl;
  }

  get budget() {
    return this.purchaseOrderForm.get('budget') as FormControl;
  }

  getTalentList(detail, talentDetailIndex) {
    return detail.get('talentDescription')?.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.createPurchaseOrderForm();
  }

  ngOnInit(): void {
  }

  // function for creating purchase form
  createPurchaseOrderForm() {
    this.purchaseOrderForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      purchaseOrderType: ['', Validators.required],
      purchaseOrderNumber: ['', Validators.required],
      receivedOn: ['', Validators.required],
      receivedFromName: ['', Validators.required],
      receivedFromEmail: ['', [Validators.email, Validators.required]],
      purchaseOrderStartDate: ['', Validators.required],
      purchaseOrderEndDate: ['', Validators.required],
      budget: ['', [Validators.maxLength(5), Validators.required]],
      currency: ['', Validators.required],
      talentDetails: this.formBuilder.array([
        this.formBuilder.group({
          jobTitle: ['', Validators.required],
          jobId: [],
          talentDescription: this.formBuilder.array([
            this.getTalentDescriptionGroup()
          ])
        })
      ]),
    })
  }

  /* method to add talent description object 
  * i.e adding description form group in
  * talent description form array
  */
  getTalentDescriptionGroup() {
    const desc = this.formBuilder.group({
      isChecked: [false],
      talentName: [null],
      contractDuration: [null],
      billRate: [null],
      billRateCurrency: [null],
      standardTimeBillRate: [null],
      standardTimeCurrency: [null],
      overTimeBillRate: [null],
      overTimeCurrency: [null]
    });
    return desc;
  }

  goBack() {
    this.location.back();
  }

  // method to check value of purchase order/budget input field matching the required regExp condition
  setInputTypeForFormField(event, inputFor) {
    const combinedRegex = new RegExp('^[ A-Za-z0-9_@./#&+-]*$');
    const numberRegex = new RegExp('^[0-9]*$');
    if (inputFor === 'po') {
      if (event.target.value.match(combinedRegex)) {
        return event.target.value;
      } else {
        event.target.value = '';
        return event.target.value;
      }
    } else if (inputFor === 'budget') {
      if (event?.target?.value.match(numberRegex)) {
        return event.target.value;
      } else {
        event.target.value = '';
        return event.target.value;
      }
    } else if (inputFor === 'duration') {
      if (event?.target?.value.match(numberRegex)) {
        if (event?.target?.value >= 0 && event?.target?.value <= 12) {
          return event.target.value;
        } else {
          event.target.value = '';
          return event.target.value;
        }
      } else {
        event.target.value = '';
        return event.target.value;
      }
    }
  }

  /* method to set job id accordingly to the selected job title by the user
  * and then after dynamically set the talent description form array in
  * talent details form array as per the required condition
  */
  setJobIdAndTalentDescription(detail, index) {
    if (this.talentDetails.value.some(detailObj => detailObj?.jobTitle)) {

      // for getting length to further use for inserting talent object
      const len = this.talentDetails.length;

      // for getting talent details form array at specified index and removing it
      const talentDetailArr = this.talentDetails.at(index).value;
      this.talentDetails.removeAt(index);

      // for setting job id and job title accordingly as per situation
      const jobId = detail.get('jobId') as FormControl;
      const jobTitle = detail.get('jobTitle') as FormControl;
      const jobObj = this.jobTitleList.find(titleObj => titleObj.name === talentDetailArr.jobTitle);
      jobId.patchValue(jobObj.jobId);
      jobTitle.patchValue(jobObj.name);

      // for getting talent description form array and using it as per requirement
      const talentDescription = detail.get('talentDescription') as FormArray;
      if (talentDescription.length >= 2) {
        talentDescription.clear();
        talentDescription.push(this.getTalentDescriptionGroup());
      }

      /* for patching and adding talent description form array into
      * talent details form array dynamically
      */
      this.getTalentListFromJobId(detail).map(obj => {
        this.patchTalentDescriptionArrayDynamically(detail, obj);
      });

      // for inserting/pushing talent detail object as per requirement
      len > 1 ? this.talentDetails.insert(index, detail) : this.talentDetails.push(detail);

      // for show/hide the expand/enclose button
      $(".hideBtn" + index).css('display', 'flex');
      $(".showBtn" + index).css('display', 'none');
    }
  }

  // method to get candidate list according to the job id
  getTalentListFromJobId(detail) {
    const jobId = detail.get('jobId') as FormControl;
    const list = StaticEnums.talents[jobId.value];
    return list;
  }

  /** for patching and adding talent description form array into
   * talent details form array dynamically
   */
  patchTalentDescriptionArrayDynamically(detail, talentObj) {
    talentObj.isChecked = false;
    const talentDescriptionArr = detail.get('talentDescription') as FormArray;
    const descriptionArr = talentDescriptionArr.value;
    if (descriptionArr.length) {
      descriptionArr.map(data => {
        if (data) {
          if (!data.talentName) {
            talentDescriptionArr.clear();
            this.pushValueToTalentDescription(talentDescriptionArr, talentObj);
          } else {
            if (data.talentName !== talentObj.name) {
              this.pushValueToTalentDescription(talentDescriptionArr, talentObj);
            }
          }
        }
      });
    }
  }

  // method to add form group in talent description form array according to requirement
  pushValueToTalentDescription(talentDescription: FormArray, talentObj) {
    talentDescription.push(this.formBuilder.group({
      isChecked: [talentObj.isChecked],
      talentName: [talentObj.name],
      contractDuration: [talentObj.duration],
      billRate: [talentObj.rate],
      billRateCurrency: [talentObj?.billRateCurrency ? talentObj?.billRateCurrency : null],
      standardTimeBillRate: [talentObj.standardTimeBr],
      standardTimeCurrency: [talentObj?.standardTimeCurrency ? talentObj?.standardTimeCurrency : null],
      overTimeBillRate: [talentObj.overTimeBr],
      overTimeCurrency: [talentObj?.overTimeCurrency ? talentObj?.overTimeCurrency : null]
    }))
  }

  /* method to get candidate list according to the job id
  * and using that candidate object one by one
  */
  getTalentListObject(detail, talentDescritpionIndex) {
    let talentList = [];
    if (this.getTalentListFromJobId(detail)) {
      talentList.push(this.getTalentListFromJobId(detail)[talentDescritpionIndex]);
    }
    return talentList;
  }

  // method to add another talent detail group
  addAnotherTalentDetails() {
    const talentDetail = this.formBuilder.group({
      jobTitle: ['', Validators.required],
      jobId: [],
      talentDescription: this.formBuilder.array([
        this.getTalentDescriptionGroup()
      ])
    });
    this.talentDetails.push(talentDetail);
  }

  // method to check if job title and job id selected or not
  checkIfJobIsSelected() {
    return this.talentDetails.value.some(detailObj => detailObj?.jobTitle);
  }

  // method to check purchase order type and assigning talent details accordingly
  checkOrderType(event) {
    if (event.target.value.toLowerCase() === 'individual po') {
      this.talentDetails.clear();
      this.addAnotherTalentDetails();
    }
  }

  // method to check validity of jobTitle form control
  checkIfJobTitleIsValid(detail) {
    if (detail.controls.jobTitle) {
      return detail.controls.jobTitle;
    }
  }

  // method to check if candidate required detail are valid or not
  checkIfCandidateFieldIsValid(talent) {
    if (talent.controls) {
      return talent.controls;
    }
  }

  // method to set the min date range for purchase order end date
  setPurchaseOrderEndDateRange(event) {
    if (event.target.value) {
      this.purchaseOrderEndDate.reset();
    }
  }

  // method to mark candidate as checked or not and also to set validators accordingly
  addFormControlToTalentDescriptionFormArray(event, talentObj, talentDescriptionGroup: FormGroup) {
    if (event.target.checked) {
      talentObj.isChecked = true;
    } else {
      talentObj.isChecked = false;
    }
    this.setValidatorsInFormControl(talentDescriptionGroup, event);
  }

  // method to set or remove validators according to candidate is checked or not
  setValidatorsInFormControl(talentDescriptionGroup: FormGroup, event) {
    const contractDuration = talentDescriptionGroup.get('contractDuration') as FormControl;
    event.target.checked ? contractDuration.setValidators(Validators.required) : contractDuration.removeValidators(Validators.required);
    contractDuration.updateValueAndValidity();

    const billRate = talentDescriptionGroup.get('billRate') as FormControl;
    event.target.checked ? billRate.setValidators(Validators.required) : billRate.removeValidators(Validators.required);
    billRate.updateValueAndValidity();

    const billRateCurrency = talentDescriptionGroup.get('billRateCurrency') as FormControl;
    event.target.checked ? billRateCurrency.setValidators(Validators.required) : billRateCurrency.removeValidators(Validators.required);
    billRateCurrency.updateValueAndValidity();

    const standardTimeBillRate = talentDescriptionGroup.get('standardTimeBillRate') as FormControl;
    event.target.checked ? standardTimeBillRate.setValidators(Validators.required) : standardTimeBillRate.removeValidators(Validators.required);
    standardTimeBillRate.updateValueAndValidity();

    const standardTimeCurrency = talentDescriptionGroup.get('standardTimeCurrency') as FormControl;
    event.target.checked ? standardTimeCurrency.setValidators(Validators.required) : standardTimeCurrency.removeValidators(Validators.required);
    standardTimeCurrency.updateValueAndValidity();

    const overTimeBillRate = talentDescriptionGroup.get('overTimeBillRate') as FormControl;
    event.target.checked ? overTimeBillRate.setValidators(Validators.required) : overTimeBillRate.removeValidators(Validators.required);
    overTimeBillRate.updateValueAndValidity();

    const overTimeCurrency = talentDescriptionGroup.get('overTimeCurrency') as FormControl;
    event.target.checked ? overTimeCurrency.setValidators(Validators.required) : overTimeCurrency.removeValidators(Validators.required);
    overTimeCurrency.updateValueAndValidity();

  }

  // method to remove talent detail object from talent detail form array
  removeTalentDetail(talentDetailIndex) {
    this.talentDetails.removeAt(talentDetailIndex);
    this.talentDetails.updateValueAndValidity();
  }

  // method to hide the candidate details using jquery
  onClickHideBtn(index) {
    $(".talent-info-" + index).css('display', 'none');
    $(".hideBtn" + index).css('display', 'none');
    $(".showBtn" + index).css('display', 'flex');
  }

  // method to show the candidate details using juery
  onClickShowBtn(index) {
    $(".talent-info-" + index).css('display', 'block');
    $(".hideBtn" + index).css('display', 'flex');
    $(".showBtn" + index).css('display', 'none');
  }

  // method to show all the candidate details when user clicks save button
  expandAllCandidateDetails() {
    for (let i = 0; i < this.talentDetails.length; i++) {
      $(".talent-info-" + i).css('display', 'block');
    }
  }

  // method to get if toaster is closed
  getToasterEmittedData(data) {
    if (data === 'closed') {
      this.isSubmittedFormInvalid = false;
    }
  }

  /** method to check the submitted form data for its validity according to
   * the purchase order type
   * @param formData form value data
   * @returns boolean i.e true/false
   */
  checkIfFormIsValid(formData) {
    let isFormValid = false;
    if (formData) {
      if (formData?.purchaseOrderType?.toLowerCase() === 'group po') {
        if (formData?.talentDetails?.length === 1 && formData?.talentDetails?.some(item => item.talentDescription.length > 1)) {
          isFormValid = true;
        } else if (formData?.talentDetails?.length > 1) {
          formData?.talentDetails?.forEach(element => {
            if (element && element?.talentDescription?.length >= 1) {
              isFormValid = true;
            } else {
              isFormValid = false;
            }
          });
        }
      } else if (formData?.purchaseOrderType?.toLowerCase() === 'individual po') {
        if (formData?.talentDetails?.length === 1 && formData?.talentDetails?.some(item => item.talentDescription.length === 1)) {
          isFormValid = true;
        }
      }
    }
    if (isFormValid) {
      return true;
    } else {
      return false;
    }
  }

  // method to reset the entire form and making it fresh new
  resetForm() {
    this.purchaseOrderForm.enable();
    this.talentDetails.clear();
    const talentDetailObj = this.formBuilder.group({
      jobTitle: ['', Validators.required],
      jobId: [],
      talentDescription: this.formBuilder.array([
        this.getTalentDescriptionGroup()
      ])
    });
    this.talentDetails.push(talentDetailObj);
    this.purchaseOrderForm.reset();
    $('.submit-btn').attr('disabled', 'false');
  }

  /** method to submit the form and then after disabling it as per requirement
   * and also using purchase model method to get a clean and clear submitted form
   * values in console
   */
  submitForm() {
    const purchaseForm = new PurchaseModel().toLocal(this.purchaseOrderForm.value);
    if (this.checkIfFormIsValid(purchaseForm) && this.purchaseOrderForm.valid) {
      this.purchaseOrderForm.disable();
      this.expandAllCandidateDetails();
      $('.submit-btn').attr('disabled', 'true');
      console.log(purchaseForm);
    } else {
      this.purchaseOrderForm.markAllAsTouched();
      this.isSubmittedFormInvalid = true;
    }
  }

}
