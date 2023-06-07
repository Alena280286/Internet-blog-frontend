import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CategoryInfoType, CategoryName} from "../../../types/category-info.type";
import {CategoryService} from "./category-service";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isLight: boolean = false;
  categories: CategoryInfoType[] = [];
  private category: CategoryName = CategoryName.copywriting;

  constructor(private dialog: MatDialog, private categoryService: CategoryService) {

  }

  getCategory(){
    return this.category;
  }
  setCategory(value: CategoryName){
    this.category = value;
  }

}
