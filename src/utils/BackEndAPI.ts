const BASE_URL = "https://localhost:7212/api";

export const API_URL = {
    AUTH:{
        Login: `${BASE_URL}/User/user-login`,
        Register: `${BASE_URL}/User/user-register`,
    },
    PLACE:{
        GetAll: `${BASE_URL}/Place/get-place`,
        GetDetail: (id: string) => `${BASE_URL}/Place/get-place/${id}`,
    },
}