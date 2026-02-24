export const VOLUME_UNITS_METRIC: UnitOption[] = [
  { label: "Milliliters", value: "ml" },
  { label: "Liters", value: "l" },
  { label: "Teaspoon", value: "tsp" },
  { label: "Tablespoon", value: "tbsp" },
  { label: "Cup", value: "cup" },
] as const;

export const WEIGHT_UNITS_METRIC: UnitOption[] = [
  { label: "Milligrams", value: "mg" },
  { label: "Grams", value: "g" },
  { label: "Kilograms", value: "kg" },
] as const;

export const VOLUME_UNITS_IMPERIAL: UnitOption[] = [
  { label: "Fluid Ounce", value: "fl_oz" },
  { label: "Pint", value: "pt" },
  { label: "Quart", value: "qt" },
  { label: "Gallon", value: "gal" },
] as const;

export const WEIGHT_UNITS_IMPERIAL: UnitOption[] = [
  { label: "Ounce", value: "oz" },
  { label: "Pound", value: "lb" },
] as const;

export const COUNT_UNITS: UnitOption[] = [
  { label: "Unit", value: "unit" },
  { label: "Clove", value: "clove" },
  { label: "Slice", value: "slice" },
  { label: "Can", value: "can" },
  { label: "Bunch", value: "bunch" },
  { label: "Pinch", value: "pinch" },
  { label: "Dash", value: "dash" },
] as const;

export const ALL_MEASUREMENT_UNITS = [
  ...VOLUME_UNITS_METRIC,
  ...WEIGHT_UNITS_METRIC,
  ...VOLUME_UNITS_IMPERIAL,
  ...WEIGHT_UNITS_IMPERIAL,
  ...COUNT_UNITS,
] as const;

export type Measurements = {
  metric: Measurement[];
  imperial: Measurement[];
};

export type Measurement = {
  category: string;
  items: UnitOption[];
};

export type UnitOption = {
  label: string;
  value: string;
};

export const measurements = {
  metric: [
    { category: "Volume", items: VOLUME_UNITS_METRIC },
    { category: "Weight", items: WEIGHT_UNITS_METRIC },
    { category: "Specific", items: COUNT_UNITS },
  ],
  imperial: [
    { category: "Volume", items: VOLUME_UNITS_IMPERIAL },
    { category: "Weight", items: WEIGHT_UNITS_IMPERIAL },
    { category: "Specific", items: COUNT_UNITS },
  ],
} as const;

export enum MEASUREMENT_UNIT {
  ML = "ml",
  L = "l",
  TSP = "tsp",
  TBSP = "tbsp",
  CUP = "cup",
  MG = "mg",
  G = "g",
  KG = "kg",
  FLOZ = "fl_oz",
  PT = "pt",
  QT = "qt",
  GAL = "gal",
  OZ = "oz",
  LB = "lb",
  UNIT = "unit",
  CLOVE = "clove",
  SLICE = "slice",
  CAN = "can",
  BUNCH = "bunch",
  PINCH = "pinch",
  DASH = "dash",
}
