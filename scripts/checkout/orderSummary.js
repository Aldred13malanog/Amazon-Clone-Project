import { cart, removeFromCart, updateCartQuantity, updateQuantity, updateDeliveryOptions } from "../../data/cart.js";
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import { deliveryOptions, calculateDeliveryDays, getDeliveryOption } from "../../data/deliveryOptions.js";
import { loadPaymentSummary } from "./paymentSummary.js";

export function loadOrderSummary() {
	let orderSummaryHTML = '';	

	cart.forEach((cartItem) => {
		const cartProductId = cartItem.productId;
		const matchingItem = getProduct(cartProductId);

		const deliveryId = cartItem.deliveryId;
		const deliveryOption = getDeliveryOption(deliveryId);
		const dateString = calculateDeliveryDays(deliveryOption);

		orderSummaryHTML += `
			<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
				<div class="delivery-date">
					Delivery date: ${dateString}
				</div>

				<div class="cart-item-details-grid">
					<img class="product-image"
						src="${matchingItem.image}">

					<div class="cart-item-details">
						<div class="product-name">
							${matchingItem.name}
						</div>
						<div class="product-price">
							${matchingItem.getPrice()}
						</div>
						<div class="product-quantity">
							<span>
								Quantity: <span class="quantity-label js-quantity-label-${matchingItem.id}">
									${cartItem.quantity}
								</span>
							</span>
							<span class="update-quantity-link link-primary js-update-quantity" 
								data-product-id="${matchingItem.id}">
								Update
							</span>
							<input class="quantity-input js-quantity-input-${matchingItem.id}">
							<span class="save-quantity-link link-primary js-save-quantity" 
								data-product-id="${matchingItem.id}">
								Save
							</span>
							<span class="delete-quantity-link link-primary js-delete-quantity" 
								data-product-id="${matchingItem.id}">
								Delete
							</span>
						</div>
					</div>

					<div class="delivery-options">
						<div class="delivery-options-title">
							Choose a delivery option:
						</div>
						${deliveryOptionHTML(matchingItem, cartItem)}
					</div>
				</div>
			</div>
		`;
	});

	function deliveryOptionHTML(matchingItem, cartItem) {
		let html = '';

		deliveryOptions.forEach((deliveryOption) => {
		
			const dateString = calculateDeliveryDays(deliveryOption);

			const priceString = deliveryOption.priceCents === 0 
				? 'FREE' 
				: `$${formatCurrency(deliveryOption.priceCents)}`;

			const isChecked = deliveryOption.id === cartItem.deliveryId;

			html += `
				<div class="delivery-option js-delivery-option" 
					data-product-id="${matchingItem.id}" 
					data-delivery-id="${deliveryOption.id}">
					<input type="radio"
						${isChecked ? 'checked' : ''}
						class="delivery-option-input"
						name="delivery-option-${matchingItem.id}">
					<div>
						<div class="delivery-option-date">
							${dateString}
						</div>
						<div class="delivery-option-price">
							${priceString} Shipping
						</div>
					</div>
				</div>
			`;
		})

		return html;
	}

	const cartQuantity = updateCartQuantity();
	document.querySelector('.js-return-to-home').innerHTML = `${cartQuantity} items`;

	document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

	document.querySelectorAll('.js-delete-quantity').forEach((button) => {
		button.addEventListener('click', () => {
			const {productId} = button.dataset;
			removeFromCart(productId);
			loadOrderSummary();
			loadPaymentSummary();
		})
	});

	document.querySelectorAll('.js-update-quantity').forEach((update) => {
		update.addEventListener('click', () => {
			const {productId} = update.dataset;
			const container = document.querySelector(`.js-cart-item-container-${productId}`);
			container.classList.add('is-editing-quantity');
		})
	});

	document.querySelectorAll('.js-save-quantity').forEach((save) => {
		save.addEventListener('click', () => {
			const {productId} = save.dataset;
			const container = document.querySelector(`.js-cart-item-container-${productId}`);
			container.classList.remove('is-editing-quantity');

			const inputElem = document.querySelector(`.js-quantity-input-${productId}`);
			const newQuantity = Number(inputElem.value);
			const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

			if (newQuantity < 0 || newQuantity >= 1000) {
				alert('Quantity must be at least 0 and less than 1000');
				return;
			}

			quantityLabel.innerHTML = newQuantity;
			updateQuantity(productId, newQuantity);
			loadOrderSummary();
			loadPaymentSummary();
		})
	});

	// purpose: when clicking its container we can still select delivery option
	document.querySelectorAll('.js-delivery-option').forEach((element) => {
		element.addEventListener('click', () => {
			const {productId, deliveryId} = element.dataset;
			updateDeliveryOptions(productId, deliveryId);
			loadOrderSummary();
			loadPaymentSummary();
		});
	});
}