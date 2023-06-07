import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../../components/modal/modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ViewportScroller} from "@angular/common";


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})


export class FooterComponent implements OnInit {
  constructor(private modalService: ModalService,
              private matDialog: MatDialog,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private viewportScroller: ViewportScroller) {

  }

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

  openModal(): void {
    this.modalService.isLight = true;
    this.matDialog.open(ModalComponent);
  }

  scrollInto(element: string): void {
    setTimeout(() => {
      document.getElementById(element)
        ?.scrollIntoView({behavior: 'smooth'});
    }, 1);
  }

}
