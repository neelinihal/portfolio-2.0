import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Declare global THREE from CDN
declare const THREE: any;

@Component({
  selector: 'app-three-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas #canvas class="three-canvas" aria-hidden="true"></canvas>
    <div class="nebula-bg" aria-hidden="true"></div>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      display: block;
    }
    .three-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.7;
    }
    .nebula-bg {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 120% 80% at 15% 20%,
          rgba(45, 212, 191, 0.09) 0%, transparent 60%),
        radial-gradient(ellipse 80% 60% at 85% 80%,
          rgba(249, 115, 22, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 50% 50%,
          rgba(13, 118, 110, 0.08) 0%, transparent 70%),
        #0d0c0b;
    }

    @media (max-width: 767px) {
      .three-canvas { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      :host { display: none; }
    }
  `],
})
export class ThreeBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private renderer: any;
  private scene: any;
  private camera: any;
  private particles: any;
  private animFrameId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private scrollY = 0;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    this.initThree();
    this.bindEvents();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x000000, 0);

    // Scene + Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    this.camera.position.z = 5;

    // Particles — 3000 points using BufferGeometry
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const teal  = new THREE.Color('#2dd4bf');
    const white = new THREE.Color('#e8e6e3');
    const gold  = new THREE.Color('#d4a853');

    for (let i = 0; i < count; i++) {
      // Random in sphere radius 5
      const r = 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Color distribution: 60% teal, 30% warm white, 10% gold
      const rnd = Math.random();
      const col = rnd < 0.6 ? teal : rnd < 0.9 ? white : gold;
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.animate();
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    // Slow constant rotation
    this.particles.rotation.y += 0.0003;
    this.particles.rotation.x += 0.0001;

    // Mouse parallax — lerp toward target
    this.targetX = this.mouseX * 0.0005;
    this.targetY = this.mouseY * 0.0005;
    this.particles.rotation.y += (this.targetX - this.particles.rotation.y) * 0.02;
    this.particles.rotation.x += (this.targetY - this.particles.rotation.x) * 0.02;

    // Scroll drift — particles move upward
    this.particles.position.y = this.scrollY * 0.0008;

    this.renderer.render(this.scene, this.camera);
  }

  private bindEvents(): void {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX - window.innerWidth / 2;
    this.mouseY = e.clientY - window.innerHeight / 2;
  };

  private onScroll = (): void => {
    this.scrollY = window.scrollY;
  };

  private onResize = (): void => {
    if (!this.renderer) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  ngOnDestroy(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    this.renderer?.dispose();
  }
}
