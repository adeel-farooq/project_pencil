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
        this.canvas.on('mouse:up', (options:any) => {
          if (options.button === 1) {
            this.getClickCoords(options.e);
          }
        });

        this.canvas.on('mouse:down', (event:any) => {
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
        console.log(document.getElementById('canvasID'));
document.getElementById('canvasID')
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
  ngOnInit() {
    this.canvas = new fabric.Canvas('canvasID', { fireRightClick: true });

    this.polygon = new fabric.Polygon(this.points, {
      left: 0,
      top: 0,
      fill: 'rgba(255,0,0,0.1)',
      strokeWidth: 1,
      stroke: 'lightgrey',
      scaleX: 1,
      scaleY: 1,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue'
    });
    this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

  //   this.image.src = "https://picsum.photos/200/300";
  //   let ctx: CanvasRenderingContext2D =
  //     this.myCanvas.nativeElement.getContext('2d');

  //    // showing

  // ctx.fillRect(20, 20, 150, 100);

  // // Not showing
  //   this.image.onload = () => {
  //   console.log("image has loaded!");
  //    ctx.drawImage(this.image, 100, 100); }
    // this.uploadForm = this.formBuilder.group({
    //   file: [''],
    // });
    if (!localStorage.getItem('googleId')) {
      console.log('here');
this.router.navigateByUrl('/login')
    }
    // this.canvas = new fabric.Canvas('canvas', { selection: true });
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
  handleDrop(e:any) {
    // this.file = e.dataTransfer.files[0];
    this.file = e.target.files[0];
    const reader = new FileReader();
  this.angularFireStorage.upload("/files"+Math.random(), this.file)
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
