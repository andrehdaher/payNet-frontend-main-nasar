import { estimateAlraghebTotal, estimateAlraghebMarkup } from "./alraghebPricing";

test("estimates use each application's unit price without rounding it first", () => {
  expect(estimateAlraghebTotal("0.23977917611178512", "2000", 1)).toBe("479.56");
  expect(estimateAlraghebTotal("0.014918810289389068", "10000", 1)).toBe("149.19");
  expect(estimateAlraghebTotal("0.02046460624385496", "5000", 1)).toBe("102.32");
  expect(estimateAlraghebTotal("479.55835222357024", 1, 1)).toBe("479.56");
  expect(estimateAlraghebTotal("239.77917611178512", 2000, 1000)).toBe("479.56");
});

test('markup is calculated on each product cost with one fixed fee per order', () => {
  expect(estimateAlraghebMarkup('0.2', 2500, 1, '10', '2.50')).toEqual({ total: '552.50', cost: '500', profit: '52.5' });
  expect(estimateAlraghebTotal('0.22', 2500, 1, '2.50')).toBe('552.50');
  expect(estimateAlraghebMarkup('0.23977917611178512', 2000, 1, '10', '0').total).toBe('527.51');
  expect(estimateAlraghebMarkup('0.2', 2500, 1, '0', '0').total).toBe('500.00');
  for (const value of ['-1', '', 'NaN', 'Infinity', '1001', '1.001', null]) expect(estimateAlraghebMarkup('1', 1, 1, value, '0')).toBeNull();
  expect(estimateAlraghebTotal('0', 1, 1, '5')).toBeNull();
});

test("invalid inputs never produce a free or non-finite offer", () => {
  for (const args of [["1", 0, 1], ["1", 2, 0], ["NaN", 1, 1], ["1", 1.5, 1], ["-1", 1, 1], ["0.0000001", 1, 1]]) {
    expect(estimateAlraghebTotal(...args)).toBeNull();
  }
});
