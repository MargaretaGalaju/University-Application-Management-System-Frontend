import * as THREE from 'three';
import { Vector3 } from 'three';

export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

export function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera, cameraFrustrum) {
  const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
  const halfFovY = THREE.MathUtils.degToRad(cameraFrustrum * .5);
  const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
  
  // compute a unit vector that points in the direction the camera is now
  // in the xz plane from the center of the box
  const vector3 = new Vector3(-camera.position.x, -camera.position.y, -camera.position.z)
  
  const direction = (new THREE.Vector3())
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(-1, 0, -1))
      .normalize();
      
  // move the camera to a position distance units way from the center
  // in whatever direction the camera was from the center already
  const position = direction.multiplyScalar(distance).add(boxCenter);
  camera.position.copy(position);
  
  camera.position.setY(camera.position.y+12);
  camera.position.setX(camera.position.x+25);

  // pick some near and far values for the frustum that
  // will contain the box.
  camera.near = boxSize / 100;
  camera.far = boxSize * 100;

  camera.updateProjectionMatrix();

  // point the camera to look at the center of the box
  camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
}