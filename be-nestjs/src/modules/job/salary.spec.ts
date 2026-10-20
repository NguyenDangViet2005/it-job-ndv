import { describe, expect, it } from 'vitest';
import { salaryDisplay, salaryFields } from './salary.js';

describe('salary normalization', () => {
  it('converts the existing million-VND form into exact stored amounts', () => {
    expect(salaryFields({ salary: '25 - 35 triệu' })).toEqual({
      salarymin: '25000000',
      salarymax: '35000000',
      currency: 'VND',
      salaryperiod: 'month',
      isnegotiable: false,
    });
  });

  it.each(['Thỏa thuận', 'Thoả thuận', ''])(
    'clears numeric bounds for %s',
    (salary) => {
      expect(salaryFields({ salary })).toMatchObject({
        salarymin: null,
        salarymax: null,
        isnegotiable: true,
      });
    },
  );

  it('accepts decimal currency amounts and a yearly period', () => {
    expect(
      salaryFields({ salary: '1000.50 - 2000.75 USD/year' }),
    ).toMatchObject({
      salarymin: '1000.5',
      salarymax: '2000.75',
      currency: 'USD',
      salaryperiod: 'year',
    });
  });

  it('does not clear salary on an unrelated job update', () => {
    expect(
      salaryFields(
        {},
        { isnegotiable: false, salarymin: '10.00', salarymax: '20.00' },
      ),
    ).toEqual({});
  });

  it('validates a partial update against the persisted other bound', () => {
    expect(() =>
      salaryFields(
        { salarymin: 30 },
        { isnegotiable: false, salarymin: '10.00', salarymax: '20.00' },
      ),
    ).toThrow();
  });

  it.each([
    { salarymin: -1, salarymax: 2 },
    { salarymin: 30, salarymax: 20 },
    { salarymin: 1, salarymax: 1.234 },
    { salarymin: 1, salarymax: 1_000_000_000_000 },
    { salarymin: 1 },
    { salarymin: 1, salarymax: 2, isnegotiable: true },
    { salary: '25 triệu', salarymin: 25 },
    { salary: 'arbitrary text' },
  ])('rejects invalid or ambiguous salary: %j', (input) => {
    expect(() => salaryFields(input)).toThrow();
  });

  it('round-trips display text used by the current frontend', () => {
    const job = {
      salarymin: '25000000.00',
      salarymax: '35000000.00',
      currency: 'VND',
      salaryperiod: 'month',
      isnegotiable: false,
    };
    expect(salaryFields({ salary: salaryDisplay(job) })).toMatchObject({
      salarymin: '25000000',
      salarymax: '35000000',
    });
  });
});
