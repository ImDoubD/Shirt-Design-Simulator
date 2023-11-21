import { proxy } from "valtio";
// import * as THREE from 'three'

const state = proxy({
    intro: true,
    color: '#FF0000',
    isLogoText: true,
    isFullText: false,
    logoDecal: './threejs.png',
    fullDecal: './threejs.png',
    // position: new THREE.Vector3(),
    // rotation: new THREE.Euler(),
    // scale: new THREE.Vector3(1, 1, 1),
})

export default state