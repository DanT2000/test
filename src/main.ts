import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Door } from "./door";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Окружение
const environmentTexture = new THREE.TextureLoader().load("background.jpg");
scene.background = environmentTexture;

// Освещение
const mainLight = new THREE.PointLight(0xffffff, 100);
mainLight.position.set(0, 20, 0);
scene.add(mainLight);

const sideLight = new THREE.DirectionalLight(0xffffff, 1);
sideLight.position.set(5, 4, 14); 
scene.add(sideLight);

// Настройка теней
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 4096;
mainLight.shadow.mapSize.height = 4096;
renderer.shadowMap.enabled = true;

// Создание геометрических фигур
const boxGeometry = new THREE.BoxGeometry();
const sphereGeometry = new THREE.SphereGeometry();

// Создание материалов
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ff00, // Зеленый цвет
  metalness: 0.5,
  roughness: 0.5,
});

const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.3,
});

const platformTexture = new THREE.TextureLoader().load("floor.png");
const platformBumpMap = new THREE.TextureLoader().load("floor_bump.png");

// Создание объектов
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
boxMesh.position.x = -4;
sphereMesh.position.x = 4;

boxMesh.castShadow = true;
sphereMesh.castShadow = true;

// Создание платформы
const platformGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const platformMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 0,
  roughness: 0.5,
  map: platformTexture,
  bumpMap: platformBumpMap,
  bumpScale: 1,
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.y = -2;
platform.receiveShadow = true;

scene.add(platform);
scene.add(boxMesh);
scene.add(sphereMesh);

const door = new Door();
scene.add(door.getDoor());

const controls = new OrbitControls(camera, renderer.domElement);

// GUI 
const doorWidthSlider: HTMLInputElement = document.createElement("input");
const doorHeightSlider: HTMLInputElement = document.createElement("input");

doorWidthSlider.type = "range";
doorWidthSlider.min = "100";
doorWidthSlider.max = "500";
doorWidthSlider.value = "200";

doorHeightSlider.type = "range";
doorHeightSlider.min = "100";
doorHeightSlider.max = "500";
doorHeightSlider.value = "300";

doorWidthSlider.addEventListener("input", () => {
  const newWidth = parseFloat(doorWidthSlider.value) / 100;
  const currentHeight = parseFloat(doorHeightSlider.value) / 100;
  door.resizeDoor(newWidth, currentHeight);
});

doorHeightSlider.addEventListener("input", () => {
  const currentWidth = parseFloat(doorWidthSlider.value) / 100;
  const newHeight = parseFloat(doorHeightSlider.value) / 100;
  door.resizeDoor(currentWidth, newHeight);
});

const widthLabel: HTMLDivElement = document.createElement('div');
widthLabel.textContent = 'Ширина';
widthLabel.className = 'label';
const heightLabel: HTMLDivElement = document.createElement('div');
heightLabel.textContent = 'Высота';
heightLabel.className = 'label';

const gui: HTMLDivElement = document.createElement('div');
gui.id = 'gui';
gui.appendChild(widthLabel);
gui.appendChild(doorWidthSlider);
gui.appendChild(heightLabel);
gui.appendChild(doorHeightSlider);
document.body.appendChild(gui);

function animate() {
  requestAnimationFrame(animate);
  window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  });

  

  controls.update();
  renderer.render(scene, camera);
}

animate();
