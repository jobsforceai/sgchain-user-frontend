import api from "./api";

export const sellSgc = (sgcAmount: number) =>
  api.post("/me/sell-sgc", { sgcAmount }).then(r => r.data);
