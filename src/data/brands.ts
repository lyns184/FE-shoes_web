export interface Brand {
  id: number;
  name: string;
}

export const brands: Brand[] = [
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Jordan' },
  { id: 4, name: 'Puma' },
  { id: 5, name: 'New Balance' },
  { id: 6, name: 'Converse' },
];

export function getBrandById(id: number): Brand | undefined {
  return brands.find(brand => brand.id === id);
}

export function getBrandByName(name: string): Brand | undefined {
  return brands.find(brand => brand.name.toLowerCase() === name.toLowerCase());
}
