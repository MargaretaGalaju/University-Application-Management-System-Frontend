import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { MeshService } from './mesh.service';

@Injectable({
  providedIn: 'root'
})
export class GroundService {

  constructor(
    private meshService: MeshService,
  ) { }

  
  public getGroundObject(XSize: number, YSize: number): THREE.Object3D {
    const groundObject = new THREE.Object3D();

    const ground = this.getGroundUnregularGeometry(XSize, YSize);

    const groundBorder = this.getGroundUnregularGeometry(XSize, YSize);
    groundObject.add(this.meshService.createMesh('#605b54', groundBorder, 0, -0.10, 0));

    const groundShade = this.getGroundUnregularGeometry(XSize, YSize);
    groundObject.add(this.meshService.createMesh('#d3c9b6', groundShade, 0, -0.5, 0));



    const loader = new THREE.TextureLoader();

    // load a resource
    loader.load(
      'assets/textures/sidewalk_tile.tga.png',
      ( texture ) =>  {
            groundObject.add(this.meshService.createMeshWithTexture(texture, ground, 0, 0, 0));
      },
      undefined,
      function ( err ) {
        console.error( 'An error happened.' );
      }
    );
    // groundObject.scale.set(3,3,3)
    groundObject.translateX(0.4);
    groundObject.translateY(-0.4);
    return groundObject;
  }

  public getGroundUnregularGeometry(XSize: number, YSize: number) {
    let matrix = [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 0, 0],
        [1, 1, 0, 0, 0, 0],
    ];

    let radius = 0.3;

    const shape = new THREE.Shape();
    
    let positionX = 0;
    let positionY = 0;

    const shapeCoordinates = [[positionX, positionY]];
    const vectorsArray = [];
    
