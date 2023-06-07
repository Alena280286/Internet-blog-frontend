import {Component, OnInit} from '@angular/core';
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-user-agreement',
  templateUrl: './user-agreement.component.html',
  styleUrls: ['./user-agreement.component.scss']
})
export class UserAgreementComponent implements OnInit{

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.activatedRoute.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.querySelector("#" + fragment);
        if (element) {
          this.viewportScroller.scrollToAnchor(fragment);
        }
      }
    });
  }
}
