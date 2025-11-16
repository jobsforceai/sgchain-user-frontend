import api from "./api";

export const getSgcPrice = () =>
  api.get("/market/sgc-price").then(res => res.data);
