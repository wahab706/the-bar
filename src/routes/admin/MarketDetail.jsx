import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useMemo,
} from "react";
import {
  Page,
  Layout,
  Card,
  Scrollable,
  Avatar,
  Stack,
  ButtonGroup,
  Button,
  PageActions,
  Form,
  FormLayout,
  TextField,
  Icon,
  Listbox,
  EmptySearchResult,
  AutoSelection,
  Toast,
  Loading,
  List,
  TextContainer,
  Tag,
  Modal,
  OptionList,
  Autocomplete,
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

export function MarketDetail() {
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
  const [discountId, setDiscountId] = useState();
  const [discardModal, setDiscardModal] = useState(false);

  const [newMarket, setNewMarket] = useState({
    name: "Asia Market",
    slug: "asia-market",
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
    if (newMarket.name) {
      setNewMarket({
        slug: newMarket.name.toLowerCase().replace(" ", "-"),
      });
    }
  }, [newMarket.name]);

  // -------------------Tags------------------------
  const TagsOptionsData = useMemo(
    () => [
      { value: "men", label: "Men" },
      { value: "women", label: "Women" },
      { value: "kids", label: "Kids" },
      { value: "tops", label: "Tops" },
      { value: "shoes", label: "Shoes" },
      { value: "jackets", label: "Jackets" },
      { value: "sale", label: "Sale" },
      { value: "new-arrival", label: "New Arrival" },
      { value: "special-occasion", label: "Special Occasion" },
      { value: "birthday-dresses", label: "Birthday Dresses" },
    ],
    []
  );

  const [tagOptionsSelected, setTagOptionsSelected] = useState("");
  const [tagInputValue, setTagInputValue] = useState("");
  const [tagOptions, setTagOptions] = useState(TagsOptionsData);
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
          setTagOptions(TagsOptionsData);
          setOptionsLoading(false);
          return;
        }

        const filterRegex = new RegExp(value, "i");
        const resultOptions = TagsOptionsData.filter((option) =>
          option.label.match(filterRegex)
        );
        let endIndex = resultOptions.length - 1;
        if (resultOptions.length === 0) {
          endIndex = 0;
        }
        setTagOptions(resultOptions);
        setOptionsLoading(false);
      }, 300);
    },
    [TagsOptionsData, optionsLoading, tagOptionsSelected]
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
    tagOptionsSelected.length > 0 ? (
      <div className="Product-Tags-Stack">
        <Stack spacing="extraTight" alignment="center">
          {tagOptionsSelected.map((option) => {
            let tagLabel = "";
            tagLabel = option.replace("_", " ");
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
      onChange={tagUpdateText}
      label="Vendors"
      value={tagInputValue}
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

  const discardMarket = () => {
    navigate("/admin/markets");
  };

  const handleDiscardModal = () => {
    setDiscardModal(!discardModal);
  };

  const handleUpdateMarket = () => {
    document.getElementById("updateMarketForm").click();
  };

  // =================Countries Modal Code Start Here================
  const [countriesModal, setCountriesModal] = useState(false);
  const [allCountriesChecked, setAllCountriesChecked] = useState(true);
  const [expandedContinent, setExpandedContinent] = useState([]);
  const [continentsList, setContinentsList] = useState([]);
  //   const [allCountries, setAllCountries] = useState([]);
  const [checkedCountries, setCheckedCountries] = useState([]);
  const [previousCheckedCountries, setPreviousCheckedCountries] = useState([]);
  const allCountries = [
    {
      id: 1,
      name: "United States",
      code: "US",
      created_at: "2023-03-16T11:52:42.000000Z",
      updated_at: "2023-03-16T11:52:50.000000Z",
      states: [
        {
          id: 1,
          name: "Alabama",
          code: "AL",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [
            {
              id: 1,
              name: "Phoenix",
              state_id: "1",
              created_at: null,
              updated_at: null,
            },
            {
              id: 2,
              name: "Alabama",
              state_id: "2",
              created_at: null,
              updated_at: null,
            },
          ],
        },
        {
          id: 2,
          name: "Alaska",
          code: "AK",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [
            {
              id: 3,
              name: "Phoenix",
              state_id: "3",
              created_at: null,
              updated_at: null,
            },
            {
              id: 4,
              name: "Alaska",
              state_id: "4",
              created_at: null,
              updated_at: null,
            },
          ],
        },
        {
          id: 3,
          name: "Arizona",
          code: "AZ",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [
            {
              id: 5,
              name: "Phoenix",
              state_id: "5",
              created_at: null,
              updated_at: null,
            },
            {
              id: 6,
              name: "Arizona",
              state_id: "6",
              created_at: null,
              updated_at: null,
            },
          ],
        },
        {
          id: 4,
          name: "Arkansas",
          code: "AR",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
        {
          id: 5,
          name: "California",
          code: "CA",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [
            {
              id: 7,
              name: "Los Angeles",
              state_id: "5",
              created_at: null,
              updated_at: null,
            },
            {
              id: 8,
              name: "San Diego",
              state_id: "5",
              created_at: null,
              updated_at: null,
            },
            {
              id: 10,
              name: "San Jose",
              state_id: "5",
              created_at: null,
              updated_at: null,
            },
          ],
        },
        {
          id: 6,
          name: "Colorado",
          code: "CO",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
        {
          id: 7,
          name: "Connecticut",
          code: "CT",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
        {
          id: 8,
          name: "Delaware",
          code: "DE",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
        {
          id: 9,
          name: "Florida",
          code: "FL",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
        {
          id: 10,
          name: "Georgia",
          code: "GA",
          country_id: "1",
          created_at: null,
          updated_at: null,
          cities: [],
        },
      ],
    },
  ];

  const handleAllCountriesChecked = (newChecked) => {
    setAllCountriesChecked(newChecked);
    if (newChecked == true) {
      selectAllCountries();
    } else {
      setCheckedCountries([]);
    }
  };

  const handleSelectCountriesModal = () => {
    setCountriesModal(true);
  };

  const handleCountriesCancelModal = () => {
    setCountriesModal(false);
    setCheckedCountries(previousCheckedCountries);
  };

  const handleCountriesSaveModal = () => {
    if (checkedCountries?.length > 0) {
      setCountriesModal(false);
      setPreviousCheckedCountries(checkedCountries);
    } else {
      setToastMsg("Atleast one country should be selected!");
      setErrorToast(true);
    }
  };

  function selectAllCountries() {
    let arr = [];
    continentsList?.map((continent) => {
      continent?.children?.map((countries) => {
        arr.push(countries.value);
      });
    });
    setCheckedCountries(arr);
    setPreviousCheckedCountries(arr);
  }

  function getFirstSelectedCountry(val, countries) {
    let value = "";

    if (countries?.length > 0) {
      if (val == "sheet") {
        value = allCountries.find((obj) => obj.code == countries[0]).name;
      } else if (val == "table") {
        value = allCountries.find((obj) => obj.code == countries[0].code).name;
      }
    }

    return value;
  }

  useEffect(() => {
    setContinentsList(groupCountries(allCountries));
    if (checkedCountries?.length < allCountries?.length) {
      setAllCountriesChecked(false);
    } else {
      setAllCountriesChecked(true);
    }
  }, [checkedCountries]);

  function countrySelected(arr, region) {
    let countries = [];
    arr?.map((item) => {
      if (region != "Other") {
        if (item.continent == region) {
          countries.push({ value: item.code, label: item.name });
        }
      } else {
        if (item.continent == "Other" || item.continent == null) {
          countries.push({ value: item.code, label: item.name });
        }
      }
    });
    return countries;
  }

  function getSelectedCountriesLength(region) {
    let number = 0;
    allCountries?.map((item2) => {
      if (region != "Other") {
        if (item2.continent == region) {
          if (checkedCountries.find((obj) => obj == item2.code)) {
            number = number + 1;
          }
        }
      } else {
        if (item2.continent == "Other" || item2.continent == null) {
          if (checkedCountries.find((obj) => obj == item2.code)) {
            number = number + 1;
          }
        }
      }
    });
    return number;
  }

  function groupCountries(data) {
    let arr = [];
    data?.map((item) => {
      let states = [];
      if (item.states?.length > 0) {
        item.states?.map((item2) => {
          let cities = [];
          if (item2.cities?.length > 0) {
            item2.cities?.map((item3) => {
              cities.push({
                value: item3.id,
                label: item3.name,
              });
            });
          }

          states.push({
            value: item2.code,
            label: item2.name,
            children: cities,
          });
        });
      }
      arr.push({
        value: item.code,
        label: item.name,
        children: states,
      });
    });

    return arr;
  }

  useEffect(() => {
    setContinentsList(groupCountries(allCountries));
  }, []);

  // =================Countries Modal Code Ends Here================

  return (
    <div className="Discount-Detail-Page  Market-Detail-Page">
      <Modal
        open={discardModal}
        onClose={handleDiscardModal}
        title="Leave page with unsaved changes?"
        primaryAction={{
          content: "Leave page",
          destructive: true,
          onAction: discardMarket,
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
            <OptionList
              title="AVAILABLE"
              onChange={setTagOptionsSelected}
              options={TagsOptionsData}
              selected={tagOptionsSelected}
              allowMultiple
            />
          </div>
        </Modal.Section>
      </Modal>

      {!loading ? (
        <span>
          <Loading />
          <SkeltonPageForProductDetail />
        </span>
      ) : (
        <Page
          breadcrumbs={[{ content: "Markets", onAction: handleDiscardModal }]}
          title={"Asia Market"}
          primaryAction={{
            content: "Save Market",
            onAction: handleUpdateMarket,
            loading: btnLoading,
          }}
        >
          <Form onSubmit={""}>
            <FormLayout>
              <span className="VisuallyHidden">
                <Button submit id="updateMarketForm">
                  Submit
                </Button>
              </span>

              <Card sectioned title="General Information">
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
                  marginTop
                  type="text"
                  label="Description (optional)"
                  name="description"
                  value={newMarket.description}
                  onChange={handleNewMarketDetails}
                  autoComplete="off"
                  multiline="4"
                  placeholder="Enter Description"
                />
                <br />
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
              </Card>

              <Card sectioned title="Country/State">
                <Scrollable className="Market-Edit-Countries-Scroll">
                  <CheckboxTree
                    nodes={continentsList}
                    checked={checkedCountries}
                    expanded={expandedContinent}
                    onCheck={(checked) => setCheckedCountries(checked)}
                    onExpand={(expanded) => setExpandedContinent(expanded)}
                    icons={{
                      check: <img src={FillCheckBox} alt="checkbox" />,
                      halfCheck: (
                        <span className="Polaris-Icon-Half-Check">
                          <svg
                            viewBox="0 0 20 20"
                            className="Polaris-Icon__Svg"
                            focusable="false"
                            aria-hidden="true"
                          >
                            <path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path>{" "}
                          </svg>
                        </span>
                      ),
                      uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                      expandClose: <Icon source={ChevronDownMinor} />,
                      expandOpen: <Icon source={ChevronUpMinor} />,
                    }}
                  />
                </Scrollable>
              </Card>

              <Card title="Vendor Information">
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
              </Card>
            </FormLayout>
          </Form>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
