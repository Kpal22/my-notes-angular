import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Note } from '../../models/note';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../services/auth/auth.service';

interface NoteResponse {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
// tslint:disable: deprecation
// tslint:disable: variable-name
export class NotesService {
  private ALL_NOTES_API = environment.BACKEND_BASE + environment.ALL_NOTES;
  private NOTES_API = environment.BACKEND_BASE + environment.NOTES;
  private notes: Note[];
  userNotes: BehaviorSubject<Note[]>;
  notesEvents: Subject<string>;
  private isAuth: boolean;

  constructor(private http: HttpClient, authService: AuthService) {
    this.isAuth = false;
    this.notes = [];
    this.userNotes = new BehaviorSubject(this.notes);
    this.notesEvents = new Subject();
    authService.authenticatedUser.subscribe(user => {
      if (user) {
        this.isAuth = true;
        this.fetchNotes();
      } else {
        this.isAuth = false;
        this.notes = [new Note(new Date().toString(), 'Untitled_Note')];
        this.userNotes.next(this.notes);
      }
    });
  }

  private fetchNotes = () => this.noteOperation('get', this.ALL_NOTES_API);

  saveNote = (data: { title: string, content: string }) => this.noteOperation('post', this.NOTES_API, data, 'Note Saved Successfully!');

  updateNote = (id: string, data: { title: string, content: string }) => this.noteOperation('patch', this.NOTES_API + '/' + id, data, 'Note Updated Successfully!');

  deleteNote = (id: string) => this.noteOperation('delete', this.NOTES_API + '/' + id, null, 'Note Deleted Successfully!');

  private noteOperation = (method: string | 'get' | 'post' | 'patch' | 'delete', api: string, body?: any, message?: string) => {
    if (!this.isAuth && method !== 'get') {
      this.notesEvents.next('Please login first!');
    } else {
      const observer = {
        next: (_data?: any) => { },
        error: (error: string) => this.notesEvents.next(error)
      };
      let observable: Observable<any>;

      switch (method) {
        case 'get':
          observable = this.http.get<NoteResponse[]>(api)
            .pipe(map(notes => notes.map(note => new Note(note.id, note.title, note.content, note.createdAt, note.updatedAt))));
          break;
        case 'post':
          observable = this.http.post<NoteResponse>(api, body);
          break;
        case 'patch':
          observable = this.http.patch<NoteResponse>(api, body);
          break;
        case 'delete':
          observable = this.http.delete<NoteResponse>(api);
          break;
        default: observable = throwError('Client Error!');
      }

      if (method === 'get') {
        observer.next = notes => this.userNotes.next(notes);
      } else {
        observer.next = _data => {
          this.notesEvents.next(message);
          this.fetchNotes();
        };
      }

      observable.pipe(catchError(errorRes => throwError(errorRes.error))).subscribe(observer);
    }
  }

}
