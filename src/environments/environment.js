// const BASE_URL = "http://deepapps.go.ro:8090/api/v1/";
const BASE_URL = "http://46.4.122.212:80/api/v1/";
 

export const ENDPOINTS = {

  GOOGLE_API_KEY: "AIzaSyA1RhZwwHXtD9gNw2Nteo48yIMDH2fWRbM",
  apiBaseUrl: "http://192.168.0.106/provet/api/",
  register: `${BASE_URL}register`,
  login: `${BASE_URL}login`,
  forgotPassword: `${BASE_URL}forgot-password`,
  verifyToken: (token) => `${BASE_URL}validate-token?token=${token}`,
  resetPassword: `${BASE_URL}reset-password`,
  userGetProfile: `${BASE_URL}profile/`,
  userUpdateProfile: `${BASE_URL}profile/`,
  userUpdateProfilePhote: `${BASE_URL}profile-photo`,
  getProductsList: `${BASE_URL}products`,
  getUberProductList: `${BASE_URL}uber/vehicles`,
  getBoltProductList: `${BASE_URL}bolt/vehicles`,
  getBoltandUberList: `${BASE_URL}combined/vehicles`,
  linkedRequest:`${BASE_URL}uber/linkingRequest`,
  linkedSendOTP:`${BASE_URL}uber/linkingSendPhoneOtp`,
  combined:`${BASE_URL}combined/requestRide`,
  cancelRide:`${BASE_URL}combined/cancelRide`,
  paymentstart:`${BASE_URL}payment/start`,
  addCard:`${BASE_URL}payment/addCard`,
  CardList:`${BASE_URL}payment/listCards`,
  setDefaultCard:`${BASE_URL}payment/setDefault`,
  DeleteCard:`${BASE_URL}payment/removeCard`,
  whatsappValidation: (phoneNumber) => `${BASE_URL}phone-validation?phoneNumber=${phoneNumber}`,
  phoneValidationSignIn : (phoneNumber) => `${BASE_URL}phone-validation-sign-in?phoneNumber=${phoneNumber}`,
  verifyValidation: (phoneNumber, code) =>`${BASE_URL}verify-code?phoneNumber=${phoneNumber}&code=${code}`,
};



