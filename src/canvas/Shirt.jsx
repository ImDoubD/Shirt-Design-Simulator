import React , { useRef }  from 'react'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei'
// import shirt_baked from ''
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


import state from '../store'

const Shirt = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    // const meshRef = useRef();
    const logoTexture = useTexture(snap.logoDecal);
    const fullTexture = useTexture(snap.fullDecal);

    useFrame((state, delta) => {
        easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);

        // meshRef.current.material.color = materials.lambert1.color;
        // meshRef.current.material.needsUpdate = true;

        // // Set aoMapIntensity to 0
        // materials.lambert1.aoMapIntensity=0;
    });

    const state_str = JSON.stringify(snap);

    return (
        <group
            key = {state_str}  //successfull rendering of shirt
        >
            <mesh
                // ref={meshRef}
                castShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={materials.lambert1}
                material-roughness={1}
                dispose={null}
            >
                {snap.isFullText && (
                    <Decal
                        position={[0,0,0]}
                        rotation={[0,0,0]}
                        scale={1}
                        map={fullTexture}
                    /> 
                )}
                {snap.isLogoText && (
                    <Decal
                        position={[0, 0.01, 0.17]}
                        rotation={[0,0,0]}
                        scale={0.22}
                        map={logoTexture}
                        anisotropy={16}
                        depthTest={false}
                        depthWrite={true}
                    /> 
                )}
            </mesh>
        </group>
    )
}

export default Shirt
