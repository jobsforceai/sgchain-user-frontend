const API_DOMAIN = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const API_BASE_URL = `${API_DOMAIN}/api`;
export const MARKET_API_BASE_URL = `${API_DOMAIN}/api/v1`;
export const SOCKET_URL = API_DOMAIN;
