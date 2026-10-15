const paymentModal = document.getElementById("payment-modal");
const payButton = document.querySelector(".pay-button");
const successModal = document.getElementById("success-modal");
const paymentForm = document.getElementById("payment-form");

window.onclick = (event) => {
  if (event.target === paymentModal) {
    paymentModal.style.display = "none";
  }
};

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cardNumber = document.getElementById("card-number").value;
  const expirationDate = document.getElementById("expiration-date").value;
  const cvv = document.getElementById("cvv").value;

  const cardNumberRegex = /^[0-9]{16}$/;
  const cleanedCardNumber = cardNumber.replace(/\s+/g, "");

  if (!cardNumberRegex.test(cleanedCardNumber)) {
    alert("Please enter a valid 16 digits card number");
    return;
  }

  const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expirationDateRegex.test(expirationDate)) {
    alert("please enter a valid expiration date. Format MM/YY");
  }

  const cvvRegex = /^[0-9]{3}$/;
  if (!cvvRegex.test(cvv)) {
    alert("Please enter a valid 3 digits cvv");
    return;
  }

  showSuccessModal();
  clearCartItems();
});

const cardNumberInput = document.getElementById("card-number");
cardNumberInput.addEventListener("input", (event) => {
  let input = event.target.value.replace(/\D/g, "");

  input = input.substring(0, 16);

  const formattedCardNumber = input.match(/.{1,4}/g)?.join(" ") || input;

  event.target.value = formattedCardNumber;
});

const expirationDateInput = document.getElementById("expiration-date");
expirationDateInput.addEventListener("input", (event) => {
  let input = event.target.value.replace(/\D/g, "");

  input = input.substring(0, 4);

  if (input.length >= 3) {
    event.target.value = input.substring(0, 2) + "/" + input.substring(2);
  } else {
    event.target.value = input;
  }
});

function clearCartItems() {
  localStorage.removeItem("cart");
  updateCartBadge();
  renderInvoice();
}

function showSuccessModal() {
  paymentModal.style.display = "none";
  successModal.style.display = "flex";

  setTimeout(function () {
    successModal.style.display = "none";
  }, 5000);
}
