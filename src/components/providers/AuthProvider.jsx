import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useReducer,
  useCallback,
} from "react";
import { useNavigate, Navigate, useLocation, Route } from "react-router-dom";
import { Toast, Frame, Button } from "@shopify/polaris";
import { Loader, getAccessToken } from "../../components";
import axios from "axios";
import getUser from "./UserApi";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

function reducer(currentState, newState) {
  return { ...currentState, ...newState };
}

function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context) throw new Error("useAuthState must be used in AuthProvider");

  return context;
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");

  return context;
}

const initialState = {
  user: null,
  userToken: "",
  userRole: null,
  isLoggedIn: false,
};

function AuthProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const [errorToast, setErrorToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toastErrorMsg = errorToast ? (
    <Toast
      content={toastMsg}
      error
      onDismiss={toggleErrorMsgActive}
      duration={300000}
    />
  ) : null;

  const handleReloadPage = () => {
    window.location.reload(true);
  };

  const ErrorPage = () => {
    return (
      <>
        <p>
          Something went wrong, please {""}
          <a
            onClick={handleReloadPage}
            className="href-css-underline href-css-pointer"
          >
            reload
          </a>
          {""} the page
        </p>
      </>
    );
  };

  const AuthCheck = async () => {
    try {
      const response = await axios.post(
        `${props.apiUrl}/api/check/auth`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("AuthCheck response: ", response?.data);

      if (!response.data.status) {
        navigate("/login");
      } else {
        dispatch({
          user: response.data?.user && response.data?.user,
          userToken: response.data?.access_token,
          userRole: response.data?.role && response.data?.role,
        });

        if (
          location.pathname == "/login" ||
          (location.pathname == "/reset-password") |
            (location.pathname == "/change-passwords")
        ) {
          navigate("/");
        }
      }
      setLoading(false);
    } catch (error) {
      console.warn("AuthCheck Api Error", error.response?.data);
      if (location.pathname == "/reset-password") {
        navigate("/reset-password");
      } else if (location.pathname == "/change-password") {
        navigate(`/change-password${location.search}`);
      } else {
        navigate("/login");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    AuthCheck();
  }, []);

  return (
    <Frame>
      {loading ? (
        <Loader />
      ) : (
        <AuthStateContext.Provider value={state}>
          <AuthDispatchContext.Provider value={dispatch}>
            {props.children}
          </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
      )}
      {toastErrorMsg}
    </Frame>
  );
}

export { AuthProvider, useAuthState, useAuthDispatch };
