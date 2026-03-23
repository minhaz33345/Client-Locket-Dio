import { BETA_SERVER_HOST } from "@/config/apiConfig";
import { instanceAuth } from "@/lib/axios.auth";
import api from "@/lib/axios";
import { instanceMain } from "@/lib/axios.main";

// ============================================================
// LOGIN
// ============================================================

// Bỏ ValidateEmailAddress — gọi thẳng Locket server từ browser
// dễ bị CORS/block trên production, self-hosted API tự xử lý qua Firebase
export const loginWithEmail = async ({ email, password }) => {
  try {
    const res = await instanceAuth.post("locket/login", { email, password });

    if (res.data?.success === false) {
      const err = new Error(res.data.message || "Đăng nhập thất bại");
      err.status = res.data.status || 400;
      throw err;
    }

    // Self-hosted: { data: {idToken,...}, success:true } → unwrap
    return res.data?.data || res.data;
  } catch (error) {
    if (error.response) {
      const err = new Error(
        error.response.data?.message || "Đăng nhập thất bại, vui lòng thử lại"
      );
      err.status = error.response.status;
      throw err;
    }
    if (error instanceof Error) throw error;
    throw new Error("Có sự cố khi kết nối đến hệ thống");
  }
};

export const loginWithPhone = async ({ phone, password, captchaToken }) => {
  try {
    const res = await instanceAuth.post("locket/loginWithPhoneV2", {
      phone,
      password,
      captchaToken,
    });
    if (res.data?.success === false) return null;
    // Self-hosted: { data: {idToken,...}, success:true } → unwrap
    return res.data?.data || res.data;
  } catch (error) {
    if (error.response?.data?.error) throw error.response.data.error;
    throw new Error(
      "Có sự cố khi kết nối đến hệ thống, vui lòng thử lại sau ít phút."
    );
  }
};

// ============================================================
// REFRESH TOKEN
// ============================================================
export const refreshIdTokenV2 = async () => {
  try {
    const res = await instanceAuth.post("locket/refresh-token");
    if (res.data?.success === false) return null;
    return res.data.idToken;
  } catch (error) {
    if (error.response?.data?.error) throw error.response.data.error;
    throw new Error("Có sự cố khi kết nối đến hệ thống.");
  }
};

export const refreshIdToken = async (refreshToken) => {
  try {
    const res = await instanceAuth.post(
      "locket/refresh-token",
      { refreshToken },
      { withCredentials: true }
    );
    return res.data.idToken;
  } catch (error) {
    if (error.response?.data?.error) throw error.response.data.error;
    throw new Error("Có sự cố khi kết nối đến hệ thống.");
  }
};

// ============================================================
// FORGOT PASSWORD
// ============================================================
export const forgotPassword = async (email) => {
  try {
    const res = await instanceMain.post(
      `${BETA_SERVER_HOST}/locket/resetPassword`,
      { email }
    );
    // Self-hosted: { data: {idToken,...}, success:true } → unwrap
    return res.data?.data || res.data;
  } catch (error) {
    if (error.response?.data?.error) throw error.response.data.error;
    throw new Error("Có sự cố khi kết nối đến hệ thống.");
  }
};

// ============================================================
// LOGOUT
// ============================================================
export const logout = async () => {
  try {
    const response = await instanceAuth.get("locket/logout", {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ============================================================
// GET USER DATA
// ============================================================
export const GetUserData = async () => {
  try {
    const res = await api.get("/api/me");
    return res.data?.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const GetUserDataV2 = async () => {
  try {
    const res = await api.get("/api/po");
    return res.data?.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const GetUserLocket = async () => {
  try {
    const res = await api.post("/locket/getInfoUser");
    return res.data?.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
