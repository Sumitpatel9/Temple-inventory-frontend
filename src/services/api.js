export const serverip = import.meta.env.VITE_API_URL;
// export const serverip = "http://192.168.1.8:5000/api";

export const Api = {
  baseurl: serverip,

  //--LOGIN
  userlogin: serverip + "/auth/login",

  //--LOGOUT
  userlogout: serverip + "/auth/logout",

  //--VERSION CONTROL
  version: serverip + "/version/latest",

  //--TEMPLE
  templeadd: serverip + "/temples/create",
  templelist: serverip + "/temples/list",
  templeupdate: serverip + "/temples/update",
  templedelete: serverip + "/temples/delete",

  //--INWARD
  inwardCreate: serverip + "/inward/create",
  inwardList: serverip + "/inward/list",
  inwardDelete: serverip + "/inward/delete",
  inwardUpdate: serverip + "/inward/update",

  //--OUTWARD
  outwardCreate: serverip + "/outward/create",
  outwardList: serverip + "/outward/list",
  outwardDelete: serverip + "/outward/delete",
  outwardUpdate: serverip + "/outward/update",

  //--PRODUCT
  productCreate: serverip + "/products/create",
  productList: serverip + "/products/list",
  productUpdate: serverip + "/products/update",
  productCategory: serverip + "/products/categories",

  //--USER
  createUser: serverip + "/users/create",
  listUsers: serverip + "/users/list",
  updateUser: serverip + "/users/update",

  //--STOCK
  stockList: serverip + "/stock/list",
  transactionHistory: serverip + "/stock/transactions",
  inwardHistory: serverip + "/stock/inward-history",
  outwardHistory: serverip + "/stock/outward-history",

  //--STOCK REPORTS
  lowStockAlert: serverip + "/stock/low-stock-alert",
  slowMovingStock: serverip + "/stock/slow-moving",
  fastMovingStock: serverip + "/stock/fast-moving",
  dailyStockReport: serverip + "/stock/daily-stock-report",

  //--DASHBOARD
  dashboardSummary: serverip + "/dashboard/summary",
};
