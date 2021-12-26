

import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

const ThirdPersonCamera = ({positionX=1,positionY=1,positionZ=1, moveNumX=0, moveNumZ=0}) => {
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
           

           camera.position.set(positionX+moveNumX-2,positionY+2,positionZ+moveNumZ-2)

            

           camera.lookAt(positionX+moveNumX,positionY,positionZ+moveNumZ)
      
         console.log("asasasqqqqq")
         return () => {
           controls.dispose();
          
         };
      },
      [camera, gl, moveNumX, moveNumZ]
   );
   return null;
};

export default ThirdPersonCamera;