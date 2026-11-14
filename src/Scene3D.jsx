import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene3D() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    el.appendChild(renderer.domElement);

    const wire = (geo, opacity, color = 0xffffff) =>
      new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
      );

    const group = new THREE.Group();
    const outer = wire(new THREE.IcosahedronGeometry(3, 1), 0.35, 0x7c5cff);
    const inner = wire(new THREE.IcosahedronGeometry(1.5, 0), 0.9, 0x00e5ff);
    const ring1 = wire(new THREE.TorusGeometry(4.3, 0.015, 8, 160), 0.8, 0x00ec97);
    const ring2 = wire(new THREE.TorusGeometry(5.2, 0.015, 8, 160), 0.6, 0xff4d8d);
    ring1.rotation.x = Math.PI / 2.4;
    ring2.rotation.y = Math.PI / 3;
    group.add(outer, inner, ring1, ring2);
    scene.add(group);

    const N = 1400;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 6 + Math.random() * 18;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      pg,
      new THREE.PointsMaterial({ color: 0x9fe8ff, size: 0.05, transparent: true, opacity: 0.8 })
    );
    scene.add(stars);

    const place = () => { group.position.x = innerWidth > 900 ? 4.2 : 0; };
    place();

    let mx = 0, my = 0, t = 0, raf;

    const onMove = (e) => {
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
      document.querySelectorAll(".card").forEach((c) => {
        const r = c.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (inside) {
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = "perspective(900px) rotateY(" + x * 9 + "deg) rotateX(" + -y * 9 + "deg) translateZ(8px)";
        } else {
          c.style.transform = "";
        }
      });
    };

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      place();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const loop = () => {
      t += 0.01;
      outer.rotation.y += 0.004;
      outer.rotation.x += 0.002;
      inner.rotation.y -= 0.01;
      inner.rotation.z += 0.006;
      ring1.rotation.z += 0.005;
      ring2.rotation.x += 0.003;
      stars.rotation.y += 0.0007;
      const s = 1 + Math.sin(t * 2) * 0.04;
      inner.scale.set(s, s, s);
      group.rotation.y += (mx * 0.8 - group.rotation.y) * 0.03;
      group.rotation.x += (my * 0.6 - group.rotation.x) * 0.03;
      camera.position.x += (mx * 1.6 - camera.position.x) * 0.04;
      camera.position.y += (-my * 1.1 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }} />;
}

