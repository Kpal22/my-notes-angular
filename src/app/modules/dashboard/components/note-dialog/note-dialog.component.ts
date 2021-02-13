import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.scss']
})
export class NoteDialogComponent {
  noteForm: FormGroup;
  noteTitle: FormControl;
  noteContent: FormControl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, content: string }) {
    this.noteTitle = new FormControl(data.title, [Validators.required, Validators.maxLength(25)]);
    this.noteContent = new FormControl(data.content);
    this.noteForm = new FormGroup({ noteTitle: this.noteTitle, noteContent: this.noteContent });
  }

  getData = () => {
    this.data.title = this.noteTitle.value;
    this.data.content = this.noteContent.value;
    return this.data;
  }

}
