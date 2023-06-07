let submit = document.getElementById('submit');
let email = document.getElementById('email').value;

submit.addEventListener('click', (event) => {
  event.preventDefault();

  if(this.email.value == null || this.email.value == "") {
    alert("error: email not added");
  } else {
    let fetchData = {
      method: "POST",
      body: JSON.stringify({email: this.email.value}),
      headers: {"Content-Type": "application/json"}
    }

    fetch('/subscribe', fetchData)
      .then(res => {
        if (res.ok) {
          alert("Success!")
        } else {
          alert("Error!")
        }
      })
    }
  })