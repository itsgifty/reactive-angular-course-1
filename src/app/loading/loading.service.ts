import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable() //not add  provided im
export class LoaderService {
  // create behaviour subject which will return custom observable for us
  private loadingSubject = new BehaviorSubject<boolean>(false);
  // create a loading observable of booleans
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  //method to return a boolean observable that'll return true until the loading is complete, takes in any observable and returns false when the observable is finished
  showLoaderUntilCompleted(observ$: Observable<any>): Observable<any> {
    // creating a default observable to create a an observable chain
    return of(null).pipe(
      tap(() => this.loadingOn()), //upon receiving the initial value we create a side effect to turn on the loading icon
      concatMap(() => observ$), //transforms items emitted by an observable into an observable
      finalize(() => this.loadingOff()) //after observable completes, the loader is turned off
    );
  }

  // emit laoding obsevable value as true
  loadingOn() {
    this.loadingSubject.next(true);
  }

  // emit laoding obsevable value as false
  loadingOff() {
    this.loadingSubject.next(false);
  }
}
