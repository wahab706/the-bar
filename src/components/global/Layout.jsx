import { useState, useCallback, useRef, useContext, useEffect } from "react";
import { Frame, Navigation, TopBar, Toast } from "@shopify/polaris";
import {
  HomeMinor,
  SettingsMinor,
  ProductsMinor,
  CustomersMinor,
  OrdersMinor,
  MarketsMajor,
  FinancesMinor,
} from "@shopify/polaris-icons";
import { AppContext } from "../providers/ContextProvider";
import { useAuthDispatch, useAuthState } from "../providers/AuthProvider";
import barLogo from "../../assets/barLogo.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  setAccessToken,
  getAccessToken,
  PaymentLoader,
} from "../../components";
import axios from "axios";

const apiUrl = "https://phpstack-899754-3368767.cloudwaysapps.com";

export function SuperAdminLayout({ children }) {
  const params = useParams();
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setBtnLoading] = useState(false);
  const { locationChange, setLocationChange } = useContext(AppContext);
  const skipToContentRef = useRef(null);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.first_name,
    initials: "",
  });

  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

  useEffect(() => {
    if (user?.first_name?.length > 0) {
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
      let initials = [...user.first_name.matchAll(rgx)] || [];
      initials = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();
      setUserDetails({
        name: user?.first_name,
        initials: initials,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    let data = {};
    setBtnLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/logout`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      // console.log("response", response?.data);

      if (response?.data?.success) {
        setAccessToken("");
        dispatch({
          user: null,
          userToken: "",
          userRole: null,
        });
        navigate("/login");
      } else {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      }
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.warn("AuthCheck Api Error", error);
      setToastMsg("Something Went Wrong, Try Again!");
      setErrorToast(true);
    }
  };

  const NavigationMarkupSuperAdmin = (
    <Navigation location={locationChange}>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeMinor,
            url: "/dashboard",
            onClick: () => setLocationChange("/dashboard"),
            selected: location.pathname === "/dashboard",
          },
          {
            label: "Orders",
            icon: OrdersMinor,
            url: "/orders",
            onClick: () => setLocationChange("/orders"),
          },
          {
            label: "Products",
            icon: ProductsMinor,
            url: "/products",
            onClick: () => setLocationChange("/products"),
            subNavigationItems: [
              {
                url: "/product-types",
                onClick: () => setLocationChange("/product-types"),
                label: "Product Types",
              },
            ],
          },
          {
            label: "Customers",
            icon: CustomersMinor,
            url: "/customers",
            onClick: () => setLocationChange("/customers"),
          },
          {
            label: "Vendors",
            icon: CustomersMinor,
            url: "/vendors",
            onClick: () => setLocationChange("/vendors"),
            selected:
              location.pathname === "/vendors" ||
              location.pathname ===
                `/vendor/${location.pathname.split("/vendor/")[1]}`,
          },
          {
            label: "Users",
            icon: CustomersMinor,
            url: "/users",
            onClick: () => setLocationChange("/users"),
          },
          {
            label: "Markets",
            icon: MarketsMajor,
            url: "/markets",
            selected:
              location.pathname === "/markets" ||
              location.pathname ===
                `/market/${location.pathname.split("/market/")[1]}`,
            onClick: () => setLocationChange("/markets"),
          },
          {
            label: "Finance",
            icon: FinancesMinor,
            url: "/finances",
            onClick: () => setLocationChange("/finances"),
          },
          {
            label: "Account",
            icon: account,
            url: "/profile",
            onClick: () => setLocationChange("/profile"),
          },
          {
            label: "Settings",
            icon: SettingsMinor,
            url: "/settings",
            onClick: () => setLocationChange("/settings"),
          },
        ]}
      />
    </Navigation>
  );

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );

  const userMenuActions = [
    {
      items: [
        {
          content: "Logout",
          onAction: handleLogout,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={userDetails.name}
      initials={userDetails.initials}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const logo = {
    width: 124,
    topBarSource: barLogo,
    contextualSaveBarSource: barLogo,
    url: "/",
    accessibilityLabel: "Jaded Pixel",
    onClick: () => setLocationChange("/"),
  };

  return (
    <div style={{ height: "500px" }}>
      {location.pathname == "/login" ||
      location.pathname == "/reset-password" ||
      location.pathname == "/change-password" ? (
        <Frame>{children}</Frame>
      ) : (
        <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={NavigationMarkupSuperAdmin}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
        >
          {children}
        </Frame>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}

      {btnLoading && (
        <div className="Logout-Processing">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export function AdminLayout({ children }) {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setBtnLoading] = useState(false);
  const { locationChange, setLocationChange } = useContext(AppContext);
  const skipToContentRef = useRef(null);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.first_name,
    initials: "",
  });

  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

  useEffect(() => {
    if (user?.first_name?.length > 0) {
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
      let initials = [...user.first_name.matchAll(rgx)] || [];
      initials = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();
      setUserDetails({
        name: user?.first_name,
        initials: initials,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    let data = {};
    setBtnLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/logout`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      // console.log("response", response?.data);

      if (response?.data?.success) {
        setAccessToken("");
        dispatch({
          user: null,
          userToken: "",
          userRole: null,
        });
        navigate("/login");
      } else {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      }
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.warn("AuthCheck Api Error", error);
      setToastMsg("Something Went Wrong, Try Again!");
      setErrorToast(true);
    }
  };

  const NavigationMarkupAdmin = (
    <Navigation location={locationChange}>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeMinor,
            url: "/dashboard",
            onClick: () => setLocationChange("/dashboard"),
            selected: location.pathname === "/dashboard",
          },
          {
            label: "Orders",
            icon: OrdersMinor,
            url: "/orders",
            onClick: () => setLocationChange("/orders"),
          },
          {
            label: "Products",
            icon: ProductsMinor,
            url: "/products",
            onClick: () => setLocationChange("/products"),
            subNavigationItems: [
              {
                url: "/product-types",
                onClick: () => setLocationChange("/product-types"),
                label: "Product Types",
              },
            ],
          },
          {
            label: "Customers",
            icon: CustomersMinor,
            url: "/customers",
            onClick: () => setLocationChange("/customers"),
          },
          {
            label: "Vendors",
            icon: CustomersMinor,
            url: "/vendors",
            onClick: () => setLocationChange("/vendors"),
          },
          {
            label: "Markets",
            icon: MarketsMajor,
            url: "/markets",
            onClick: () => setLocationChange("/markets"),
          },
          {
            label: "Account",
            icon: account,
            url: "/profile",
            onClick: () => setLocationChange("/profile"),
          },
          {
            label: "Settings",
            icon: SettingsMinor,
            url: "/settings",
            onClick: () => setLocationChange("/settings"),
          },
        ]}
      />
    </Navigation>
  );

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );

  const userMenuActions = [
    {
      items: [
        {
          content: "Logout",
          onAction: handleLogout,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={userDetails.name}
      initials={userDetails.initials}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const logo = {
    width: 124,
    topBarSource: barLogo,
    contextualSaveBarSource: barLogo,
    url: "/",
    accessibilityLabel: "Jaded Pixel",
    onClick: () => setLocationChange("/"),
  };

  return (
    <div style={{ height: "500px" }}>
      {location.pathname == "/login" ||
      location.pathname == "/reset-password" ||
      location.pathname == "/change-password" ? (
        <Frame>{children}</Frame>
      ) : (
        <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={NavigationMarkupAdmin}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
        >
          {children}
        </Frame>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}

      {btnLoading && (
        <div className="Logout-Processing">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export function VendorLayout({ children }) {
  const dispatch = useAuthDispatch();
  const { user } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const [btnLoading, setBtnLoading] = useState(false);
  const { locationChange, setLocationChange } = useContext(AppContext);
  const skipToContentRef = useRef(null);
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: user?.first_name,
    initials: "",
  });

  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

  useEffect(() => {
    if (user?.first_name?.length > 0) {
      let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
      let initials = [...user.first_name.matchAll(rgx)] || [];
      initials = (
        (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
      ).toUpperCase();
      setUserDetails({
        name: user?.first_name,
        initials: initials,
      });
    }
  }, [user]);

  const handleLogout = async () => {
    let data = {};
    setBtnLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/logout`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
      // console.log("response", response?.data);

      if (response?.data?.success) {
        setAccessToken("");
        dispatch({
          user: null,
          userToken: "",
          userRole: null,
        });
        navigate("/login");
      } else {
        setToastMsg(response?.data?.message);
        setErrorToast(true);
      }
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      console.warn("AuthCheck Api Error", error);
      setToastMsg("Something Went Wrong, Try Again!");
      setErrorToast(true);
    }
  };

  const NavigationMarkupVendor = (
    <Navigation location={locationChange}>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: HomeMinor,
            url: "/dashboard",
            onClick: () => setLocationChange("/dashboard"),
            selected: location.pathname === "/dashboard",
          },
          {
            label: "Orders",
            icon: OrdersMinor,
            url: "/orders",
            onClick: () => setLocationChange("/orders"),
          },
          {
            label: "Products",
            icon: ProductsMinor,
            url: "/products",
            onClick: () => setLocationChange("/products"),
          },
          {
            label: "Account",
            icon: account,
            url: "/profile",
            onClick: () => setLocationChange("/profile"),
          },
          {
            label: "Settings",
            icon: SettingsMinor,
            url: "/settings",
            onClick: () => setLocationChange("/settings"),
          },
        ]}
      />
    </Navigation>
  );

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );

  const userMenuActions = [
    {
      items: [
        {
          content: "Logout",
          onAction: handleLogout,
        },
      ],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name={userDetails.name}
      initials={userDetails.initials}
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const logo = {
    width: 124,
    topBarSource: barLogo,
    contextualSaveBarSource: barLogo,
    url: "/",
    accessibilityLabel: "Jaded Pixel",
    onClick: () => setLocationChange("/"),
  };

  return (
    <div style={{ height: "500px" }}>
      {location.pathname == "/login" ||
      location.pathname == "/reset-password" ||
      location.pathname == "/change-password" ? (
        <Frame>{children}</Frame>
      ) : (
        <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={NavigationMarkupVendor}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
          skipToContentTarget={skipToContentRef.current}
        >
          {children}
        </Frame>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}

      {btnLoading && (
        <div className="Logout-Processing">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

function account() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 0C4.579 0 0 4.579 0 10C0 15.421 4.579 20 10 20C15.421 20 20 15.421 20 10C20 4.579 15.421 0 10 0ZM10 5C11.727 5 13 6.272 13 8C13 9.728 11.727 11 10 11C8.274 11 7 9.728 7 8C7 6.272 8.274 5 10 5ZM4.894 14.772C5.791 13.452 7.287 12.572 9 12.572H11C12.714 12.572 14.209 13.452 15.106 14.772C13.828 16.14 12.015 17 10 17C7.985 17 6.172 16.14 4.894 14.772Z" />
    </svg>
  );
}
