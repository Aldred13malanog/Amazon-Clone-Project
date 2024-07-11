class Cart {
	cartItems;

	constructor() {
		this.loadFromStorage();
	}

	loadFromStorage () {
		this.cartItems = JSON.parse(localStorage.getItem('cartItem'));

		if (!this.cartItems) {
		 this.cartItems = [{
				productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
				quantity: 2,
				deliveryId: '1'
			}, {
				productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
				quantity: 1,
				deliveryId: '2'
			}];
		};	
	}

	addToCart(productId) {
		let matchingItem;
	
		const selectValue = document.querySelector(`.js-quantity-selector-${productId}`).value;
		const quantity = Number(selectValue);
	
		this.cartItems.forEach((cartItem) => {
			if (productId === cartItem.productId) {
				matchingItem = cartItem;
			}
		});
	
		if (matchingItem) {
			matchingItem.quantity += quantity;
		} else {
			this.cartItems.push({
				productId,
				quantity,
				deliveryId: '1'
			});
		}
	
		this.saveToLocalStorage();
	}

	saveToLocalStorage() {
		localStorage.setItem('cartItem', JSON.stringify(cart.cartItems));
	}

	removeFromCart(productId) {
		const newCart = [];
	
		this.cartItems.forEach((cartItem) => {
			if (cartItem.productId !== productId) {
				newCart.push(cartItem);
			}
		})
	
		this.cartItems = newCart;
		this.saveToLocalStorage();
	}

	updateCartQuantity() {
		let cartQuantity = 0;
	
		this.cartItems.forEach((cartItem) => {
			cartQuantity += cartItem.quantity;
		});
	
		return cartQuantity;
	}

	updateQuantity(productId, newQuantity) {
		let matchingItem;
	
		this.cartItems.forEach((item) => {
			if (item.productId === productId) {
				matchingItem = item;
			}
		});
		matchingItem.quantity = newQuantity;
		this.saveToLocalStorage();
	}

	updateDeliveryOptions(productId, deliveryId) {
		let matchingItem;
		this.cartItems.forEach((cartItem) => {
			if (productId === cartItem.productId) {
				matchingItem = cartItem;
			};
		});
	
		matchingItem.deliveryId = deliveryId;
		this.saveToLocalStorage();
	}

	getCart(productId) {
		let matchingItem;
		this.cartItems.forEach((cartItem) => {
			if (productId === cartItem.productId) {
				matchingItem = cartItem;
			};
		});

		return matchingItem;
	}

}

export let cart = new Cart();