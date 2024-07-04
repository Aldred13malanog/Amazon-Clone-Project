export let cart = JSON.parse(localStorage.getItem('cartItem')) || [{
	productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
	quantity: 2,
	deliveryId: '1'
}, {
	productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
	quantity: 1,
	deliveryId: '2'
}];

export function addToCart(productId) {
	let matchingItem;

	const selectValue = document.querySelector(`.js-quantity-selector-${productId}`).value;
	const selectNumber = Number(selectValue);

	cart.forEach((cartItem) => {
		if (productId === cartItem.productId) {
			matchingItem = cartItem;
		}
	});

	if (matchingItem) {
		matchingItem.quantity += selectNumber;
	} else {
		cart.push({
			productId,
			quantity: selectNumber,
			deliveryId: '1'
		});
	}

	saveToLocalStorage();
}

function saveToLocalStorage() {
	localStorage.setItem('cartItem', JSON.stringify(cart));
}

export function removeFromCart(productId) {
	const newCart = [];

	cart.forEach((cartItem) => {
		if (cartItem.productId !== productId) {
			newCart.push(cartItem);
		}
	})

	cart = newCart;
	saveToLocalStorage();
}

export function updateCartQuantity() {
	let cartQuantity = 0;

	cart.forEach((cartItem) => {
		cartQuantity += cartItem.quantity;
	});

	return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
	let matchingItem;

	cart.forEach((item) => {
		if (item.productId === productId) {
			matchingItem = item;
		}
	});
	matchingItem.quantity = newQuantity;
	saveToLocalStorage();
}

export function updateDeliveryOptions(productId, deliveryId) {
	let matchingItem;
	cart.forEach((cartItem) => {
		if (productId === cartItem.productId) {
			matchingItem = cartItem;
		};
	});

	matchingItem.deliveryId = deliveryId;
	saveToLocalStorage();
}