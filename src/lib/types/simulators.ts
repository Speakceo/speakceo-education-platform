import { z } from 'zod';

// Grid Types
export interface Position {
  x: number;
  y: number;
}

export interface GridPosition {
  row: number;
  col: number;
}

export interface GridCell {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
  label: string;
  description: string;
}

// Grid Constants
export const GRID_SIZE = {
  CELL_WIDTH: 180,
  CELL_HEIGHT: 120,
  COLS: 6,
  ROWS: 3,
  PADDING: 16,
  GAP: 8
} as const;

// Grid Helper Functions
export function pixelToGrid(x: number, y: number): GridPosition {
  const col = Math.floor(x / (GRID_SIZE.CELL_WIDTH + GRID_SIZE.GAP));
  const row = Math.floor(y / (GRID_SIZE.CELL_HEIGHT + GRID_SIZE.GAP));
  
  return {
    col: Math.max(0, Math.min(col, GRID_SIZE.COLS - 1)),
    row: Math.max(0, Math.min(row, GRID_SIZE.ROWS - 1))
  };
}

export function gridToPixel(row: number, col: number): Position {
  return {
    x: col * (GRID_SIZE.CELL_WIDTH + GRID_SIZE.GAP) + GRID_SIZE.PADDING,
    y: row * (GRID_SIZE.CELL_HEIGHT + GRID_SIZE.GAP) + GRID_SIZE.PADDING
  };
}

export function isValidGridPosition(gridPos: GridPosition, cell: GridCell): boolean {
  // Check if position is within grid bounds
  if (
    gridPos.row < 0 || 
    gridPos.row >= GRID_SIZE.ROWS ||
    gridPos.col < 0 || 
    gridPos.col >= GRID_SIZE.COLS
  ) {
    return false;
  }

  // Check if position overlaps with cell's designated area
  return (
    gridPos.row >= cell.y &&
    gridPos.row < cell.y + cell.height &&
    gridPos.col >= cell.x &&
    gridPos.col < cell.x + cell.width
  );
}

// Business Model Types
export const ComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  gridPosition: z.object({
    row: z.number(),
    col: z.number()
  })
});

export type Component = z.infer<typeof ComponentSchema>;

export const BusinessModelSchema = z.object({
  components: z.array(ComponentSchema),
  suggestions: z.array(z.string()),
  isDirty: z.boolean(),
  version: z.number().optional()
});

export type BusinessModel = z.infer<typeof BusinessModelSchema>;

// Grid Cell Definitions
export const GRID_CELLS: GridCell[] = [
  {
    x: 0, y: 0, width: 1, height: 2,
    type: 'key_partners',
    label: 'Key Partners',
    description: 'Who are your key partners and suppliers?'
  },
  {
    x: 1, y: 0, width: 1, height: 1,
    type: 'key_activities',
    label: 'Key Activities',
    description: 'What key activities does your value proposition require?'
  },
  {
    x: 2, y: 0, width: 2, height: 2,
    type: 'value_propositions',
    label: 'Value Propositions',
    description: 'What value do you deliver to the customer?'
  },
  {
    x: 4, y: 0, width: 1, height: 1,
    type: 'customer_relationships',
    label: 'Customer Relationships',
    description: 'What type of relationship does each customer segment expect?'
  },
  {
    x: 5, y: 0, width: 1, height: 2,
    type: 'customer_segments',
    label: 'Customer Segments',
    description: 'Who are you creating value for?'
  },
  {
    x: 1, y: 1, width: 1, height: 1,
    type: 'key_resources',
    label: 'Key Resources',
    description: 'What key resources does your value proposition require?'
  },
  {
    x: 4, y: 1, width: 1, height: 1,
    type: 'channels',
    label: 'Channels',
    description: 'Through which channels do your customers want to be reached?'
  },
  {
    x: 0, y: 2, width: 3, height: 1,
    type: 'cost_structure',
    label: 'Cost Structure',
    description: 'What are the most important costs inherent in your business model?'
  },
  {
    x: 3, y: 2, width: 3, height: 1,
    type: 'revenue_streams',
    label: 'Revenue Streams',
    description: 'For what value are your customers willing to pay?'
  }
];

// Financial Types
export const FinancialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']),
  category: z.string(),
  startDate: z.string(),
  notes: z.string().optional()
});

export const FinancialProjectionSchema = z.object({
  revenues: z.array(FinancialItemSchema),
  expenses: z.array(FinancialItemSchema),
  metrics: z.object({
    revenueGrowth: z.number(),
    profitMargin: z.number(),
    breakEvenPoint: z.number(),
    cashFlow: z.number()
  }),
  assumptions: z.object({
    growthRate: z.number(),
    taxRate: z.number(),
    inflationRate: z.number()
  }),
  isDirty: z.boolean(),
  version: z.number()
});

export type FinancialItem = z.infer<typeof FinancialItemSchema>;
export type FinancialProjection = z.infer<typeof FinancialProjectionSchema>;

// Financial Categories
export const REVENUE_CATEGORIES = [
  'Product Sales',
  'Services',
  'Subscriptions',
  'Licensing',
  'Advertising',
  'Other Revenue'
] as const;

export const EXPENSE_CATEGORIES = [
  'Fixed Costs',
  'Variable Costs',
  'Marketing',
  'Salaries',
  'Operations',
  'Other Expenses'
] as const;

// Pitch Simulator Types
export const PitchSchema = z.object({
  content: z.string(),
  duration: z.number(),
  recording: z.string().optional(),
  brandLogo: z.string().optional(),
  feedback: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    clarity: z.number(),
    innovation: z.number(),
    businessModel: z.number(),
    audienceRelevance: z.number(),
    delivery: z.number()
  }).optional(),
  score: z.number().optional(),
  improvements: z.array(z.string()).optional(),
  enhancedPitch: z.string().optional(),
  oneLiner: z.string().optional(),
  motivationalNote: z.string().optional()
});

export type Pitch = z.infer<typeof PitchSchema>;

// Component Position Validation
export function validateComponentPosition(component: Component): Component {
  const cell = GRID_CELLS.find(c => c.type === component.type);
  if (!cell) return component;

  const validPosition = isValidGridPosition(component.gridPosition, cell);
  if (!validPosition) {
    // Reset to default position if invalid
    const gridPos = { row: cell.y, col: cell.x };
    const pixelPos = gridToPixel(gridPos.row, gridPos.col);
    return {
      ...component,
      gridPosition: gridPos,
      position: pixelPos
    };
  }

  return component;
}