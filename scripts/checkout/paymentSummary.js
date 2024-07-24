import { formatCurrency } from "../utils/money.js";
import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { addOrder, uniqueid } from "../../data/orders.js";

export function loadPaymentSummary() {
	let cartQuantity = 0;
	let productPriceCents = 0;
	let shippingPriceCents = 0;
	let totalBeforeTax = 0;
	let estimatedTax = 0;
	let totalCents = 0;

	cart.cartItems.forEach((cartItem) => {
		const product = getProduct(cartItem.productId);
		productPriceCents += product.priceCents * cartItem.quantity;

		const deliveryOption = getDeliveryOption(cartItem.deliveryId);
		shippingPriceCents += deliveryOption.priceCents;

		cartQuantity += cartItem.quantity;
	});

	totalBeforeTax = productPriceCents + shippingPriceCents;
	estimatedTax = totalBeforeTax * 0.1;
	totalCents = totalBeforeTax + estimatedTax;

	const paymentSummaryHTML = `
		 <div class="payment-summary-title">
			Order Summary
		</div>

		<div class="payment-summary-row">
			<div>Items (${cartQuantity}):</div>
			<div class="payment-summary-money">
				$${formatCurrency(productPriceCents)}
			</div>
		</div>

		<div class="payment-summary-row">
			<div>Shipping &amp; handling:</div>
			<div class="payment-summary-money">
				$${formatCurrency(shippingPriceCents)}
			</div>
		</div>

		<div class="payment-summary-row subtotal-row">
			<div>Total before tax:</div>
			<div class="payment-summary-money">
				$${formatCurrency(totalBeforeTax)}
			</div>
		</div>

		<div class="payment-summary-row">
			<div>Estimated tax (10%):</div>
			<div class="payment-summary-money">
				$${formatCurrency(estimatedTax)}
			</div>
		</div>

		<div class="payment-summary-row total-row">
			<div>Order total:</div>
			<div class="payment-summary-money">
				$${formatCurrency(totalCents)}
			</div>
		</div>

		<button class="place-order-button button-primary js-place-order">
			Place your order
		</button>
	`;

	document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

	document.querySelector('.js-place-order').addEventListener('click', () => {
		let order = {
			id: uniqueid(),
			orderTime: dayjs(),
			totalCostCents: totalCents,
			products: []
		};

		cart.cartItems.forEach((details) => {
			let productId = details.productId;
			let quantity = details.quantity;
			let deliveryId = details.deliveryId;
			order.products.push({
				productId,
				quantity,
				estimatedDeliveryTime: dayjs(),
				deliveryId
			});
		});
		addOrder(order);		
		order = {};
		cart.resetCart();

		window.location.href = 'orders.html';		
	});
}