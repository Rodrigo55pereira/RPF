import { Component, OnInit } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { FixHeader } from '../models/FixHeader';

@Component({
  selector: 'app-fix-upload',
  templateUrl: './fix-upload.component.html',
  styleUrls: ['./fix-upload.component.scss']
})
export class FixUploadComponent implements OnInit {

  public selectedFile: any; //Resumable File Upload Variable
  public name = '';
  public fileContent: string = '';
  public fixJson;
  public fileTypeValidate = false;
  public infoInvalidMessage = false;
  public ngxXml2jsonService: NgxXml2jsonService;
  public fixHeader = new FixHeader;
  public fixHeaderList = [];
  panelOpenState = false;

  constructor(ngx: NgxXml2jsonService) {
    this.ngxXml2jsonService = ngx;
  }

  ngOnInit() {
    
  }

  onFileSelect(event) {
    this.fileTypeValidate = false;
    this.infoInvalidMessage = false;
    this.selectedFile = event.target.files[0]; //User selected File
    this.name = this.selectedFile.name;
    if (this.selectedFile.type === 'text/xml') {
      this.fileTypeValidate = true;
    } else {
      this.infoInvalidMessage = true;
    }
  }

  uploadFile() {
    let fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile);
    fileReader.onload = (x) => {
      let parser = new DOMParser(),
      xmlDoc = parser.parseFromString(fileReader.result as string, 'text/xml');
      this.fixJson = this.convertXmlToJson(xmlDoc);
      this.fixJson = this.fixJson.fix.header.field;
      // FIX HEAD
      for(let i = 0; i < this.fixJson.length; i++){
        this.fixHeaderList.push(this.fixJson[i]['@attributes']);
      }
      console.log(this.fixHeaderList);
      //this.fixHeader = this.fixJson.fix.header.field[0]['@attributes'];
      //console.log(this.fixHeader);
    }
  }

  convertXmlToJson(value){
    return this.ngxXml2jsonService.xmlToJson(value);
  }
}
