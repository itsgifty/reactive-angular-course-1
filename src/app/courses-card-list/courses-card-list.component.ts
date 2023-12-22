import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { pipe } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { Course } from "../model/course";

@Component({
  selector: "course-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrl: "./courses-card-list.component.css",
})
export class CoursesCardListComponent implements OnInit {
  @Input()
  courses: Course[];

  constructor(private dialog: MatDialog) {}

  // emitter to inform about the changes
  @Output()
  private coursesChanged = new EventEmitter();
  ngOnInit(): void {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    // emit whenever we are successfully updating the course data, filter cases where val is emitted when dialog is closed
    dialogRef
      .afterClosed()
      .pipe(
        filter((val) => !!val), // to filter out values where we do not receive val
        tap(() => this.coursesChanged.emit()) // tap creates a sideffect i.e. emit an event everytime we get data
      )
      .subscribe();
  }
}
