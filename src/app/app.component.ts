import { Component, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
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

  constructor(private notificationsService: NotificationsService, private foldersService: FoldersService, private cdRef:ChangeDetectorRef, private elRef:ElementRef) {
    Window["myComponent"] = this;
  }

  createFolder() {
    if(!this.folderName) {
      this.notificationsService.error('Error!', 'Name is mandatory to create a folder');
    } else {
      if(this.foldersService.folders.length == 0) {
        this.foldersService.folders.push({
          "id" : 1, "parent" : "#", "text" : this.folderName, "isChecked": false
        });
      } else {
        for(let i=0;i<this.foldersService.folders.length;i++) {
          if(this.foldersService.folders[i].parent == this.currentDirectory && this.foldersService.folders[i].text == this.folderName) {
            this.notificationsService.error('Error!', 'This folder name already exists. Please enter a different one');
            return;
          } 
        }
        this.foldersService.folders.push({
          "id" : this.foldersService.folders[this.foldersService.folders.length-1].id+1, "parent" : this.currentDirectory, "text" : this.folderName, "isChecked": false
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
    this.currentFolders.forEach((item, index) => {
      if(item.isChecked == true) {
        this.foldersService.folders.splice(index, 1);
      }
    });
    this.getCurrentFolders();
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
      let zeroLevelIds = [];
      document.getElementById("quick-access-list").innerHTML = '';
      for(let i=0;i<this.foldersService.folders.length;i++) {
        if(this.foldersService.folders[i].parent == this.currentDirectory) {

          this.currentFolders.push(this.foldersService.folders[i]);
        }

        console.log('ipdu', this.currentFolders);

        
        if(this.foldersService.folders[i].parent == '#') {
          document.getElementById("quick-access-list").innerHTML += `<a  onclick="Window.myComponent.quickAccessJump(`+this.foldersService.folders[i].parent+`)" href="#" class="list-group-item" id="`+ this.foldersService.folders[i].id +`">`+ this.foldersService.folders[i].text +`</a>`;
          zeroLevelIds.push(this.foldersService.folders[i].id);
        } 
      }

      this.quickAccessUpdation(zeroLevelIds);
    } 

    if(this.currentFolders.length == 0) {
      this.showEmptyMessage = true;
    } else {
      this.showEmptyMessage = false;
    }

    
  }

  quickAccessJump(selectedParent) {
    // this.currentFolders = [];
    // for(let i=0;i<this.foldersService.folders.length;i++) {
    //   if(this.foldersService.folders[i].id == selectedParent) {
    //     this.currentDirectory = this.foldersService.folders[i].parent;
    //   } 
    // }
    // this.getCurrentFolders();
    this.currentFolders = [];
  }

  quickAccessUpdation(tempIds) {
    let nextLevelIds = [];
    tempIds.forEach(item => {
      for(let i=0;i<this.foldersService.folders.length;i++) {
        if(this.foldersService.folders[i].parent == item) {     
          $(`<a href="#" onclick="Window.myComponent.quickAccessJump(`+this.foldersService.folders[i].parent+`)" style="padding-left: `+(parseInt($('#'+item).css("padding-left").replace(/px/,""))+15)+"px"+`;" class="list-group-item" id="`+ this.foldersService.folders[i].id +`">`+ this.foldersService.folders[i].text +`</a>`).insertAfter('#'+item);
          nextLevelIds.push(this.foldersService.folders[i].id);
        }

      }
    });
    if(nextLevelIds.length > 0) {
      this.quickAccessUpdation(nextLevelIds);
    }
    
  }

  renameFolder() {

  }
}