export const getToken = () => {
    if(typeof window !== "undefined"){
        return localStorage.getItem("token");
    }
    return null;
}

export const isLoggedIn = () => {
    const token = getToken();
    return token !== null;
}

export const getUserRole = () => {
    const token = getToken();
    if(!token) return null;

    try{
        const payloadBase64 = token.split('.')[1];

        const decoedJson = atob(payloadBase64);
        const payload = JSON.parse(decoedJson);

        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role;

        return role;
    }
    catch(error){
        console.error("Gagal membaca token:", error);
        return null;
    }
}

export const getUserName = () =>{
    const token = getToken();
    if(!token) return null;

    try{
        const payloadBase64 = token.split('.')[1];

        const decoedJson = atob(payloadBase64);
        const payload = JSON.parse(decoedJson);

        const username = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name;

        return username;
    }
    catch(error){
        console.error("Gagal membaca token:", error);
        return null;
    }
}

export const getUserId = () =>{
    const token = getToken();
    if(!token) return null;

    try{
        const payloadBase64 = token.split('.')[1];

        const decoedJson = atob(payloadBase64);
        const payload = JSON.parse(decoedJson);

        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.nameId;

        return userId;
    }
    catch(error){
        console.error("Gagal membaca token:", error);
        return null;
    }
}