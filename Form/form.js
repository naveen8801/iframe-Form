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

  // onClick Save Button
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

  // If Custom validaiton failed then send errors to parent
  if (Object.keys(customValidationResults).length > 0) {
    let result = {
      passed: false,
      errros: customValidationResults,
    };
    sendDataToParent(JSON.stringify(result));
  } else {
    let result = {
      passed: true,
    };
    sendDataToParent(JSON.stringify(result));
  }

  return false;
};

const sendDataToParent = (val) => {
  // Sending validations result to parent
  if (val) {
    window.parent.postMessage(val, '*');
  }
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const handleCustomValidation = (validators, data) => {
  let errors = {};

  try {
    for (let i = 0; i < validators.length; i++) {
      const field = validators[i].field;
      const validator = validators[i].validator;

      let errs = [];

      for (let j = 0; j < validator.length; j++) {
        const validatorType = Object.keys(validator[j])[0];
        const validatorValue = validator[j][validatorType];

        // Validate required type
        if (
          validatorType === 'required' &&
          validatorValue &&
          data[field].trim().length === 0 &&
          !data.field
        ) {
          errs.push(`${field} is required field`);
        }

        // Validate minLength type
        if (
          validatorType === 'minLength' &&
          data[field].trim().length >= validatorValue
        ) {
          errs.push(`minimum length of ${field} should be ${validatorValue}`);
        }

        // Validate maxLength type
        if (
          validatorType === 'maxLength' &&
          data[field].trim().length <= validatorValue
        ) {
          errs.push(`maximum length of ${field} can be ${validatorValue}`);
        }

        // Validate length type
        if (
          validatorType === 'length' &&
          data[field].trim().length !== validatorValue
        ) {
          errs.push(`length of ${field} should be ${validatorValue}`);
        }

        // Validate validateEmail type ( only in case of email )
        if (validatorType === 'validateEmail' && field === 'email') {
          if (!validateEmail(data.email) && validatorValue) {
            errs.push(`Email should be valid`);
          }
        }

        // Validate lengthRange type
        if (validatorType === 'lengthRange') {
          let minLen = validatorValue.split('-')[0];
          let maxLen = validatorValue.split('-')[0];

          if (
            data[field].trim().length > 0 &&
            (data[field].trim().length < minLen ||
              data[field].trim().length > maxLen)
          ) {
            errs.push(
              `length of ${field} should be in range ${validatorValue}`
            );
          }
        }
      }

      if (errs.length > 0) {
        errors[field] = errs;
      }
    }

    return errors;
  } catch (err) {
    console.log(err);
    console.log('Something went wrong during validation');
    errors['msg'] = 'Something went wrong during validation';
    return errors;
  }
};

const onChangeCountry = async (e) => {
  let val = e.value;
  let statesOptions = [];
  if (val) {
    const countryStateData = await fetchCountries();
    statesOptions = getStatesOptions(countryStateData, val);

    let state = document.getElementById('state');

    removeOptions(document.getElementById('state'));
    var option = document.createElement('option');
    option.text = 'Select state';
    option.value = '';
    state.add(option);

    if (statesOptions.length === 0) {
      removeOptions(document.getElementById('state'));
      var option = document.createElement('option');
      option.text = 'No States';
      option.value = 'No States';
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

/*

{
    "validators": [
        {
            "field": "state",
            "validator": [
                {
                    "required": true
                }
            ]
        },
        {
            "field": "country",
            "validator": [
                {
                    "required": true
                }
            ]
        },
        {
            "field": "email",
            "validator": [
                {
                    "validateEmail": false
                }
            ]
        },
        {
            "field": "name",
            "validator": [
                {
                    "lengthRange": "4-10"
                },
                {
                    "required": true
                }
            ]
        },
        {
            "field": "contact",
            "validator": [
                {
                    "length": 10
                }
            ]
        }
    ]
}


*/
