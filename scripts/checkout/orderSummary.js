import { cart, removeFromCart, updateCartQuantity, updateQuantity } from "../../data/cart.js";
import {products} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function loadCheckoutPage() {
	let orderSummaryHTML = '';	

	cart.forEach((cartItem) => {
		let matchingItem;

		products.forEach((product) => {
			if (product.id === cartItem.productId) {
				matchingItem = product;
			}
		});

		orderSummaryHTML += `
			<div class="cart-item-container js-cart-item-container-${matchingItem.id}">
				<div class="delivery-date">
					Delivery date: Tuesday, June 21
				</div>

				<div class="cart-item-details-grid">
					<img class="product-image"
						src="${matchingItem.image}">

					<div class="cart-item-details">
						<div class="product-name">
							${matchingItem.name}
						</div>
						<div class="product-price">
							$${formatCurrency(matchingItem.priceCents)}
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
						<div class="delivery-option">
							<input type="radio" checked
								class="delivery-option-input"
								name="delivery-option-${matchingItem.id}">
							<div>
								<div class="delivery-option-date">
									Tuesday, June 21
								</div>
								<div class="delivery-option-price">
									FREE Shipping
								</div>
							</div>
						</div>
						<div class="delivery-option">
							<input type="radio"
								class="delivery-option-input"
								name="delivery-option-${matchingItem.id}">
							<div>
								<div class="delivery-option-date">
									Wednesday, June 15
								</div>
								<div class="delivery-option-price">
									$4.99 - Shipping
								</div>
							</div>
						</div>
						<div class="delivery-option">
							<input type="radio"
								class="delivery-option-input"
								name="delivery-option-${matchingItem.id}">
							<div>
								<div class="delivery-option-date">
									Monday, June 13
								</div>
								<div class="delivery-option-price">
									$9.99 - Shipping
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	});

	const cartQuantity = updateCartQuantity();
	document.querySelector('.js-return-to-home').innerHTML = `${cartQuantity} items`;

	document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML;

	document.querySelectorAll('.js-delete-quantity').forEach((button) => {
		button.addEventListener('click', () => {
			const {productId} = button.dataset;
			removeFromCart(productId);
			loadCheckoutPage();
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
			loadCheckoutPage();
		})
	});
}