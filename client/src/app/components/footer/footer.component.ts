import { Subscription } from 'rxjs';
import { FooterService } from './../../services/footer.service';
import { Footer } from './../../interfaces/Footer';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  footerParts: Footer[] = [];
  loading = true;
  footerSub: Subscription;

  constructor(private footerServ: FooterService) { }

  ngOnInit(): void {
    this.loading = true;
    this.footerSub = this.footerServ.getFooter().subscribe(foot => {
      this.loading = false;
      this.footerParts = foot;
    }, err => {
      console.log(err);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.footerSub) {
      this.footerSub.unsubscribe();
    }
  }

  trackByFun(i: number): number {
    return i;
  }
}
