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
} from "../../components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Markets() {
  const { apiUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [marketModal, setMarketModal] = useState(false);
  const [deleteMarketModal, setDeleteMarketModal] = useState(false);
  const [marketId, setMarketId] = useState();
  const [markets, setMarkets] = useState([]);
  const [marketStatus, setMarketStatus] = useState("");
  const [pagination, setPagination] = useState(1);
  const [paginationUrl, setPaginationUrl] = useState([]);

  const [newMarket, setNewMarket] = useState({
    name: "",
    slug: "",
    description: "",
    status: true,
  });

  const handleNewMarketDetails = (e) => {
    if (e.target.name == "status") {
      setNewMarket({ ...newMarket, [e.target.name]: e.target.checked });
    } else {
      setNewMarket({ ...newMarket, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    setNewMarket({
      slug: newMarket.name?.replace(/\s+/g, "-").toLowerCase(),
      name: newMarket.name,
      description: newMarket.description,
      status: newMarket.status,
    });
  }, [newMarket.name]);

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selectedTab != selectedTabIndex) {
      setSelectedTab(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setMarketStatus("");
      } else if (selectedTabIndex == 1) {
        setMarketStatus("active");
      } else if (selectedTabIndex == 2) {
        setMarketStatus("draft");
      } else if (selectedTabIndex == 3) {
        setMarketStatus("archive");
      }
      setMarketsLoading(true);
      setToggleLoadData(true);
    }
  };

  const tabs = [
    {
      id: "all-markets",
      content: "All",
    },
    {
      id: "active-markets",
      content: "Active",
    },
    {
      id: "draft-markets",
      content: "Draft",
    },
    {
      id: "archived-markets",
      content: "Archived",
    },
  ];

  const handleMarketModal = () => {
    setMarketModal(!marketModal);
    setNewMarket({
      name: "",
      slug: "",
      description: "",
      status: true,
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
    singular: "Market",
    plural: "Markets",
  };

  const rowMarkup = markets?.map(
    ({ id, name, slug, status, countries }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        disabled={marketsLoading}
      >
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Text variant="bodyMd" fontWeight="semibold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>{slug}</IndexTable.Cell>

        <IndexTable.Cell className="Capitalize-Cell">
          <Text variant="headingSm" as="h6">
            {countries?.length && countries?.length > 1 ? (
              <>
                <span>{countries[0].name}</span>
                &nbsp;
                <small>{`+ ${countries?.length - 1} others`}</small>
              </>
            ) : (
              <span>{countries[0].name}</span>
            )}
            {!countries?.length && "---"}
          </Text>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <span
            className="small-tgl-btn"
            onClick={() => updateMarketStatus(id, status)}
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
            <Tooltip content="Edit Market">
              <Button onClick={() => editMarket(id)}>
                <Icon source={EditMinor}></Icon>
              </Button>
            </Tooltip>

            <Tooltip content={selectedTab == 3 ? "Delete" : "Move to Archive"}>
              <Button onClick={() => handleDeleteMarket(id)}>
                <Icon source={DeleteMinor}></Icon>
              </Button>
            </Tooltip>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Markets Found"} withIllustration />
  );

  const handleDeleteMarket = (id) => {
    setMarketId(id);
    setDeleteMarketModal(true);
  };

  const handleDeleteMarketModal = () => {
    setDeleteMarketModal(!deleteMarketModal);
    setMarketId();
  };

  const editMarket = (id) => {
    navigate(`/market/${id}`);
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

  const getMarkets = async () => {
    setMarketsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/markets?status=${marketStatus}&page=${pagination}&query=${queryValue}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      console.log("getMarkets response: ", response.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setMarkets(response.data?.markets?.data);
        setPaginationUrl(response.data.markets?.links);
        setLoading(false);
        setMarketsLoading(false);
        setToggleLoadData(false);
      }
    } catch (error) {
      console.warn("getMarkets Api Error", error.response);
      setLoading(false);
      setMarketsLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setToggleLoadData(false);
      setErrorToast(true);
    }
  };

  const updateMarketStatus = async (id, value) => {
    let enableValue = "";
    if (value == 0) {
      enableValue = 1;
    } else {
      enableValue = 0;
    }

    let data = {
      toggle: enableValue,
    };

    try {
      const response = await axios.post(
        `${apiUrl}/api/market/status/${id}`,
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
      console.warn("updateMarketStatus Api Error", error.response);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  const deleteMarket = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["deleteMarket"]) {
        toggleId = { ["deleteMarket"]: false };
      } else {
        toggleId = { ["deleteMarket"]: true };
      }
      return { ...toggleId };
    });
    try {
      const response = await axios.post(
        `${apiUrl}/api/delete/market/${marketId}`,
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
        setDeleteMarketModal(false);
        setMarketId();
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("deleteMarket Api Error", error.response);
      setBtnLoading(false);
      if (error.response?.message) {
        setToastMsg(error.response?.message);
      } else {
        setToastMsg("Something Went Wrong, Try Again!");
      }
      setErrorToast(true);
    }
  };

  const archiveMarket = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["deleteMarket"]) {
        toggleId = { ["deleteMarket"]: false };
      } else {
        toggleId = { ["deleteMarket"]: true };
      }
      return { ...toggleId };
    });
    try {
      const response = await axios.post(
        `${apiUrl}/api/market/add/archive/${marketId}`,
        {},
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      console.log("response", response?.data);
      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setToastMsg(response?.data?.message);
        setSucessToast(true);
        setDeleteMarketModal(false);
        setMarketId();
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("Archive Market Api Error", error.response);
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
      getMarkets();
    }
  }, [toggleLoadData]);

  const handleAddNewMarket = () => {
    document.getElementById("addNewMarketForm").click();
  };

  const addNewMarket = async (e) => {
    e.preventDefault();

    setBtnLoading((prev) => {
      let toggleId;
      if (prev["addMarket"]) {
        toggleId = { ["addMarket"]: false };
      } else {
        toggleId = { ["addMarket"]: true };
      }
      return { ...toggleId };
    });

    let data = {
      name: newMarket.name,
      description: newMarket.description,
      slug: newMarket.slug,
      toggle: convertBooleanToNumber(newMarket.status),
    };

    try {
      const response = await axios.post(`${apiUrl}/api/market/save`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log("createOffer response: ", response.data);

      if (!response?.data?.success) {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      } else {
        setBtnLoading(false);
        setDeleteMarketModal(false);
        setToastMsg(response.data?.message);
        setSucessToast(true);
        if (response?.data?.market?.id) {
          setTimeout(() => {
            navigate(`/market/${response?.data?.market?.id}`);
          }, 500);
        }
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
  };

  return (
    <div className="Products-Page IndexTable-Page Orders-page Markets-Page">
      <Modal
        open={marketModal}
        onClose={handleMarketModal}
        title="Add Market"
        primaryAction={{
          content: "Add",
          loading: btnLoading["addMarket"],
          onAction: handleAddNewMarket,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["addMarket"],
            onAction: handleMarketModal,
          },
        ]}
      >
        <Modal.Section>
          <Form onSubmit={addNewMarket}>
            <div className="Sheet-Container Payment-Sheet">
              <Scrollable className="Sheet-Market">
                <FormLayout>
                  <span className="VisuallyHidden">
                    <Button submit id="addNewMarketForm">
                      Submit
                    </Button>
                  </span>

                  <FormLayout.Group>
                    <InputField
                      type="text"
                      label="Name"
                      name="name"
                      value={newMarket.name}
                      onChange={handleNewMarketDetails}
                      autoComplete="off"
                      required
                      placeholder="Enter Name"
                    />
                    <InputField
                      type="text"
                      label="Slug"
                      name="slug"
                      disabled
                      value={newMarket.slug}
                      required
                      onChange={handleNewMarketDetails}
                      autoComplete="off"
                      placeholder="Slug"
                    />
                  </FormLayout.Group>

                  <InputField
                    type="text"
                    label="Description (optional)"
                    name="description"
                    required
                    value={newMarket.description}
                    onChange={handleNewMarketDetails}
                    autoComplete="off"
                    multiline="4"
                    placeholder="Enter Description"
                  />

                  <span className="Modal-Select">
                    <label htmlFor="marketStatus">Status</label>
                    <input
                      id="marketStatus"
                      type="checkbox"
                      name="status"
                      className="tgl tgl-light"
                      checked={newMarket.status}
                      onChange={handleNewMarketDetails}
                    />
                    <label htmlFor="marketStatus" className="tgl-btn"></label>
                  </span>
                </FormLayout>
              </Scrollable>
            </div>
          </Form>
        </Modal.Section>
      </Modal>

      <Modal
        small
        open={deleteMarketModal}
        onClose={handleDeleteMarketModal}
        title={selectedTab == 3 ? "Delete Market" : "Archive Market?"}
        loading={btnLoading["deleteMarket"]}
        primaryAction={{
          content: selectedTab == 3 ? "Delete" : "Archive?",
          destructive: true,
          disabled: btnLoading["deleteMarket"],
          onAction: selectedTab == 3 ? deleteMarket : archiveMarket,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading["deleteMarket"],
            onAction: handleDeleteMarketModal,
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
          title="Markets"
          primaryAction={{
            content: "Add Market",
            onAction: handleMarketModal,
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
                        placeholder="Search Market"
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
                    itemCount={markets.length}
                    hasMoreItems
                    selectable={false}
                    loading={marketsLoading}
                    emptyState={emptyStateMarkup}
                    headings={[
                      { title: "Name" },
                      { title: "Slug" },
                      { title: "Countries" },
                      {
                        title:
                          selectedTab == 3 ? "Move to Draft" : "Active/Draft",
                      },
                      { title: "" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card.Section>

                {markets?.length > 0 && (
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
