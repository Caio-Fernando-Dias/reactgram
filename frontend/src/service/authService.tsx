import { api, requestConfig } from "../utils/config";

// Register an user
const register = async (data: any) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err: any) => err);

    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error as Error);
  }
};

// Logout an user
const logout = () => {
  localStorage.removeItem("user");
};

// Sign an user
const login = async (data: any) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/users/login", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res._id) {
      localStorage.setItem("user", JSON.stringify(res));
    }

    return res;
  } catch (error) {
    console.log(error as Error);
  }
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
