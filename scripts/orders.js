import { orders, addToCartFromOrders, calculateEstimatedTime } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct } from "../data/products.js";
import { cart } from "../data/cart.js";

function loadOrderPage() {
	let ordersHTML = '';

	orders.forEach((order) => {
		const orderTimeString = dayjs(order.orderTime).format('MMMM D');
		ordersHTML += `
			<div class="order-container">
          
				<div class="order-header">
					<div class="order-header-left-section">
						<div class="order-date">
							<div class="order-header-label">Order Placed:</div>
							<div>${orderTimeString}</div>
						</div>
						<div class="order-total">
							<div class="order-header-label">Total:</div>
							<div>$${formatCurrency(order.totalCostCents)}</div>
						</div>
					</div>

					<div class="order-header-right-section">
						<div class="order-header-label">Order ID:</div>
						<div>${order.id}</div>
					</div>
				</div>

				<div class="order-details-grid">
					${productListHTMl(order)}
				</div>
			</div>
		`;
	});

	function productListHTMl(order) {
		let html = '';

		order.products.forEach((productDetails) => {
			const product = getProduct(productDetails.productId);
			const deliveryId = productDetails.deliveryId;
			const deliveryTime = productDetails.estimatedDeliveryTime;
			const dateString = calculateEstimatedTime(deliveryId, deliveryTime);
			
			html += `
				<div class="product-image-container">
					<img src="${product.image}">
				</div>

				<div class="product-details">
					<div class="product-name">
						${product.name}
					</div>
					<div class="product-delivery-date">
						Arriving on: ${dateString}
					</div>
					<div class="product-quantity">
						Quantity: ${productDetails.quantity}
					</div>
					<button class="buy-again-button button-primary js-buy-again"
						data-product-id="${product.id}">
						<img class="buy-again-icon" src="images/icons/buy-again.png">
						<span class="buy-again-message">Buy it again</span>
					</button>
				</div>

				<div class="product-actions">
					<a href="tracking.html?orderId=${order.id}&productId=${product.id}">
						<button class="track-package-button button-secondary">
							Track package
						</button>
					</a>
				</div>
			`;
		});

		return html;
	}

	cart.displayQuantity();

	document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

	document.querySelectorAll('.js-buy-again').forEach((button) => {
		button.addEventListener('click', () => {
			addToCartFromOrders(button.dataset.productId);

			button.innerHTML = 'Added';

			setTimeout(() => {
				button.innerHTML = `
					<img class="buy-again-icon" src="images/icons/buy-again.png">
					<span class="buy-again-message">Buy it again</span>
				`;
			}, 1000);
			cart.displayQuantity();
		});
	});

	document.querySelector('.js-search-button').addEventListener('click', () => {
		const search = document.querySelector('.js-search-bar').value;
		window.location.href = `amazon.html?search=${search}`;
	});

	document.querySelector('.js-search-bar').addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			const search = document.querySelector('.js-search-bar').value;
			window.location.href = `amazon.html?search=${search}`;
		}		
	});
}
loadOrderPage();