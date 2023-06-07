import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {ModalService} from "../../shared/services/modal.service";
import {MatDialog} from "@angular/material/dialog";
import {CategoryName} from "../../../types/category-info.type";
import {ArticlesType} from "../../../types/articles.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {Router} from "@angular/router";
import {Config} from "../../shared/config/config";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MainComponent implements OnInit {

  sliders = Config.sliders;

  services = Config.services;
  advantages = Config.advantages;
  reviews = Config.reviews;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }
  articles: ArticlesType[] = [];

  constructor(private modalService: ModalService,
              private matDialog: MatDialog,
              private articlesService: ArticlesService,
              private router: Router) {
  }

  ngOnInit() {
    this.articlesService.getArticlesTop()
      .subscribe((data: ArticlesType[]) => {
        this.articles = data;
      });
  }


  openModal(serviceCategory: CategoryName): void {
    this.modalService.isLight = false;
    this.modalService.setCategory(serviceCategory);
    this.matDialog.open(ModalComponent);
  }

}
