window.addEventListener('load', onLoad);

function onLoad() {
  let element = document.getElementById('validationText');

  // Setting default validations
  let defaultData = JSON.stringify(
    JSON.parse('{"validators" : [{"field" : "state" , "validator" : [{"required" : true}]}]}'),
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
  console.log(e.value);
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
