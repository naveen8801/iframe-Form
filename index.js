window.addEventListener('load', onLoad);

function onLoad() {
  let element = document.getElementById('validationText');
  let resultDiv = document.getElementById('result');

  // Recieve message from iframe
  window.addEventListener('message', function (event) {
    try {
      const result = JSON.parse(event.data);
      if (result.passed) {
        resultDiv.style.color = 'green';
        resultDiv.style.fontSize = '16px';
      } else {
        resultDiv.style.color = 'red';
        resultDiv.style.fontSize = '20px';
      }
      resultDiv.innerHTML = `<p style="text-align :center;">${event.data}</p>`;
    } catch (err) {
      console.log(err);
    }
  });

  // Setting default validations
  let defaultData = JSON.stringify(
    JSON.parse(
      '{"validators":[{"field":"state","validator":[{"required":true}]},{"field":"country","validator":[{"required":true}]},{"field":"email","validator":[{"validateEmail":true}]},{"field":"name","validator":[{"lengthRange":"4-10"},{"required":true}]},{"field":"contact","validator":[{"length":10}]}]}'
    ),
    null,
    4
  );
  element.value = defaultData;

  //Sending Default validations to form
  sendDataToIframe(defaultData);
}

const sendDataToIframe = (val) => {
  // Sending Validations to Iframe
  if (val) {
    let element = document.getElementById('frame1');
    element.contentWindow.postMessage(val, '*');
  }
};

const handleOnFocus = (e) => {
  let element = document.getElementById('validationText');
  if (e.value) {
    try {
      let obj = JSON.parse(e.value);
      element.value = JSON.stringify(obj, null, 4);
      sendDataToIframe(e.value);
    } catch (err) {
      console.log(err);
    }
  }
};
