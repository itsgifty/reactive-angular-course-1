import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Message } from "../model/message";
import { MessagesService } from "./messages.service";

@Component({
  selector: "messages",
  templateUrl: "./messages.component.html",
  styleUrls: ["./messages.component.css"],
})
export class MessagesComponent implements OnInit {
  constructor(public messagesService: MessagesService) {} //public instance so that it can be accessed by the template
  showMessages = false;
  ngOnInit() {}

  onClose() {}
}
