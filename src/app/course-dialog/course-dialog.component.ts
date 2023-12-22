import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as moment from "moment";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoaderService } from "../loading/loading.service";
import { Course } from "../model/course";
import { HomeService } from "../services/home.service";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  providers: [LoaderService], //provide single instance of the loader service
})
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private courseService: HomeService,
    private loadingService: LoaderService,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes = this.form.value;
    // get a save course observable
    const saveCourse$ = this.courseService.saveCourse(this.course.id, changes);

    // send the course observable to the show until loader completed method in service
    this.loadingService
      .showLoaderUntilCompleted(
        this.courseService.saveCourse(this.course.id, changes)
      )
      .subscribe((val) => {
        this.dialogRef.close(val);
      });
  }

  close() {
    this.dialogRef.close();
  }
}
