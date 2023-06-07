import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CommentsType} from "../../../types/comments.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ActionsType} from "../../../types/actions.type";


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {

  }

  getComments(offset: number, articleId: string): Observable<{ allCount: number, comments: CommentsType[] }> {
    return this.http.get<{ allCount: number, comments: CommentsType[] }>(environment.api + 'comments?offset=' + offset + '&article=' + articleId);
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text, article
    });
  }

  getArticleCommentActions(articleId: string): Observable<DefaultResponseType | ActionsType[]> {
    return this.http.get<DefaultResponseType | ActionsType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }

  getCommentActions(commentId: string): Observable<DefaultResponseType | ActionsType[]> {
    return this.http.get<DefaultResponseType | ActionsType[]>(environment.api + 'comments/' + commentId + '/actions');
  }


  applyCommentAction(commentId: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    });
  }


}
