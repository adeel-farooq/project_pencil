import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { fabric } from 'fabric';
import {AuthService} from '../services/auth.service'
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {AngularFireStorage} from '@angular/fire/compat/storage'
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {
  canvas:any
  // image: any;
path:any=String;
  uploadForm:any= FormGroup;
  file:any= File;
  @ViewChild("myCanvas")
  myCanvas!: ElementRef;
   image = new Image();

  constructor(private auth:AuthService,
     private formBuilder: FormBuilder,
    private angularFireStorage:AngularFireStorage,
      private router: Router) { }

  ngOnInit() {
    this.image.src = "https://picsum.photos/200/300";
    let ctx: CanvasRenderingContext2D =
      this.myCanvas.nativeElement.getContext('2d');

     // showing

  ctx.fillRect(20, 20, 150, 100);

  // Not showing
    this.image.onload = () => {
    console.log("image has loaded!");
     ctx.drawImage(this.image, 100, 100); }
    // let canvas = this.myCanvas.nativeElement.getContext('2d');
    // let ctx = canvas.getContext("2d");
    // let img = new Image();
    // img.src = "https://picsum.photos/300/200";
    // img.onload = () => {
    //     ctx.drawImage(img, 10, 10, 250, 250);
    // }
    this.uploadForm = this.formBuilder.group({
      file: [''],
    });
    if (!localStorage.getItem('googleId')) {
      console.log('here');
this.router.navigateByUrl('/login')
    }
    this.canvas = new fabric.Canvas('canvas', { selection: false });
  }
  img(event:any){
    console.log(event.target.files.length);

    if (event.target.files.length > 0) {
      const file = event.target.files[0];


      // this.uploadForm.get('file').setValue(file);
      // const formData = new FormData();
      // formData.append('image', this.uploadForm.get('file').value);
      this.angularFireStorage.upload("/files"+Math.random(),file)
// const reader= new FileReader()
// console.log(reader.result);

//       fabric.Image.fromURL('reader.result', file=>{
// this.canvas.add(file)
// this.canvas.requestRenderAll()
      // })
  }
}
  logout(){
    localStorage.clear()
    this.ngOnInit()
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








}