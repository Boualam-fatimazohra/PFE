import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

export const login = async (credentials) => {
  try {
    console.log("Sending login request with credentials:", {
      email: credentials.email,
      hasPassword: !!credentials.password,
    });

    const response = await axios.post(`${API_BASE_URL}/signIn`, credentials, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Complete axios response:", response);

    if (!response.data) {
      throw new Error("Empty response from server");
    }

    const { role, user } = response.data;

    console.log("User object from response:", user);

    if (!role) {
      throw new Error("Role missing in response");
    }

    if (!user || typeof user !== "object" || Object.keys(user).length === 0) {
      throw new Error("User data missing or invalid in response");
    }

    // Vérification et stockage dans localStorage
    localStorage.setItem("nom", user.nom || "");
    localStorage.setItem("prenom", user.prenom || "");
    localStorage.setItem("userRole", role || "");

    console.log("Stored localStorage values:", {
      nom: localStorage.getItem("nom"),
      prenom: localStorage.getItem("prenom"),
      userRole: localStorage.getItem("userRole"),
    });

    return response.data;
  } catch (error) {
    console.error("Login API error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    throw error;
  }
};
