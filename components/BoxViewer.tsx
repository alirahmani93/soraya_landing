"use client";

import { useEffect, useRef, useState } from "react";
import type * as Three from "three";

/** The drawer box as a real 3D object on a turntable.
 *
 *  It only ever spins about its own vertical axis: the camera sits at a fixed
 *  elevation and dragging changes yaw and nothing else, so there is no angle where
 *  the box tips onto an edge or looks skewed. The field of view is narrow (24°) and
 *  the camera far back — near-orthographic — because a wide lens makes a cube read as
 *  bent while it turns.
 *
 *  three.js and the model are imported only once the section is near the viewport, and
 *  the render loop stops whenever it scrolls out. */

const FOV = 24;
const ELEVATION = 0.36;
const SPIN = 0.3;

function fontStack(name: string, fallback: string) {
  const value = getComputedStyle(document.body).getPropertyValue(name).trim();
  return value || fallback;
}

export default function BoxViewer({ label, hint }: { label: string; hint: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let teardown: (() => void) | null = null;

    const start = async () => {
      const [THREE, { buildSorayaBox, loadBoxFonts, studioEnvironment }] = await Promise.all([
        import("three"),
        import("@/lib/boxModel"),
      ]);
      if (cancelled) return;

      const fonts = {
        display: fontStack("--font-fraunces", "Georgia"),
        arabic: fontStack("--font-aref", "Georgia"),
        body: fontStack("--font-tajawal", "system-ui"),
      };
      await loadBoxFonts(fonts);
      if (cancelled) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.touchAction = "pan-y";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.environment = studioEnvironment(renderer);
      scene.environmentIntensity = 0.55;

      scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 0.35));
      const key = new THREE.DirectionalLight(0xffffff, 1.7);
      key.position.set(0.42, 0.62, 0.5);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.radius = 5;
      key.shadow.bias = -0.0004;
      key.shadow.camera.near = 0.05;
      key.shadow.camera.far = 3;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xfff1de, 0.6);
      rim.position.set(-0.5, 0.35, -0.45);
      scene.add(rim);

      const model = buildSorayaBox(fonts);
      const bounds = new THREE.Box3().setFromObject(model);
      const centre = bounds.getCenter(new THREE.Vector3());
      // Spin about the contents' own vertical axis — the open drawers push the box
      // off-centre in z, and turning around the group origin would make it wobble.
      model.position.x -= centre.x;
      model.position.z -= centre.z;

      const turntable = new THREE.Group();
      turntable.add(model);
      scene.add(turntable);

      const radius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4),
        new THREE.ShadowMaterial({ opacity: 0.22 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = bounds.min.y;
      ground.receiveShadow = true;
      scene.add(ground);

      const span = radius * 1.6;
      key.shadow.camera.left = -span;
      key.shadow.camera.right = span;
      key.shadow.camera.top = span;
      key.shadow.camera.bottom = -span;
      key.shadow.camera.updateProjectionMatrix();

      const target = new THREE.Vector3(0, centre.y, 0);
      const base = (radius / Math.tan((FOV * Math.PI) / 360)) * 0.92;
      const camera = new THREE.PerspectiveCamera(FOV, 1, base / 100, base * 100);

      const fit = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Narrow viewport: pull back rather than widen the lens — a wider lens is
        // exactly what makes the cube look bent as it turns.
        const distance = base / Math.min(1, camera.aspect);
        camera.position.set(
          0,
          target.y + distance * Math.sin(ELEVATION),
          distance * Math.cos(ELEVATION),
        );
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      };
      fit();
      const resize = new ResizeObserver(fit);
      resize.observe(host);

      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let yaw = -0.5;
      let last = performance.now();
      let dragging = false;
      let pointer = 0;

      const draw = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (!dragging && !still) yaw += SPIN * dt;
        turntable.rotation.y = yaw;
        renderer.render(scene, camera);
      };

      const onDown = (e: PointerEvent) => {
        dragging = true;
        pointer = e.clientX;
        renderer.domElement.setPointerCapture(e.pointerId);
        renderer.domElement.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        yaw += ((e.clientX - pointer) / (host.clientWidth || 1)) * Math.PI * 2;
        pointer = e.clientX;
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        last = performance.now();
        if (renderer.domElement.hasPointerCapture(e.pointerId)) {
          renderer.domElement.releasePointerCapture(e.pointerId);
        }
        renderer.domElement.style.cursor = "grab";
      };
      renderer.domElement.style.cursor = "grab";
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerup", onUp);
      renderer.domElement.addEventListener("pointercancel", onUp);

      let running = false;
      const setRunning = (on: boolean) => {
        if (on === running) return;
        running = on;
        last = performance.now();
        renderer.setAnimationLoop(on ? draw : null);
        if (!on) draw();
      };
      const visibility = new IntersectionObserver(
        ([entry]) => setRunning(entry.isIntersecting && !document.hidden),
        { rootMargin: "100px" },
      );
      visibility.observe(host);
      const onVisibilityChange = () => setRunning(!document.hidden && running);
      document.addEventListener("visibilitychange", onVisibilityChange);

      draw();
      setReady(true);

      teardown = () => {
        visibility.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        renderer.setAnimationLoop(null);
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("pointercancel", onUp);
        scene.traverse((o) => {
          const mesh = o as Three.Mesh;
          if (!mesh.isMesh) return;
          mesh.geometry.dispose();
          const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (const m of list) {
            for (const value of Object.values(m)) {
              const texture = value as Three.Texture | null;
              if (texture?.isTexture) texture.dispose();
            }
            m.dispose();
          }
        });
        scene.environment?.dispose();
        renderer.domElement.remove();
        renderer.dispose();
      };
    };

    // Build only when the section is close — three.js and the canvas textures are the
    // heaviest thing on the page and most visitors never scroll this far.
    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trigger.disconnect();
        start();
      },
      { rootMargin: "600px" },
    );
    trigger.observe(host);

    return () => {
      cancelled = true;
      trigger.disconnect();
      teardown?.();
    };
  }, []);

  return (
    <div className="relative pb-8">
      <div
        ref={hostRef}
        role="img"
        aria-label={label}
        className="h-[58vh] min-h-[320px] w-full sm:h-[68vh]"
      />
      <p
        className={`pointer-events-none absolute inset-x-0 bottom-0 text-center text-xs uppercase tracking-[0.2em] text-ink/35 transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}
