import { query } from '@angular/animations';
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
  public fixJsonHeaders;
  public fixJsonFields;
  public fileTypeValidate = false;
  public infoInvalidMessage = false;
  public ngxXml2jsonService: NgxXml2jsonService;
  public fixHeader = new FixHeader;
  public fixHeaderList = [];
  public fixFieldsList = [];
  public panelOpenState = false;
  public removeButtonLoad = true;

  constructor(ngx: NgxXml2jsonService) {
    this.ngxXml2jsonService = ngx;
  }

  ngOnInit() {
    
  }

  onFileSelect(event) {
    this.fileTypeValidate = false;
    this.removeButtonLoad = true;
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
    this.removeButtonLoad = false;
    let fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile);
    fileReader.onload = (x) => {
      let parser = new DOMParser(),
      xmlDoc = parser.parseFromString(fileReader.result as string, 'text/xml');
      this.fixJson = this.convertXmlToJson(xmlDoc);
      this.fixJsonHeaders = this.fixJson.fix.header.field;
      this.fixJsonFields = this.fixJson.fix.fields.field;
      // FIX FIELDS
      
      for(let i = 0; i < this.fixJsonFields.length; i++){
        if(this.fixJsonFields[i]['value']){
          this.fixFieldsList.push(this.fixJsonFields[i]['@attributes'], this.fixJsonFields[i]['value']);
        }else{
          this.fixFieldsList.push(this.fixJsonFields[i]['@attributes']);
        }
      }
      // FIX HEAD
      for(let i = 0; i < this.fixJsonHeaders.length; i++){
        this.fixHeaderList.push(this.fixJsonHeaders[i]['@attributes']);
        let queryResult = this.consultValue(this.fixJsonHeaders[i]['@attributes'].name, this.fixFieldsList);
        if(queryResult != null){
          this.fixHeaderList[i]["number"] = queryResult.number;
          this.fixHeaderList[i]["type"] = queryResult.type;
        }
      }
      console.log(this.fixHeaderList);
      console.log(this.fixFieldsList);
      //this.fixHeader = this.fixJson.fix.header.field[0]['@attributes'];
      //console.log(this.fixHeader);
    }
  }

  consultValue(query, array){
    let result = array.find(x => x.name === query);
    return result;
  }

  convertXmlToJson(value){
    return this.ngxXml2jsonService.xmlToJson(value);
  }
}
