import * as THREE from "three";

export class Door {
  door: THREE.Group;
  private initialSizes: { [key: string]: { width: number; height: number } };
  private textureLoader: THREE.TextureLoader;
/**
 * Создает дверь с заданными параметрами.
 * 
 * @param width Ширина двери. Это общая ширина всей двери, включая раму.
 * @param height Высота двери. Это общая высота всей двери, включая верхнюю и нижнюю рамы.
 * @param depth Глубина фрейма двери (рамы). Это толщина рамы двери, которая выступает относительно центральной части.
 * @param depthCenter Глубина центральной части двери. Это толщина центральной части двери, которая обычно меньше толщины рамы.
 */
  constructor(
    width: number = 2,
    height: number = 3,
    depth: number = 0.3,
    depthCenter: number = 0.1
  ) {
    this.door = new THREE.Group();
    this.initialSizes = {};
    this.textureLoader = new THREE.TextureLoader();

    const frameWidth = width * 0.1;
    const centralRectWidth = width - 2 * frameWidth;
    const centralRectHeight = height - 2 * frameWidth;

    //Материалы и текстуры
    const beigeColor = new THREE.Color(0xa0522d);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: beigeColor,
      roughness: 0.3,
      metalness: 0.5,
    });
    const centralTexture = this.textureLoader.load("wood1.jpg");
    centralTexture.wrapS = centralTexture.wrapT = THREE.RepeatWrapping;
    const centralMaterial = new THREE.MeshStandardMaterial({
      map: centralTexture,
      bumpScale: 0.8,
      roughness: 0.3,
      metalness: 0.3,
    });
    // Верхний прямоугольник
    const topRect = new THREE.Mesh(
      new THREE.BoxGeometry(width, frameWidth, depth),
      frameMaterial
    );
    topRect.position.y = height / 2 - frameWidth / 2;
    this.door.add(topRect);
    this.initialSizes["topRect"] = { width: width, height: frameWidth };

    // Нижний прямоугольник
    const bottomRect = new THREE.Mesh(
      new THREE.BoxGeometry(width, frameWidth, depth),
      frameMaterial
    );
    bottomRect.position.y = -(height / 2 - frameWidth / 2);
    this.door.add(bottomRect);
    this.initialSizes["bottomRect"] = { width: width, height: frameWidth };

    // Левый прямоугольник
    const leftRect = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, centralRectHeight, depth),
      frameMaterial
    );
    leftRect.position.x = -(width / 2 - frameWidth / 2);
    this.door.add(leftRect);
    this.initialSizes["leftRect"] = {
      width: frameWidth,
      height: centralRectHeight,
    };

    // Правый прямоугольник
    const rightRect = new THREE.Mesh(
      new THREE.BoxGeometry(frameWidth, centralRectHeight, depth),
      frameMaterial
    );
    rightRect.position.x = width / 2 - frameWidth / 2;
    this.door.add(rightRect);
    this.initialSizes["rightRect"] = {
      width: frameWidth,
      height: centralRectHeight,
    };

    // Центральный прямоугольник
    const centerRect = new THREE.Mesh(
      new THREE.BoxGeometry(centralRectWidth, centralRectHeight, depthCenter),
      centralMaterial
    );
    this.door.add(centerRect);
    this.initialSizes["centerRect"] = {
      width: centralRectWidth,
      height: centralRectHeight,
    };
  }
  resizeDoor(newWidth: number, newHeight: number): void {
    const frameWidth = this.initialSizes["topRect"].height;
    const centralRectWidth = newWidth - 2 * frameWidth;
    const centralRectHeight = newHeight - 2 * frameWidth;
    const topRect = this.door.children[0] as THREE.Mesh;
    const bottomRect = this.door.children[1] as THREE.Mesh;
    topRect.scale.x = newWidth / this.initialSizes["topRect"].width;
    bottomRect.scale.x = newWidth / this.initialSizes["bottomRect"].width;

    topRect.position.y = newHeight / 2 - frameWidth / 2;
    bottomRect.position.y = -(newHeight / 2 - frameWidth / 2);

    // Обновление  прямоугольников
    const leftRect = this.door.children[2] as THREE.Mesh;
    const rightRect = this.door.children[3] as THREE.Mesh;
    leftRect.scale.y = centralRectHeight / this.initialSizes["leftRect"].height;
    rightRect.scale.y =
      centralRectHeight / this.initialSizes["rightRect"].height;

    leftRect.position.x = -(newWidth / 2 - frameWidth / 2);
    rightRect.position.x = newWidth / 2 - frameWidth / 2;

    const centerRect = this.door.children[4] as THREE.Mesh;
    centerRect.scale.set(
      centralRectWidth / this.initialSizes["centerRect"].width,
      centralRectHeight / this.initialSizes["centerRect"].height,
      1
    );
    // Обновление текстур
    const centralRect = this.door.children[4] as THREE.Mesh;
    const centralRectMaterial =
      centralRect.material as THREE.MeshStandardMaterial;

    if (centralRectMaterial.map) {
      const textureRepeatX =
        centralRectWidth / this.initialSizes["centerRect"].width;
      const textureRepeatY =
        centralRectHeight / this.initialSizes["centerRect"].height;
      centralRectMaterial.map.repeat.set(textureRepeatX, textureRepeatY);
    }
  }
  getDoor(): THREE.Group {
    return this.door;
  }
}
