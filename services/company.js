import http from "../helpers/http";

export const getCompanyDetails = (companyName) => {
  return http.get(`/companies/code/${companyName}`);
};
