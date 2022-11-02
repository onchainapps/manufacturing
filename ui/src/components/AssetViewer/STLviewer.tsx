import React, { FC, useRef, useEffect, useState } from "react";// eslint-disable-next-line
import { Button } from '@material-ui/core/'; //tslint:disable-line
import { Canvas, extend, useFrame, useThree, ReactThreeFiber } from "@react-three/fiber";
import { BufferGeometry, PerspectiveCamera} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { HexColorPicker } from "react-colorful";
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
    stlName: string;
    setLoading: any;
    color: string;
};

export const STLViewer: FC<Props> = ({fileUrl, fileName, stlName, setLoading, color }) => {
  const [geometry, setGeometry] = useState<BufferGeometry>() 
  const [ipfsLoadProgress, setIpfsLoadProgress ]: any = useState();
  const [itemColor, setItemColor ] = useState(color);

  const Controls = () => {
    let { camera, gl, invalidate } = useThree();
    const ref: any = useRef();
    useFrame(() => ref.current.update());// eslint-disable-next-line
    useEffect(() => void ref.current.addEventListener('change', invalidate), []);
    return <orbitControls ref={ref} enableDamping enableZoom args={[camera, gl.domElement]} />
  };

  const stlLoader = () => {
    console.log(fileUrl);
    const stlLoader = new STLLoader();
    stlLoader.load(fileUrl, geo => {
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
  }

  useEffect(() => {
    stlLoader();
  }, []);

  return (
    <>
      {
        geometry ?
        <div style={{textAlign: "center"}}>
          <div>
            {stlName}
          </div>
          <div>
            <Canvas style={{height: 570}} camera={{ position: [0, 0, 400], fov: 50 }}>
              <Controls />
              <ambientLight intensity={.5} />
              <spotLight position={[0, 0, 400]} angle={0.45} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <mesh geometry={geometry}>
                <meshStandardMaterial color={itemColor}/>
              </mesh>
            </Canvas>
          </div>
          <div>
            <HexColorPicker color={itemColor} onChange={setItemColor} />
            <Button
              href={fileUrl+"?filename="+stlName+".stl"}
            >
              Download STL
            </Button>
          </div>
        </div>
        : 
        <div>LOADING: {stlName}<br />{ipfsLoadProgress && ipfsLoadProgress } <br />Loading files from IPFS can sometimes take a moment.(You might want to grab a drink)</div>
      }
    </>
  )
}