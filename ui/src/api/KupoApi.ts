export const KupoAPI = async ( uri: string ) => {
  const kupoURI =
  sessionStorage.getItem("kupoURI") == null ?
    window.location.protocol == "http:" ? 
    `http://kupotest.bakon.dev/v1/${uri}`
    :
    `https://kupotest.bakon.dev/v1/${uri}`
    :
    window.location.protocol == "http:" ? 
    `http://${sessionStorage.getItem("kupoURI")}:${sessionStorage.getItem("kupoPort")}/v1/${uri}`
    :
    `https://${sessionStorage.getItem("kupoURI")}:${sessionStorage.getItem("kupoPort")}/v1/${uri}`
    ;

  let settings:any = {};
  settings = {
    method: "GET",
    headers: {}
  };
  try {
    const fetchResponse: any = await fetch(kupoURI, settings);
    const data: any = await fetchResponse.json();
    // console.log(data);
    return(data);
  } catch (e) {
    console.log(e);
    return e;
  };

};

const checkKupoHealth = async () => {
  try{
    const kupoHealthRes = await KupoAPI("health");
    console.log("Kupo health", kupoHealthRes);
    sessionStorage.setItem("kupoHealth", kupoHealthRes.connection_status);
  }catch( error ){
    console.log("Kupo health error", error);
    sessionStorage.setItem("kupoHealth", "ERROR!!")
  };
};

checkKupoHealth();