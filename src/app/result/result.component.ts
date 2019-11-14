import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  planet: any;
  totalTime: any;
  status: any;
  error: any;
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.status === 'true') {
          this.planet = params.planet;
          this.totalTime = params.totalTime;
          this.status = 'success';
        } else if (params.status === 'false') {
          this.status = 'failure';
        } else {
          this.error = params.error;
          this.status = 'error';
        }
    });
  }
  home() {
    this.router.navigate(['']);
  }

}
