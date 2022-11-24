window.addEventListener('load', onLoad);

async function onLoad() {
  //Form elements
  let name = document.getElementById('name');
  let email = document.getElementById('email');
  let contact = document.getElementById('contact');
  let country = document.getElementById('country');
  let state = document.getElementById('state');
  let saveBtn = document.getElementById('saveBtn');
  let form = document.getElementById('myform');

  // Event to recieve validations
  window.addEventListener('message', function (event) {
    document.getElementById('myform').dataset.validators = event.data;
  });

  saveBtn.addEventListener('click', handleSubmit);

  // Fetch Countries and States data
  const countryStateData = await fetchCountries();
  const countriesOptions = getCountriesOptions(countryStateData || []);

  //Set options for country select field
  countriesOptions.map((item) => {
    var option = document.createElement('option');
    option.text = item;
    option.value = item;
    country.add(option);
  });
}

const handleSubmit = (e) => {
  let name = document.getElementById('name');
  let email = document.getElementById('email');
  let contact = document.getElementById('contact');
  let country = document.getElementById('country');
  let state = document.getElementById('state');

  let ele = document.getElementById('myform').dataset;
  let obj = { ...ele }['validators'];

  let validators = JSON.parse(obj);

  let data = {
    name: name.value,
    email: email.value,
    contact: contact.value,
    country: country.value,
    state: state.value,
  };

  let customValidationResults = handleCustomValidation(
    validators['validators'],
    data
  );

  return false;
};

const handleCustomValidation = (validators, data) => {
  console.log(validators);
  console.log(data);
};

const onChangeCountry = async (e) => {
  let val = e.value;
  let statesOptions = [];
  if (val) {
    const countryStateData = await fetchCountries();
    statesOptions = getStatesOptions(countryStateData, val);

    let state = document.getElementById('state');

    if (statesOptions.length === 0) {
      removeOptions(document.getElementById('state'));
      var option = document.createElement('option');
      option.text = 'No States';
      option.value = 'NULL';
      state.add(option);
      return;
    }

    //Set options for states select field
    statesOptions.map((item) => {
      var option = document.createElement('option');
      option.text = item;
      option.value = item;
      state.add(option);
    });
  }
};

const getStatesOptions = (data, country) => {
  let states = [];
  let item = data.filter((item) => item.name === country);
  if (item[0].states) {
    item[0]?.states.map((item) => states.push(item.name));
  }
  return states;
};

function removeOptions(selectElement) {
  var i,
    L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

const getCountriesOptions = (data) => {
  let countries = [];
  data.map((item) => countries.push(item.name));
  return countries;
};

const fetchCountries = async () => {
  let res = await fetch(
    'https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json',
    {
      method: 'GET',
    }
  );
  let jsonRes = await res.json();
  return jsonRes;
};
