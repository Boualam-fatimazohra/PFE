import axios from "axios";

   const API_BASE_URL = 'http://localhost:5000/api/auth';

   export const login = async (credentials) => {
   try {
   const response = await axios.post(`${API_BASE_URL}/signIn`, credentials, { withCredentials: true });
   if (response.data) {
   return response.data;
   } else {
   throw new Error("Empty response from server");
   }
   } catch (error) {
   console.error("Login API error:", error);
   throw error;
   }
   };

   export const logout = async () => {
   try {
   const response = await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true });
   return response.data;
   } catch (error) {
   throw error;
   }
   };
