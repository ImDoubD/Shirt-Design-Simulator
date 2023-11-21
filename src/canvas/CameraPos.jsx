import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useSnapshot } from 'valtio'
import * as THREE from 'three'

import state from '../store'


const CameraPos = ({ children }) => {
    // const group = React.useRef<THREE.Mesh>(!null);
    const group = useRef();
    const snap = useSnapshot(state);

    
    useFrame((state , delta) => {
        const isBreakpoint = window.innerWidth <= 1260;
        const isMobile = window.innerWidth <= 600;



        //setting initial posisition of the model
        let targetPos = [-0.4, 0 , 2];
        if(snap.intro){
            if(isBreakpoint) targetPos = [0, 0.2, 2.5];
            if(isMobile) targetPos = [0 , 0.2, 2.5];
        }
        else{
            if(isMobile) targetPos = [0 ,0 ,2.5];
            else targetPos = [0 ,0 ,2];
        }
    
        //setting model camera position
        easing.damp3(state.camera.position, targetPos, 0.25, delta)


        //smooth model rotation
        easing.dampE(
            group.current.rotation,
            [state.pointer.y / 10 , -state.pointer.x / 5 , 0],
            0.25,
            delta
            ) 
    })

    return (
        <group ref={group}>
        {children}
        </group>
    )
}

export default CameraPos
