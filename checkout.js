document.addEventListener("DOMContentLoaded", () => {
  const orderItems = document.getElementById("orderItems");
  const orderTotal = document.getElementById("orderTotal");
  const form = document.getElementById("checkoutForm");
  const thankYou = document.getElementById("thankYou");
  const cardInfo = document.querySelector(".card-info");

  const selectedCart = JSON.parse(localStorage.getItem("selectedCart")) || [];

  let total = 0;
  selectedCart.forEach((item) => {
    const price = parseFloat(String(item.price).replace(/[₱,]/g, ""));
    const quantity = item.quantity || 1;
    total += price * quantity;

    const li = document.createElement("li");
    li.textContent = `${item.title} (${item.size}) - ₱${price.toLocaleString()} x ${quantity}`;
    orderItems.appendChild(li);
  });

  orderTotal.textContent = total.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });

  // Toggle card input visibility
  document.querySelectorAll("input[name='payment']").forEach((radio) => {
    radio.addEventListener("change", () => {
      cardInfo.classList.toggle("hidden", radio.value !== "Card" || !radio.checked);
    });
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.classList.add("hidden");
    thankYou.classList.remove("hidden");
    localStorage.removeItem("selectedCart");
    localStorage.removeItem("cart");
  });
});
// ===============================
// PAYMENT METHOD TOGGLE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const paymentRadios = document.querySelectorAll("input[name='payment']");
  const cardInfo = document.querySelector(".card-info");

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      cardInfo.style.display = (radio.value === "Card" && radio.checked) ? "block" : "none";
    });
  });

  // ===============================
  // FORM SUBMISSION
  // ===============================
  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.style.display = "none";
    document.getElementById("thankYou").style.display = "block";
  });
});

// ===============================
// GOOGLE MAPS + AUTOCOMPLETE
// ===============================
let map, marker, autocomplete;

function initMap() {
  const defaultLocation = { lat: 14.5995, lng: 120.9842 }; // Manila default

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map: map,
    position: defaultLocation,
    draggable: true,
  });

  const input = document.getElementById("address");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // When user selects an address from autocomplete
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.setCenter(place.geometry.location);
    marker.setPosition(place.geometry.location);
  });

  // Update address when marker is moved
  marker.addListener("dragend", () => {
    const pos = marker.getPosition();
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results[0]) {
        document.getElementById("address").value = results[0].formatted_address;
      }
    });
  });
}
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Hide form and show thank-you message
  document.getElementById("checkoutForm").classList.add("hidden");
  const thankYou = document.getElementById("thankYou");
  thankYou.classList.remove("hidden");

  // Trigger confetti
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    document.querySelector(".checkout-container").appendChild(confetti);

    setTimeout(() => confetti.remove(), 2500);
  }
});
