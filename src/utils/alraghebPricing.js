import DecimalJs from "decimal.js";

const Decimal = DecimalJs.clone({ precision: 50 });

export function estimateAlraghebTotal(price, qty, billingUnitQty, fixedFee = '0') {
  if (!/^\d+$/.test(String(qty)) || !/^\d+$/.test(String(billingUnitQty)) || Number(qty) <= 0 || Number(billingUnitQty) <= 0) return null;
  try {
    if (!new Decimal(price).gt(0) || !new Decimal(fixedFee).isFinite() || new Decimal(fixedFee).lt(0)) return null;
    const total = new Decimal(price).times(qty).div(billingUnitQty).plus(fixedFee).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    return total.isFinite() && total.gt(0) ? total.toFixed(2) : null;
  } catch { return null; }
}

export function estimateAlraghebMarkup(price, qty, unit, percent, fixed) {
  if (![percent, fixed].every(v => /^\d{1,10}(\.\d{1,2})?$/.test(String(v)))) return null;
  try {
    if (new Decimal(percent).gt(1000) || new Decimal(fixed).gt(1000000000)) return null;
    const saleUnit = new Decimal(price).times(new Decimal(percent).div(100).plus(1));
    const total = estimateAlraghebTotal(saleUnit, qty, unit, fixed);
    if (!total) return null;
    const cost = new Decimal(price).times(qty).div(unit);
    return { total, cost: cost.toFixed(), profit: new Decimal(total).minus(cost).toFixed() };
  } catch { return null; }
}
