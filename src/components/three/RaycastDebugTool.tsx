'use client';

import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * HERRAMIENTA DE DEPURACIÓN DE ANCLAJES (?debug)
 * Excluida o inactiva a menos que se invoque explícitamente con el parámetro URL ?debug.
 * Permite hacer clic sobre la arcada 3D para calcular las coordenadas locales exactas
 * y la normal de superficie, copiando el JSON resultante directamente al portapapeles.
 */
export function RaycastDebugTool() {
  const { gl, camera, scene } = useThree();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debugMarkerRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isDebugActive = window.location.search.includes('debug');
    if (!isDebugActive) return;

    // Crear marcador visual temporal
    const markerGeo = new THREE.SphereGeometry(0.015, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0xff3366, wireframe: true });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.visible = false;
    scene.add(marker);
    debugMarkerRef.current = marker;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const performRaycast = (clientX: number, clientY: number) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Buscar mallas de dientes o alineador
      const meshes: THREE.Mesh[] = [];
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh && obj.visible && obj !== marker) {
          meshes.push(obj as THREE.Mesh);
        }
      });

      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const worldPos = hit.point;
        const faceNormal = hit.face ? hit.face.normal.clone() : new THREE.Vector3(0, 1, 0);

        // Determinar si pertenece a la arcada superior o inferior
        let targetMesh: 'upper' | 'lower' = 'upper';
        let currentObj: THREE.Object3D | null = hit.object;
        while (currentObj) {
          if (currentObj.name.toLowerCase().includes('lower')) {
            targetMesh = 'lower';
            break;
          }
          currentObj = currentObj.parent;
        }

        // Obtener coordenadas locales relativas al objeto intersectado
        const localPos = worldPos.clone().applyMatrix4(hit.object.matrixWorld.clone().invert());
        const localNormal = faceNormal.clone().normalize();

        const anchorData = {
          mesh: targetMesh,
          localPosition: [
            Math.round(localPos.x * 1000) / 1000,
            Math.round(localPos.y * 1000) / 1000,
            Math.round(localPos.z * 1000) / 1000,
          ],
          normal: [
            Math.round(localNormal.x * 1000) / 1000,
            Math.round(localNormal.y * 1000) / 1000,
            Math.round(localNormal.z * 1000) / 1000,
          ],
        };

        const jsonStr = JSON.stringify(anchorData, null, 2);
        console.info('📍 [Debug Raycast Anchor]:\n', jsonStr);

        if (typeof window !== 'undefined') {
          (window as unknown as { __lastRaycastAnchor?: unknown }).__lastRaycastAnchor = anchorData;
        }

        if (navigator.clipboard) {
          navigator.clipboard.writeText(jsonStr).catch(() => {});
        }

        // Actualizar marcador visual
        marker.position.copy(worldPos);
        marker.visible = true;

        setToastMessage(`Anclaje ${targetMesh.toUpperCase()} copiado: [${anchorData.localPosition.join(', ')}]`);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setToastMessage(null);
        }, 3500);

        return anchorData;
      }
      return null;
    };

    const showToast = (msg: string) => {
      if (typeof document === 'undefined') return;
      let el = document.getElementById('cala-raycast-toast');
      if (!el) {
        el = document.createElement('div');
        el.id = 'cala-raycast-toast';
        el.className =
          'fixed top-20 left-1/2 -translate-x-1/2 z-[10000] bg-[#1A1816] text-[#F8F6F1] text-xs px-4 py-2 rounded shadow-xl border border-[#2D6A4F] flex items-center space-x-2 pointer-events-none transition-opacity duration-300';
        document.body.appendChild(el);
      }
      el.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping"></span><span>${msg}</span>`;
      el.style.opacity = '1';
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        if (el) el.style.opacity = '0';
      }, 3500);
    };

    const handleClick = (e: MouseEvent) => {
      const hit = performRaycast(e.clientX, e.clientY);
      if (hit) {
        showToast(`Anclaje ${hit.mesh.toUpperCase()} copiado: [${hit.localPosition.join(', ')}]`);
      }
    };

    if (typeof window !== 'undefined') {
      (window as unknown as { __raycastAtScreen?: (x: number, y: number) => unknown }).__raycastAtScreen = performRaycast;
    }

    const domEl = gl.domElement;
    domEl.style.pointerEvents = 'auto'; // Permitir clicks durante depuración
    const parent = domEl.parentElement;
    const originalParentPointerEvents = parent ? parent.style.pointerEvents : '';
    if (parent) {
      parent.style.pointerEvents = 'auto';
    }
    domEl.addEventListener('click', handleClick);

    return () => {
      domEl.removeEventListener('click', handleClick);
      if (parent) {
        parent.style.pointerEvents = originalParentPointerEvents;
      }
      if (debugMarkerRef.current) {
        scene.remove(debugMarkerRef.current);
      }
    };
  }, [gl, camera, scene]);

  return null;
}

