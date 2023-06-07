import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CategoryInfoType, CategoryName} from "../../../../types/category-info.type";
import {ModalService} from "../../services/modal.service";
import {CategoryService} from "../../services/category-service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {RequestService} from "../../services/request.service";
import {RequestType, RequestTypeType} from "../../../../types/request-type.type";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  isLight: boolean = false;
  formModal: FormGroup;
  isSubmitted = false;
  showThanks = false;
  categories: CategoryInfoType[] = [];
  filteredCategories: CategoryInfoType[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    private modalService: ModalService,
    private categoryService: CategoryService,
    private requestService: RequestService) {

    this.isLight = this.modalService.isLight;

    this.formModal = fb.group({
      services: [CategoryName.copywriting, Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });

  }

  ngOnInit() {
    if (!this.isLight) {
      this.formModal.patchValue( { services: this.modalService.getCategory()} );
    }
    this.categoryService.getCategories()
      .subscribe((data: CategoryInfoType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.categories = data as CategoryInfoType[];
        this.filteredCategories = this.categories.filter(c => c.name !== CategoryName.freelance);
      });

    this.isLight = this.modalService.isLight;
  }


  onSubmit() {

    if (this.formModal.valid) {
      const dataRequest: RequestTypeType = {
        name: this.formModal.value.name,
        phone: this.formModal.value.phone,
        type: RequestType.consultation
      }
      if (!this.isLight) {
        dataRequest.service = this.formModal.value.services;
        dataRequest.type = RequestType.order;
      }

      this.requestService.sendRequest(dataRequest)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error(data.message);
          }
          this.isSubmitted = true;
        });
    }
  }

  onCloseModal(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    if (this.showThanks) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close(this.formModal.value);
    }
  }
}
