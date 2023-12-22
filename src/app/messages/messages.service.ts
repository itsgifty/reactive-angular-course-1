import { Injectable } from "@angular/core";
import { log } from "console";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class MessagesService {
  constructor() {
    console.log("created messages service instance...");
  }
  // provide an observable
  error$: Observable<string[]>; //emit value whenever we are calling the showerro methdo
  private errorSubject = new BehaviorSubject<string[]>([]);
  showError(...err: string[]) {
    this.errorSubject.next(err);
  }
}
