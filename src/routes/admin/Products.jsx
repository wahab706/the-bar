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
  Avatar,
  Pagination,
  Badge,
  EmptySearchResult,
  Toast,
  Tooltip,
} from "@shopify/polaris";
import { SearchMinor, ViewMinor } from "@shopify/polaris-icons";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  SkeltonPageForTable,
  getAccessToken,
  CustomBadge,
} from "../../components";
import axios from "axios";

const productsData = [
  {
    id: "1",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "2",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "3",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black_1f5b46cb-a2dd-40a9-995d-bee23f469987_350x350.jpg?v=1667404652",
  },
  {
    id: "4",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/TysonJogger-Red_MER_360x_4d34951c-33b3-4840-8596-7587b3ec4483_350x350.jpg?v=1666359474",
  },
  {
    id: "5",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "6",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black_1f5b46cb-a2dd-40a9-995d-bee23f469987_350x350.jpg?v=1667404652",
  },
  {
    id: "7",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "8",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "9",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/black_1f5b46cb-a2dd-40a9-995d-bee23f469987_350x350.jpg?v=1667404652",
  },
  {
    id: "10",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "11",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "12",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "13",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "14",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "15",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "16",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "17",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "18",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "19",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "20",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "21",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "22",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "23",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "24",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "25",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "26",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "27",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "28",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "29",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "30",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
  {
    id: "31",
    url: "341",
    product: "Dance of the devil",
    status: "ACTIVE",
    Inventory: "712 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/08-25-22Studio5_RD_CC_09-18-03_23_FNTN47_Orange_4728_JB_360x_a539bae9-5754-41ab-b6d8-9a0195a3bb89_350x350.jpg?v=1666359404",
  },
  {
    id: "32",
    url: "256",
    product: "Los Angeles Lakers Jogger",
    status: "ACTIVE",
    Inventory: "35 in Stock",
    Type: "Jeans",
    Vendor: "Webinopoly",
    image:
      "https://cdn.shopify.com/s/files/1/0136/5223/0203/products/10-05-22Studio3_KJ_IM_13-30-33_75_TFAF314_Black_P_0642_JB_360x_25efc501-034b-4971-bd92-c2d4530b3c64_350x350.jpg?v=1666252405",
  },
];

export function Products() {
  const { apiUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [storeUrl, setStoreUrl] = useState("");

  const [products, setProducts] = useState(productsData);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [pageCursor, setPageCursor] = useState("next");
  const [nextPageCursor, setNextPageCursor] = useState("");
  const [previousPageCursor, setPreviousPageCursor] = useState("");
  const [pageCursorValue, setPageCursorValue] = useState("");
  const [productStatus, setProductStatus] = useState("");

  // ---------------------Tabs Code Start Here----------------------

  const handleTabChange = (selectedTabIndex) => {
    if (selected != selectedTabIndex) {
      setSelected(selectedTabIndex);
      if (selectedTabIndex == 0) {
        setProductStatus("");
      } else if (selectedTabIndex == 1) {
        setProductStatus("ACTIVE");
      } else if (selectedTabIndex == 2) {
        setProductStatus("DRAFT");
      } else if (selectedTabIndex == 3) {
        setProductStatus("ARCHIVED");
      }
      setPageCursorValue("");
      setToggleLoadData(true);
    }
  };

  const tabs = [
    {
      id: "all-products",
      content: "All",
      accessibilityLabel: "All products",
      panelID: "all-products-content",
    },
    {
      id: "active-products",
      content: "Active",
      panelID: "active-products-content",
    },
    {
      id: "draft-products",
      content: "Draft",
      panelID: "draft-products-content",
    },
    {
      id: "archived-products",
      content: "Archived",
      panelID: "archived-products-content",
    },
  ];

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

  // ---------------------Tag/Filter Code Start Here----------------------
  const handleQueryValueRemove = () => {
    setQueryValue("");
    setPageCursorValue("");
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
    singular: "product",
    plural: "products",
  };

  const rowMarkup = products.map(
    (
      {
        id,
        product,
        handle,
        image,
        status,
        totalInventory,
        Type,
        Vendor,
        totalVariants,
      },
      index
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell className="Polaris-IndexTable-Image">
          <Avatar size="small" shape="square" name={product} source={image} />
        </IndexTable.Cell>

        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <div>
            <Text variant="bodyMd" fontWeight="semibold" as="span">
              {product}
            </Text>
          </div>
        </IndexTable.Cell>

        <IndexTable.Cell>
          <CustomBadge value={status} type="products" />
        </IndexTable.Cell>

        <IndexTable.Cell>
          {totalInventory != null ? (
            <Text variant="bodyMd" as="p" fontWeight="regular">
              <Text
                variant="bodyMd"
                as="span"
                fontWeight="regular"
                color={totalInventory < 1 && "critical"}
              >
                {totalInventory}
              </Text>{" "}
              in stock
              {totalVariants > 0 && ` for ${totalVariants} variants `}
            </Text>
          ) : (
            <Text variant="bodyMd" as="p" fontWeight="regular" color="subdued">
              Inventory not tracked
            </Text>
          )}
        </IndexTable.Cell>

        <IndexTable.Cell>{Type ? Type : "---"}</IndexTable.Cell>

        <IndexTable.Cell>{Vendor ? Vendor : "---"}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult title={"No Products Found"} withIllustration />
  );

  const handleClearStates = () => {
    setProducts([]);
    setPageCursor("next");
    setPageCursorValue("");
    setHasNextPage(false);
    setHasPreviousPage(false);
  };

  // ---------------------Api Code starts Here----------------------
  const getProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/shopify/products?title=${queryValue}&${pageCursor}=${pageCursorValue}&status=${productStatus}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('getProducts response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        let products = response.data.data.body?.data?.products;
        let productsArray = [];
        let nextValue = "";

        if (products.edges?.length > 0) {
          let previousValue = products.edges[0]?.cursor;
          products.edges.map((item) => {
            nextValue = item.cursor;
            productsArray.push({
              id: item.node.id.replace("gid://shopify/Product/", ""),
              title: item.node.title,
              handle: item.node.handle,
              status: item.node.status,
              vendor: item.node.vendor,
              productType: item.node.productType,
              totalInventory: item.node.totalInventory,
              totalVariants: item.node.totalVariants,
              image: item.node.featuredImage?.transformedSrc,
            });
          });

          setProducts(productsArray);
          setPageCursorValue("");
          setNextPageCursor(nextValue);
          setPreviousPageCursor(previousValue);
          setHasNextPage(products.pageInfo?.hasNextPage);
          setHasPreviousPage(products.pageInfo?.hasPreviousPage);
        } else {
          handleClearStates();
        }

        setStoreUrl(response.data.user?.shopifyShopDomainName);
      }

      setLoading(false);
      setProductsLoading(false);
      setToggleLoadData(false);
    } catch (error) {
      console.warn("getProducts Api Error", error.response);
      setLoading(false);
      setToastMsg("Server Error");
      setErrorToast(true);
      setToggleLoadData(false);
      handleClearStates();
    }
  };

  // useEffect(() => {
  //   if (toggleLoadData) {
  //     getProducts();
  //   }
  // }, [toggleLoadData]);

  return (
    <div className="Products-Page IndexTable-Page">
      {!loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
        <Page fullWidth title="Products">
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
                        placeholder="Search Product"
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
                    itemCount={products.length}
                    hasMoreItems
                    selectable={false}
                    loading={productsLoading}
                    emptyState={emptyStateMarkup}
                    headings={[
                      { title: "" },
                      { title: "Product" },
                      { title: "Status" },
                      { title: "Inventory" },
                      { title: "Type" },
                      { title: "Vendor", hidden: false },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card.Section>

                <Card.Section>
                  <div className="data-table-pagination">
                    <Pagination
                      hasPrevious={hasPreviousPage ? true : false}
                      onPrevious={() => handlePagination("prev")}
                      hasNext={hasNextPage ? true : false}
                      onNext={() => handlePagination("next")}
                    />
                  </div>
                </Card.Section>
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
