import { Component, ViewChild, ElementRef, OnInit,AfterViewInit } from '@angular/core';
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
export class CanvasComponent implements OnInit,AfterViewInit {
  canvas:any
  // image: any;
  myCanvas: any;
  image = new Image();
   textString: string;
   size: any = {
      width: 1200,
      height: 1000
  };
   OutputContent: string;

  url!: string;
  isCanvasDrawn: boolean = true;
  // canvas: any;
  polygon: any;
  isImageDrawn: boolean = false;
  isPolygonDrawn: boolean = false;
  points = [];
  newPt: any;
path:any=String;
  uploadForm:any= FormGroup;
  file:any= File;
  // @ViewChild('myCanvas')
  // private myCanvas: ElementRef = {} as ElementRef;
  //  image = new Image();


  constructor(private auth:AuthService,
     private formBuilder: FormBuilder,
    private angularFireStorage:AngularFireStorage,
      private router: Router) { }
      ngAfterViewInit() {
        // console.log("upppppp");
        this.canvas.on('mouse:up', (options:any) => {
          // console.log("up");
this.ExportToContent('svg')
          if (options.button === 1) {
            this.getClickCoords(options.e);
          }
        });

        this.canvas.on('mouse:down', (event:any) => {
          // console.log("down");
          // this.ExportToContent('svg')
          if (event.button === 3) {
            if (this.points.length < 4) {
              this.isPolygonDrawn = false;
            } else {
              this.makePolygon();
              this.isPolygonDrawn = true;
            }
          }
        });
      }

