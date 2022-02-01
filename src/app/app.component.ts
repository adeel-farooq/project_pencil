import { Component,OnInit } from '@angular/core';
import { fabric } from 'fabric';
import { ActivatedRoute, Router } from '@angular/router';
import {AuthService} from './services/auth.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  OnInit{
  title = 'pencil';
  canvas:any
  image: any;
  file!: File;
  constructor(private auth:AuthService,  private router: Router,){

  }
  route(){
    this.router.navigateByUrl('/canvas');
  }
  ngOnInit(){
    this.router.navigateByUrl('/login');
// this.canvas= new fabric.Canvas('canvas',{
//   isDrawingMode:true,
//   imageSmoothingEnabled:true,
//   moveCursor:'down'

// })

this.canvas = new fabric.Canvas('canvas', { selection: false });
  }
  handleDrop(e:any) {
    this.file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (imgFile:any) => {
      console.log(imgFile);
      const data = imgFile.target["result"];
      fabric.Image.fromURL(data, (img) => {
        let oImg = img.set({
          left: 0,
          top: 0,
          angle: 0
        }).scale(1);
      this.canvas.add(oImg).renderAll();
      var a = this.canvas.setActiveObject(oImg);
      var dataURL = this.canvas.toDataURL({format: 'png', quality: 0.8});
      console.log(dataURL);

      });
    };
    reader.readAsDataURL(this.file);
    return false;
  }
  login(){
const val=this.auth.googleLogin()
console.log(val);

  }
}
