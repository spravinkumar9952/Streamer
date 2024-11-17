import { baseUrl, getHeaders } from "./common"


type ProfileResp = {
  email : string,
  userName : string
}

export const getProfile = async () => {
  try{
    const url = baseUrl + 'profile';
    fetch(url ?? "",{
      method : "GET",
      headers: getHeaders(),
    }).then(resp => resp.text())
    .then(resp => console.log(resp))
    .catch(err => console.log(err))

  }catch(err){
    console.error(err);
  }
}