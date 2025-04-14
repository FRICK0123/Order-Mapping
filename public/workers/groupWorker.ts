/* eslint-disable @typescript-eslint/no-explicit-any */
self.onmessage = (e) => {
  const rawOrders = e.data;

  const grouped = {};

  rawOrders.forEach((order: any, index: number) => {
    if (!order.coords || !order.coords.includes(',')) return;

    const [lat, lng] = order.coords.split(',').map((c: string) => c.trim());

    if (!lat || !lng || isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) return;

    const key = `${lat},${lng}`;
    const orderWithId = { ...order, id: index };

    if (!grouped[key]) {
      grouped[key] = {
        lat,
        lng,
        orders: []
      };
    }

    grouped[key].orders.push(orderWithId);
  });

  // Send result back to main thread
  self.postMessage(Object.values(grouped));
};