import { Component, ElementRef, OnInit } from '@angular/core';
import { AmbientLight, BackSide, BoxGeometry, Camera, Color, EquirectangularReflectionMapping, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, TextureLoader, Vector2, WebGLRenderer } from 'three';

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STAR_TYPES, Star, StarFactory } from './models/Star.class';
import { StarSystem, StarSystemFactory } from './models/StarSystem.class';
import { Planet } from './models/Planet.class';

@Component({
  selector: 'app-solar-system',
  templateUrl: './solar-system.component.html',
  styleUrls: ['./solar-system.component.css']
})
export class SolarSystemComponent implements OnInit {

  public scene = new Scene();
  public camera!: Camera;
  public renderer: WebGLRenderer = new WebGLRenderer({precision: "highp"});
  public objects: { [key: string]: Mesh } = {};
  public bloomComposer!: EffectComposer;
  public starSystem!: StarSystem;

  constructor(private elm: ElementRef) {
    this.starSystem = StarSystemFactory.createRandom();
  }

  public ngOnInit(): void {
    const target = this.elm.nativeElement.querySelector('.solar-system');
    const dimensions = target.getBoundingClientRect();

    this.camera = new PerspectiveCamera(75, dimensions.width / dimensions.height, 0.1, 1000)
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 0.0);

    // const starConstructor = StarFactory.getRandomType();
    // const star = StarFactory.create(starConstructor.type, starConstructor.getRandomGravity(), starConstructor.getRandomMass(), starConstructor.getRandomLuminosity())

    // console.log(star);

    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = this.starSystem.sun.luminosity * 2; //intensity of glow
    bloomPass.radius = 0;
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.setSize(dimensions.width, dimensions.height);
    this.bloomComposer.renderToScreen = true;
    this.bloomComposer.addPass(renderScene);
    this.bloomComposer.addPass(bloomPass);

    target.appendChild(this.renderer.domElement);
    // const geometry = new SphereGeometry(1, 24, 24);
    // const material = new MeshBasicMaterial({ color: new Color("#FDB813") });
    // const sun = new Mesh(geometry, material);
    this.objects['box'] = this.starSystem.sun.mesh;
    this.scene.add(this.starSystem.sun.mesh)

    this.starSystem.planets.forEach((planet:Planet)=>{
      this.scene.add(planet.planetObj);
    })
    console.log(this.starSystem)

    this.camera.position.z = 15;
    // this.camera.position.set(-50, 90, 150);
    const starGeometry = new SphereGeometry(80, 64, 64);

    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    new TextureLoader()
      .setPath('assets/')
      .load('galaxy.png', (texture) => {

        texture.mapping = EquirectangularReflectionMapping;

        const backgroundMat = new MeshBasicMaterial({
          map: texture,
          side: BackSide,
          transparent: true
        })

        const starMesh = new Mesh(starGeometry, backgroundMat);
        this.objects['starmesh'] = starMesh;
        this.scene.add(starMesh)

      });

    const ambientlight = new AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientlight);
    this.update();
  }

  public update() {
    this.objects['box'].rotation.x += 0.01;
    this.objects['box'].rotation.y += 0.01;
    if (this.objects['starmesh'] && this.camera) {

      this.objects['starmesh'].position.set(this.camera.position.x,this.camera.position.y,this.camera.position.z);
    }
    this.render();
  }

  public render() {
    requestAnimationFrame(() => this.update());
    // this.renderer.render(this.scene, this.camera);
    this.starSystem.planets.forEach(planet => {
      planet.planetObj.rotation.z = Date.now() / planet.orbitalPeriod;
    })
    this.bloomComposer.render();
  }

}
