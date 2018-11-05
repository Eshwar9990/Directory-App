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
  currentDirectoryName: string = '#';
  folderName: string;
  editFolderName: string;
  editFolderId: number;
  options = {
    timeOut: 2000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };
  
  currentFolders = [];
  showEmptyMessage = true;
  canBeDeleted: boolean = false;

  constructor(private notificationsService: NotificationsService, private foldersService: FoldersService, private cdRef:ChangeDetectorRef, private elRef:ElementRef) {
    // Window["myComponent"] = this;
    
  }

  ngAfterViewInit() {
    this.setViewHierarchy();
    $('#guideModal').modal('show');    
  }

  createFolder() {
    if(!this.folderName) {
      this.notificationsService.error('Error!', 'Name is mandatory to create a folder');
    } else {
      if(this.foldersService.folders.length == 0) {
        this.foldersService.folders.push({
          "id" : 1, "parent" : "#", "text" : this.folderName, "isChecked": false, "lastModifiedAt": new Date()
        });
      } else {
        for(let i=0;i<this.foldersService.folders.length;i++) {
          if(this.foldersService.folders[i].parent == this.currentDirectory && this.foldersService.folders[i].text == this.folderName) {
            this.notificationsService.error('Error!', 'This folder name already exists. Please enter a different one');
            return;
          } 
        }
        this.foldersService.folders.push({
          "id" : this.foldersService.folders[this.foldersService.folders.length-1].id+1, "parent" : this.currentDirectory, "text" : this.folderName, "isChecked": false, "lastModifiedAt": new Date()
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
    this.currentDirectoryName = folderDetails.text;
    this.getCurrentFolders();    
  }

  deleteItems() {
    let isAllDone = true;
    for(let i=0;i<this.foldersService.folders.length;i++) {
      if(this.foldersService.folders.length == 1 && this.foldersService.folders[0].isChecked == true) {
        this.foldersService.folders = [];
        this.canBeDeleted = false;
        this.currentFolders = [];
        this.getCurrentFolders();
        return;
      } else {
        if(this.foldersService.folders[i].isChecked == true) {
          this.foldersService.folders.splice(i, 1);
          isAllDone = false;
          this.canBeDeleted = true;
          break;
        }
      }
    }
    if(isAllDone == false) {
      this.deleteItems();
    } else {
      this.getCurrentFolders();
    }
  }

  deleteItemsMessage() {
    this.notificationsService.success('Success!', 'Selected folders are successfully deleted');
  }

  folderUp() {
    this.currentFolders = [];
    let isTopmostFolder = true, temp;
    for(let i=0;i<this.foldersService.folders.length;i++) {
      if(this.foldersService.folders[i].id == this.currentDirectory) {
        this.currentDirectory = this.foldersService.folders[i].parent;
        temp = this.currentDirectory;
        for(let j=0;j<this.foldersService.folders.length;j++) {
          if(this.foldersService.folders[j].id == this.currentDirectory) {
            temp = this.foldersService.folders[j].parent;
            this.currentDirectoryName = this.foldersService.folders[j].text;
            break;
          } 
        }
        if(temp == this.currentDirectory) {
          this.currentDirectoryName = '#';
        }
        isTopmostFolder = false;
        break;
      } 
    }
    if(isTopmostFolder == true) {
      this.notificationsService.info('Info!', 'This is the top most folder');
    }
    this.getCurrentFolders();
  }

  setViewHierarchy() {
    document.getElementById("quick-access-list").innerHTML = `<img height="150" src="../assets/arrow-pointing-upwards.svg" alt="Upward arrow" style="display: block; margin: auto;">
    <div style="font-size: 20px; margin: 10vh 0;">
      You can understand the folder structure hierarchy here after adding atleast one folder
    </div>
    <img height="150" src="../assets/downward-arr.svg" alt="Downward arrow" style="display: block; margin: auto;">`;
  }

  getCurrentFolders() { 
    this.canBeDeleted = false;
    if(this.foldersService.folders.length > 0) {
      this.currentFolders = [];
      let zeroLevelIds = [];
      document.getElementById("quick-access-list").innerHTML = '';
      for(let i=0;i<this.foldersService.folders.length;i++) {
        this.foldersService.folders[i].isChecked = false;
        if(this.foldersService.folders[i].parent == this.currentDirectory) {
          this.currentFolders.push(this.foldersService.folders[i]);
        }

        if(this.foldersService.folders[i].parent == '#') {
          document.getElementById("quick-access-list").innerHTML += `<a href="#" class="list-group-item" id="`+ this.foldersService.folders[i].id +`">`+ `<img height="15" style="margin: 0 10px 0 0;" src="../assets/is-greater-than-mathematical-sign.svg" alt="Greater than Icon">` + this.foldersService.folders[i].text +`</a>`;
          zeroLevelIds.push(this.foldersService.folders[i].id);
        }         
      }

      this.quickAccessUpdation(zeroLevelIds);
    } else {
      this.setViewHierarchy();
    }

    if(this.currentFolders.length == 0) {
      this.showEmptyMessage = true; 
    } else {
      this.showEmptyMessage = false;
    }
  }

  quickAccessUpdation(tempIds) {
    let nextLevelIds = [];
    tempIds.forEach(item => {
      for(let i=0;i<this.foldersService.folders.length;i++) {
        if(this.foldersService.folders[i].parent == item) {     
          $(`<a href="#" style="padding-left: `+(parseInt($('#'+item).css("padding-left").replace(/px/,""))+15)+"px"+`;" class="list-group-item" id="`+ this.foldersService.folders[i].id +`">`+ `<img height="15" style="margin: 0 10px 0 0;" src="../assets/is-greater-than-mathematical-sign.svg" alt="Greater than Icon">` + this.foldersService.folders[i].text +`</a>`).insertAfter('#'+item);
          nextLevelIds.push(this.foldersService.folders[i].id);
        }
      }
    });
    if(nextLevelIds.length > 0) {
      this.quickAccessUpdation(nextLevelIds);
    }
  }

  editFolderModal(folder) {
    this.editFolderName = folder.text;
    this.editFolderId = folder.id;
    $('#editModal').modal('show');   
  }

  editFolder() {
    for(let i=0;i<this.foldersService.folders.length;i++) {
      if(this.foldersService.folders[i].id == this.editFolderId) {
        if(this.foldersService.folders[i].text === this.editFolderName) {
          this.notificationsService.error('Error!', 'Edited name cannot be the same as old name');
        } else {
          this.foldersService.folders[i].text = this.editFolderName;
          this.foldersService.folders[i].lastModifiedAt = new Date(); 
          this.notificationsService.success('Success!', 'Folder name edited successfully');
          this.editFolderId = this.editFolderName = null;
          this.getCurrentFolders();
          $('#editModal').modal('hide');   
        }
      }
    }
    
  }

  closeDeleteModal() {
    $('#deleteModal').modal('hide');   
  }

  confirmDeletion() {
    let notChecked = true;
    for(let i=0;i<this.currentFolders.length;i++) {
      if(this.currentFolders[i].isChecked == true) {
        $('#deleteModal').modal('show');   
        notChecked = false;
        return;
      } 
    }

    if(notChecked == true) {
      this.notificationsService.error('Error!', 'Please select at least one folder to delete');
    }
  }
}