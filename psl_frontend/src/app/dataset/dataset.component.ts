import { Component, OnInit } from '@angular/core';
import {Http, Response} from '@angular/http';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {
 
  loading : boolean;
  options : object;

  data :Array<Object>;
  t20Players :Array<Object>;
  pslPlayers : Array<Object>;
  domesticPlayers : Array<Object>;
  pslPlayersList : Array<Object>;

  datasetHeading : String;

  //pagination variable, starting from 1
  p: number = 1;

  constructor(private http: Http) { }

  download_T20_Dataset() : void{
    this.loading = true;

    this.pslPlayers = []
    this.domesticPlayers = []
    this.pslPlayersList = []

    this.http.post('http://127.0.0.1:8081/PSL/addT20Dataset','t20_dataset').subscribe((res:Response)=>{
      this.t20Players = res.json();
      this.loading = false;
      this.datasetHeading = "T20 Dataset"
      this.download(this.t20Players,this.datasetHeading);
    });
  }

  download_Domestic_Dataset() : void{
    this.loading = true;
    this.t20Players = []
    this.pslPlayers = []
    this.pslPlayersList = []

    this.http.post('http://127.0.0.1:8081/PSL/addDomesticDataset','domestic_dataset').subscribe((res:Response)=>{
      this.domesticPlayers = res.json();
      this.loading = false;
      this.datasetHeading = "Domestic Dataset"
      this.download(this.domesticPlayers,this.datasetHeading);
    }); 
    
  }

  download_PSL_Dataset() : void{
    this.loading = true;
    this.domesticPlayers = []
    this.t20Players = []
    this.pslPlayers = []

    this.http.post('http://127.0.0.1:8081/PSL/addPSLDataset','psl_dataset').subscribe((res:Response)=>{
      this.pslPlayers = res.json();
      this.loading = false;
      this.datasetHeading = "Pakistan Super League Dataset"
      this.download(this.pslPlayers,this.datasetHeading);
    }); 
  }

  download_PSL_PLayerList() : void{
    this.options = {
      data : 'psl_player_list'
    }
    this.loading = true;
    this.t20Players = []
    this.pslPlayers = []
    this.domesticPlayers = []
    this.http.post('http://127.0.0.1:8081/PSL/addPSL_Player_list',this.options).subscribe((res:Response)=>{
      this.pslPlayersList = res.json();
      this.loading = false;
      this.datasetHeading = "PSL Players List"
      this.download(this.pslPlayersList,this.datasetHeading);
    });
  }


  // Download CSV Sample Code
  download(data,fileName){

    console.log("Downloading Dataset")
    var csvData = this.ConvertToCSV(data);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + '.csv';
    a.click();
  }

  
  ConvertToCSV(data): Object{
    var array = typeof data != 'object' ? JSON.parse(data) : data;
    var str = '';
    var row = "";

    for (var index in data[0]) {
        //Now convert each value to string and comma-separated
        row += index + ',';
    }
    row = row.slice(0, -1);
    //append Label row with line break
    str += row + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}
  ngOnInit() {
  }

}
