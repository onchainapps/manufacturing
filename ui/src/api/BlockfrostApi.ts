export const blockfrostApi = async ( uri: string, method: string, content: any ) => {
  console.log(JSON.stringify(content));
  let settings:any = {};
  const blockfrostApi: any = "testnetemH1u78at8jVJ0mFj3RnJUsradmzB56d"

  let tx = Buffer.from(content, 'hex');

  method == "POST" ?
  settings = {
    method: method,
    body: tx,
    headers: {
      "project_id": blockfrostApi,
      "Content-Type": "application/cbor",
    }
  }
  :
  settings = {
    method: method,
    headers: {
      "project_id": blockfrostApi,
    }
  };
  try {
    const fetchResponse: any = await fetch(uri, settings);
    const data: any = await fetchResponse.json();
    // console.log(data);
    return(data);
  } catch (e) {
    console.log(e);
    return e;
  }; 
};