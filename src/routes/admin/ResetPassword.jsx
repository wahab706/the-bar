import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Layout,
  Card,
  Form,
  FormLayout,
  Button,
  Text,
  Stack,
  Modal,
  TextContainer,
  Toast,
} from "@shopify/polaris";
import barLogo from "../../assets/barLogo.png";
import { AppContext } from "../../components/providers/ContextProvider";
import { InputField, setAccessToken } from "../../components";
import { Link } from "react-router-dom";
import axios from "axios";

export function ResetPassword() {
  const { apiUrl } = useContext(AppContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [time, setTime] = useState(0);

  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleErrorModal = useCallback(
    () => setErrorModal(!errorModal),
    [errorModal]
  );

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

  const handleFormValue = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const clearFormValues = () => {
    setFormValues({
      email: "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setBtnDisabled(true);
    let data = {
      email: formValues.email,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/forget/password`, data);
      console.log("forgot password response: ", response.data);

      setBtnLoading(false);
      if (
        response.data?.status == "We have emailed your password reset link!"
      ) {
        setToastMsg("We have emailed your password reset link!");
        setSucessToast(true);
        setTime(60);
        setTimeout(() => {
          setBtnDisabled(false);
        }, 60000);
      } else if (response.data?.status == "Please wait before retrying.") {
        setToastMsg("Please wait before retrying.");
        setErrorToast(true);
        setTime(60);
        setTimeout(() => {
          setBtnDisabled(false);
        }, 60000);
      } else {
        setToastMsg(response.data?.status);
        setErrorToast(true);
        setBtnDisabled(false);
      }
    } catch (error) {
      console.warn("forgot password Api Error", error);
      setBtnLoading(false);
      setBtnDisabled(false);
      setToastMsg("Something Went Wrong, Try Again!");
      setErrorToast(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="Login-Page Login-Page-Centered">
      <Modal
        titleHidden
        small
        open={errorModal}
        onClose={handleErrorModal}
        secondaryActions={[
          {
            content: "Ok",
            onAction: handleErrorModal,
          },
        ]}
      >
        <div className="Login-Error-Modal">
          <Modal.Section>
            <TextContainer>
              <Text variant="bodyMd" as="p" fontWeight="medium">
                Your email or password is incorrect.
              </Text>
              <Text variant="bodyMd" as="p" fontWeight="regular">
                Please try again
              </Text>
            </TextContainer>
          </Modal.Section>
        </div>
      </Modal>

      <Page>
        <Card sectioned>
          <div className="Logo-Container">
            <img src={barLogo} alt="logo" />
          </div>

          <div>
            <Text variant="headingLg" as="h6" fontWeight="semibold">
              Forgot your password?
            </Text>

            <Text variant="bodyMd" as="p" fontWeight="regular" color="subdued">
              We’ll send instructions to your email, on how to reset it.
            </Text>

            <Form onSubmit={handleFormSubmit}>
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    value={formValues.email}
                    name="email"
                    onChange={handleFormValue}
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter Email"
                    required
                  />
                </FormLayout.Group>

                <div className="Form-Btns">
                  <Stack vertical>
                    <Button
                      submit
                      primary
                      loading={btnLoading}
                      disabled={formValues.email?.length < 1 || btnDisabled}
                    >
                      {btnDisabled
                        ? time > 0
                          ? `Resend in ${time}`
                          : "Reset Password"
                        : "Reset Password"}
                    </Button>
                  </Stack>
                </div>

                <div className="Form-Footer">
                  <p>
                    <Link to="/login">Return to login</Link>
                  </p>
                </div>
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
