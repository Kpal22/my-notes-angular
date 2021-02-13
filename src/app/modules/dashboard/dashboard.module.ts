import { NgModule } from '@angular/core';

import { DashboardComponent } from './components/dashboard.component';
import { NoteDialogComponent } from './components/note-dialog/note-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { MaterialModule } from '../../material/material.module';
import { CommonNgModule } from '../../common-ng.module';
import { NotesService } from './services/notes/notes.service';

const components = [
  DashboardComponent,
  NoteDialogComponent,
  DeleteDialogComponent,
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonNgModule,
    MaterialModule,
    DashboardRoutingModule,
  ],
  providers: [NotesService],
  exports: [...components]
})
export class DashboardModule { }
