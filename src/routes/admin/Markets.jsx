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
} from "@shopify/polaris";
import { SearchMinor, DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  SkeltonPageForTable,
  getAccessToken,
  InputField,
} from "../../components";
import axios from "axios";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";

const marketsData = [
  {
    id: "1",
    name: "All",
    status: true,
    countries: "all",
  },
  {
    id: "2",
    name: "Asia",
    status: true,
    countries: "42",
  },
  {
    id: "3",
    name: "Europe",
    status: false,
    countries: "55",
  },
  {
    id: "4",
    name: "All",
    status: false,
    countries: "27",
  },
  {
    id: "5",
    name: "Africa",
    status: true,
    countries: "10",
  },
];

export function Markets() {
  const { apiUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [storeUrl, setStoreUrl] = useState("");

  const [marketModal, setMarketModal] = useState(false);
  const [markets, setMarkets] = useState(marketsData);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [marketStatus, setMarketStatus] = useState("");

  const [newMarket, setNewMarket] = useState({
    name: "",
    slug: "",
    description: "",
    status: false,
  });

  const handleNewMarketDetails = (e) => {
    if (e.target.name == "status") {
      setNewMarket({ ...newMarket, [e.target.name]: e.target.checked });
    } else {
      setNewMarket({ ...newMarket, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (newMarket.name) {
      setNewMarket({
        slug: newMarket.name.toLowerCase().replace(" ", "-"),
      });
    }
  }, [newMarket.name]);

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selected != selectedTabIndex) {
      setSelected(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setMarketStatus("");
      } else if (selectedTabIndex == 1) {
        setMarketStatus("ACTIVE");
      } else if (selectedTabIndex == 2) {
        setMarketStatus("DRAFT");
      } else if (selectedTabIndex == 3) {
        setMarketStatus("ARCHIVED");
      }
      setPageCursorValue("");
      // setToggleLoadData(true);
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
      status: false,
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
    if (value === true) {
      booleanValue = 1;
    } else {
      booleanValue = 0;
    }

    return booleanValue;
  }

  function convertNumberToBoolean(value) {
    let booleanValue;
    if (value === 1) {
      booleanValue = true;
    } else {
      booleanValue = false;
    }
    return booleanValue;
  }

  // ---------------------Tag/Filter Code Start Here----------------------
  const handleQueryValueRemove = () => {
    setPageCursorValue("");
    setQueryValue("");
    setToggleLoadData(true);
  };
  const handleFiltersQueryChange = (value) => {
    setPageCursorValue("");
    setQueryValue(value);
    setTimeout(() => {
      setToggleLoadData(true);
    }, 1000);
  };

  const handlePagination = (value) => {
    if (value == "next") {
      setPageCursorValue(nextPageCursor);
    } else {
      setPageCursorValue(previousPageCursor);
    }
    setPageCursor(value);
    setToggleLoadData(true);
  };

  // ---------------------Index Table Code Start Here----------------------

  const resourceName = {
    singular: "Market",
    plural: "Markets",
  };

  const rowMarkup = markets?.map(({ id, name, status, countries }, index) => (
    <IndexTable.Row id={id} key={id} position={index}>
      <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          {name}
        </Text>
      </IndexTable.Cell>

      <IndexTable.Cell>
        <span
          className="small-tgl-btn"
          // onClick={() => updateShippingStatus(id, status)}
        >
          <input
            id={id}
            type="checkbox"
            className="tgl tgl-light"
            onChange={() => ""}
            checked={status}
          />
          <label htmlFor={id} className="tgl-btn"></label>
        </span>
      </IndexTable.Cell>

      <IndexTable.Cell className="Capitalize-Cell">
        {countries == "all" ? (
          <Text variant="headingSm" as="h6">
            <span>🌍</span>
            &nbsp;
            <span>All countries</span>
          </Text>
        ) : (
          <Text variant="headingSm" as="h6">
            <span>Afghanistan</span>
            &nbsp;
            <small>{`+ ${countries} others`}</small>
          </Text>
        )}
      </IndexTable.Cell>

      <IndexTable.Cell className="Polaris-IndexTable-Delete-Column">
        <ButtonGroup>
          <Tooltip content="Edit Market">
            <Button onClick={() => editMarket(id)}>
              <Icon source={EditMinor}></Icon>
            </Button>
          </Tooltip>

          <Tooltip content="Move to Archive">
            <Button
            // onClick={() => handleDeleteTax(id)}
            >
              <Icon source={DeleteMinor}></Icon>
            </Button>
          </Tooltip>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Markets Found"} withIllustration />
  );

  const handleClearStates = () => {
    setMarkets([]);
    setPageCursorValue("");
    setNextPageCursor("");
    setPreviousPageCursor("");
  };

  // ---------------------Api Code starts Here----------------------

  const getOrders = async () => {
    setMarketsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/shopify/order?title=${queryValue}&${pageCursor}=${pageCursorValue}&status=${marketStatus}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getOrders response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        let markets = response.data.data.body?.data?.markets;
        let ordersArray = [];
        let nextValue = "";

        if (markets?.edges?.length > 0) {
          let previousValue = markets.edges[0]?.cursor;
          markets?.edges?.map((item) => {
            nextValue = item.cursor;
            ordersArray.push({
              id: item.node.id.replace("gid://shopify/Order/", ""),
              name: item.node.name,
              date: item.node.processedAt,
              quantity: item.node.currentSubtotalLineItemsQuantity,
              paymentStatus: item.node.displayFinancialStatus,
              fulfillmentStatus: item.node.displayFulfillmentStatus,
              deliveryMethod: item.node.shippingLine?.title,
              customerFName: item.node.customer?.firstName,
              customerLName: item.node.customer?.lastName,
            });
          });

          setMarkets(ordersArray);
          setPageCursorValue("");
          setNextPageCursor(nextValue);
          setPreviousPageCursor(previousValue);
          setHasNextPage(markets.pageInfo?.hasNextPage);
          setHasPreviousPage(markets.pageInfo?.hasPreviousPage);
        } else {
          handleClearStates();
        }
        setStoreUrl(response.data.user?.shopifyShopDomainName);
      }

      setLoading(false);
      setMarketsLoading(false);
      setToggleLoadData(false);
    } catch (error) {
      console.warn("getOrders Api Error", error.response);
      setLoading(false);
      // setMarketsLoading(false)
      setToastMsg("Server Error");
      setToggleLoadData(false);
      setErrorToast(true);
      handleClearStates();
    }
  };

  // useEffect(() => {
  //   if (toggleLoadData) {
  //     getOrders();
  //   }
  // }, [toggleLoadData]);

  const handleAddNewMarket = () => {
    document.getElementById("addNewMarketForm").click();
  };

  const addNewMarket = (e) => {
    e.preventDefault();
    navigate(`/market/${"1"}`);
    // alert("new market added");
  };

  const editMarket = (id) => {
    navigate(`/market/${id}`);
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
                      value={newMarket.slug}
                      onChange={handleNewMarketDetails}
                      autoComplete="off"
                      required
                      placeholder="Slug"
                    />
                  </FormLayout.Group>

                  <InputField
                    type="text"
                    label="Description (optional)"
                    name="description"
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

      {!loading ? (
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
              selected={selected}
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
                      { title: "Active/Draft" },
                      { title: "Countries" },
                      // { title: "" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card.Section>

                {/* <Card.Section>
                  <div className="data-table-pagination">
                    <Pagination
                      hasPrevious={hasPreviousPage ? true : false}
                      onPrevious={() => handlePagination("prev")}
                      hasNext={hasNextPage ? true : false}
                      onNext={() => handlePagination("next")}
                    />
                  </div>
                </Card.Section> */}
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
