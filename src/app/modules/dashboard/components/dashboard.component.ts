import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { Note } from '../models/note';
import { NotesService } from '../services/notes/notes.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
// tslint:disable: deprecation
export class DashboardComponent implements OnInit {
  search: FormControl;
  selected: FormControl;
  private allNotes: Note[];
  notes: Note[];
  private snackBarRef: MatSnackBarRef<any> | undefined;

  constructor(private notesService: NotesService, private dialog: MatDialog, private matSnackBar: MatSnackBar) {
    this.search = new FormControl();
    this.selected = new FormControl();
    this.notes = [];
    this.allNotes = [];
    notesService.notesEvents.subscribe(message => this.openSnackBar(message, 'X', 3000));
  }

  ngOnInit(): void {
    this.notesService.userNotes.subscribe({
      next: notes => {
        this.allNotes = notes;
        this.notes = this.allNotes;
      }
    });
    this.search.valueChanges.pipe(map(value => value = value.toLowerCase())).subscribe(value => {
      this.notes = value ?
        this.allNotes
          .filter(note => note.title.toLowerCase().search(value) !== -1 || note.content.toLowerCase().search(value) !== -1) :
        this.allNotes;
    });
    this.selected.valueChanges.subscribe(value => {
      this.notes = value === 'create' ?
        this.notes.sort((noteA, noteB) => this.compareDates(noteA.createdAt, noteB.createdAt)) :
        this.notes.sort((noteA, noteB) => this.compareDates(noteA.updatedAt, noteB.updatedAt));
    });
  }

  private compareDates = (dateA: Date, dateB: Date) => {
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }
  }

  newNote = () => {
    this.dialog.open(
      NoteDialogComponent,
      {
        width: '1000px',
        maxWidth: '700px',
        data: { title: '', content: '' }
      })
      .afterClosed().subscribe(result => {
        if (result && !result.title.isEmpty) {
          this.openSnackBar('Saving note ' + result.title);
          this.notesService.saveNote({ title: result.title, content: result.content });
        }
      });
  }

  editNote = (note: Note) => {
    this.dialog.open(
      NoteDialogComponent,
      {
        width: '1000px',
        maxWidth: '700px',
        data: { title: note.title, content: note.content }
      })
      .afterClosed().subscribe(result => {
        if (result && (note.title !== result.title || note.content !== result.content)) {
          this.openSnackBar('Saving note ' + result.title);
          this.notesService.updateNote(note.id, { title: result.title, content: result.content });
        }
      });
  }

  deleteNote = (note: Note) => {
    this.dialog.open(DeleteDialogComponent, { data: { title: note.title } })
      .afterClosed().subscribe(result => result ? this.notesService.deleteNote(note.id) : null);
  }

  getDateFormat = (date: Date) => new Date(date).getUTCFullYear() !== new Date().getUTCFullYear() ? 'MMM d, y, h:mm a' : 'MMM d, h:mm a';

  private openSnackBar = (message: string, action?: string, duration?: number) => {
    if (this.snackBarRef) {
      this.snackBarRef?.dismiss();
    }
    this.snackBarRef = this.matSnackBar.open(message, action, { duration });
  }

}
