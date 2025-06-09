export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'coordinates';

interface FieldTypeInfo {
  type: FieldType;
  format?: string;
  examples: any[];
}

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
  /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
  /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
  /^\d{1,2}\/\d{1,2}\/\d{2}$/, // M/D/YY
  /^\d{1,2}-\d{1,2}-\d{2}$/, // D-M-YY
];

const COORDINATE_PATTERNS = [
  /^-?\d+(\.\d+)?$/, // Simple number
  /^-?\d+°\s*\d+'?\s*\d*"?\s*[NS]\s*,\s*-?\d+°\s*\d+'?\s*\d*"?\s*[EW]$/, // Degrees, minutes, seconds
  /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/, // Decimal degrees
];

export const detectFieldType = (values: any[]): FieldTypeInfo => {
  if (values.length === 0) {
    return { type: 'string', examples: [] };
  }

  // Remove null/undefined values
  const validValues = values.filter(v => v !== null && v !== undefined);
  if (validValues.length === 0) {
    return { type: 'string', examples: [] };
  }

  // Check for boolean
  if (validValues.every(v => typeof v === 'boolean' || 
    (typeof v === 'string' && ['true', 'false', 'yes', 'no', '1', '0'].includes(v.toLowerCase())))) {
    return {
      type: 'boolean',
      examples: validValues.slice(0, 3)
    };
  }

  // Check for dates
  if (validValues.every(v => {
    if (typeof v !== 'string') return false;
    return DATE_PATTERNS.some(pattern => pattern.test(v));
  })) {
    return {
      type: 'date',
      format: detectDateFormat(validValues[0]),
      examples: validValues.slice(0, 3)
    };
  }

  // Check for coordinates
  if (validValues.every(v => {
    if (typeof v !== 'string') return false;
    return COORDINATE_PATTERNS.some(pattern => pattern.test(v));
  })) {
    return {
      type: 'coordinates',
      format: detectCoordinateFormat(validValues[0]),
      examples: validValues.slice(0, 3)
    };
  }

  // Check for numbers
  if (validValues.every(v => !isNaN(Number(v)))) {
    const numbers = validValues.map(v => Number(v));
    const hasDecimals = numbers.some(n => n % 1 !== 0);
    return {
      type: 'number',
      format: hasDecimals ? 'decimal' : 'integer',
      examples: validValues.slice(0, 3)
    };
  }

  // Default to string
  return {
    type: 'string',
    examples: validValues.slice(0, 3)
  };
};

const detectDateFormat = (dateStr: string): string => {
  if (DATE_PATTERNS[0].test(dateStr)) return 'YYYY-MM-DD';
  if (DATE_PATTERNS[1].test(dateStr)) return 'MM/DD/YYYY';
  if (DATE_PATTERNS[2].test(dateStr)) return 'DD-MM-YYYY';
  if (DATE_PATTERNS[3].test(dateStr)) return 'YYYY/MM/DD';
  if (DATE_PATTERNS[4].test(dateStr)) return 'M/D/YY';
  if (DATE_PATTERNS[5].test(dateStr)) return 'D-M-YY';
  return 'unknown';
};

const detectCoordinateFormat = (coordStr: string): string => {
  if (COORDINATE_PATTERNS[0].test(coordStr)) return 'decimal';
  if (COORDINATE_PATTERNS[1].test(coordStr)) return 'dms';
  if (COORDINATE_PATTERNS[2].test(coordStr)) return 'decimal-pair';
  return 'unknown';
};

export const getFieldTypeDisplay = (typeInfo: FieldTypeInfo): string => {
  switch (typeInfo.type) {
    case 'boolean':
      return 'Boolean';
    case 'date':
      return `Date (${typeInfo.format})`;
    case 'coordinates':
      return `Coordinates (${typeInfo.format})`;
    case 'number':
      return `Number (${typeInfo.format})`;
    default:
      return 'Text';
  }
};

export const validateFieldValue = (value: any, typeInfo: FieldTypeInfo): boolean => {
  switch (typeInfo.type) {
    case 'boolean':
      return typeof value === 'boolean' || 
        (typeof value === 'string' && ['true', 'false', 'yes', 'no', '1', '0'].includes(value.toLowerCase()));
    
    case 'date':
      if (typeof value !== 'string') return false;
      return DATE_PATTERNS.some(pattern => pattern.test(value));
    
    case 'coordinates':
      if (typeof value !== 'string') return false;
      return COORDINATE_PATTERNS.some(pattern => pattern.test(value));
    
    case 'number':
      return !isNaN(Number(value));
    
    default:
      return true;
  }
}; 