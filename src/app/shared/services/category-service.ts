import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CategoryInfoType} from "../../../types/category-info.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryInfoType[] | DefaultResponseType> {
    return this.http.get<CategoryInfoType[] | DefaultResponseType>(environment.api + 'categories');
  }

}
