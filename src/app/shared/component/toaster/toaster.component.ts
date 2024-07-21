import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  @Output()
  toasterClosedEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClose() {
    this.toasterClosedEmitter.emit('closed');
  }

}
