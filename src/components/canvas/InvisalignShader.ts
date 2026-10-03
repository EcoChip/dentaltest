import * as THREE from 'three';

export function createInvisalignShaderMaterial() {
  const uniforms = {
    uBaseColor: { value: new THREE.Color('#F2F9FB') },     // Plástico casi incoloro, cristalino
    uFresnelColor: { value: new THREE.Color('#FFFFFF') },  // Blanco diamante en los bordes
    uDeepColor: { value: new THREE.Color('#98BAC6') },     // Matiz claro de poliuretano suave
    uFresnelPower: { value: 2.8 },
    uOpacity: { value: 0.65 },
    uLightPos1: { value: new THREE.Vector3(3.0, 5.0, 5.0) },
    uLightPos2: { value: new THREE.Vector3(-3.0, -1.0, 3.5) },
  };

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uBaseColor;
    uniform vec3 uFresnelColor;
    uniform vec3 uDeepColor;
    uniform float uFresnelPower;
    uniform float uOpacity;
    uniform vec3 uLightPos1;
    uniform vec3 uLightPos2;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Efecto Fresnel para bordes de cristal óptico
      float fresnel = dot(normal, viewDir);
      fresnel = clamp(1.0 - abs(fresnel), 0.0, 1.0);
      float fresnelFactor = pow(fresnel, uFresnelPower);

      // Micro-estrías de termoformado SmartTrack®
      float striation = sin(vWorldPosition.y * 120.0) * 0.035;
      striation += sin((vWorldPosition.x + vWorldPosition.z) * 60.0) * 0.015;

      // Destello especular de luz superior (cúspides)
      vec3 lightDir1 = normalize(uLightPos1 - vWorldPosition);
      vec3 halfDir1 = normalize(lightDir1 + viewDir);
      float spec1 = pow(max(dot(normal, halfDir1), 0.0), 38.0);

      // Destello especular secundario
      vec3 lightDir2 = normalize(uLightPos2 - vWorldPosition);
      vec3 halfDir2 = normalize(lightDir2 + viewDir);
      float spec2 = pow(max(dot(normal, halfDir2), 0.0), 20.0);

      // Mezcla cromática biomimética
      vec3 color = mix(uDeepColor, uBaseColor, fresnel * 0.85 + 0.15);
      color = mix(color, uFresnelColor, fresnelFactor);
      
      // Aplicación de estrías y destellos
      color += vec3(striation);
      color += uFresnelColor * (spec1 * 0.9 + spec2 * 0.45);

      // Transparencia física con densidad en ángulos tangentes
      float alpha = clamp(uOpacity * (0.15 + fresnelFactor * 0.65 + spec1 * 0.3), 0.05, 0.85);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}
