import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

export const createTable = pgTableCreator((name) => `morsel_${name}`);

export const mealTypeEnum = pgEnum("meal_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
]);

export const difficultyEnum = pgEnum("difficulty", ["Easy", "Medium", "Hard"]);
export const instructionNoteTypeEnum = pgEnum("instruction_note_type", [
  "tip",
  "warning",
  "note",
]);

export const unitTypeEnum = pgEnum("unit_type", [
  "ml",
  "l",
  "tsp",
  "tbps",
  "cup",
  "mg",
  "g",
  "kg",
  "unit",
  "clove",
  "slice",
  "can",
  "bunch",
  "pinch",
  "dash",
]);

export const recipes = createTable(
  "recipe",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.varchar({ length: 256 }),
    imageUrl: d.varchar({ length: 256 }).notNull(),
    color: d.varchar({ length: 30 }).default("E5E5E5").notNull(),
    favourited: d.boolean().default(false).notNull(),
    prepTimeMinutes: d.integer().notNull(), // in minutes
    cookTimeMinutes: d.integer().notNull(), // in minutes
    servings: d.integer().notNull(),
    calories: d.integer().notNull(),
    mealTypes: mealTypeEnum("meal_types").array().notNull().default([]),
    tags: d.varchar({ length: 30 }).array().notNull().default([]),
    difficulty: difficultyEnum("difficulty").notNull().default("Easy"),
    collectionIds: d.integer().array().notNull().default([]),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("recipe_name_idx").on(t.name)],
);

export const ingredients = createTable(
  "ingredient",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    groupId: d.integer().notNull(),
    name: d.varchar({ length: 256 }).notNull(),
    unitType: unitTypeEnum("unit_type").notNull(),
    amount: d.real().notNull(),
    note: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("ingredient_group_idx").on(t.groupId),
    index("ingredient_name_idx").on(t.name),
  ],
);

export const ingredientGroups = createTable(
  "ingredient_group",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    recipeId: d.integer().notNull(),
    name: d.varchar({ length: 128 }).notNull(),
    order: d.integer().notNull().default(0),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("ingredient_group_recipe_idx").on(t.recipeId)],
);

export const procedureGroups = createTable("procedureGroups", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  recipeId: d.integer().notNull(), // FK to recipes
  name: d.varchar({ length: 128 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .$defaultFn(() => new Date())
    .notNull(),
}));

export const procedures = createTable(
  "procedure",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    groupId: d.integer().notNull(), // FK to procedure
    instructionNumber: d.integer().notNull(),
    instruction: d.varchar({ length: 1024 }).notNull(),
  }),
  (t) => [
    index("procedure_step_procid_step_idx").on(t.groupId, t.instructionNumber),
  ],
);

export const instructionTimer = createTable("instruction_timer", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  instructionId: d.integer().notNull(), // FK to procedure_step
  timeSeconds: d.integer().notNull(),
  title: d.varchar({ length: 256 }),
}));

export const instructionIngredients = createTable(
  "instruction_ingredient",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    instructionId: d.integer().notNull(), // FK to procedure_step
    ingredient: d.varchar({ length: 64 }).notNull(),
  }),
);

export const instructionNotes = createTable("instruction_note", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  instructionId: d.integer().notNull(), // FK to procedure_step
  type: instructionNoteTypeEnum("instruction_note_type").notNull(), // tip, warning, note, etc.
  content: d.varchar({ length: 1024 }).notNull(),
}));

export const collections = createTable(
  "collection",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
  }),
  (t) => [index("collection_name_idx").on(t.name)],
);

export const recipeCollections = createTable(
  "recipe_collection",
  (d) => ({
    recipeId: d.integer().notNull(),
    collectionId: d.integer().notNull(),
  }),
  (t) => [
    index("recipe_collection_recipe_idx").on(t.recipeId),
    index("recipe_collection_collection_idx").on(t.collectionId),
  ],
);

export const recipesRelations = relations(recipes, ({ many, one }) => ({
  ingredientGroups: many(ingredientGroups),
  procedureGroups: many(procedureGroups),
}));

export const ingredientGroupRelations = relations(
  ingredientGroups,
  ({ one, many }) => ({
    recipe: one(recipes, {
      fields: [ingredientGroups.recipeId],
      references: [recipes.id],
    }),
    ingredients: many(ingredients),
  }),
);

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  group: one(ingredientGroups, {
    fields: [ingredients.groupId],
    references: [ingredientGroups.id],
  }),
}));

export const procedureGroupRelations = relations(
  procedureGroups,
  ({ many, one }) => ({
    recipe: one(recipes, {
      fields: [procedureGroups.recipeId],
      references: [recipes.id],
    }),
    instructions: many(procedures),
  }),
);

export const instructionRelations = relations(procedures, ({ many, one }) => ({
  procedureGroups: one(procedureGroups, {
    fields: [procedures.groupId],
    references: [procedureGroups.id],
  }),
  timer: one(instructionTimer),
  ingredients: many(instructionIngredients),
  notes: many(instructionNotes),
}));

export const instructionTimerRelations = relations(
  instructionTimer,
  ({ one }) => ({
    instruction: one(procedures, {
      fields: [instructionTimer.instructionId],
      references: [procedures.id],
    }),
  }),
);

export const instructionIngredientRelations = relations(
  instructionIngredients,
  ({ one }) => ({
    instruction: one(procedures, {
      fields: [instructionIngredients.instructionId],
      references: [procedures.id],
    }),
  }),
);

export const instructionNoteRelations = relations(
  instructionNotes,
  ({ one }) => ({
    instruction: one(procedures, {
      fields: [instructionNotes.instructionId],
      references: [procedures.id],
    }),
  }),
);
