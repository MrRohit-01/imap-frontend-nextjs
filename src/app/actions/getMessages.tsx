import axios from "axios";

export default async function getMessages():Promise<[]> {
   try{
  const res = await axios.get('/api/');

  return res.data;
   }catch(e){
      console.log(e);
      return [];
   }
}
