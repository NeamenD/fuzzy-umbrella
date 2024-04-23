"use strict";

const smartyUrl =
  "https://us-street.api.smartystreets.com/street-address?auth-id=196567255671291494&candidates=10";

const smartyInit = {
  method: "POST", // Specify the method as POST
  headers: {
    "Content-Type": "application/json",
    Host: "us-street.api.smartystreets.com",
  },
  // Add a body if required
  // body: JSON.stringify({ key: value }),
};

const parksUrl =
  "https://ecoajaxproxy-c0f9cdbb0650.herokuapp.com/nps/api/v1/parks?stateCode=ca";

const addressField = document.querySelector("#address");
const cityField = document.querySelector("#city");
const stateField = document.querySelector("#state");
const zipField = document.querySelector("#zip");
const parkThumb = document.querySelector("#specials h2 img");
const parkSection = document.querySelector("#specials");
const parkName = document.querySelector("#specials h2 a");
const parkDesc = document.querySelector("#specials p");

const smartyUpdateUISuccess = function (parsedData) {
  const zip = parsedData[0].components.zipcode;
  const plus4 = parsedData[0].components.plus4_code;
  zipField.value = zip + "-" + plus4;
};

const parkUpdateUISuccess = function (parsedData) {
  const number = Math.floor(Math.random() * parsedData.data.length);
  parkName.textContent = parsedData.data[number].fullName;
  parkName.href = parsedData.data[number].url;
  parkDesc.textContent = parsedData.data[number].description;
  parkThumb.src =
    "https://www.nps.gov/theme/assets/dist/images/branding/logo.png";
  parkSection.classList.remove("hidden");
};

const smartyUpdateUIError = function (error) {
  console.log(error);
};

const parkUpdateUIError = function (error) {
  console.log(error);
};

const handleErrors = function (response) {
  if (!response.ok) {
    throw response.status + ": " + response.statusText;
  }
  return response.json();
};

const createRequest = function (url, succeed, fail, init) {
  fetch(url, init)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .catch((error) => fail(error));
};

const checkCompletion = function () {
  if (
    addressField.value !== "" &&
    cityField.value !== "" &&
    stateField.value !== ""
  ) {
    const requestData = {
      street: addressField.value,
      city: cityField.value,
      state: stateField.value,
    };
    const init = {
      ...smartyInit,
      body: JSON.stringify(requestData),
    };
    createRequest(smartyUrl, smartyUpdateUISuccess, smartyUpdateUIError, init);
  }
};

addressField.addEventListener("blur", checkCompletion);
cityField.addEventListener("blur", checkCompletion);
stateField.addEventListener("blur", checkCompletion);

window.addEventListener("DOMContentLoaded", () => {
  createRequest(parksUrl, parkUpdateUISuccess, parkUpdateUIError);
});
