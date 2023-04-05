import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  Page,
  Card,
  Scrollable,
  Stack,
  Button,
  PageActions,
  Form,
  FormLayout,
  Banner,
  Icon,
  Toast,
  Loading,
  List,
  TextContainer,
  Tag,
  Modal,
  OptionList,
  Autocomplete,
  Badge,
  Layout,
} from "@shopify/polaris";
import {
  SearchMinor,
  ChevronDownMinor,
  ChevronUpMinor,
} from "@shopify/polaris-icons";
import {
  SkeltonPageForProductDetail,
  getAccessToken,
  InputField,
  ShowPassword,
  HidePassword,
  CustomSelect,
  CheckBox,
  CustomBadge,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import { useAuthState } from "../../components/providers/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import EmptyCheckBox from "../../assets/icons/EmptyCheckBox.png";
import FillCheckBox from "../../assets/icons/FillCheckBox.png";
import CheckboxTree from "react-checkbox-tree";

export function VendorDetail() {
  const params = useParams();
  const { apiUrl } = useContext(AppContext);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorStatus, setVendorStatus] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [discardModal, setDiscardModal] = useState(false);
  const [vendorsList, setVendorsList] = useState([]);
  const [vendorError, setVendorError] = useState();
  const [marketsList, setMarketsList] = useState([]);

  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [newVendor, setNewVendor] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    cPassword: "",
    status: true,
    address_line1: "",
    address_line2: "",
    state: "",
    city: "",
    zipCode: "",
    market_id: null,
  });

  const handleNewVendorDetails = (e) => {
    if (e.target.name == "status") {
      setNewVendor({ ...newVendor, [e.target.name]: e.target.checked });
    } else {
      setNewVendor({ ...newVendor, [e.target.name]: e.target.value });
    }
    if (e.target.name == "password" || e.target.name == "cPassword") {
      setPasswordErrorMsg("");
    }
  };

  // -------------------Tags------------------------

  const [tagOptionsSelected, setTagOptionsSelected] = useState("");
  const [tagInputValue, setTagInputValue] = useState("");
  const [tagOptions, setTagOptions] = useState([]);
  const [tagsModal, setTagsModal] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const handleTagsModal = useCallback(
    () => setTagsModal(!tagsModal),
    [tagsModal]
  );

  const tagUpdateText = useCallback(
    (value) => {
      setTagInputValue(value);

      if (!optionsLoading) {
        setOptionsLoading(true);
      }

      setTimeout(() => {
        if (value === "") {
          let list = [];
          vendorsList?.map((item) => {
            list.push({
              value: item.id,
              label: item.name,
            });
          });
          setTagOptions(list);
          setOptionsLoading(false);
          return;
        }

        const filterRegex = new RegExp(value, "i");
        const resultOptions = vendorsList.filter((option) =>
          option.name.match(filterRegex)
        );
        let endIndex = resultOptions.length - 1;
        if (resultOptions.length === 0) {
          endIndex = 0;
        }
        let list = [];
        resultOptions?.map((item) => {
          list.push({
            value: item.id,
            label: item.name,
          });
        });
        setTagOptions(list);
        setOptionsLoading(false);
      }, 300);
    },
    [vendorsList, optionsLoading, tagOptionsSelected]
  );

  const removeTag = useCallback(
    (tag) => () => {
      const tagOptions = [...tagOptionsSelected];
      tagOptions.splice(tagOptions.indexOf(tag), 1);
      setTagOptionsSelected(tagOptions);
    },
    [tagOptionsSelected]
  );

  const tagsContentMarkup =
    tagOptionsSelected?.length > 0 &&
    vendorsList?.length &&
    tagOptions?.length ? (
      <div className="Product-Tags-Stack">
        <Stack spacing="extraTight" alignment="center">
          {tagOptionsSelected.map((option) => {
            let tagLabel = "";
            let title = vendorsList?.find((obj) => obj.id == option);
            if (title) {
              tagLabel = title.name;
            }
            tagLabel = tagLabel.replace("_", " ");
            tagLabel = tagTitleCase(tagLabel);
            return (
              <Tag key={`option${option}`} onRemove={removeTag(option)}>
                {tagLabel}
              </Tag>
            );
          })}
        </Stack>
      </div>
    ) : null;

  function tagTitleCase(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join("");
  }

  const tagTextField = (
    <Autocomplete.TextField
      autoComplete="off"
      onChange={tagUpdateText}
      label="Vendors"
      value={tagInputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Select Vendors"
      // verticalContent={tagsContentMarkup}
    />
  );

  // ------------------------Toasts Code start here------------------
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

  function convertBooleanToNumber(value) {
    let booleanValue;
    if (value == true) {
      booleanValue = 1;
    } else {
      booleanValue = 0;
    }

    return booleanValue;
  }

  function convertNumberToBoolean(value) {
    let booleanValue;
    if (value == 1) {
      booleanValue = true;
    } else {
      booleanValue = false;
    }
    return booleanValue;
  }

  const discardVendor = () => {
    navigate("/vendors");
  };

  const handleDiscardModal = () => {
    setDiscardModal(!discardModal);
  };

  const getMarketsList = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/markets/list`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("getMarketsList response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        let list = [];
        response.data?.markets?.map((item) => {
          list.push({
            value: item.id,
            label: item.name,
          });
        });
        setMarketsList(list);
      }
    } catch (error) {
      console.warn("Get VendorsList Api Error", error.response);
      setBtnLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  useEffect(() => {
    getMarketsList();
  }, []);

  const editVendor = async (id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/vendor/detail/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      //   console.log("editVendor response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        let vendorResponse = response.data?.vendor;
        setVendorId(vendorResponse?.id);
        setVendorName(vendorResponse?.name);
        setVendorStatus(vendorResponse?.status);
        setNewVendor({
          ...newVendor,
          first_name: vendorResponse?.first_name,
          last_name: vendorResponse?.last_name,
          email: vendorResponse?.email,
          phone: vendorResponse?.phone,
          market_id: vendorResponse?.market
            ? vendorResponse?.market?.details?.id
            : null,
          city: vendorResponse?.details?.city,
          zipCode: vendorResponse?.details?.zipCode,
          state: vendorResponse?.details?.state,
          address_line1: vendorResponse?.details?.address_line1,
          address_line2: vendorResponse?.details?.address_line2,
          status: convertNumberToBoolean(vendorResponse?.status),
        });

        setLoading(false);
        setToggleLoadData(false);
        window.scrollTo(0, 0);
      }

      setBtnLoading(false);
    } catch (error) {
      console.warn("editVendor Api Error", error.response);
      setBtnLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  useEffect(() => {
    if (toggleLoadData) {
      editVendor(params.vendorId);
    }
  }, [toggleLoadData]);

  const handleUpdateVendor = () => {
    document.getElementById("updateVendorForm").click();
  };

  const handleUpdateVendorSubmit = (e) => {
    e.preventDefault();
    if (newVendor.password.length < 8) {
      setPasswordErrorMsg("Password must be 8 digits long");
      window.scrollTo(0, 400);
    } else {
      if (newVendor.password != newVendor.cPassword) {
        setPasswordErrorMsg("Password must match");
        window.scrollTo(0, 400);
      } else {
        if (newVendor.market_id) {
          setVendorError();
          updateVendor();
        } else {
          setVendorError("market");
          window.scrollTo(0, 0);
        }
      }
    }
  };

  const updateVendor = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["updateVendor"]) {
        toggleId = { ["updateVendor"]: false };
      } else {
        toggleId = { ["updateVendor"]: true };
      }
      return { ...toggleId };
    });

    let data = {
      first_name: newVendor.first_name,
      last_name: newVendor.last_name,
      email: newVendor.email,
      phone: newVendor.phone,
      password: newVendor.password,
      password_confirmation: newVendor.cPassword,
      status: convertBooleanToNumber(newVendor.status),
      address_line1: newVendor.address_line1,
      address_line2: newVendor.address_line2,
      state: newVendor.state,
      city: newVendor.city,
      zipCode: newVendor.zipCode,
      market_id: newVendor.market_id,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/vendor/update/${vendorId}`,
        data,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("updateVendor response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setToastMsg("Market Updated Successfully!");
        setSucessToast(true);
        setToggleLoadData(true);
      }

      setBtnLoading(false);
    } catch (error) {
      console.warn("updateVendor Api Error", error.response);
      setBtnLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  return (
    <div className="Vendor-Detail-Page">
      <Modal
        open={discardModal}
        onClose={handleDiscardModal}
        title="Leave page with unsaved changes?"
        primaryAction={{
          content: "Leave page",
          destructive: true,
          onAction: discardVendor,
        }}
        secondaryActions={[
          {
            content: "Stay",
            onAction: handleDiscardModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Leaving this page will delete all unsaved changes.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Modal
        open={tagsModal}
        onClose={handleTagsModal}
        title="Manage Vendors"
        primaryAction={{
          content: "Done",
          onAction: () => {
            setTagsModal(false);
          },
        }}
      >
        <Modal.Section>
          <div className="Modal-Product-Tags">
            <Scrollable className="Market-Edit-Vendors-Scroll">
              <OptionList
                title="AVAILABLE"
                onChange={setTagOptionsSelected}
                options={tagOptions}
                selected={tagOptionsSelected}
                allowMultiple
              />
            </Scrollable>
          </div>
        </Modal.Section>
      </Modal>

      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForProductDetail />
        </span>
      ) : (
        <Page
          breadcrumbs={[{ content: "Vendor", onAction: handleDiscardModal }]}
          title={vendorName}
          titleMetadata={
            vendorStatus == 0 ? (
              <Badge status="info">Draft</Badge>
            ) : vendorStatus == 1 ? (
              <Badge status="success">Active</Badge>
            ) : null
          }
          primaryAction={{
            content: "Save Vendor",
            onAction: handleUpdateVendor,
            loading: btnLoading["updateVendor"],
          }}
        >
          {vendorError ? (
            <>
              <Banner
                title="There is 1 error with this Vendor:"
                status="critical"
              >
                <List>
                  {vendorError == "market" ? (
                    <List.Item>Market must be selected</List.Item>
                  ) : (
                    <List.Item>Specific {vendorError} must be added</List.Item>
                  )}
                </List>
              </Banner>
              <br />
            </>
          ) : (
            ""
          )}

          <Form onSubmit={handleUpdateVendorSubmit}>
            <span className="VisuallyHidden">
              <Button submit id="updateVendorForm">
                Submit
              </Button>
            </span>

            {/* <Layout>
              <Layout.Section></Layout.Section>
              <Layout.Section oneThird></Layout.Section>
            </Layout> */}

            <Card sectioned title="General Information">
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    type="text"
                    label="First Name"
                    name="first_name"
                    value={newVendor.first_name}
                    onChange={handleNewVendorDetails}
                    autoComplete="off"
                    required
                    placeholder="Enter First Name"
                  />
                  <InputField
                    type="text"
                    label="Last Name"
                    name="last_name"
                    value={newVendor.last_name}
                    onChange={handleNewVendorDetails}
                    autoComplete="off"
                    required
                    placeholder="Enter Last Name"
                  />
                </FormLayout.Group>

                <InputField
                  type="email"
                  label="Email"
                  name="email"
                  required
                  value={newVendor.email}
                  onChange={handleNewVendorDetails}
                  autoComplete="off"
                  placeholder="Enter Email"
                />

                <InputField
                  type="number"
                  label="Phone"
                  name="phone"
                  required
                  value={newVendor.phone}
                  onChange={handleNewVendorDetails}
                  autoComplete="off"
                  placeholder="Enter Phone"
                />
                <InputField
                  type="text"
                  label="City"
                  name="city"
                  value={newVendor.city}
                  onChange={handleNewVendorDetails}
                  autoComplete="off"
                  required
                  placeholder="Enter City"
                />
                <FormLayout.Group>
                  <InputField
                    type="text"
                    label="State"
                    name="state"
                    value={newVendor.state}
                    onChange={handleNewVendorDetails}
                    autoComplete="off"
                    required
                    placeholder="Enter State"
                  />
                  <InputField
                    type="text"
                    label="Zip Code"
                    name="zipCode"
                    value={newVendor.zipCode}
                    onChange={handleNewVendorDetails}
                    autoComplete="off"
                    required
                    placeholder="Enter Zip Code"
                  />
                </FormLayout.Group>

                <InputField
                  type="text"
                  label="Address 1"
                  name="address_line1"
                  multiline={"3"}
                  value={newVendor.address_line1}
                  onChange={handleNewVendorDetails}
                  autoComplete="off"
                  placeholder="Enter Address"
                />

                <InputField
                  type="text"
                  label="Address 2 (optional)"
                  name="address_line2"
                  multiline={"3"}
                  value={newVendor.address_line2}
                  onChange={handleNewVendorDetails}
                  autoComplete="off"
                  placeholder="Enter Address"
                />

                <FormLayout.Group>
                  <div className="Icon-TextFiled">
                    <InputField
                      value={newVendor.password}
                      name="password"
                      onChange={handleNewVendorDetails}
                      label="Password"
                      type={hidePassword ? "password" : "text"}
                      autoComplete="off"
                      placeholder="Enter Password"
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
                      value={newVendor.cPassword}
                      name="cPassword"
                      onChange={handleNewVendorDetails}
                      label="Confirm Password"
                      type={hidePassword ? "password" : "text"}
                      autoComplete="off"
                      placeholder="Enter Password"
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
                </FormLayout.Group>

                <span className="Modal-Select">
                  <label htmlFor="vendorStatus">Status</label>
                  <input
                    id="vendorStatus"
                    type="checkbox"
                    name="status"
                    className="tgl tgl-light"
                    checked={newVendor.status}
                    onChange={handleNewVendorDetails}
                  />
                  <label htmlFor="vendorStatus" className="tgl-btn"></label>
                </span>
              </FormLayout>
            </Card>

            <Card title="Select Market" sectioned>
              <CustomSelect
                label="Select Vendor Market"
                name="market_id"
                value={newVendor.market_id}
                onChange={handleNewVendorDetails}
                options={marketsList}
              />
            </Card>

            {/* <Card title="Vendor Information">
                <Card.Section
                  actions={[
                    {
                      content: "Manage",
                      onAction: () => {
                        setTagsModal(true);
                      },
                    },
                  ]}
                >
                  <div className="Product-Tags">
                    <Autocomplete
                      // actionBefore={
                      //     console.log('Action Clicked!')
                      // }
                      allowMultiple
                      options={tagOptions}
                      selected={tagOptionsSelected}
                      textField={tagTextField}
                      loading={optionsLoading}
                      onSelect={setTagOptionsSelected}
                      listTitle="Available Vendors"
                    />
                    {tagsContentMarkup}
                  </div>
                </Card.Section>
              </Card> */}
          </Form>

          <div className="Polaris-Product-Actions">
            <br />
            <PageActions
              primaryAction={{
                content: "Save Vendor",
                onAction: handleUpdateVendor,
                loading: btnLoading["updateVendor"],
              }}
            />
          </div>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