      selectFile(event: any): void {
        var canvas = this.canvas;
        if (event.target.files) {
          var reader = new FileReader();
          let file = event.target.files[0];
          // this.angularFireStorage.upload("/files"+Math.random(),file)
          reader.readAsDataURL(file);
          reader.onload = (event: any) => {
            this.url = event.target.result;
            this.canvas.setHeight(480);
            this.canvas.setWidth(720);
            fabric.Image.fromURL(this.url, function(img) {
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width / img.width,
                scaleY: canvas.height / img.height
              });
            });
          };
          // this.isImageDrawn = true;
        }
      }

      getClickCoords(event: any) {
        // console.log(document.getElementById('canvasID'));
document.getElementById('canvas')
        if (this.isCanvasDrawn && this.isImageDrawn) {
          this.newPt = {
            x: event.layerX,
            y: event.layerY
          };
          this.points.push(this.newPt);
          this.canvas.add(this.polygon);
          // if (this.points.length > 3) {
          //   this.isPolygonDrawn = true;
          // }
        }
      }

      makePolygon() {
        this.isImageDrawn = false;
        console.log(this.points);
      }

      copyCoords() {
        // if (this.points.length >= 3) {
          let polygonStr = 'Coords Array (';
          let close = ')';
          let sp = ' ';
          let com = ', ';
          for (let i = 0; i < this.points.length - 1; i++) {
            let tempX = (this.points[i].x / 1280).toFixed(10);
            let tempY = (this.points[i].y / 720).toFixed(10);
            tempX = tempX.toString();
            tempY = tempY.toString();
            polygonStr = polygonStr.concat(tempX, sp, tempY, com);
          }
          let last = this.points[this.points.length - 1];
          let tempX = (last.x / 1280).toFixed(10);
          let tempY = (last.y / 720).toFixed(10);
          tempX = tempX.toString();
          tempY = tempY.toString();
          polygonStr = polygonStr.concat(tempX, sp, tempY, close);
          console.log(polygonStr);

          //Copying Polygon to clipboard
          let el = document.createElement('textarea');
          el.value = polygonStr;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          document.body.removeChild(el);
        // }
      }

      //POLYGON EDIT
      public Edit() {
        function polygonPositionHandler(dim, finalMatrix, fabricObject) {
          let x =
              fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
            y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
          return fabric.util.transformPoint(
            new fabric.Point(x, y),
            fabric.util.multiplyTransformMatrices(
              fabricObject.canvas.viewportTransform,
              fabricObject.calcTransformMatrix()
            )
          );
        }
        function anchorWrapper(anchorIndex, fn) {
          return function(eventData, transform, x, y) {
            var fabricObject = transform.target,
              absolutePoint = fabric.util.transformPoint(
                new fabric.Point(
                  fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
                  fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
                ),
                fabricObject.calcTransformMatrix()
              ),
              actionPerformed = fn(eventData, transform, x, y),
              newDim = fabricObject._setPositionDimensions({}),
              polygonBaseSize = fabricObject._getNonTransformedDimensions(),
              newX =
                (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
                polygonBaseSize.x,
              newY =
                (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
                polygonBaseSize.y;
            fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
            return actionPerformed;
          };
        }
        function actionHandler(eventData, transform, x, y) {
          var polygon = transform.target,
            currentControl = polygon.controls[polygon.__corner],
            mouseLocalPosition = polygon.toLocalPoint(
              new fabric.Point(x, y),
              'center',
              'center'
            ),
            polygonBaseSize = polygon._getNonTransformedDimensions(),
            size = polygon._getTransformedDimensions(0, 0),
            finalPointPosition = {
              x:
                (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
                polygon.pathOffset.x,
              y:
                (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
                polygon.pathOffset.y
            };
          polygon.points[currentControl.pointIndex] = finalPointPosition;
          return true;
        }
        let poly = this.canvas.getObjects()[0];
        this.canvas.setActiveObject(poly);
        poly.edit = !poly.edit;
        if (poly.edit) {
          let lastControl = poly.points.length - 1;
          poly.cornerStyle = 'circle';
          poly.cornerColor = 'rgba(0,0,255,0.5)';
          poly.controls = poly.points.reduce(function(acc, point, index) {
            acc['p' + index] = new fabric['Control']({
              // pointIndex: index,
              positionHandler: polygonPositionHandler,
              actionHandler: anchorWrapper(
                index > 0 ? index - 1 : lastControl,
                actionHandler
              ),
              actionName: 'modifyPolygon'
            });
            return acc;
          }, {});
        }

        poly.hasBorders = !poly.edit;
        this.canvas.requestRenderAll();
      }

  addText() {
    console.log('here');

    let textString = this.textString;
    let text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    console.log('here',text);
    this.textString = '';
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  ExportToContent(input) {
    if(input == 'json'){
      this.OutputContent = JSON.stringify(this.canvas);
    }else if(input == 'svg'){
     this.image.src = this.canvas.toDataURL('png')
    //  console.log( ".................",this.image.src);

      // var w = window.open("");
      // w.document.write(this.image.outerHTML);
      // console.log(this.image.outerHTML);
      let text = this.image.src;
      let arr = text.split(',');

      let arr1 = arr[1].split('">');

      // console.log(arr1[0]);
      // var pic=`data${arr1[0]}`
 var pic=  this.base64toBlob(arr1[0],'image/png')
//  console.log(pic);

     var url= this.angularFireStorage.upload("/files"+Math.random(),pic)
// console.log("urllll",url);



    //  this.OutputContent = this.canvas.toSVG();
    }
  }
  base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
  ngOnInit() {
    // this.canvas = new fabric.Canvas('canvasID', { fireRightClick: true });
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });
    this.textString = null;
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.OutputContent = null;
   var imageGet= localStorage.getItem('image')
  //  console.log('.................',imageGet);

   if(imageGet){
// console.log("here");

 var pic=  this.base64toBlob(imageGet,'image/png')
   this.reload(pic)
   }else{
    console.log("else");
   }
       if (!localStorage.getItem('googleId')) {
      // console.log('here');
this.router.navigateByUrl('/login')
    }

  }
  img(event:any){
    console.log(event.target.files.length);

    if (event.target.files.length > 0) {
      const file = event.target.files[0];


      this.angularFireStorage.upload("/files"+Math.random(),file)

  }
}
  logout(){
    localStorage.clear()
    this.router.navigateByUrl('/login')
  }
  clearCanvas(){
    localStorage.removeItem("image")
    this.ngOnInit()
  }
  handleDrop(e:any) {

    // this.file = e.dataTransfer.files[0];


    this.file=e.target.files[0]
    const reader = new FileReader();
    // console.log("imgFileimgFileimgFileimgFileimgFileimgFile", this.file);
  // this.angularFireStorage.upload("/files"+Math.random(), this.file)
    reader.onload = (imgFile:any) => {

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
      // console.log(dataURL);
      let text = dataURL;
      let arr = text.split(',');

      let arr1 = arr[1].split('">');

      // console.log(arr1[0]);
      // var pic=`data${arr1[0]}`
      localStorage.setItem('image',arr1)
      window.location.reload();

      });
    };
    reader.readAsDataURL(this.file);
    // this.save()
    return false;
  }
  reload(e:any) {
    // this.file = e.dataTransfer.files[0];
    console.log(e);


  this.file=e

    const reader = new FileReader();
    // console.log("imgFileimgFileimgFileimgFileimgFileimgFile", this.file);
  // this.angularFireStorage.upload("/files"+Math.random(), this.file)
    reader.onload = (imgFile:any) => {

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
      // console.log(dataURL);
      let text = dataURL;
      let arr = text.split(',');

      let arr1 = arr[1].split('">');

      // console.log(arr1[0]);
      // var pic=`data${arr1[0]}`
      localStorage.setItem('image',arr1)

      });
    };
    reader.readAsDataURL(this.file);
    // this.save()
    return false;
  }
  save(){
    window.open(this.canvas.toDataURL('png'));
   }
imageClick(){
  console.log("download");

  document.getElementById('canvasID').addEventListener("click", function(e) {
    let canvas = <HTMLCanvasElement> document.getElementById('canvasID');

  var dataURL = canvas.toDataURL("image/jpeg", 1.0);

  downloadImage(dataURL, 'my-canvas.jpeg');
});
function downloadImage(data, filename = 'untitled.jpeg') {
  var a = document.createElement('a');
  a.href = data;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
}
}






}
