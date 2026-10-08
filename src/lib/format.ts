// Dutch price format: €2.950
export function euro(amount: number): string {
  return `€${amount.toLocaleString('nl-NL')}`;
}

export function priceLabel(p: { from: number; to?: number }): string {
  return p.to ? `${euro(p.from)} tot ${euro(p.to)}` : euro(p.from);
}
