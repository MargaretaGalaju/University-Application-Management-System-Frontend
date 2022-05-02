import { furnitureObjects, getGroundUnregularGeometry, getImageTexture, getPlaneSquareGeometry, VcfHelper } from '../../helpers/vcf.helper';
import { VcfColors } from '../../helpers/colors.helper';
import {
  PositionAlign,
  InitialColorsEnum,
  VisitorGender,
  VisitorPosition,
  VisitorRaceColor,
  VcfMapDTO,
  VcfBoothDTO,
  VcfVisitorDTO,
  OrientationEventTypeEnum,
} from '../../interfaces/vcf-viewer.interface';

import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { ThemeService } from '@app/services/theme.service';
@Component({
  selector: 'app-vcf-viewer-map',
  templateUrl: './vcf-viewer-map.component.html',
  styleUrls: ['./vcf-viewer-map.component.scss'],
})
export class VcfViewerMapComponent implements OnChanges, OnDestroy {
  @Input()
  public mapConfigurations: VcfMapDTO;

  @Output()
  public boothClicked = new EventEmitter<VcfBoothDTO>();

  @Output()
  public isLoading = new EventEmitter<boolean>();

  public parentContainerDimensions = {
    width: 0,
    height: 0,
  };

  public renderer: THREE.WebGLRenderer;

  public scene: THREE.Scene;

  public camera: THREE.OrthographicCamera;

  public controls: OrbitControls;

  public animatedElements = [];

  public boxes = [];

  public mapPadding = 0.5;

  public boothWidthPadding = 0.25;

  public boothHeightPadding = 0.4;

  public boothGroupArray: THREE.Object3D[] = [];

  public elementsToChangeColor: THREE.Object3D[] = [];

  public mouse = new THREE.Vector2();

  public raycaster = new THREE.Raycaster();

  public lastIntersected: THREE.Object3D;

  public frustumSize = 5;

  public animationFrameId;

  public loadingManager = new THREE.LoadingManager();

  public uniqueVisitorsGroup = [];

  public uniqueFurnituresGroup = [];

  constructor(private el: ElementRef, private themeService: ThemeService, private changeDetector: ChangeDetectorRef) {
    this.loadingManager.onLoad = () => {
      this.isLoading.emit(false);
    };
  }

  public ngOnChanges() {
    if (!this.mapConfigurations) {
      this.isLoading.emit(false);
      return;
    }

    this.drawVcf();
  }

  public ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  public drawVcf() {
    if (this.scene) {
      this.loadingManager.onStart = () => {
        this.isLoading.emit(true);
      };

      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }

      this.animatedElements = [];
      this.boothGroupArray = [];
      this.elementsToChangeColor = [];
    }

    if (!this.mapConfigurations.Width || !this.mapConfigurations.Height) {
      this.isLoading.emit(false);
      return;
    }

    this.initSceneConfigurations();
    this.buildVcfGround();
    this.buildBooths();
    this.buildVisitors();
    this.buildFurniture();
    
    if (!this.mapConfigurations.Visitors?.length && !this.mapConfigurations.Furniture?.length) {
      this.isLoading.emit(false);
    }

