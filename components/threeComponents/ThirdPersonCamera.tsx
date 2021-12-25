

import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

const ThirdPersonCamera = ({positionX=1,positionY=1,positionZ=1, move}) => {
   const { camera, gl } = useThree();
   const [time, setTime] = useState(0)
   useFrame(() => {
    setTime(time+1)
   })
   
   useEffect(
       () => {
           const controls = new OrbitControls(camera, gl.domElement);
           controls.minDistance = 10;
           controls.maxDistance = 10;
           

        
           camera.position.set(positionX-2,positionY+3,positionZ-2)


           camera.lookAt(positionX,positionY+2,positionZ)
      
         console.log("asasasqqqqq")
         return () => {
           controls.dispose();
          
         };
      },
      [camera, gl, time]
   );
   return null;
};

export default ThirdPersonCamera;