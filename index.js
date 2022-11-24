window.addEventListener('load', onLoad);

function onLoad() {
  console.log('in');
  let element = document.getElementById('validationText');
  element.value = JSON.stringify(
    JSON.parse('{"Apple" : true , "B" : "f"}'),
    null,
    4
  );
}

const handleValidationChange = (e) => {};

const handleOnFocus = (e) => {
  let element = document.getElementById('validationText');
  if (e.value) {
    try {
      let obj = JSON.parse(e.value);
      element.value = JSON.stringify(obj, null, 4);
    } catch (err) {
      console.log(err);
    }
  }
};
