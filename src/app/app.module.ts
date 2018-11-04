import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { FoldersService } from './folders.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCheckboxModule
  ],
  providers: [FoldersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
