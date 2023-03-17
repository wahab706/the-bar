import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Layout,
  Button,
  Loading,
  Card,
  Icon,
  Tabs,
  Text,
  TextField,
  Toast,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import shopify from "../../assets/icons/shopify.svg";
import namecheap from "../../assets/icons/namecheap.svg";
import godaddy from "../../assets/icons/godaddy.svg";
import clipBoard from "../../assets/icons/clipBoard.svg";
import axios from "axios";
import { SkeltonTabsLayoutSecondary, getAccessToken } from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import { useAuthState } from "../../components/providers/AuthProvider";

export function Settings() {
  const { user } = useAuthState();
  const { apiUrl } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [toggleLoadProfile, setToggleLoadProfile] = useState(true);

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

  const tabs = [
    // {
    //     id: '1',
    //     content: 'Custom Domain',
    // },
    {
      id: "2",
      content: "Checkify Script",
    },
    {
      id: "3",
      content: "Buy Link",
    },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    []
  );

  function copyTextToClipboard(id, text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successfully" : "unsuccessful";
      document.getElementById(id).style.display = "block";

      const timer = setTimeout(() => {
        document.getElementById(id).style.display = "none";
      }, 1000);
    } catch (err) {
      alert("unable to copy");
    }

    document.body.removeChild(textArea);
  }

  const publishScript = async () => {
    setBtnLoading(true);
    let data = {};
    try {
      const response = await axios.post(`${apiUrl}/api/script-publish`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      console.log("publishScript Api response: ", response.data);
      setToastMsg("Sucessfully Published");
      setSucessToast(true);

      setBtnLoading(false);
    } catch (error) {
      console.warn("publishScript Api Error", error.response);
      setBtnLoading(false);
      setToastMsg("Failed to publish");
      setErrorToast(true);
    }
  };

  return (
    <div className="Settings-Page">
      <Page fullWidth title="Settings">
        {/* <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    {(() => {
                        switch (selectedTab) {
                            case 0:
                                return (
                                    <div className='Custom-Domain-Tab'>
                                        <Layout>
                                            <Layout.Section secondary>
                                                <Text variant="headingMd" as="h6">
                                                    Connect your domain to Checkify
                                                </Text>

                                                <Text variant="bodyMd" as="p">
                                                    Improve your checkout branding, customer trust & ads tracking performance by connecting your store domain to your checkout.
                                                </Text>

                                            </Layout.Section>

                                            <Layout.Section >
                                                <span className='Flex-Space-Center'>
                                                    <Card>
                                                        <Card.Section >
                                                            <Text variant="headingMd" as="h6">
                                                                You can't add .myshopify.com domain to Checkify.
                                                            </Text>

                                                            <Text variant="bodyMd" as="p" color='subdued'>
                                                                Please, set custom domain as a primary one. You can buy it from the one of popular providers listed below.
                                                            </Text>

                                                            <span>
                                                                <ButtonGroup>
                                                                    <a href="https://onecheckout.myshopify.com/admin/settings/domains" target="_blank" rel="noopener noreferrer">
                                                                        <Button>
                                                                            <img src={shopify} alt="shopify" />
                                                                        </Button>
                                                                    </a>

                                                                    <a href="https://godaddy.com/" target="_blank" rel="noopener noreferrer">
                                                                        <Button>
                                                                            <img src={godaddy} alt="godaddy" />
                                                                        </Button>
                                                                    </a>

                                                                    <a href="https://www.namecheap.com/" target="_blank" rel="noopener noreferrer">
                                                                        <Button>
                                                                            <img src={namecheap} alt="namecheap" />
                                                                        </Button>
                                                                    </a>
                                                                </ButtonGroup>
                                                            </span>
                                                        </Card.Section>
                                                    </Card>
                                                </span>
                                            </Layout.Section>
                                        </Layout>

                                        <Layout>
                                            <Layout.Section secondary>
                                                <Text variant="headingMd" as="h6">
                                                    Checkify branding
                                                </Text>

                                                <Text variant="bodyMd" as="p">
                                                    Can only be removed from checkout page after custom domain verification.
                                                </Text>

                                            </Layout.Section>

                                            <Layout.Section >
                                                <span className='Flex-Space-Between'>
                                                    <Card>
                                                        <Card.Section >
                                                            <Text variant="bodyMd" as="p" color='subdued'>
                                                                Remove “©️ Checkify” label from your checkout
                                                            </Text>

                                                            <span>
                                                                <input
                                                                    id='branding'
                                                                    disabled
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                // checked={shippingFormToggle}
                                                                // onChange={handleShippingFormToggle}
                                                                />
                                                                <label htmlFor='branding' className='tgl-btn'></label>
                                                            </span>
                                                        </Card.Section>
                                                    </Card>
                                                </span>

                                            </Layout.Section>
                                        </Layout>
                                    </div>
                                )

                            case 0:
                                return (
                                    <div className='Checkify-Script-Tab'>
                                        <Layout>
                                            <Layout.Section secondary>
                                                <Text variant="headingMd" as="h6">
                                                    Checkify Script
                                                </Text>

                                                <Text variant="bodyMd" as="p">
                                                    This script was automatically generated and embedded into your Shopify Store theme when Checkify connects.
                                                </Text>

                                                <Text variant="bodyMd" as="p">
                                                    With all permissions granted, this script redirects users to Checkify's checkout from the shopping cart and buy buttons.
                                                </Text>

                                            </Layout.Section>

                                            <Layout.Section >
                                                <span className='Flex-Space-Start'>
                                                    <Card>
                                                        <Card.Section >
                                                            <Text variant="headingMd" as="h6">
                                                                Checkify Script
                                                            </Text>

                                                            <Text variant="bodyMd" as="p" >
                                                                This script was automatically generated and embedded into your Shopify Store theme when Checkify connects. With all permissions granted, this script redirects users to Checkify's checkout from the shopping cart and buy buttons.
                                                            </Text>


                                                            <Text variant="bodyMd" as="p" >
                                                                {' In some cases, we may ask you to add this script to your theme manually. For this, go to '}
                                                                <strong>
                                                                    {' Online Store > Themes > Current theme > Actions > Edit code.'}
                                                                </strong>

                                                                {' Find'}
                                                                <strong>
                                                                    {' theme.liquid'}
                                                                </strong>

                                                                {' file in the left menu and add this script right before closing '}
                                                                <strong>
                                                                    {' </head>'}
                                                                </strong>

                                                                {' tag.'}
                                                            </Text>


                                                            <span className='Custom-TextField-Label'>
                                                                <TextField
                                                                    disabled
                                                                    type="text"
                                                                    label={
                                                                        <span className='Custom-Label'>
                                                                            <span>Script</span>
                                                                            <span>
                                                                                <p id='copyToCliboard'>Copied</p>
                                                                                <Button onClick={() =>
                                                                                    copyTextToClipboard('copyToCliboard', '<script data-checkify-url="https://phpstack-908320-3153127.cloudwaysapps.com" async="" src="https://phpstack-908320-3153127.cloudwaysapps.com/script.js"></script>')}>
                                                                                    <img src={clipBoard} alt="clipboard" />
                                                                                </Button>
                                                                            </span>

                                                                        </span>
                                                                    }
                                                                    value='<script data-checkify-url="https://phpstack-908320-3153127.cloudwaysapps.com" async="" src="https://phpstack-908320-3153127.cloudwaysapps.com/script.js"></script>'
                                                                    autoComplete="off"
                                                                />
                                                            </span>

                                                            <br />
                                                            <Text variant="bodyMd" as="p" >
                                                                {' If you would like to temporarily disable Checkify on your store, convert this script to a comment. For this, locate this script in'}
                                                                <strong>{' theme.liquid'} </strong>
                                                                {' and enclose it in'}
                                                                <strong > {' <!--'} </strong>
                                                                {' and '}
                                                                <strong > {' -->'} </strong>
                                                                {' tags. Thus, when you want to enable Checkify, you can simply remove the comment tags.'}
                                                            </Text>

                                                            <Button
                                                                primary
                                                                loading={btnLoading}
                                                                onClick={publishScript}
                                                            >
                                                                Republish Script
                                                            </Button>

                                                        </Card.Section>
                                                    </Card>
                                                </span>
                                            </Layout.Section>
                                        </Layout>
                                    </div>
                                )

                            case 1:
                                return (
                                    <div className='Buy-Link-Tab'>
                                        <Layout>
                                            <Layout.Section secondary>
                                                <Text variant="headingMd" as="h6">
                                                    Buy link
                                                </Text>

                                                <Text variant="bodyMd" as="p">
                                                    You can send them to customers directly or add to custom landings, use in email marketing, etc.
                                                </Text>

                                            </Layout.Section>

                                            <Layout.Section >
                                                <span className='Flex-Space-Start'>
                                                    <Card>
                                                        <Card.Section >
                                                            <Text variant="headingMd" as="h6">
                                                                Direct Checkout Link Template
                                                            </Text>

                                                            <Text variant="bodyMd" as="p" >
                                                                Direct checkout links ("Buy Links") are created from the product(s) variant ID, their quantity and discount code (optional). You can share them with customers, add to the custom landings, use in email marketing etc.
                                                            </Text>

                                                            <span className='Custom-TextField-Label'>
                                                                <TextField
                                                                    disabled
                                                                    type="text"
                                                                    label={
                                                                        <span className='Custom-Label'>
                                                                            <span>Generated link</span>
                                                                            <span>
                                                                                <p id='copyToCliboard'>Copied</p>
                                                                                <Button onClick={() =>
                                                                                    copyTextToClipboard('copyToCliboard', `https://phpstack-908320-3153127.cloudwaysapps.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`)}>
                                                                                    <img src={clipBoard} alt="clipboard" />
                                                                                </Button>

                                                                            </span>

                                                                        </span>
                                                                    }
                                                                    value={`https://phpstack-908320-3153127.cloudwaysapps.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`}
                                                                    autoComplete="off"
                                                                />
                                                            </span>
                                                            <br />
                                                            <Text variant="headingMd" as="h6">
                                                                Use this template to create “Buy Link” for your store:
                                                            </Text>
                                                            <br />
                                                            <Text variant="bodyMd" as="p" >
                                                                {`https://phpstack-908320-3153127.cloudwaysapps.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=[VARIANT-ID-1]:[QUANTITY-1],[VARIANT-ID-2]:[QUANTITY-2]&discount=[DISCOUNT CODE]`}
                                                            </Text>

                                                            <Text variant="bodyMd" as="p" >
                                                                {`Link example: https://phpstack-908320-3153127.cloudwaysapps.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=123456789:1&discount=CHECKIFY`}
                                                            </Text>
                                                            <br />
                                                            <a href="https://help.checkify.pro/en/articles/4784506-direct-checkout-links-buy-links" target="_blank" rel="noopener noreferrer">
                                                                <Button plain>
                                                                    Go to helpdesk
                                                                    <Icon source={ExternalMinor}></Icon>
                                                                </Button>
                                                            </a>


                                                        </Card.Section>
                                                    </Card>
                                                </span>
                                            </Layout.Section>
                                        </Layout>
                                    </div>
                                )

                            default:
                                break
                        }

                    })()}
                </Tabs> */}
      </Page>
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
