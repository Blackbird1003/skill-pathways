export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NG', {
    currency: 'naira',
    style: 'currency',
  }).format(price);
};