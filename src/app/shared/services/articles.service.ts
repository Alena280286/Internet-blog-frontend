import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticlesType} from "../../../types/articles.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) {
  }

  getArticlesTop(): Observable<ArticlesType[]> {
    return this.http.get<ArticlesType[]>(environment.api + 'articles/top');
  }


  getArticle(url: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'articles/' + url);
  }

  getArticlesRelated(url: string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/related/' + url);
  }

  getArticles(params: ActiveParamsType): Observable<{ count: number, pages: number, items: ArticlesType[]}> {
    return this.http.get<{ count: number, pages: number, items: ArticlesType[] }>(environment.api + 'articles', {
      params: params
    });
  }

}
