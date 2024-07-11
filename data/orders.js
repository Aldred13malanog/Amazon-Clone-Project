import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export let orders = JSON.parse(localStorage.getItem('orders'));

loadFromStorage();
function loadFromStorage() {
	if (!orders) {
		orders = [{
			id: uniqueid(),
			orderTime: dayjs().format(),
			totalCostCents: 5251,
			products: [
				{
					productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
					quantity: 2,
					estimatedDeliveryTime: dayjs().format()
				},
				{
					productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
					quantity: 1,
					estimatedDeliveryTime: dayjs().format()
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