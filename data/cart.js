export const cart = JSON.parse(localStorage.getItem('cartItem')) || [{
	productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
	quantity: 2
}, {
	productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
	quantity: 1
}];

export function addToCart(productId) {
	let matchingItem;

	const selectValue = document.querySelector(`.js-quantity-selector-${productId}`).value;

	cart.forEach((cartItem) => {
		if (productId === cartItem.productId) {
			matchingItem = cartItem;
		}
	});

	if (matchingItem) {
		matchingItem.quantity += 1;
	} else {
		cart.push({
			productId,
			quantity: Number(selectValue)
		});
	}

	saveToLocalStorage();
}

function saveToLocalStorage() {
	localStorage.setItem('cartItem', JSON.stringify(cart));
}