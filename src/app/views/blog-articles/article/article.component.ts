import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentsType} from "../../../../types/comments.type";
import {LoaderService} from "../../../shared/services/loader.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentType} from "../../../../types/comment.type";
import {FormControl} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {ActionsType} from "../../../../types/actions.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleComponent implements OnInit {
  article!: ArticleType;
  articleRelated: ArticleType[] = [];
  comments: CommentsType[] = [];
  comment!: CommentType;
  commentControl = new FormControl('');
  commentCount = 0;
  visibleCommentsCount = 3;
  isLogged = false;
  isLoading = false;
  hasMoreComments = false;
  isLiked: { [key: string]: boolean } = {};
  isDisliked: { [key: string]: boolean } = {};

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private commentsService: CommentService,
              private loaderService: LoaderService,
              public authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {
    this.authService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;
    });

    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url'])
        .subscribe((data: ArticleType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.article = data as ArticleType;
          if (this.article && this.article.id) {
            this.getComments(0, this.article.id);
          }
          this.getCommentActions();
        });

      this.articlesService.getArticlesRelated(params['url'])
        .subscribe((data: ArticleType[] | DefaultResponseType) => {
          if (data) {
            this.articleRelated = data as ArticleType[];
          }
        });
    });
  }

  getComments(offset: number, article: string) {
    this.commentsService.getComments(offset, article)
      .subscribe((data: { allCount: number; comments: CommentsType[] }) => {
        this.comments = data.comments.slice(0, this.visibleCommentsCount);
        this.commentCount = data.allCount;
        if (this.comments.length < data.allCount) {
          this.hasMoreComments = true;
        }
      });
  }

  submitComment() {
    const text = this.commentControl.value;
    if (!text) {
      return;
    }
    const articleId = this.article.id;

    this.commentsService.addComment(text, articleId)
      .subscribe((data: DefaultResponseType) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.commentControl.setValue('');
        this.getComments(0, articleId);
      });
  }

  getCommentActions() {
    const articleId = this.article.id;

    this.commentsService.getArticleCommentActions(articleId)
      .subscribe((data: DefaultResponseType | ActionsType[]) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }
        if (Array.isArray(data)) {
          for (let action of data) {
            const commentId = action.comment;

            if (action.action === 'like') {
              this.isLiked[commentId] = true;
              this.isDisliked[commentId] = false;
            }

            if (action.action === 'dislike') {
              this.isLiked[commentId] = false;
              this.isDisliked[commentId] = true;
            }
          }
        }
      });
  }

  applyCommentAction(comment: CommentsType, action: string) {
    if (!this.isLogged || !this.article) {
      return;
    }

    this.commentsService.getCommentActions(comment.id)
      .subscribe((data: DefaultResponseType | ActionsType[]) => {
        if ((data as DefaultResponseType).error) {
          throw new Error((data as DefaultResponseType).message);
        }

        let currentAction = '';

        if ((data as ActionsType[]).length) {
          currentAction = (data as ActionsType[])[0].action;
        }


        this.commentsService.applyCommentAction(comment.id, action)
          .subscribe({
            next: (data: DefaultResponseType) => {
              if (data.error) {
                this._snackBar.open(data.message);
                throw new Error(data.message);
              }

              if (action === 'violate') {
                this._snackBar.open('Жалоба отправлена');
                return;
              }

              if (action === 'like' && currentAction === 'like') {
                comment.likesCount--;
                this.isLiked[comment.id] = false;
              }

              if (action === 'dislike' && currentAction === 'dislike') {
                comment.dislikesCount--;
                this.isDisliked[comment.id] = false;
              }

              if (action === 'like' && currentAction === 'dislike') {
                comment.likesCount++;
                comment.dislikesCount--;
                this.isLiked[comment.id] = true;
                this.isDisliked[comment.id] = false;
              }

              if (action === 'dislike' && currentAction === 'like') {
                comment.likesCount--;
                comment.dislikesCount++;
                this.isLiked[comment.id] = false;
                this.isDisliked[comment.id] = true;
              }

              if (action === 'dislike' && !currentAction) {
                comment.dislikesCount++;
                this.isDisliked[comment.id] = true;
              }

              if (action === 'like' && !currentAction) {
                comment.likesCount++;
                this.isLiked[comment.id] = true;
              }

              this._snackBar.open('Ваш голос учтён!');
            },
            error: (errorResponse: HttpErrorResponse) => {
              if (errorResponse.error && action === 'violate') {
                this._snackBar.open('Жалоба уже отправлена');
              }
            }
          });
      });
  }


  showMoreComments() {
    const offset = this.comments.length;
    const articleId = this.article.id;
    this.isLoading = true;
    this.commentsService.getComments(offset, articleId)
      .subscribe((data: { allCount: number; comments: CommentsType[] }) => {
        this.comments = [...this.comments, ...data.comments];
        if (this.comments.length >= data.allCount) {
          this.hasMoreComments = false;
        }
        this.isLoading = false;
      });
  }
}
