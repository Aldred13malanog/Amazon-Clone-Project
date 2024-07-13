import { getProduct } from "../data/products.js";
import { getOrder } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { isWeekend } from "../data/deliveryOptions.js";
import { cart } from "../data/cart.js";

function loadTrackingPage() {
	const url = new URL(window.location.href);
	const orderId = url.searchParams.get('orderId');
	const productId = url.searchParams.get('productId');

	const order = getOrder(orderId);
	const product = getProduct(productId);

	let productDetails;
	order.products.forEach((details) => {
		if (details.productId === product.id) {
			productDetails = details;
		}
	});

	const deliveryId = productDetails.deliveryId;
	let deliveryDays;
	if (deliveryId == 1) {
		deliveryDays = 7;
	} else if (deliveryId == 2) {
		deliveryDays = 3;
	} else {
		deliveryDays = 1;
	}
	let today = dayjs();
	while (deliveryDays > 0) {
		today = today.add(1, 'day');
		if (!isWeekend(today)) {
			deliveryDays--;
		}
	}
	const dateString = today.format('dddd, MMMM D');

	let todays = dayjs();
	let orderTime = dayjs(order.orderTime);
	let deliveryTime = today;
	const percentProgress = ((todays - orderTime) / (deliveryTime - orderTime)) * 100;

	const deliveredMessage = todays < deliveryTime ? 'Arriving on' : 'Delivered on';

	const html = `
		<a class="back-to-orders-link link-primary" href="orders.html">
			View all orders
		</a>

		<div class="delivery-date">
			${deliveredMessage} ${dateString}
		</div>

		<div class="product-info">
			${product.name}
		</div>

		<div class="product-info">
			Quantity: ${productDetails.quantity}
		</div>

		<img class="product-image" src="${product.image}">

		<div class="progress-labels-container">
			<div class="progress-label ${
				percentProgress < 50 ? 'current-status' : ''
			}">
				Preparing
			</div>
			<div class="progress-label ${
				percentProgress >= 50 ? 'current-status' : ''
			}">
				Shipped
			</div>
			<div class="progress-label ${
				percentProgress >= 100 ? 'current-status' : ''
			}">
				Delivered
			</div>
		</div>

		<div class="progress-bar-container">
			<div class="progress-bar" style="width: ${percentProgress}%"></div>
		</div>
	`;

	cart.displayQuantity();

	document.querySelector('.js-order-tracking').innerHTML = html;
}
loadTrackingPage();