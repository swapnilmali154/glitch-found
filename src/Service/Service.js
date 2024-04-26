import axios from "axios";
const url = "https://onlinetestapi.gerasim.in/api/Glitch/";

const getData = async (endpoint) => {
    try {
      
        const result = await axios.get(`${url}${endpoint}`);
        return result.data.data;
    } catch (error) {
        alert(error);
    }

}
const getDataById = async (endpoint) => {
    
    try {
        const result = await axios.get(`${url}${endpoint}`);
        return result.data.data;
    } catch (error) {
        alert(error);
    }

}
const postData = async (endpoint, obj) => {
    try {
        const result = await axios.post(`${url}${endpoint}`, obj);
        return result.data;
    } catch (error) {
        alert(error);
    }
}

const deleteData = async (endpoint, id) => {
    
    try {
        
        const result = await axios.get(`${url}${endpoint}${id}`);
        return result.data;
    } catch (error) {
        alert(error);
    }
}

export { getData, postData, deleteData,getDataById }