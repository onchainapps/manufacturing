import ReactDOM from 'react-dom'
import React, { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useLoader, extend, useThree, ReactThreeFiber } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
extend({ OrbitControls })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>
    }
  }
};

interface Props {
    fileUrl: string;
    fileName: string;
    setLoading: any;
};

export const GLTFViewer:React.FC<Props> = ({fileUrl, fileName, setLoading}) => {
  const [ geometry, setGeometry ]: any = useState();
  const [ipfsLoadProgress, setIpfsLoadProgress ]: any = useState();

  const Controls = () => {
    let { camera, gl, invalidate } = useThree();
    const ref: any = useRef();
    useFrame(() => ref.current.update());// eslint-disable-next-line
    useEffect(() => void ref.current.addEventListener('change', invalidate), []);
    return <orbitControls ref={ref} enableDamping enableZoom autoRotate args={[camera, gl.domElement]} />
  };

  useEffect(() => {
    console.log(fileUrl);
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(fileUrl, geo => {
      setGeometry(geo);
      setLoading(false);
     // console.log(geo);
    },
    (xhr: any) => {
        // console.log((((xhr.loaded / xhr.total)*100).toFixed(2)));
        setIpfsLoadProgress(((xhr.loaded / xhr.total)*100).toFixed(2));
    },
    (error) => {
        console.log(error);
        setIpfsLoadProgress("Error");
    });// eslint-disable-next-line
  }, []);


  return (
    <>
    { geometry ? 
      <Canvas  style={{height: 570}} camera={{ position: [0, 0, 80], fov: 50 }}>
        <Controls />
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.8} position={[300, 300, 400]} />
        <primitive object={geometry.scene} position={[0, 0, 0]} /> 
      </Canvas>
      :
      <div>LOADING<br />{ipfsLoadProgress && ipfsLoadProgress } <br />Loading files from IPFS can sometimes take a moment.</div>
    }
    </>
  )
}