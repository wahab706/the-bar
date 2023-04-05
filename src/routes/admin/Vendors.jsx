import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Page,
  Card,
  Tabs,
  TextField,
  IndexTable,
  Loading,
  Icon,
  Text,
  Form,
  FormLayout,
  Scrollable,
  Modal,
  EmptySearchResult,
  Toast,
  Tooltip,
  ButtonGroup,
  Button,
  TextContainer,
} from "@shopify/polaris";
import { SearchMinor, DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  SkeltonPageForTable,
  getAccessToken,
  InputField,
  ShowPassword,
  HidePassword,
} from "../../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Vendors() {
  const { apiUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [vendorModal, setVendorModal] = useState(false);
  const [deleteVendorModal, setDeleteVendorModal] = useState(false);
  const [vendorId, setVendorId] = useState();
  const [vendors, setVendors] = useState([]);
  const [vendorStatus, setVendorStatus] = useState("");
  const [pagination, setPagination] = useState(1);
  const [paginationUrl, setPaginationUrl] = useState([]);

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

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selectedTab != selectedTabIndex) {
      setSelectedTab(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setVendorStatus("");
      } else if (selectedTabIndex == 1) {
        setVendorStatus("active");
      } else if (selectedTabIndex == 2) {
        setVendorStatus("draft");
      }
      setVendorsLoading(true);
      setToggleLoadData(true);
    }
  };

  const tabs = [
    {
      id: "all-vendors",
      content: "All",
    },
    {
      id: "active-vendors",
      content: "Active",
    },
    {
      id: "draft-vendors",
      content: "Draft",
    },
  ];

  const handleVendorModal = () => {
    setVendorModal(!vendorModal);
    setPasswordErrorMsg("");
    setHidePassword(true);
    setNewVendor({
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
    });
  };

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

  // ---------------------Tag/Filter Code Start Here----------------------
  const handleQueryValueRemove = () => {
    setQueryValue("");
    setToggleLoadData(true);
  };
  const handleFiltersQueryChange = (value) => {
    setQueryValue(value);
    setTimeout(() => {
      setToggleLoadData(true);
    }, 1000);
  };

  // ---------------------Index Table Code Start Here----------------------

  const resourceName = {
    singular: "Vendor",
    plural: "Vendors",
  };

  const rowMarkup = vendors?.map(
    ({ id, first_name, last_name, email, phone, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        disabled={vendorsLoading}
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {first_name} {last_name}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{phone ? phone : "---"}</IndexTable.Cell>
        <IndexTable.Cell>{email ? email : "---"}</IndexTable.Cell>

        <IndexTable.Cell>
          <span
            className="small-tgl-btn"
            onClick={() => updateVendorStatus(id, status)}
          >
            <input
              id={id}
              type="checkbox"
              className="tgl tgl-light"
              onChange={() => ""}
              checked={convertNumberToBoolean(status)}
            />
            <label htmlFor={id} className="tgl-btn"></label>
          </span>
        </IndexTable.Cell>

        <IndexTable.Cell className="Polaris-IndexTable-Delete-Column">
          <ButtonGroup>
            <Tooltip content="Edit Vendor">
              <Button onClick={() => editVendor(id)}>
                <Icon source={EditMinor}></Icon>
              </Button>
            </Tooltip>

            <Tooltip content={"Delete Vendor"}>
              <Button onClick={() => handleDeleteVendor(id)}>
                <Icon source={DeleteMinor}></Icon>
              </Button>
            </Tooltip>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Vendor Found"} withIllustration />
  );

  const handleDeleteVendor = (id) => {
    setVendorId(id);
    setDeleteVendorModal(true);
  };

  const handleDeleteVendorModal = () => {
    setDeleteVendorModal(!deleteVendorModal);
    setVendorId();
  };

  const editVendor = (id) => {
    navigate(`/vendor/${id}`);
  };

  const handlePaginationTabs = (active, url) => {
    if (!active && url != null) {
      let link = url.split("page=")[1];
      setPagination(link);
      setToggleLoadData(true);
    }
  };

  const ConvertStr = ({ value }) => {
    let label = value.replace("&raquo;", "»").replace("&laquo;", "«");
    return label;
  };

  // ---------------------Api Code starts Here----------------------

  const getVendors = async () => {
    setVendorsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/vendors?status=${vendorStatus}&page=${pagination}&query=${queryValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("getVendors response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setVendors(response.data?.vendors?.data);
        setPaginationUrl(response.data.vendors?.links);
        setLoading(false);
        setVendorsLoading(false);
        setToggleLoadData(false);
      }
    } catch (error) {
      console.warn("getVendors Api Error", error.response);
      setLoading(false);
      setVendorsLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setToggleLoadData(false);
      setErrorToast(true);
    }
  };

  const updateVendorStatus = async (id, value) => {
    let enableValue = "";
    if (value == 0) {
      enableValue = 1;
    } else {
      enableValue = 0;
    }

    let data = {
      status: enableValue,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/vendor/status/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      if (response?.data?.success) {
        setToastMsg(response?.data?.message);
        setSucessToast(true);
      } else {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      }
      setToggleLoadData(true);
    } catch (error) {
      console.warn("updateVendorStatus Api Error", error.response);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  const deleteVendor = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["deleteVendor"]) {
        toggleId = { ["deleteVendor"]: false };
      } else {
        toggleId = { ["deleteVendor"]: true };
      }
      return { ...toggleId };
    });
    try {
      const response = await axios.post(
        `${apiUrl}/api/vendor/delete/${vendorId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      // console.log("response", response?.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setToastMsg(response?.data?.message);
        setSucessToast(true);
        setDeleteVendorModal(false);
        setVendorId();
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("deleteVendor Api Error", error.response);
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
      getVendors();
    }
  }, [toggleLoadData]);

  const handleAddNewMarket = () => {
    document.getElementById("addNewVendorForm").click();
  };

  const addNewVendor = async (e) => {
    e.preventDefault();
    if (newVendor.password.length < 8) {
      setPasswordErrorMsg("Password must be 8 digits long");
    } else {
      if (newVendor.password != newVendor.cPassword) {
        setPasswordErrorMsg("Password must match");
      } else {
        setBtnLoading((prev) => {
          let toggleId;
          if (prev["addVendor"]) {
            toggleId = { ["addVendor"]: false };
          } else {
            toggleId = { ["addVendor"]: true };
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
        };

        try {
          const response = await axios.post(`${apiUrl}/api/vendor/save`, data, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          });

          // console.log("addNewVendor response: ", response.data);

          if (!response?.data?.success) {
            if (response?.data?.status == 400) {
              if (response?.data?.errors?.email) {
                setToastMsg(response?.data?.errors?.email[0]);
              } else {
                setToastMsg("Something Went Wrong, Try Again!");
              }
            } else {
              setToastMsg(response?.data?.message);
            }
            setErrorToast(true);
          } else {
            setBtnLoading(false);
            setToastMsg(response.data?.message);
            setSucessToast(true);
            handleVendorModal();
            if (response?.data?.vendor?.id) {
              setTimeout(() => {
                navigate(`/vendor/${response?.data?.vendor?.id}`);
              }, 500);
            }
          }

          setBtnLoading(false);
        } catch (error) {
          console.warn("addNewVendor Api Error", error.response);
          if (error.response?.status == 400) {
            if (error.response?.data?.errors?.name) {
              setToastMsg(error.response?.data?.errors?.name[0]);
            }
          } else {
            setToastMsg("Something Went Wrong, Try Again!");
          }
          setErrorToast(true);
          setBtnLoading(false);
        }
      }
    }
  };

  return (
    <div className="Products-Page IndexTable-Page Orders-page Markets-Page">
      <Modal
        open={vendorModal}
        onClose={handleVendorModal}
        title="Add Vendor"
        primaryAction={{
          content: "Add",
          loading: btnLoading["addVendor"],
          onAction: handleAddNewMarket,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["addVendor"],
            onAction: handleVendorModal,
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={addNewVendor}>
            <div className="Sheet-Container Payment-Sheet">
              <Scrollable className="Sheet-Market">
                <FormLayout>
                  <span className="VisuallyHidden">
                    <Button submit id="addNewVendorForm">
                      Submit
                    </Button>
                  </span>

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
              </Scrollable>
            </div>
          </Form>
        </Modal.Section>
      </Modal>

      <Modal
        small
        open={deleteVendorModal}
        onClose={handleDeleteVendorModal}
        title="Delete Market"
        loading={btnLoading["deleteVendor"]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading["deleteVendor"],
          onAction: deleteVendor,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["deleteVendor"],
            onAction: handleDeleteVendorModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure? This action can not be undone.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
        <Page
          fullWidth
          title="Vendors"
          primaryAction={{
            content: "Add Vendor",
            onAction: handleVendorModal,
          }}
        >
          <Card>
            <Tabs
              tabs={tabs}
              selected={selectedTab}
              onSelect={handleTabChange}
              disclosureText="More views"
            >
              <div className="Polaris-Table">
                <Card.Section>
                  <div style={{ padding: "16px", display: "flex" }}>
                    <div style={{ flex: 1 }}>
                      <TextField
                        placeholder="Search Vendor"
                        value={queryValue}
                        onChange={handleFiltersQueryChange}
                        clearButton
                        onClearButtonClick={handleQueryValueRemove}
                        autoComplete="off"
                        prefix={<Icon source={SearchMinor} />}
                      />
                    </div>
                  </div>

                  <IndexTable
                    resourceName={resourceName}
                    itemCount={vendors.length}
                    hasMoreItems
                    selectable={false}
                    loading={vendorsLoading}
                    emptyState={emptyStateMarkup}
                    headings={[
                      { title: "Name" },
                      { title: "Phone" },
                      { title: "Email" },
                      { title: "Active/Draft" },
                      { title: "" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card.Section>

                {vendors?.length > 0 && (
                  <Card.Section>
                    <div className="data-table-pagination Pagination-Section">
                      {paginationUrl?.map((item) => {
                        return (
                          <Button
                            disabled={item.url === null}
                            primary={item.active}
                            onClick={() =>
                              handlePaginationTabs(item.active, item.url)
                            }
                          >
                            <ConvertStr value={item.label} />
                          </Button>
                        );
                      })}
                    </div>
                  </Card.Section>
                )}
              </div>
            </Tabs>
          </Card>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
