import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from './cart.js';
import { isWeekend } from './deliveryOptions.js';

export let orders = JSON.parse(localStorage.getItem('orders'));

loadFromStorage();
function loadFromStorage() {
	if (!orders) {
		orders = [{
			id: uniqueid(),
			orderTime: dayjs(),
			totalCostCents: 5251,
			products: [
				{
					productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
					quantity: 2,
					estimatedDeliveryTime: dayjs(),
					deliveryId: '3'
				},
				{
					productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
					quantity: 1,
					estimatedDeliveryTime: dayjs(),
					deliveryId: '3'
				}
			]
		}];
	}
}

export function addOrder(order) {
	orders.unshift(order);
	saveToStorage();
}

function saveToStorage() {
	localStorage.setItem('orders', JSON.stringify(orders));
}

export function uniqueid() {
	var S4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4());
}

export function getOrder(orderId) {
	let matchingItem;

	orders.forEach((order) => {
		if (orderId === order.id) {
			matchingItem = order;
		}
	})

	return matchingItem;
}

export function addToCartFromOrders(productId) {
	let matchingItem;

	cart.cartItems.forEach((cartItem) => {
		if (productId === cartItem.productId) {
			matchingItem = cartItem;
		}
	});

	if (matchingItem) {
		matchingItem.quantity += 1;
	} else {
		this.cartItems.push({
			productId,
			quantity,
			deliveryId: '1'
		});
	}

	cart.saveToLocalStorage();
}

export function calculateEstimatedTime(deliveryId, deliveryTime) {
	let deliveryDays;
	if (deliveryId == 1) {
		deliveryDays = 7;
	} else if (deliveryId == 2) {
		deliveryDays = 3;
	} else {
		deliveryDays = 1;
	}
	let today = dayjs(deliveryTime);

	while (deliveryDays > 0) {
		today = today.add(1, 'day');
		if (!isWeekend(today)) {
			deliveryDays--;
		}
	}
	const dateString = today.format('MMMM D');
	return dateString;
}

export function calculateEstimatedTimeForTrackingPage(deliveryId, deliveryTime) {
	let deliveryDays;
	if (deliveryId == 1) {
		deliveryDays = 7;
	} else if (deliveryId == 2) {
		deliveryDays = 3;
	} else {
		deliveryDays = 1;
	}
	let today = dayjs(deliveryTime);

	while (deliveryDays > 0) {
		today = today.add(1, 'day');
		if (!isWeekend(today)) {
			deliveryDays--;
		}
	}
	return today;
}