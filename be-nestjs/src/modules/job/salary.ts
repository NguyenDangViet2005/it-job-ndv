import { BadRequestException } from '@nestjs/common';

export interface SalaryInput {
  /** Compatibility input for existing clients. Never stored as a DB column. */
  salary?: string;
  salarymin?: number | null;
  salarymax?: number | null;
  currency?: string;
  salaryperiod?: string;
  isnegotiable?: boolean;
}

export function salaryFields(
  dto: SalaryInput,
  current?: any,
): Record<string, any> {
  const structured = [
    'salarymin',
    'salarymax',
    'currency',
    'salaryperiod',
    'isnegotiable',
  ] as const;
  if (dto.salary !== undefined) {
    if (structured.some((key) => dto[key] !== undefined)) {
      throw new BadRequestException(
        'Chỉ gửi salary hoặc các trường lương có cấu trúc',
      );
    }
    const text = dto.salary?.trim().toLowerCase() ?? '';
    if (!text || ['thỏa thuận', 'thoả thuận', 'negotiable'].includes(text)) {
      return {
        salarymin: null,
        salarymax: null,
        currency: 'VND',
        salaryperiod: 'month',
        isnegotiable: true,
      };
    }
    const match = text.match(
      /^(\d+(?:\.\d{1,2})?)\s*(?:[-–]\s*(\d+(?:\.\d{1,2})?))?\s*(triệu|tr|vnd|usd|eur)?\s*(?:\/\s*(hour|month|year))?$/u,
    );
    if (!match)
      throw new BadRequestException(
        'Lương cần min/max hoặc dạng "25 - 35 triệu", "1000 - 2000 USD"',
      );
    const multiplier = ['triệu', 'tr'].includes(match[3]) ? 1_000_000 : 1;
    return salaryFields({
      salarymin: Number(match[1]) * multiplier,
      salarymax: Number(match[2] ?? match[1]) * multiplier,
      currency: ['usd', 'eur'].includes(match[3])
        ? match[3].toUpperCase()
        : 'VND',
      salaryperiod: match[4] ?? 'month',
      isnegotiable: false,
    });
  }
  if (current && !structured.some((key) => dto[key] !== undefined)) return {};
  const explicitAmounts = dto.salarymin != null || dto.salarymax != null;
  const negotiable =
    dto.isnegotiable ??
    (explicitAmounts ? false : (current?.isnegotiable ?? true));
  const min = negotiable
    ? null
    : dto.salarymin !== undefined
      ? dto.salarymin
      : current?.salarymin;
  const max = negotiable
    ? null
    : dto.salarymax !== undefined
      ? dto.salarymax
      : current?.salarymax;
  if (negotiable && explicitAmounts)
    throw new BadRequestException('Lương thỏa thuận không kèm min/max');
  if (
    !negotiable &&
    (min == null ||
      max == null ||
      !Number.isFinite(Number(min)) ||
      !Number.isFinite(Number(max)) ||
      Number(min) < 0 ||
      Number(max) < Number(min) ||
      Number(max) >= 1_000_000_000_000 ||
      !/^\d+(?:\.\d{1,2})?$/.test(String(min)) ||
      !/^\d+(?:\.\d{1,2})?$/.test(String(max)))
  ) {
    throw new BadRequestException(
      'Lương phải có 0 <= min <= max < 10^12, tối đa 2 chữ số thập phân',
    );
  }
  const currency = dto.currency ?? current?.currency ?? 'VND';
  const period = dto.salaryperiod ?? current?.salaryperiod ?? 'month';
  if (
    !['VND', 'USD', 'EUR'].includes(currency) ||
    !['hour', 'month', 'year'].includes(period)
  ) {
    throw new BadRequestException(
      'Đơn vị tiền tệ hoặc kỳ trả lương không hợp lệ',
    );
  }
  return {
    salarymin: min == null ? null : String(min),
    salarymax: max == null ? null : String(max),
    currency,
    salaryperiod: period,
    isnegotiable: negotiable,
  };
}

export function salaryDisplay(job: any): string {
  if (job.isnegotiable || job.salarymin == null || job.salarymax == null)
    return 'Thỏa thuận';
  const min = Number(job.salarymin);
  const max = Number(job.salarymax);
  if (
    job.currency === 'VND' &&
    job.salaryperiod === 'month' &&
    min % 1_000_000 === 0 &&
    max % 1_000_000 === 0
  ) {
    return `${min / 1_000_000} - ${max / 1_000_000} triệu`;
  }
  return `${job.salarymin} - ${job.salarymax} ${job.currency}/${job.salaryperiod}`;
}
