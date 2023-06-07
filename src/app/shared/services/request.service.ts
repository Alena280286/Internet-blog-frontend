import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RequestTypeType} from "../../../types/request-type.type";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {

  }

  sendRequest(data: RequestTypeType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', data);
  }

}
