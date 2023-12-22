import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Observable, interval, noop, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { LoaderService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { HomeService } from "../services/home.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];

  advancedCourses: Course[];

  constructor(
    private http: HttpClient,
    private homeService: HomeService,
    private loadingService: LoaderService,
    private messageService: MessagesService
  ) {}

  courses$: Observable<Course[]>;
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.loadingService.loadingOn();

    this.courses$ = this.homeService.loadAllCourses().pipe(
      map((c) => c.sort(sortCoursesBySeqNo)),
      catchError((err) => {
        const message = "Error Loading Courses";
        this.messageService.showError(message);
        console.log(err);
        return throwError(err); //must return an observable
      })
    );
    // pass observable to which we want to add loading  indicator capabilites
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(
      this.courses$
    );
    // loadCourses$ ^ has loading indicator capacity
    // pass on the observable with loading capacity to others
    this.beginnerCourses$ = loadCourses$.pipe(
      map((c) =>
        c
          .sort(sortCoursesBySeqNo)
          .filter((course) => course.category === "BEGINNER")
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((c) =>
        c
          .sort(sortCoursesBySeqNo)
          .filter((course) => course.category === "ADVANCED")
      )
    );

    this.loadingService.loadingOff();
  }
}
