import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export function GenerativeArtScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<THREE.PointLight | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const accentHex =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#2563eb";

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.4, 4.8);
    camera.lookAt(0, 0.6, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const geos: THREE.BufferGeometry[] = [];
    const mats: THREE.Material[]       = [];

    const wireMat = new THREE.MeshBasicMaterial({
      color: accentHex, wireframe: true, transparent: true, opacity: 0.72,
    });
    const dimMat = new THREE.MeshBasicMaterial({
      color: accentHex, wireframe: true, transparent: true, opacity: 0.45,
    });
    mats.push(wireMat, dimMat);

    const group = new THREE.Group();
    group.position.y = -0.75;
    scene.add(group);

    // ── Helpers ──────────────────────────────────────────────────

    const add = (geo: THREE.BufferGeometry, mat: THREE.MeshBasicMaterial, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => {
      geos.push(geo);
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, rz);
      group.add(m);
      return m;
    };

    // Pipe: thin cylinder between two 3D points
    const pipe = (
      x1: number, y1: number, z1: number,
      x2: number, y2: number, z2: number,
      r = 0.038
    ) => {
      const dir = new THREE.Vector3(x2 - x1, y2 - y1, z2 - z1);
      const len = dir.length();
      const geo = new THREE.CylinderGeometry(r, r, len, 8);
      geos.push(geo);
      const m = new THREE.Mesh(geo, dimMat);
      m.position.set((x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      group.add(m);
    };

    // Storage tank: cylinder body + domed cap
    const tank = (x: number, r: number, h: number, base = 0.06): number => {
      // Cylinder body
      add(new THREE.CylinderGeometry(r, r, h, 18), wireMat, x, base + h / 2, 0);
      // Dome cap
      add(new THREE.SphereGeometry(r, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2),
          wireMat, x, base + h, 0);
      // Bottom plate ring
      add(new THREE.TorusGeometry(r, 0.018, 6, 18), dimMat, x, base, 0, Math.PI / 2);
      // Top nozzle
      pipe(x, base + h, 0, x, base + h + 0.22, 0, 0.03);
      return base + h; // top of body (not including dome)
    };

    // ── Base platform ─────────────────────────────────────────────
    add(new THREE.BoxGeometry(3.5, 0.07, 0.72), wireMat, 0, 0.035, 0);

    // ── Three main storage tanks ──────────────────────────────────
    const L = -0.95, C = 0, R = 0.95;
    const ltop = tank(L, 0.29, 1.32);
    const ctop = tank(C, 0.32, 1.62); // centre tallest
    const rtop = tank(R, 0.29, 1.32);

    // ── Top nozzle pipes from domes ───────────────────────────────
    const lNoz = ltop + 0.22;
    const cNoz = ctop + 0.22;
    const rNoz = rtop + 0.22;

    // Horizontal header at nozzle level
    pipe(L, lNoz, 0, R, lNoz, 0);

    // Risers from centre and right nozzles up to a higher header
    const topH = cNoz + 0.28;
    pipe(L, lNoz, 0, L, topH, 0);
    pipe(C, cNoz, 0, C, topH, 0);
    pipe(R, rNoz, 0, R, topH, 0);
    pipe(L, topH, 0, R, topH, 0);          // top header
    pipe(L, topH, 0, L, topH + 0.22, 0);   // vent left
    pipe(R, topH, 0, R, topH + 0.22, 0);   // vent right

    // Mid-level connecting ring
    const midH = 0.7;
    pipe(L, midH, 0, R, midH, 0);
    pipe(L, midH, 0, L - 0.32, midH, 0);   // branches left
    pipe(R, midH, 0, R + 0.32, midH, 0);   // branches right

    // ── Left heat exchanger unit ──────────────────────────────────
    const hxX = -1.68;
    add(new THREE.CylinderGeometry(0.18, 0.18, 0.62, 14), wireMat, hxX, 0.37, 0);
    add(new THREE.SphereGeometry(0.18, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        wireMat, hxX, 0.68, 0);
    add(new THREE.SphereGeometry(0.18, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        wireMat, hxX, 0.06, 0, Math.PI);

    // HX connecting pipes to left tank
    pipe(hxX + 0.18, 0.28, 0, L - 0.29, 0.28, 0);
    pipe(hxX + 0.18, 0.55, 0, L - 0.29, 0.55, 0);
    pipe(hxX, 0.68, 0, hxX, midH + 0.1, 0);
    pipe(hxX, midH + 0.1, 0, L, midH, 0);

    // ── Support lattice under HX ──────────────────────────────────
    pipe(hxX - 0.15, 0.06, 0, hxX - 0.15, 0.06, 0, 0.001); // anchor
    pipe(hxX - 0.2, 0.06, 0, hxX,       0.06, 0);
    pipe(hxX - 0.2, 0.06, 0, hxX - 0.1, 0.4,  0);
    pipe(hxX,       0.06, 0, hxX - 0.1, 0.4,  0);

    // ── Right outlet pipe to off-unit ─────────────────────────────
    pipe(R + 0.29, midH,      0, 1.45, midH,      0);
    pipe(1.45,     midH,      0, 1.45, 0.06,      0);
    pipe(1.3,      0.06,      0, 1.6,  0.06,      0);
    // small valve box on right
    add(new THREE.BoxGeometry(0.18, 0.18, 0.18), wireMat, 1.52, midH, 0);

    // ── Lighting ──────────────────────────────────────────────────
    const pointLight = new THREE.PointLight(0xffffff, 1.4, 100);
    pointLight.position.set(1, 2, 4);
    lightRef.current = pointLight;
    scene.add(pointLight);

    let frameId: number;
    const animate = (t: number) => {
      group.rotation.y += 0.0015;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x   = (e.clientX / window.innerWidth)  * 2 - 1;
      const y   = -(e.clientY / window.innerHeight) * 2 + 1;
      const vec = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const pos  = camera.position.clone().add(dir.multiplyScalar(dist));
      if (lightRef.current) lightRef.current.position.copy(pos);
    };

    window.addEventListener("resize",    handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize",    handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentMount.contains(renderer.domElement))
        currentMount.removeChild(renderer.domElement);
      geos.forEach(g => g.dispose());
      mats.forEach(m => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, opacity: 0.28 }}
    />
  );
}
