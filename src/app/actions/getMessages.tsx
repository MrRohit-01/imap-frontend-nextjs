import axios from "axios";

export default async function getMessages() {
   return await axios.get('/api/');
}