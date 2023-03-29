import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Page,
  Card,
  Tabs,
  Link,
  TextField,
  IndexTable,
  Loading,
  Icon,
  Text,
  Form,
  FormLayout,
  Scrollable,
  Pagination,
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
  CustomSelect,
  ShowPassword,
  HidePassword,
} from "../../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Users() {
  const { apiUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [userModal, setUserModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [userId, setUserId] = useState();
  const [isEditUser, setIsEditUser] = useState(false);
  const [users, setUsers] = useState([]);
  const [userStatus, setUserStatus] = useState("");
  const [pagination, setPagination] = useState(1);
  const [paginationUrl, setPaginationUrl] = useState([]);

  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    cPassword: "",
    role: "1",
  });

  const handleNewUserDetails = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
    if (e.target.name == "password" || e.target.name == "cPassword") {
      setPasswordErrorMsg("");
    }
  };

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selectedTab != selectedTabIndex) {
      setSelectedTab(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setUserStatus("");
      } else if (selectedTabIndex == 1) {
        setUserStatus("super_admin");
      } else if (selectedTabIndex == 2) {
        setUserStatus("admin");
      } else if (selectedTabIndex == 3) {
        setUserStatus("vendor");
      }
      setUsersLoading(true);
      setToggleLoadData(true);
    }
  };

  const tabs = [
    {
      id: "all",
      content: "All",
    },
    {
      id: "super-admin",
      content: "Super Admin",
    },
    {
      id: "admin",
      content: "Admin",
    },
    {
      id: "vendor",
      content: "Vendor",
    },
  ];

  const handleUserModal = () => {
    setUserModal(!userModal);
    setIsEditUser(false);
    setUserId();
    setHidePassword(true);
    setNewUser({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      cPassword: "",
      role: "1",
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
    singular: "User",
    plural: "Users",
  };

  const rowMarkup = users?.map(
    ({ id, first_name, last_name, phone, email, status, roles }, index) => (
      <IndexTable.Row
        id={id}
        key={index}
        position={index}
        disabled={usersLoading}
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {first_name} {last_name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell className="Capitalize-Cell">
          {roles?.length ? roles[0].name?.replace("_", " ") : "---"}
        </IndexTable.Cell>
        <IndexTable.Cell>{phone ? phone : "---"}</IndexTable.Cell>
        <IndexTable.Cell>{email ? email : "---"}</IndexTable.Cell>
        <IndexTable.Cell>
          <span
            className="small-tgl-btn"
            onClick={() => updateUserStatus(id, status)}
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
            <Tooltip content="Edit User">
              <Button
                onClick={() => handleEditUser(id)}
                loading={btnLoading[id]}
              >
                <Icon source={EditMinor}></Icon>
              </Button>
            </Tooltip>

            <Tooltip content={"Delete User"}>
              <Button
                onClick={() => handleDeleteUser(id)}
                disabled={btnLoading[id]}
              >
                <Icon source={DeleteMinor}></Icon>
              </Button>
            </Tooltip>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No User Found"} withIllustration />
  );

  const handleDeleteUser = (id) => {
    setUserId(id);
    setDeleteUserModal(true);
  };

  const handleDeleteUserModal = () => {
    setDeleteUserModal(!deleteUserModal);
    setUserId();
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

  const getUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/users?role=${userStatus}&page=${pagination}&query=${queryValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("getUsers response: ", response.data?.users);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setUsers(response.data?.users?.data);
        setPaginationUrl(response.data.users?.links);
        setLoading(false);
        setUsersLoading(false);
        setToggleLoadData(false);
      }
    } catch (error) {
      console.warn("getUsers Api Error", error.response);
      setLoading(false);
      setUsersLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setToggleLoadData(false);
      setErrorToast(true);
    }
  };

  const deleteUser = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["deleteUser"]) {
        toggleId = { ["deleteUser"]: false };
      } else {
        toggleId = { ["deleteUser"]: true };
      }
      return { ...toggleId };
    });
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/delete/${userId}`,
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
        setDeleteUserModal(false);
        setUserId();
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("deleteUser Api Error", error.response);
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
      getUsers();
    }
  }, [toggleLoadData]);

  const handleAddNewUser = () => {
    document.getElementById("addNewUserForm").click();
  };

  const addNewUser = async (e) => {
    e.preventDefault();
    if (newUser.password.length < 8) {
      setPasswordErrorMsg("Password must be 8 digits long");
    } else {
      if (newUser.password != newUser.cPassword) {
        setPasswordErrorMsg("Password must match");
      } else {
        setBtnLoading((prev) => {
          let toggleId;
          if (prev["addUser"]) {
            toggleId = { ["addUser"]: false };
          } else {
            toggleId = { ["addUser"]: true };
          }
          return { ...toggleId };
        });

        let data = {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          phone: newUser.phone,
          email: newUser.email,
          role_id: newUser.role,
          password: newUser.password,
          confirm_password: newUser.cPassword,
        };

        try {
          const response = await axios.post(`${apiUrl}/api/user/save`, data, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          });

          // console.log("createOffer response: ", response.data);

          if (!response?.data?.success) {
            if (response?.data?.status == 400) {
              if (response?.data?.message?.email) {
                setToastMsg(response?.data?.message?.email[0]);
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
            setUserModal(false);
            setToggleLoadData(true);
            handleUserModal();
          }

          setBtnLoading(false);
        } catch (error) {
          console.warn("createOffer Api Error", error.response);
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

  const handleEditUser = (id) => {
    setUserId(id);
    setUsersLoading(true);
    editUser(id);
  };

  const updateUserStatus = async (id, value) => {
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
        `${apiUrl}/api/user/status/${id}`,
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
      console.warn("updateUserStatus Api Error", error.response);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  const editUser = async (id) => {
    setUsersLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log("editUser response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        let userResponse = response.data?.user_detail;
        setUserId(userResponse?.id);
        setNewUser({
          firstName: userResponse?.first_name,
          lastName: userResponse?.last_name,
          phone: userResponse?.phone,
          email: userResponse?.email,
          password: "",
          cPassword: "",
          role: "1",
        });
        setIsEditUser(true);
        setUserModal(true);
      }
      setUsersLoading(false);
      setBtnLoading(false);
    } catch (error) {
      console.warn("editUser Api Error", error.response);
      setBtnLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (newUser.password.length < 8) {
      setPasswordErrorMsg("Password must be 8 digits long");
    } else {
      if (newUser.password != newUser.cPassword) {
        setPasswordErrorMsg("Password must match");
      } else {
        setBtnLoading((prev) => {
          let toggleId;
          if (prev["addUser"]) {
            toggleId = { ["addUser"]: false };
          } else {
            toggleId = { ["addUser"]: true };
          }
          return { ...toggleId };
        });

        let data = {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          phone: newUser.phone,
          email: newUser.email,
          role_id: newUser.role,
          password: newUser.password,
          confirm_password: newUser.cPassword,
        };

        try {
          const response = await axios.post(
            `${apiUrl}/api/user/update/${userId}`,
            data,
            {
              headers: { Authorization: `Bearer ${getAccessToken()}` },
            }
          );

          // console.log("updateUser response: ", response.data);

          if (!response?.data?.success) {
            if (response?.data?.status == 422) {
              if (response?.data?.message?.email) {
                setToastMsg(response?.data?.message?.email[0]);
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
            handleUserModal();
            setToggleLoadData(true);
          }

          setBtnLoading(false);
        } catch (error) {
          console.warn("updateUser Api Error", error.response);
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
        open={userModal}
        onClose={handleUserModal}
        title={isEditUser ? "Edit User" : "Add New User"}
        primaryAction={{
          content: isEditUser ? "Update" : "Add",
          loading: btnLoading["addUser"],
          onAction: handleAddNewUser,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["addUser"],
            onAction: handleUserModal,
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={isEditUser ? updateUser : addNewUser}>
            <div className="Sheet-Container Payment-Sheet">
              <Scrollable className="Sheet-Market">
                <FormLayout>
                  <span className="VisuallyHidden">
                    <Button submit id="addNewUserForm">
                      Submit
                    </Button>
                  </span>

                  <FormLayout.Group>
                    <InputField
                      type="text"
                      label="First Name"
                      name="firstName"
                      value={newUser.firstName}
                      onChange={handleNewUserDetails}
                      autoComplete="off"
                      required
                      placeholder="Enter First Name"
                    />
                    <InputField
                      type="text"
                      label="Last Name"
                      name="lastName"
                      value={newUser.lastName}
                      onChange={handleNewUserDetails}
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
                    value={newUser.email}
                    onChange={handleNewUserDetails}
                    autoComplete="off"
                    placeholder="Enter Email"
                  />

                  <InputField
                    type="number"
                    label="Phone"
                    name="phone"
                    required
                    value={newUser.phone}
                    onChange={handleNewUserDetails}
                    autoComplete="off"
                    placeholder="Enter Phone"
                  />

                  <FormLayout.Group>
                    <CustomSelect
                      label="User Role"
                      name="role"
                      value={newUser.role}
                      onChange={handleNewUserDetails}
                      options={[
                        { label: "Super Admin", value: "1" },
                        { label: "Admin", value: "2" },
                        { label: "Vendor", value: "3" },
                      ]}
                    />
                  </FormLayout.Group>

                  <FormLayout.Group>
                    <div className="Icon-TextFiled">
                      <InputField
                        value={newUser.password}
                        name="password"
                        onChange={handleNewUserDetails}
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
                        value={newUser.cPassword}
                        name="cPassword"
                        onChange={handleNewUserDetails}
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
                </FormLayout>
              </Scrollable>
            </div>
          </Form>
        </Modal.Section>
      </Modal>

      <Modal
        small
        open={deleteUserModal}
        onClose={handleDeleteUserModal}
        title="Delete User"
        loading={btnLoading["deleteUser"]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading["deleteUser"],
          onAction: deleteUser,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["deleteUser"],
            onAction: handleDeleteUserModal,
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
          title="Users"
          primaryAction={{
            content: "Add User",
            onAction: handleUserModal,
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
                        placeholder="Search User"
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
                    itemCount={users?.length}
                    hasMoreItems
                    selectable={false}
                    loading={usersLoading}
                    emptyState={emptyStateMarkup}
                    headings={[
                      { title: "Name" },
                      { title: "Role" },
                      { title: "Phone" },
                      { title: "Email" },
                      { title: "Active/Draft" },
                      { title: "" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card.Section>

                {users?.length > 0 && (
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
