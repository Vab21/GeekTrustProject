import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatSelectModule, MatGridListModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';
import { ResultComponent } from './result/result.component';
import { FindFalconComponent } from './find-falcon/find-falcon.component';


@NgModule({
  declarations: [
    AppComponent,
    ResultComponent,
    FindFalconComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
