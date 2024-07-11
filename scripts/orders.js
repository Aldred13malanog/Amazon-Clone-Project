import { orders } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct } from "../data/products.js";
import { isWeekend } from "../data/deliveryOptions.js";

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
			const dateString = today.format('MMMM D');
			
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
					<button class="buy-again-button button-primary">
						<img class="buy-again-icon" src="images/icons/buy-again.png">
						<span class="buy-again-message">Buy it again</span>
					</button>
				</div>

				<div class="product-actions">
					<a href="tracking.html">
						<button class="track-package-button button-secondary">
							Track package
						</button>
					</a>
				</div>
			`;
		});

		return html;
	}

	document.querySelector('.js-orders-grid').innerHTML = ordersHTML;
}
loadOrderPage();