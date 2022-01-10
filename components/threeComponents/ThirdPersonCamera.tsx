

import React, { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

const ThirdPersonCamera = ({positionX, positionY, positionZ, rotationZ}) => {
   const { camera, gl } = useThree();
   const [time, setTime] = useState(0)



   useEffect(
       () => {

           const controls = new OrbitControls(camera, gl.domElement);
           controls.minDistance = 5;
           controls.maxDistance = 5;
           

           camera.position.set(positionX-2,positionY+2,positionZ-2)
           camera.rotateZ = rotationZ
            

           camera.lookAt(positionX+3,positionY,positionZ+3)
      
      
         return () => {
           controls.dispose();
          
         };
      },
      [positionX, positionZ]
   );
   return null;
};

export default ThirdPersonCamera;