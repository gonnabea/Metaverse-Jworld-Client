

import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

const ThirdPersonCamera = ({positionX=1,positionY=1,positionZ=1, moveNumX=0, moveNumZ=0, prevPositionX, prevPositionZ}) => {
   const { camera, gl } = useThree();
   const [time, setTime] = useState(0)

   useEffect(
       () => {
           const controls = new OrbitControls(camera, gl.domElement);
           controls.minDistance = 5;
           controls.maxDistance = 5;
           

           camera.position.set(prevPositionX-2,positionY+2,prevPositionZ-2)

            

           camera.lookAt(prevPositionX,positionY,prevPositionZ)
      
      
         return () => {
           controls.dispose();
          
         };
      },
      [camera, gl, prevPositionX, prevPositionZ]
   );
   return null;
};

export default ThirdPersonCamera;