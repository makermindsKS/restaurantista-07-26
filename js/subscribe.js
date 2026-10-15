function subscribeUser(event) {
  event.preventDefault();

  const email = document.getElementById("subscriberEmail").value;
  const isSubscribed = document.getElementById("checkbox").value;

  if (!email || !email.includes("@")) {
    Toastify({
      text: "Please enter a valid email address!",
      duration: 3000,
      close: true,
      gravity: "bottom",
      position: "center",
      backgroundColor: "red",
      stopOnFocus: true,
    }).showToast();
    return;
  }
  const subscriberData = {
    email: email,
    isSubscribed: isSubscribed,
  };

  localStorage.setItem("subscriber", JSON.stringify(subscriberData));
  Toastify({
    text: "You are now subscribed!",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    backgroundColor: "#2c8a45",
    stopOnFocus: true,
  }).showToast();
}

function checkSubscriptionStatus() {
  const subscriber = JSON.parse(localStorage.getItem("subscriber"));

  if (subscriber && subscriber.isSubscribed) {
    document.getElementById("subscriberEmail").value = subscriber.email;

    Toastify({
      text: `Welcome back, ${subscriber.email}!`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "center",
      backgroundColor: "#3498db",
      stopOnFocus: true,
    }).showToast();
  }
}

const subscribeForm = document.getElementById("subscribeForm");
subscribeForm.addEventListener("submit", subscribeUser);
checkSubscriptionStatus();