    this.render();
    this.animate();
  }

  public onMouseMove(event) {
    this.updateMousePositions(event);
  }

  public onTouchEnd(event) {
    const intersectedGroup = this.getIntersectedGroup(event.changedTouches[0]);
    this.lastIntersected.userData.onMouseOut(this.lastIntersected);

    if (intersectedGroup) {
      const clickedBooth = this.mapConfigurations.Booths.find((booth) => booth.Id === intersectedGroup.userData.id);
      this.boothClicked.emit(clickedBooth);
    }
  }

  public onTouchStart(event) {
    const intersectedGroup = this.getIntersectedGroup(event.changedTouches[0]);

    if (intersectedGroup) {
      this.lastIntersected = intersectedGroup;
      this.lastIntersected.userData.onMouseOver(this.lastIntersected);
    }
  }

  public onMouseDown(event) {
    const intersectedGroup = this.getIntersectedGroup(event);

    if (intersectedGroup) {
      const clickedBooth = this.mapConfigurations.Booths.find((booth) => booth.Id === intersectedGroup.userData.id);
      this.boothClicked.emit(clickedBooth);
    }
  }

  public getIntersectedGroup(event): THREE.Object3D {
    this.updateMousePositions(event);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.boothGroupArray, true);

    return intersects.length ? this.boothGroupArray.find((array) => intersects[0].object.parent.uuid === array.uuid) : null;
  }

  public updateMousePositions(event) {
    const { top, left, width, height } = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = -1 + (2 * (event.clientX - left)) / width;
    this.mouse.y = 1 - (2 * (event.clientY - top)) / height;
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public animate() {
    if (!document.getElementById('vcf') && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.controls.update();

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));

    this.animatedElements.forEach((element) => {
      element.rotation.y += 0.01;
    });

    if (!this.themeService.isMobileView) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.boothGroupArray, true);

      if (intersects.length > 0) {
        const intersectedGroup: THREE.Object3D = this.boothGroupArray.find((array) => intersects[0].object.parent.uuid === array.uuid);

        if (intersectedGroup && intersectedGroup.userData.id) {
          if (this.lastIntersected && intersectedGroup.userData.id !== this.lastIntersected.userData.id) {
            this.lastIntersected.userData.onMouseOut(this.lastIntersected);
          }

          this.lastIntersected = intersectedGroup;
          this.lastIntersected.userData.onMouseOver(this.lastIntersected);
        } else {
          this.lastIntersected = null;
        }
      } else {
        if (this.lastIntersected) {
          this.lastIntersected.userData.onMouseOut(this.lastIntersected);
        }

        this.lastIntersected = null;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  public buildBooths() {
    this.mapConfigurations.Booths.forEach((booth) => {
      const logo = booth.CompressedLogo ?? booth.Logo;
      if (logo) {
        const loader = new THREE.ImageLoader();
        loader.crossOrigin = '';

        loader.load(
          logo,
          (image) => {
            this.addBoothOnScene(this.getBoothObject(booth, image), booth);
          },
          undefined,
          () => {
            this.addBoothOnScene(this.getBoothObject(booth), booth);
          },
        );
      } else {
        this.addBoothOnScene(this.getBoothObject(booth), booth);
      }
    });
  }

  public addBoothOnScene(booth3DObject: THREE.Object3D, booth: VcfBoothDTO) {
    const isBoothAlignedOnX = booth.Align === PositionAlign.XAxis;
    booth3DObject.position.set(booth.X + (booth.Width * this.boothWidthPadding) / 2, -0.09, booth.Y + (booth.Height * this.boothHeightPadding) / 2);

    if (isBoothAlignedOnX) {
      booth3DObject.rotateY(Math.PI / 2);
      booth3DObject.position.set(
        booth.X + (booth.Height * this.boothHeightPadding) / 2,
        -0.09,
        booth.Y + booth.Width - (booth.Width * this.boothWidthPadding) / 2,
      );
      this.scene.add(booth3DObject);
      return;
    }
    this.scene.add(booth3DObject);
  }

  public onWindowResize(event) {
    if (event.type === OrientationEventTypeEnum[OrientationEventTypeEnum.orientationchange]) {
      const vcfContainer = document.getElementById('vcf');
      this.changeDetector.markForCheck();

      this.parentContainerDimensions.width = vcfContainer.clientHeight;
      this.parentContainerDimensions.height = vcfContainer.clientWidth;

      this.drawVcf();
    }

    this.setCameraPosition();
  }

  public initSceneConfigurations() {
    const vcfContainer = document.getElementById('vcf');

    if (!this.parentContainerDimensions.width && !this.parentContainerDimensions.height) {
      this.parentContainerDimensions.width = this.el.nativeElement.parentElement.clientWidth;
      this.parentContainerDimensions.height = this.el.nativeElement.parentElement.clientHeight;
    }

    if (!this.renderer && !this.scene) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      vcfContainer.appendChild(this.renderer.domElement);

      const supportsOrientationChange = 'onorientationchange' in window;
      const orientationEvent = supportsOrientationChange
        ? OrientationEventTypeEnum[OrientationEventTypeEnum.orientationchange]
        : OrientationEventTypeEnum[OrientationEventTypeEnum.resize];

      vcfContainer.children[0].setAttribute('style', 'outline:none;');
      window.addEventListener(orientationEvent, this.onWindowResize.bind(this));

      if (this.themeService.isMobileView) {
        vcfContainer.addEventListener('touchstart', this.onTouchStart.bind(this));
        vcfContainer.addEventListener('touchend', this.onTouchEnd.bind(this));
      } else {
        vcfContainer.addEventListener('click', this.onMouseDown.bind(this));
        vcfContainer.addEventListener('mousemove', this.onMouseMove.bind(this));
      }

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);

      this.camera = new THREE.OrthographicCamera(0, 0, 0, 0);
      this.setCameraPosition();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.addEventListener('change', this.render.bind(this));

      this.controls.enableRotate = false;
    } else {
      this.setCameraPosition();
    }

    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  }

  public setCameraPosition() {
    const mapSize = this.mapConfigurations.Width;
    const aspect = this.parentContainerDimensions.width / this.parentContainerDimensions.height;
    this.frustumSize = mapSize * 0.9;

    if (this.themeService.isMobileView && this.parentContainerDimensions.width < this.parentContainerDimensions.height) {
      this.frustumSize = mapSize * 3;
    } else {
      this.frustumSize = mapSize;
    }

    this.camera.left = (this.frustumSize * aspect) / -2;
    this.camera.right = (this.frustumSize * aspect) / 2;
    this.camera.top = this.frustumSize / 2;
    this.camera.bottom = -this.frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(mapSize, mapSize, mapSize);
    this.scene.position.set(0, mapSize / 2, 0);
        
    this.renderer.setPixelRatio(2);
    this.renderer.sortObjects = false;
    this.renderer.setSize(this.parentContainerDimensions.width, this.parentContainerDimensions.height);
  }

  public buildVcfGround() {
    const groundObject = new THREE.Object3D();
    const XSize = this.mapConfigurations.Width;
    const YSize = this.mapConfigurations.Height;

    const cutsOff = this.mapConfigurations?.CutOffs;

    const ground = getGroundUnregularGeometry(XSize, YSize, cutsOff, 0.2);
    groundObject.add(this.createMesh(VcfHelper.mapGroundMaterial, ground, 0, -0.1, 0));

    const groundBorder = getGroundUnregularGeometry(XSize, YSize, cutsOff, 0.2, true);
    groundObject.add(this.createMesh(VcfHelper.mapGroundBorderMaterial, groundBorder, 0, -0.16, 0));

    const groundShade = getGroundUnregularGeometry(XSize, YSize, cutsOff, 0.2);
    groundObject.add(this.createMesh(VcfHelper.mapGroundShadowMaterial, groundShade, 0, -0.7, 0));

    groundObject.scale.set(1.1, 1, 1.1);
    groundObject.translateX(-0.05);
    groundObject.translateZ(-0.05);
    this.scene.add(groundObject);
  }

  public buildGroupFromSVG(svgData, visitor?: VcfVisitorDTO): THREE.Group {
    const { paths } = svgData;
    const group = new THREE.Group();

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      let pathColor = path.color;

      if (visitor) {
        const isSkinShape =
          path.userData.style.fill.includes(VisitorRaceColor[0]) ||
          path.userData.style.fill.includes(VisitorRaceColor[1]) ||
          path.userData.style.fill.includes(VisitorRaceColor[2]);

        pathColor = isSkinShape ? VisitorRaceColor[visitor.Race] : pathColor;
      }

      if (path.userData.style.fill.includes('url')) {
        path.color = new THREE.Color('#ACC5EE');
      }

      const material = new THREE.MeshBasicMaterial({
        color: pathColor,
        side: THREE.DoubleSide,
        opacity: path.userData.style.opacity || 1,
        transparent: true,
        depthWrite: false,
      });

      const shapes = path.toShapes(true);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeBufferGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    group.rotateZ(Math.PI);
    group.rotateY(-Math.PI / 4);
    group.rotateX(Math.PI / 4);
    return group;
  }

  public buildVisitors() {
    this.mapConfigurations.Visitors.forEach((visitor: VcfVisitorDTO) => {
      const relatedBooth = this.mapConfigurations.Booths.find((booth) => booth.X === visitor.X && booth.Y === visitor.Y);

      if (!relatedBooth) {
        return;
      }

      const loader = new SVGLoader(this.loadingManager);
      loader.load(`/assets/images/svg/visitors/${VisitorGender[visitor.Gender]}/visitor (${visitor.SkinId}).svg`, (svgData) => {
        let existingVisitorGroup = this.uniqueVisitorsGroup
          .find(
            (visitorGroup: THREE.Group) =>
              visitorGroup.userData.SkinId === visitor.SkinId && visitorGroup.userData.Race === visitor.Race && visitorGroup.userData.Gender === visitor.Gender,
          )
          ?.clone();

        if (!existingVisitorGroup) {
          existingVisitorGroup = this.buildGroupFromSVG(svgData, visitor);
          existingVisitorGroup.userData = visitor;
          this.uniqueVisitorsGroup.push(existingVisitorGroup);
        }

        const visitorPosition = this.getVisitorPosition(visitor.RelativePosition, relatedBooth?.Width, relatedBooth?.Align === PositionAlign.XAxis);

        if (visitor.InvertDirection && !existingVisitorGroup?.userData?.InvertDirection) {
          existingVisitorGroup.rotateY(Math.PI);
        }

        existingVisitorGroup.scale.set(0.005, 0.005, 0.005);
        existingVisitorGroup.position.set(visitor.X + visitorPosition.X, 0.1, visitor.Y + visitorPosition.Z);
        this.scene.add(existingVisitorGroup);
      });
    });
  }

  public buildFurniture() {
    this.mapConfigurations.Furniture.forEach((furniture) => {
      const loader = new SVGLoader(this.loadingManager);
      loader.load(furnitureObjects[furniture.SkinId].svgUrl, (data) => {
        let existingFurnitureGroup = this.uniqueFurnituresGroup
          .find((furnitureGroup: THREE.Group) => furnitureGroup.userData.SkinId === furniture.SkinId)
          ?.clone();

        if (!existingFurnitureGroup) {
          existingFurnitureGroup = this.buildGroupFromSVG(data);
          existingFurnitureGroup.userData = furniture;
          this.uniqueFurnituresGroup.push(existingFurnitureGroup);
        }

        existingFurnitureGroup.position.set(
          furniture.X + furnitureObjects[furniture.SkinId].padding.x,
          furnitureObjects[furniture.SkinId].padding.y,
          furniture.Y + furnitureObjects[furniture.SkinId].padding.z,
        );

        existingFurnitureGroup.scale.set(
          furnitureObjects[furniture.SkinId].scaleCoeficient,
          furnitureObjects[furniture.SkinId].scaleCoeficient,
          furnitureObjects[furniture.SkinId].scaleCoeficient,
        );
        this.scene.add(existingFurnitureGroup);
      });
    });
  }

  public createMesh(material: THREE.MeshLambertMaterial, box, xPosition, yPosition, zPosition, rotateX = true): THREE.Mesh<any, THREE.MeshLambertMaterial> {
    const boxMesh = new THREE.Mesh(box, material);
    boxMesh.rotation.x = rotateX ? Math.PI / 2 : 0;

    boxMesh.position.set(xPosition, yPosition, zPosition);
    return boxMesh;
  }

  public getBoothObject(booth: VcfBoothDTO, image?: HTMLImageElement): THREE.Object3D {
    const boothGroup = new THREE.Object3D();

    const boothWidth = booth.Width - booth.Width * this.boothWidthPadding;
    const boothHeight = booth.Height - booth.Height * this.boothHeightPadding;

    const boothGroundBorder = getPlaneSquareGeometry(boothWidth, boothHeight, 3, 1);
    boothGroup.add(this.createMesh(VcfHelper.boothGroundBorderMaterial, boothGroundBorder, 0, 0, 0));

    const boothGround = getPlaneSquareGeometry(boothWidth, boothHeight, 3, 1);
    boothGroup.add(this.createMesh(VcfHelper.boothGroundMaterial, boothGround, 0, 0.025, 0));

    const imageStandBorder = getPlaneSquareGeometry(boothWidth * 0.9, boothHeight * 0.3, 3, 1);
    boothGroup.add(this.createMesh(VcfHelper.boothGroundBorderMaterial, imageStandBorder, boothWidth * 0.05, 0.05, 0));

    const imageStandGround = getPlaneSquareGeometry(boothWidth * 0.9, boothHeight * 0.3, 3, 1);
    boothGroup.add(this.createMesh(VcfHelper.boothGroundMaterial, imageStandGround, boothWidth * 0.05, 0.07, 0));

    const imageShade = getPlaneSquareGeometry(boothWidth * 0.85, boothHeight * 0.6, 3, 3);
    boothGroup.add(this.createMesh(VcfHelper.logoShadeMaterial, imageShade, boothWidth * 0.07, 0.075, 0.1, false));

    const imageGeometry = getPlaneSquareGeometry(boothWidth * 0.85, boothHeight * 0.6, 3, 0);

    if (booth.Logo) {
      const boothLogoHeight = boothHeight * 0.6;
      const boothLogoWidth = boothWidth * 0.85;

      const material = new THREE.MeshBasicMaterial({
        map: getImageTexture(boothLogoWidth, boothLogoHeight, image, booth.Color),
      });

      material.transparent = true;
      material.map.minFilter = THREE.LinearFilter;
      material.needsUpdate = true;

      const min = new THREE.Vector2(0, 0);
      const max = new THREE.Vector2(boothLogoWidth, boothLogoHeight);
      const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
      const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
      const { faces } = imageGeometry;

      imageGeometry.faceVertexUvs[0] = [];

      for (let i = 0; i < faces.length; i++) {
        const v1 = imageGeometry.vertices[faces[i].a];
        const v2 = imageGeometry.vertices[faces[i].b];
        const v3 = imageGeometry.vertices[faces[i].c];

        imageGeometry.faceVertexUvs[0].push([
          new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
          new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
          new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y),
        ]);
      }

      imageGeometry.uvsNeedUpdate = true;

      const imageMesh = new THREE.Mesh(imageGeometry, material);

      imageMesh.position.set(boothWidth * 0.07, 0.075, 0.131);
      boothGroup.add(imageMesh);
    } else {
      boothGroup.add(this.createMesh(VcfHelper.whiteStandMaterial, imageShade, boothWidth * 0.07, 0.075, 0.13, false));
    }

    const boxGroundBorder = new THREE.BoxGeometry(boothHeight * 0.26, boothHeight * 0.05, boothHeight * 0.26);
    const boxGroundBorderMesh = this.createMesh(VcfHelper.boothGroundBorderMaterial, boxGroundBorder, 0, 0, 0, false);
    boxGroundBorderMesh.position.set(boothWidth * 0.5, 0.02, boothHeight * 0.55);
    boothGroup.add(boxGroundBorderMesh);

    const lightBlueBox = new THREE.BoxGeometry(boothHeight * 0.25, boothHeight * 0.4, boothHeight * 0.25);
    lightBlueBox.faces.forEach((face, id) => {
      if (id > 7) {
        const smallBoxColor = new THREE.Color(VcfColors.LIGHT_BLUE_BOX_SHADOW_1);
        face.color.set(smallBoxColor);
      }
    });
    lightBlueBox.colorsNeedUpdate = true;
    const mesh = new THREE.Mesh(lightBlueBox, VcfHelper.lightBlueBoxMaterial);
    mesh.position.set(boothWidth * 0.5, 0.05, boothHeight * 0.55);
    boothGroup.add(mesh);

    const redSmallBox = new THREE.BoxGeometry(boothHeight * 0.06, boothHeight * 0.06, boothHeight * 0.06);
    redSmallBox.faces.forEach((face, id) => {
      if (id < 6) {
        const smallBoxColor = new THREE.Color(InitialColorsEnum.darkRed);
        face.color.set(smallBoxColor);
      }
    });
    redSmallBox.colorsNeedUpdate = true;

    const redSmallBoxMesh = new THREE.Mesh(redSmallBox, new THREE.MeshBasicMaterial({ color: InitialColorsEnum.lightRed, vertexColors: true }));
    redSmallBoxMesh.position.set(boothWidth * 0.5, 0.33, boothHeight * 0.55);
    this.animatedElements.push(redSmallBoxMesh);
    boothGroup.add(redSmallBoxMesh);
    this.elementsToChangeColor.push(redSmallBoxMesh);

    const redSmallBoxMesh2 = redSmallBoxMesh.clone();
    redSmallBoxMesh2.position.set(boothWidth * 0.5, 0.25, boothHeight * 0.55);
    this.animatedElements.push(redSmallBoxMesh2);
    boothGroup.add(redSmallBoxMesh2);
    this.elementsToChangeColor.push(redSmallBoxMesh2);

    const redBoxTransparent = new THREE.BoxGeometry(boothHeight * 0.15, boothHeight * 0.4, boothHeight * 0.15);
    const redBoxTransparentMesh = new THREE.Mesh(
      redBoxTransparent,
      new THREE.MeshBasicMaterial({ color: InitialColorsEnum.lightRed, vertexColors: true, opacity: 0.6, transparent: true }),
    );
    redBoxTransparentMesh.position.set(boothWidth * 0.5, 0.1 + boothHeight * 0.25, boothHeight * 0.55);
    this.elementsToChangeColor.push(redBoxTransparentMesh);

    const blueBoxTransparentBorder = new THREE.BoxGeometry(boothHeight * 0.18, boothHeight * 0.01, boothHeight * 0.18);
    const blueBoxGroundBorderMesh = this.createMesh(VcfHelper.boothGroundMaterial, blueBoxTransparentBorder, 0, 0, 0, false);
    blueBoxGroundBorderMesh.position.set(boothWidth * 0.5, 0.17, boothHeight * 0.55);
    boothGroup.add(blueBoxGroundBorderMesh);

    const redBoxTransparentBorder = new THREE.BoxGeometry(boothHeight * 0.14, boothHeight * 0.02, boothHeight * 0.14);
    const redBoxGroundBorderMesh = this.createMesh(VcfHelper.redCubeShadowMaterial.clone(), redBoxTransparentBorder, 0, 0, 0, false);
    redBoxGroundBorderMesh.position.set(boothWidth * 0.5, 0.17, boothHeight * 0.55);
    boothGroup.add(redBoxGroundBorderMesh);
    this.elementsToChangeColor.push(redBoxGroundBorderMesh);

    boothGroup.add(redBoxTransparentMesh);
    boothGroup.userData = {
      id: booth.Id,
      onMouseOver: (booth: THREE.Object3D) => {
        this.elementsToChangeColor.forEach((element: THREE.Mesh) => {
          booth.children
            .filter((mesh) => mesh.uuid === element.uuid)
            .forEach((mesh: any) => {
              mesh.material.color.set(InitialColorsEnum.lightGreen);
            });
        });
      },

      onMouseOut: (booth) => {
        this.elementsToChangeColor.forEach((element: THREE.Mesh) => {
          booth.children
            .filter((mesh) => mesh.uuid === element.uuid)
            .forEach((mesh) => {
              mesh.material.color.set(InitialColorsEnum.lightRed);
            });
        });
      },
    };
    this.boothGroupArray.push(boothGroup);

    return boothGroup;
  }

  public getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

  public getVisitorPosition(visitorAlign: VisitorPosition, boothWidth: number, isAlignedOnX: boolean): { X: number; Y: number; Z: number } {
    switch (visitorAlign) {
      case VisitorPosition.TopLeft:
        return {
          X: isAlignedOnX ? 0 : 0 + (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? boothWidth - (boothWidth * this.boothWidthPadding) / 4 : 0 + (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.Top:
        return {
          X: isAlignedOnX ? 0 + (boothWidth * this.boothWidthPadding) / 4 : boothWidth / 2,
          Y: 0,
          Z: isAlignedOnX ? boothWidth / 2 : 0 + (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.TopRight:
        return {
          X: isAlignedOnX ? 0 + (boothWidth * this.boothWidthPadding) / 4 : boothWidth - (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? 0 + (boothWidth * this.boothWidthPadding) / 4 : 0 + (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.Right:
        return {
          X: isAlignedOnX ? 0.5 : boothWidth - (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? 0 + (boothWidth * this.boothWidthPadding) / 4 : 0.5,
        };

      case VisitorPosition.DownRight:
        return {
          X: isAlignedOnX ? 1 - (boothWidth * this.boothWidthPadding) / 4 : boothWidth - (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? 0 + (boothWidth * this.boothWidthPadding) / 4 : 1 - (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.Down:
        return {
          X: isAlignedOnX ? 1 - (boothWidth * this.boothWidthPadding) / 4 : boothWidth / 2,
          Y: 0,
          Z: isAlignedOnX ? boothWidth / 2 : 1 - (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.DownLeft:
        return {
          X: isAlignedOnX ? 1 - (boothWidth * this.boothWidthPadding) / 4 : 0 + (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? boothWidth - (boothWidth * this.boothWidthPadding) / 4 : 1 - (boothWidth * this.boothWidthPadding) / 4,
        };

      case VisitorPosition.Left:
        return {
          X: isAlignedOnX ? 0.5 : 0 + (boothWidth * this.boothWidthPadding) / 4,
          Y: 0,
          Z: isAlignedOnX ? boothWidth - (boothWidth * this.boothWidthPadding) / 4 : 0.5,
        };

      default:
        return {
          X: 0,
          Y: 0,
          Z: 0,
        };
    }
  }
}
