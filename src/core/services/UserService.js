import axios from 'axios';
import { API_URL } from '../constant/Constant';

const getAllRoles = async () => {
    try {
        const url =  API_URL + GET_ALL_ROLES;  
        const result = await axios.get(url);
        return result.data.data;
    } catch (error) {
        //error
    }
   
}

export {getAllRoles}