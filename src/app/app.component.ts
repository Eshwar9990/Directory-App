import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { FoldersService } from './folders.service';
import { debug } from 'util';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  currentDirectory = '#';
  folderName: string;
  options = {
    timeOut: 2000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };
  currentFolders = [];
  showEmptyMessage = true;

  constructor(private notificationsService: NotificationsService, private foldersService: FoldersService) {}

  ngOnInit() {
    
  }

  createFolder() {
    if(!this.folderName) {
      this.notificationsService.error('Error!', 'Name is mandatory to create a folder');
    } else {
      if(this.foldersService.folders.length == 0) {
        this.foldersService.folders.push({
          "id" : 1, "parent" : "#", "text" : this.folderName 
        });
      } else {
        for(let i=0;i<this.foldersService.folders.length;i++) {
          if(this.foldersService.folders[i].parent == this.currentDirectory && this.foldersService.folders[i].text == this.folderName) {
            this.notificationsService.error('Error!', 'This folder name already exists. Please enter a different one');
            return;
          } 
        }
        this.foldersService.folders.push({
          "id" : this.foldersService.folders[this.foldersService.folders.length-1].id+1, "parent" : this.currentDirectory, "text" : this.folderName 
        });
      }
      this.getCurrentFolders();
        this.folderName = null;
        $('#myModal').modal('hide');
        this.notificationsService.success('Success!', 'Folder is successfully created');
    }
  }

  folderOpen(folderDetails) {
    this.currentDirectory = folderDetails.id;
    this.getCurrentFolders();    
  }

  deleteItems() {

  }

  folderUp() {
    this.currentFolders = [];
    let isTopmostFolder = true;
    for(let i=0;i<this.foldersService.folders.length;i++) {
      if(this.foldersService.folders[i].id == this.currentDirectory) {
        this.currentDirectory = this.foldersService.folders[i].parent;
        isTopmostFolder = false;
        break;
      } 
    }
    if(isTopmostFolder == true) {
      this.notificationsService.info('Info!', 'This is the top most folder');
    }
    this.getCurrentFolders();
  }

  getCurrentFolders() { 
    if(this.foldersService.folders.length > 0) {
      this.currentFolders = [];
      for(let i=0;i<this.foldersService.folders.length;i++) {
        if(this.foldersService.folders[i].parent == this.currentDirectory) {
          this.currentFolders.push(this.foldersService.folders[i]);
        }
        if(this.foldersService.folders[i].parent == '#') {
          $('#quick-access-list').html(`<a href="#" class="list-group-item" id="`+ this.foldersService.folders[i].id +`">`+ this.foldersService.folders[i].text +`</a>`) 
        } else {

        }
      }
    } 
    if(this.currentFolders.length == 0) {
      this.showEmptyMessage = true;
    } else {
      this.showEmptyMessage = false;
    }

    
  }

  renameFolder() {

  }
}