// Selecting all required DOM elements
const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeIcon = document.querySelector(".drop-list .icon");
const amountInput = document.querySelector(".amount input");
const exchangeRateText = document.querySelector(".exchange-rate");

// API configuration
const API_KEY = "4a1e285bfd5009f2adb516a1";
const BASE_URL = "https://v6.exchangerate-api.com/v6";

// Country codes for currency flags
const country_code = {
  AED: "ae",
  AFN: "af",
  XCD: "ag",
  ALL: "al",
  AMD: "am",
  ANG: "ai",
  AOA: "ao",
  AQD: "aq",
  ARS: "ar",
  AUD: "au",
  AZN: "az",
  BAM: "ba",
  BBD: "bb",
  BDT: "bd",
  XOF: "be",
  BGN: "bg",
  BHD: "bh",
  BIF: "bi",
  BMD: "bm",
  BND: "bn",
  BOB: "bo",
  BRL: "br",
  BSD: "bs",
  NOK: "bv",
  BWP: "bw",
  BYR: "by",
  BZD: "bz",
  CAD: "ca",
  CDF: "cd",
  XAF: "cf",
  CHF: "ch",
  CLP: "cl",
  CNY: "cn",
  COP: "co",
  CRC: "cr",
  CUP: "cu",
  CVE: "cv",
  CYP: "cy",
  CZK: "cz",
  DJF: "dj",
  DKK: "dk",
  DOP: "do",
  DZD: "dz",
  ECS: "ec",
  EEK: "ee",
  EGP: "eg",
  ETB: "et",
  EUR: "fr",
  FJD: "fj",
  FKP: "fk",
  GBP: "gb",
  GEL: "ge",
  GGP: "gg",
  GHS: "gh",
  GIP: "gi",
  GMD: "gm",
  GNF: "gn",
  GTQ: "gt",
  GYD: "gy",
  HKD: "hk",
  HNL: "hn",
  HRK: "hr",
  HTG: "ht",
  HUF: "hu",
  IDR: "id",
  ILS: "il",
  INR: "in",
  IQD: "iq",
  IRR: "ir",
  ISK: "is",
  JMD: "jm",
  JOD: "jo",
  JPY: "jp",
  KES: "ke",
  KGS: "kg",
  KHR: "kh",
  KMF: "km",
  KPW: "kp",
  KRW: "kr",
  KWD: "kw",
  KYD: "ky",
  KZT: "kz",
  LAK: "la",
  LBP: "lb",
  LKR: "lk",
  LRD: "lr",
  LSL: "ls",
  LTL: "lt",
  LVL: "lv",
  LYD: "ly",
  MAD: "ma",
  MDL: "md",
  MGA: "mg",
  MKD: "mk",
  MMK: "mm",
  MNT: "mn",
  MOP: "mo",
  MRO: "mr",
  MTL: "mt",
  MUR: "mu",
  MVR: "mv",
  MWK: "mw",
  MXN: "mx",
  MYR: "my",
  MZN: "mz",
  NAD: "na",
  XPF: "nc",
  NGN: "ng",
  NIO: "ni",
  NPR: "np",
  NZD: "nz",
  OMR: "om",
  PAB: "pa",
  PEN: "pe",
  PGK: "pg",
  PHP: "ph",
  PKR: "pk",
  PLN: "pl",
  PYG: "py",
  QAR: "qa",
  RON: "ro",
  RSD: "rs",
  RUB: "ru",
  RWF: "rw",
  SAR: "sa",
  SBD: "sb",
  SCR: "sc",
  SDG: "sd",
  SEK: "se",
  SGD: "sg",
  SKK: "sk",
  SLL: "sl",
  SOS: "so",
  SRD: "sr",
  STD: "st",
  SVC: "sv",
  SYP: "sy",
  SZL: "sz",
  THB: "th",
  TJS: "tj",
  TMT: "tm",
  TND: "tn",
  TOP: "to",
  TRY: "tr",
  TTD: "tt",
  TWD: "tw",
  TZS: "tz",
  UAH: "ua",
  UGX: "ug",
  USD: "us",
  UYU: "uy",
  UZS: "uz",
  VEF: "ve",
  VND: "vn",
  VUV: "vu",
  YER: "ye",
  ZAR: "za",
  ZMK: "zm",
  ZWD: "zw",
  // Add more currencies as needed
};

// Initialize currency dropdowns
function initializeCurrencyDropdowns() {
  dropList.forEach((select, index) => {
    // Populate each dropdown with currency options
    for (let currency in country_code) {
      // Set default selections (USD for first dropdown, NPR for second)
      const isSelected =
        (index === 0 && currency === "USD") ||
        (index === 1 && currency === "NPR");

      const option = `<option value="${currency}" ${
        isSelected ? "selected" : ""
      }>${currency}</option>`;
      select.insertAdjacentHTML("beforeend", option);
    }

    // Add change event listener to update flags
    select.addEventListener("change", (e) => loadFlag(e.target));
  });
}

// Update flag image based on selected currency
function loadFlag(element) {
  const imgTag = element.parentElement.querySelector("img");
  const countryCode = country_code[element.value];
  if (!countryCode) return;
  imgTag.onerror = () => (imgTag.src = "default-flag.png"); // Add a default flag image
  imgTag.src = `https://flagcdn.com/h20/${countryCode}.png`;
}

// Fetch and display exchange rate
async function getExchangeRate() {
  // Validate and set default amount
  let amount = amountInput.value;
  if (!amount || amount === "0") {
    amountInput.value = "1";
    amount = 1;
  }

  // Show loading message
  try {
    // Fetch exchange rate from API
    const url = `${BASE_URL}/${API_KEY}/latest/${fromCurrency.value}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    // Calculate and display result
    const rate = data.conversion_rates[toCurrency.value];
    if (!rate) throw new Error("Invalid currency pair");
    const convertedAmount = (amount * rate).toFixed(2);
    exchangeRateText.innerText = `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
  } catch (error) {
    exchangeRateText.innerText = `Error: ${
      error.message || "Something went wrong"
    }`;
  }
}

// Swap currencies function
function swapCurrencies() {
  const tempCurrency = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCurrency;

  // Update flags and recalculate rate
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
}

// Event Listeners
window.addEventListener("load", getExchangeRate);
getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});
exchangeIcon.addEventListener("click", swapCurrencies);

// Initialize the application
initializeCurrencyDropdowns();
