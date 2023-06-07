import {Component, Input, OnInit} from '@angular/core';
import {ArticlesType} from "../../../../types/articles.type";
import {Router} from "@angular/router";


@Component({
  selector: 'article-cards',
  templateUrl: './article-cards.component.html',
  styleUrls: ['./article-cards.component.scss']
})
export class ArticleCardsComponent implements OnInit {
  @Input() articles!: ArticlesType;
  constructor(private router: Router) {

  }

  ngOnInit() {

  }

}
