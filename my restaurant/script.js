function formatNaira(n){ return "₦" + Number(n).toLocaleString(); }

function calculateBill(){
  const price = Number(document.getElementById("mealPrice").value);
  const qty = Number(document.getElementById("qty").value);
  const zoneEl = document.getElementById("zone");
  const deliveryFee = Number(zoneEl.value);
  const zoneText = zoneEl.options[zoneEl.selectedIndex].text;
  const promoInput = document.getElementById("promo").value.trim().toUpperCase();

  // NEW RULE: Minimum price is ₦8,500 - Block ₦2,500 and others below
  if(!price || price < 8500){
    alert("Invalid price! Minimum meal price for The Gideons Restaurant is ₦8,500. Example: Party Rice & Turkey Pack = ₦8,500");
    return;
  }
  if(!qty || qty < 1){ alert("Please enter Number of Packs (min 1)"); return; }

  const subtotal = price * qty;

  // Festive Bulk Discount - EXACT as instruction
  let bulkRate = 0;
  let statusText = "";
  if(subtotal >= 40000){
    bulkRate = 0.10;
    statusText = "10% Holiday Bulk Discount";
  } else if(subtotal >= 20000){
    bulkRate = 0.05;
    statusText = "5% Festive Discount";
  } else {
    bulkRate = 0;
    statusText = "Standard Price - No Discount";
  }
  const bulkDiscount = Math.round(subtotal * bulkRate);

  let promoDiscount = 0;
  let promoLabel = "None";
  if(promoInput === "XMASFEAST" || promoInput === "NEWYEAR2027"){
    promoDiscount = 1500;
    promoLabel = promoInput;
  } else if(promoInput !== ""){
    promoLabel = promoInput + " (Invalid)";
  }

  let total = (subtotal - bulkDiscount - promoDiscount) + deliveryFee;
  if(total < 0) total = 0;

  const orderId = "FEST-" + Math.floor(1000 + Math.random()*9000);
  const order = { price, qty, deliveryFee, zoneText, promoInput, subtotal, bulkDiscount, bulkRate, statusText, promoDiscount, promoLabel, total, orderId };

  localStorage.setItem("festiveOrder", JSON.stringify(order));
  displayReceipt(order);
}

function displayReceipt(order){
  document.getElementById("receipt").style.display = "block";
  document.getElementById("receiptOrderId").textContent = "Order ID: " + order.orderId;
  document.getElementById("rPrice").textContent = formatNaira(order.price);
  document.getElementById("rQty").textContent = order.qty;
  document.getElementById("rSubtotal").textContent = formatNaira(order.subtotal);
  document.getElementById("rBulk").textContent = "- " + formatNaira(order.bulkDiscount) + (order.bulkRate ? " (" + (order.bulkRate*100) + "%)" : " (0%)");
  document.getElementById("rStatus").textContent = order.statusText;
  document.getElementById("rPromoCode").textContent = order.promoLabel;
  document.getElementById("rPromo").textContent = "- " + formatNaira(order.promoDiscount);
  document.getElementById("rZone").textContent = order.zoneText;
  document.getElementById("rDelivery").textContent = formatNaira(order.deliveryFee);
  document.getElementById("rTotal").textContent = formatNaira(order.total);
}

function clearOrder(){
  localStorage.removeItem("festiveOrder");
  document.getElementById("mealPrice").value = "";
  document.getElementById("qty").value = 1;
  document.getElementById("zone").value = "0";
  document.getElementById("promo").value = "";
  document.getElementById("receipt").style.display = "none";
}

document.getElementById("calcBtn").addEventListener("click", calculateBill);
document.getElementById("clearBtn").addEventListener("click", clearOrder);

window.onload = function(){
  const saved = localStorage.getItem("festiveOrder");
  if(saved){
    const order = JSON.parse(saved);
    document.getElementById("mealPrice").value = order.price;
    document.getElementById("qty").value = order.qty;
    document.getElementById("zone").value = order.deliveryFee;
    document.getElementById("promo").value = order.promoInput;
    displayReceipt(order);
  }
};