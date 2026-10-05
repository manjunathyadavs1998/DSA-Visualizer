import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Ambient 3D background: a slow-breathing particle grid with pointer parallax.
 * Pure atmosphere — sits behind every panel at very low opacity.
 */
export default function ThreeBackground({ theme }: { theme: 'dark' | 'light' }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isLight = theme === 'light';
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isLight ? 0xedf1f8 : 0x111726, 0.028);
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 4.5, 11);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // particle grid
    const COLS = 90;
    const ROWS = 46;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    let k = 0;
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        positions[k++] = (i - COLS / 2) * 0.55;
        positions[k++] = 0;
        positions[k++] = (j - ROWS / 2) * 0.55;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: isLight ? 0x0891b2 : 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: isLight ? 0.35 : 0.4,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const onMouse = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMouse);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const animate = () => {
      const t = clock.getElapsedTime();
      for (let i = 0; i < count; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        posAttr.setY(i, Math.sin(x * 0.55 + t * 0.7) * 0.28 + Math.cos(z * 0.5 + t * 0.5) * 0.22);
      }
      posAttr.needsUpdate = true;
      camera.position.x += (mouse.x * 1.6 - camera.position.x) * 0.03;
      camera.position.y += (4.5 - mouse.y * 0.9 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMouse);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [theme]);

  return <div ref={mountRef} className="pointer-events-none fixed inset-0 -z-10 opacity-40" />;
}
