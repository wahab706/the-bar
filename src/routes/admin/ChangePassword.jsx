import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Layout,
  Card,
  Form,
  FormLayout,
  Button,
  Text,
  Icon,
  Toast,
} from "@shopify/polaris";
import barLogo from "../../assets/barLogo.png";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  InputField,
  setAccessToken,
  getAccessToken,
  ShowPassword,
  HidePassword,
} from "../../components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function ChangePassword() {
  const { apiUrl } = useContext(AppContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState(null);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    token: "",
  });
  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });

  const handlePassword = (e) => {
    setPasswordErrorMsg(null);
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toggleSuccessMsgActive = useCallback(
    () => setSucessToast((sucessToast) => !sucessToast),
    []
  );

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  const updatePassword = async (e) => {
    e.preventDefault();
    if (password.new?.length < 8) {
      setPasswordErrorMsg("Password must be 8 digits long");
    } else {
      if (password.new != password.confirm) {
        setPasswordErrorMsg("Password must match");
      } else {
        setBtnLoading((prev) => {
          let toggleId;
          if (prev["updatePassword"]) {
            toggleId = { ["updatePassword"]: false };
          } else {
            toggleId = { ["updatePassword"]: true };
          }
          return { ...toggleId };
        });

        let data = {
          //   email: userInfo?.email,
          email: "super@tlx.com",
          password: password.new,
          confirm_password: password.confirm,
        };

        try {
          const response = await axios.post(
            `${apiUrl}/api/reset/password`,
            data,
            {
              headers: {
                Authorization: `Bearer ${getAccessToken()}`,
              },
            }
          );

          console.log("updatePassword Api response: ", response.data);
          if (!response.data?.success) {
            setToastMsg(response.data?.message);
            setErrorToast(true);
          } else {
            setToastMsg(response.data?.message);
            setSucessToast(true);
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
          setBtnLoading(false);
        } catch (error) {
          console.warn("updatePassword Api Error", error.response);
          setBtnLoading(false);
          //   if (
          //     error.response?.data?.errors &&
          //     error.response?.data?.message?.message
          //   ) {
          //     setToastMsg(error.response?.data?.message?.message);
          //   } else {
          //     setToastMsg("Server Error");
          //   }
          //   setErrorToast(true);
          setToastMsg("Something Went Wrong, Try Again!");
          setErrorToast(true);
        }
      }
    }
  };

  useEffect(() => {
    let info = location.search.replace("?token=", "");
    info = info.split("&email=");
    let token = info[0];
    let email = info[1];
    setUserInfo({
      email: email,
      token: token,
    });
  }, []);

  return (
    <div className="Login-Page Login-Page-Centered">
      <Page>
        <Card sectioned>
          <div className="Logo-Container">
            <img src={barLogo} alt="logo" />
          </div>

          <div>
            <Text
              variant="headingLg"
              as="h6"
              fontWeight="semibold"
              alignment="center"
            >
              Change your password
            </Text>
            <br />
            <Form onSubmit={updatePassword}>
              <FormLayout>
                <div className="Icon-TextFiled">
                  <InputField
                    type={hidePassword ? "password" : "text"}
                    label="New Password"
                    name="new"
                    value={password.new}
                    onChange={handlePassword}
                    autoComplete="off"
                    required
                    error={passwordErrorMsg}
                  />
                  <span
                    onClick={() => setHidePassword(!hidePassword)}
                    className="Icon-Section"
                  >
                    {hidePassword ? (
                      <Icon source={HidePassword} color="subdued" />
                    ) : (
                      <Icon source={ShowPassword} color="subdued" />
                    )}
                  </span>
                </div>

                <div className="Icon-TextFiled">
                  <InputField
                    type={hidePassword ? "password" : "text"}
                    label="Confirm Password"
                    name="confirm"
                    value={password.confirm}
                    onChange={handlePassword}
                    autoComplete="off"
                    required
                    error={passwordErrorMsg}
                  />

                  <span
                    onClick={() => setHidePassword(!hidePassword)}
                    className="Icon-Section"
                  >
                    {hidePassword ? (
                      <Icon source={HidePassword} color="subdued" />
                    ) : (
                      <Icon source={ShowPassword} color="subdued" />
                    )}
                  </span>
                </div>

                <Button primary submit loading={btnLoading["updatePassword"]}>
                  Change Password
                </Button>
              </FormLayout>
            </Form>
          </div>
        </Card>
        {toastErrorMsg}
        {toastSuccessMsg}
      </Page>
    </div>
  );
}