    for (let i = positionX; i < XSize; i++) {
      positionX = i;
      if (matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX + 1, positionY]);
      } else {
        positionY++;
        positionX--;
        i--;
        shapeCoordinates.push([positionX + 1, positionY]);
      }
    }

    for (let i = positionY; i < YSize; i++) {
      positionY = i;
      
      if (matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX + 1, positionY + 1]);
      } else {
        positionX--;
        positionY--;
        i--;

        shapeCoordinates.push([positionX + 1, positionY + 1]);
      }
    }

    for (let i = positionX; i >= 0; i--) {
      positionX = i;
      
      if(matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX, positionY + 1]);
      } else {
        positionX++;
        positionY--;
        i++;
        
        shapeCoordinates.push([positionX, positionY + 1]);
      }
    }

    for (let i = positionY; i >= 0; i--) {
      positionY = i;

      if(matrix[positionX][positionY]) {
        shapeCoordinates.push([positionX, positionY]);
      } else {
        positionX++;
        positionY++;
        i++;
        shapeCoordinates.push([positionX, positionY]);
      }
    }
    
    shapeCoordinates.forEach((value, index) => {
      if (index === shapeCoordinates.length-1) {
        return;
      }

      const v1 = new THREE.Vector3(value[0], value[1], 0);
      const v2 = new THREE.Vector3(shapeCoordinates[index+1][0], shapeCoordinates[index+1][1], 0);
      const dir = new THREE.Vector3()
      vectorsArray.push(dir.subVectors(v2,v1).normalize());
    });
    
    let xPos = 0;
    let yPos = 0;
    
    vectorsArray.forEach((vector: THREE.Vector3, index)=> {
      xPos = xPos + vector.x;
      yPos = yPos + vector.y;
      if (index === vectorsArray.length - 1) {
        shape.lineTo(xPos, yPos+radius);
        shape.bezierCurveTo(xPos, yPos+radius, xPos, yPos, xPos+radius, yPos);
        return;
      }

      if (vector.equals(vectorsArray[index + 1])) {
        shape.lineTo(xPos, yPos);
      } else {
        if(vectorsArray[index].x === 1 && vectorsArray[index + 1].y  === 1) {
          shape.lineTo(xPos-radius, yPos);
          shape.bezierCurveTo(xPos-radius, yPos, xPos, yPos, xPos, yPos+ radius);
        }

        if(vectorsArray[index].x === -1 && vectorsArray[index + 1].y  === 1) {
          shape.lineTo(xPos+radius, yPos);
          shape.bezierCurveTo(xPos+radius, yPos, xPos, yPos, xPos, yPos+ radius);
        }

        if(vectorsArray[index + 1].x === -1) {
          shape.lineTo(xPos,  yPos - radius);
          shape.bezierCurveTo(xPos,  yPos - radius, xPos, yPos, xPos-radius, yPos);
        }

        if(vectorsArray[index].x === -1  && vectorsArray[index + 1].y === -1) {
          shape.lineTo(xPos+radius,  yPos);
          shape.bezierCurveTo(xPos+radius,  yPos, xPos, yPos, xPos, yPos-radius);
        }
      }
    })
      
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 0, 
      depth: 0,
      bevelEnabled: false,
      bevelThickness: 0.9, 
      bevelSize: 0.9,
      bevelSegments: 20,
      curveSegments: 10,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }

  public getPlaneSquareShape(XSize, YSize, depth, radius) {
    const shape = new THREE.Shape();

    shape.lineTo(0, YSize - YSize*radius);
    shape.bezierCurveTo(0, YSize - YSize*radius, 0, YSize, XSize*radius, YSize);
    
    shape.lineTo(XSize - XSize*radius, YSize);
    shape.bezierCurveTo(XSize - XSize*radius , YSize, XSize, YSize, XSize, YSize - YSize*radius);
    
    shape.lineTo(XSize, YSize*radius);
    shape.bezierCurveTo(XSize, YSize*radius, XSize, 0, XSize - XSize*radius, 0);
    
    shape.lineTo(XSize*radius, 0);
    shape.bezierCurveTo(XSize*radius, 0, 0, 0, 0, YSize*radius);

    const extrudeSettings = {
       steps: 0, 
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 2, 
        bevelSize: 2,
        bevelSegments: 20,
        curveSegments: 10,
      };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    return geometry;
  }
  
  public getBoothObject(): THREE.Object3D {
    const boothGroup = new THREE.Object3D();

    let boothWidth = 100;
    let boothHeight = 200;

    // const boothGroundBorder = this.getPlaneSquareShape(boothWidth, boothHeight, 20, 0.1);
    // boothGroup.add(this.meshService.createMesh('#89b2f1', boothGroundBorder, 0, 0, 0));

    const boothGround = this.getPlaneSquareShape(boothWidth, boothHeight, 200, 0.2);
    boothGroup.add(this.meshService.createMesh('#000', boothGround, 0, 0, 0));

    // const imageStandBorder = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3,20, 0.1);
    // boothGroup.add(this.meshService.createMesh('#89b2f1', imageStandBorder, boothWidth*0.1, 0.050, 0));

    // const imageStandGround = this.getPlaneSquareShape(boothWidth*0.8, boothHeight*0.3, 0.1, 0.1);
    // boothGroup.add(this.meshService.createMesh('#D3E4FA', imageStandGround, boothWidth*0.1, 0.075, 0));

    // const imageShade = this.getPlaneSquareShape(boothWidth*0.76, boothHeight*0.8, 0.1, 0.1);
    // boothGroup.add(this.meshService.createMesh('#D0D8E2', imageShade, boothWidth*0.12, 0.075, 0.1, false));
    // boothGroup.add(this.meshService.createMesh('#D0D8E2', imageShade, boothWidth*0.12, 0.06, 0.11, false));

    // new THREE.TextureLoader().load('https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTtMx1J4N4I0KXMVKvO9dSxK8ydQG4_SvFUpQ&usqp=CAU', (texture) => {
    //     const material = new THREE.MeshBasicMaterial({ 
    //       map: texture,
    //     });
    //     material.map.needsUpdate = true; 

    //     const imageBox = new THREE.Mesh(imageShade, material);
    //     imageBox.position.set(boothWidth*0.125, 0.07, 0.13);
        
    //     boothGroup.add(imageBox);
    // });

    // const boxGroundBorder = new THREE.BoxGeometry( boothHeight*0.26, boothHeight*0.05, boothHeight*0.26 );
    // const boxGroundBorderMesh = this.meshService.createMesh('#89b2f1', boxGroundBorder, 0, 0, 0, false);
    // boxGroundBorderMesh.position.set(boothWidth*0.5, 0.02, boothHeight*0.55);
    // boothGroup.add(boxGroundBorderMesh);
    
    // const box = new THREE.BoxGeometry( boothHeight*0.25, boothHeight*0.4, boothHeight*0.25 );
    // // box.faces[0].color.set('#d3e3f9');
    // // box.faces[1].color.set('#d3e3f9');
    // // box.faces[2].color.set('#f4f8ff');
    // // box.faces[3].color.set('#f4f8ff');
    // // box.faces[8].color.set('#e7eefb');
    // // box.faces[9].color.set('#e7eefb');
    // // box.colorsNeedUpdate = true;
    // const mesh = new THREE.Mesh(box,  new THREE.MeshBasicMaterial( { color: '#f4f8ff', vertexColors: true } ));
    // mesh.position.set(boothWidth*0.5, 0.05, boothHeight*0.55);
    // boothGroup.add(mesh);

    // const redSmallBox = new THREE.BoxGeometry( boothHeight*0.08, boothHeight*0.08, boothHeight*0.08 );
    // redSmallBox.faces.forEach((face, id) => {
    //   if(id<6) {
    //     let smallBoxColor = new THREE.Color(InitialColorsEnum.darkRed);
    //     face.color.set( smallBoxColor );
    //   }
    // });
    // redSmallBox.colorsNeedUpdate = true;
    
    // const redSmallBoxMesh = new THREE.Mesh(redSmallBox,  new THREE.MeshBasicMaterial( { color: InitialColorsEnum.lightRed, vertexColors: true } ));
    // redSmallBoxMesh.position.set(boothWidth*0.5, 0.50, boothHeight*0.55);
    // this.animatedElements.push(redSmallBoxMesh);
    // boothGroup.add(redSmallBoxMesh);
    // this.elementsToChangeColor.push(redSmallBoxMesh);
    
    // const redSmallBoxMesh2 = redSmallBoxMesh.clone();
    // redSmallBoxMesh2.position.set(boothWidth*0.5, 0.35, boothHeight*0.55);
    // this.animatedElements.push(redSmallBoxMesh2)
    // boothGroup.add(redSmallBoxMesh2);
    // this.elementsToChangeColor.push(redSmallBoxMesh2);

    // const redBoxTransparent = new THREE.BoxGeometry( boothHeight*0.17, boothHeight*0.5, boothHeight*0.17 );
    // const redBoxTransparentMesh = new THREE.Mesh(redBoxTransparent,  new THREE.MeshBasicMaterial( { color: InitialColorsEnum.lightRed, vertexColors: true, opacity: 0.5, transparent: true } ));
    // redBoxTransparentMesh.position.set(boothWidth*0.5, 0.18+boothHeight*0.25, boothHeight*0.55);
    // this.elementsToChangeColor.push(redBoxTransparentMesh);
    
    // const blueBoxTransparentBorder = new THREE.BoxGeometry(  boothHeight*0.18, boothHeight*0.01, boothHeight*0.18 );
    // const blueBoxGroundBorderMesh = this.meshService.createMesh('#89b2f1', blueBoxTransparentBorder, 0, 0, 0, false);
    // blueBoxGroundBorderMesh.position.set(boothWidth*0.5, 0.22, boothHeight*0.55);
    // boothGroup.add(blueBoxGroundBorderMesh);
    // this.elementsToChangeColor.push(blueBoxGroundBorderMesh);
    
    // const redBoxTransparentBorder = new THREE.BoxGeometry(  boothHeight*0.16, boothHeight*0.01, boothHeight*0.16 );
    // const redBoxGroundBorderMesh = this.meshService.createMesh(InitialColorsEnum.darkRed, redBoxTransparentBorder, 0, 0, 0, false);
    // redBoxGroundBorderMesh.position.set(boothWidth*0.5, 0.22, boothHeight*0.55);
    // boothGroup.add(redBoxGroundBorderMesh);
    // this.elementsToChangeColor.push(redBoxGroundBorderMesh);

    // boothGroup.add(redBoxTransparentMesh);
    // boothGroup.userData = {
    //   url: booth.url,
    //   id: this.boothGroupArray.length + 1,
    //   scaleUp:(bth:THREE.Object3D) =>{
    //     bth.scale.set( 1.05, 1 ,1.05 );

    //     this.elementsToChangeColor.forEach((element: THREE.Mesh)=> {
    //       bth.children.filter((mesh)=> mesh.uuid === element.uuid).forEach((mesh)=> {
    //         mesh.material.color.set(InitialColorsEnum.lightGreen)
    //       })
    //     })
    //   },

    //   scaleDown: (bth) => {
    //     bth.scale.set( 1, 1, 1 );
    //     this.elementsToChangeColor.forEach((element: THREE.Mesh)=> {
    //       bth.children.filter((mesh)=> mesh.uuid === element.uuid).forEach((mesh)=> {
    //         mesh.material.color.set(InitialColorsEnum.lightRed)
    //       })
    //     })
    //   },
    // } 
    // this.boothGroupArray.push(boothGroup);

    return boothGroup;
  }
}
