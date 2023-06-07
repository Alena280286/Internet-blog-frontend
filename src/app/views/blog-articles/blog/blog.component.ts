import {Component, OnInit} from '@angular/core';
import {ArticlesService} from "../../../shared/services/articles.service";
import {ArticlesType} from "../../../../types/articles.type";
import {CategoryService} from "../../../shared/services/category-service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CategoryInfoType} from "../../../../types/category-info.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {NameFilterType} from "../../../../types/name-filter.type";
import { debounceTime} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlesType[] = [];
  categories: CategoryInfoType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  nameFilters: NameFilterType [] = [];
  open = false;
  check = false;
  pages: number [] = [];
  loading: boolean = false;
  constructor(private articlesService: ArticlesService,
              private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.getCategories();

    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500)
      )
      .subscribe(params => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.nameFilters = [];
        this.activeParams.categories.forEach(url => {
          const foundCategory = this.categories.find(category => category.url === url);
          if (foundCategory) {
            this.nameFilters.push({
              name: foundCategory.name,
              urlParam: foundCategory.url
            });
            foundCategory.check = true;
          }
        });

        this.loading = true;
        this.articlesService.getArticles(this.activeParams)
          .subscribe(data => {
            this.pages = [];
            for (let i = 1; i <= data.pages; i++) {
              this.pages.push(i);
            }
            this.articles = data.items;
            this.loading = false;
          });

        this.open = this.activeParams.categories.length > 0;
      });

  }

  getCategories() {
    this.categoryService.getCategories()
      .subscribe((data: CategoryInfoType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.categories = data as CategoryInfoType[];
      });
  }


  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, category: CategoryInfoType) {
    category.check = !category.check;
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoriesInParams = this.activeParams.categories.includes(url);
      if (existingCategoriesInParams && !category.check) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingCategoriesInParams && category.check) {
        this.activeParams.categories = [...this.activeParams.categories, url]
      }
    } else if (category.check) {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  removeNameFilter(nameFilter: NameFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== nameFilter.urlParam);
    const foundCategory = this.categories.find(category => category.url === nameFilter.urlParam);
    if (foundCategory) {
      foundCategory.check = false;
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }
}
