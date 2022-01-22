import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const OrbitCameraController = () => {
   const { camera, gl } = useThree();
   useEffect(
      () => {
         const controls = new OrbitControls(camera, gl.domElement);
         camera.position.set(20,20,20)
         camera.lookAt(0,0,0)
      
   
         controls.minDistance = 2;
         controls.maxDistance = 40;
         
         return () => {
           controls.dispose();
         };
      },
      [camera, gl]
   );
   return null;
};

export default OrbitCameraController;