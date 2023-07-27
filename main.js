import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// data
const planetsData = [
  { name: "mercury", radius: 0.1, texture: "mercury.png", orbitRadius: 1.5 },
  { name: "venus", radius: 0.2, texture: "venus.jpeg", orbitRadius: 2 },
  {
    name: "earth",
    radius: 0.4,
    texture: "earth.jpg",
    orbitRadius: 3,

    others: [
      {
        name: "moon",
        radius: 0.1,
        texture: "moon.jpeg",
        orbitRadius: 0.5,
      },
    ],
  },
  { name: "mars", radius: 0.2, texture: "mars.jpeg", orbitRadius: 4 },
  { name: "jupiter", radius: 0.5, texture: "jupiter2_1k.jpg", orbitRadius: 5 },
  { name: "saturn", radius: 0.4, texture: "saturnmap.jpg", orbitRadius: 6 },
  { name: "uranus", radius: 0.3, texture: "uranusmap.jpg", orbitRadius: 7 },
  { name: "neptune", radius: 0.3, texture: "neptunemap.jpg", orbitRadius: 8 },
];

//
const texturePath = "/"; // Update the path to your texture folder

// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);

// Create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
});

// controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("sun.jpeg"),
  })
);
scene.add(sun);

// add line orbit
const lineOrbit = new THREE.Group();
scene.add(lineOrbit);

// add sun orbit
const sunOrbit = new THREE.Group();
scene.add(sunOrbit);

// Add stars
const stars = new THREE.Group();
scene.add(stars);

for (let i = 0; i < 1000; i++) {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, Math.random() * 3, Math.random() * 3),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  stars.add(star);
}
stars.position.z = -5;

// Add planets
planetsData.forEach((planetData) => {
  const planetOrbit = new THREE.Group();
  sunOrbit.add(planetOrbit);

  // Add planet
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(planetData.radius, 32, 32),
    new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(planetData.texture),
    })
  );

  // moon
  if (planetData.others) {
    planetData.others.forEach((moonData) => {
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(moonData.radius, 32, 32),
        new THREE.MeshStandardMaterial({
          map: new THREE.TextureLoader().load(moonData.texture),
        })
      );

      // add light
      const light = new THREE.PointLight(0xffffff, 0.2);
      moon.add(light);

      const moonOrbit = new THREE.Group();
      moonOrbit.add(moon);
      moonOrbit.position.x = moonData.orbitRadius;
      planet.add(moonOrbit);
    });
  }

  planet.position.x = planetData.orbitRadius;

  // add circle line
  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(
      planetData.orbitRadius - 0.01,
      planetData.orbitRadius + 0.009,
      64
    ),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.2,
      side: THREE.DoubleSide,
    })
  );
  orbit.rotation.x = Math.PI / 2;
  lineOrbit.add(orbit);

  planetOrbit.add(planet);
});

// camera
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(scene.position);

// lights
const light = new THREE.PointLight(0xffffff, 0.5);
scene.add(light);

// Animate
const animate = () => {
  requestAnimationFrame(animate);

  // Rotate sun
  sun.rotation.y -= 0.05;
  sun.rotation.x -= 0.001;

  // Rotate stars
  stars.rotation.y -= 0.004;
  stars.rotation.x -= 0.003;

  // Rotate planets
  sunOrbit.children.forEach((planetOrbit, index) => {
    planetOrbit.rotation.y -= 0.001 * (index + 1);
    const planet = planetOrbit.children[0];
    planet.rotation.y -= 0.01 * (index + 1);
    planet.rotation.x -= 0.001 * (index + 1);
  });

  // Render
  renderer.render(scene, camera);
};

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

animate();
