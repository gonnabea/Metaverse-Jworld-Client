import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGraph, useLoader, useThree } from '@react-three/fiber';
import { modelList } from '../../../data/modelList';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addModel } from '../../../stores/ThreeModels';
import { ThreeModelOpts, XYZType } from '../../../types/common';


import {clone} from "../../../config/skeletonUtils";




const Carpet1Model = ({installed, scale, isFocused, rotateY, position, setPosition}:ThreeModelOpts) => {

    const [graphNodes, setGraphNodes] = useState();

    const createModelStatus = async () => {
        const modelStatus = {
          name: "carpet1",
          position,
          installed,
          scale: {x: scale, y: scale, z: scale},
          rotateY
        }
        addModel(modelStatus)
      }
    
      console.log(clone)
      const raycaster = useThree((state) => state.raycaster);
      const scene = useThree((state) => state.scene)
      const gltf = useLoader(GLTFLoader, modelList.carpet_1);
      const cloned = useMemo(() => clone(gltf.scene), [scene])
      console.log(cloned)
      const graph = useGraph(cloned)
      const installModel = (e) => {
        
        // 마우스 클릭한 지점 위치 얻기
      const closedObjPosition = raycaster.intersectObjects(scene.children)[0]?.point
      
      // 모델 설치
      if(closedObjPosition && isFocused === true && e.target.tagName === "CANVAS"){
        console.log("카페트 포커싱 상태");
        setPosition(position => position = {x: closedObjPosition.x, y: 0, z: closedObjPosition.z});
      }
    };
    
    
    
    
    useEffect(() => {
      console.log(graph.nodes)
      setGraphNodes(graph.nodes)
      window.addEventListener("click", installModel);
      createModelStatus()
        return () => window.removeEventListener("click", installModel);
    }, [
        isFocused, 
        installed,
        scale,
        rotateY,
        position
    ])

    if(installed === true){

        return (
            <>
            <primitive 
                onClick={() => console.log("카페트1 클릭됨")} 
                position={[position.x, position.y, position.z]} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={cloned} 
            />
            <primitive 
                onClick={() => console.log("카페트1 클릭됨")} 
                position={[position.x-0.5, position.y, position.z-0.5]} 
                scale={scale} 
                rotation={[0, rotateY, 0]}
                object={gltf.scene} 
            />
            

          </>
        )
    }
    else{
        return <></>
    }
  }

export default Carpet1Model;