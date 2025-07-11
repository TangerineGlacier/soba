export const setBaseUrl = (str : string) => {
    const baseUrl = import.meta.env.REACT_MIDDLEWARE_IP_ADDRESS ?? "http://localhost:8000";
    return `${baseUrl}${str}`
} 