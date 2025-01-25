import axiosInstance from "../config/Axios";

export const loginCustomerViaOTP = (userDetails) => async (dispatch) => {
    try {
      dispatch({ type: "CUSTOMER_LOGIN_REQUEST" });
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axiosInstance.post(
        `/api/v1/customer/loginViaOtp`,
        { contactNumber: userDetails.contactNumber },
        config
      );
      localStorage.setItem("token", JSON.stringify(data.token));
      dispatch({ type: "CUSTOMER_LOGIN_SUCCESS", payload: data.CUSTOMER });
    } catch (error) {
        dispatch({
            type: "CUSTOMER_LOGIN_FAIL",
            payload: error.response.data.message,
          });
    }
  };
  