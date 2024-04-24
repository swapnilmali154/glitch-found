import axios from "axios";
import {
  API_URL,
  GET_ALL_ROLES,
  GET_ALL_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER_BY_ID,
  GET_USER_BY_ID,
} from "../constant/Constant";

const getAllRoles = async () => {
  try {
    const response = await axios.get(`${API_URL}${GET_ALL_ROLES}`);
    return response.data.data;
  } catch (error) {
    alert("API Error");
  }
};

const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}${GET_ALL_USERS}`);
    return response.data.data;
  } catch (error) {
    alert("API Error");
  }
};

const createUser = async (data) => {
  try {
    debugger
    const response = await axios.post(`${API_URL}${CREATE_USER}`, data);
    
    return response.data;
  } catch (error) {
    alert("API Error");
  }
};

const updateUser = async (data) => {
  try {
    const response = await axios.post(`${API_URL}${UPDATE_USER}`, data);
    return response.data;
  } catch (error) {
    alert("API Error");
  }
};

const deleteUserById = async (userId) => {
  try {
    
    const response = await axios.post(`${API_URL}${DELETE_USER_BY_ID}` + userId);
    
    return response.data;
  } catch (error) {
    alert("API Error");
  }
};

const getUserById = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}${GET_USER_BY_ID}` + userId);
    return response.data;
  } catch (error) {
    alert("API Error");
  }
};

export {
  getAllRoles,
  getAllUsers,
  createUser,
  updateUser,
  deleteUserById,
  getUserById,
};
