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
export const stepNoteTypeEnum = pgEnum("step_note_type", [
  "tip",
  "warning",
  "note",
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
    prepTime: d.integer().notNull(), // in minutes
    cookTime: d.integer().notNull(), // in minutes
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
    measurement: d.varchar({ length: 50 }).notNull(),
    value: d.real().notNull(),
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

export const procedureSteps = createTable(
  "procedure_step",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    procedureId: d.integer().notNull(), // FK to procedure
    stepNumber: d.integer().notNull(),
    content: d.varchar({ length: 1024 }).notNull(),
  }),
  (t) => [
    index("procedure_step_procid_step_idx").on(t.procedureId, t.stepNumber),
  ],
);

export const stepTimer = createTable("step_timer", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  stepId: d.integer().notNull(), // FK to procedure_step
  timeSeconds: d.integer().notNull(),
  title: d.varchar({ length: 256 }),
}));

export const stepIngredients = createTable("step_ingredient", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  stepId: d.integer().notNull(), // FK to procedure_step
  ingredientId: d.integer().notNull(), // FK to ingredient
}));

export const stepNotes = createTable("step_note", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  stepId: d.integer().notNull(), // FK to procedure_step
  type: stepNoteTypeEnum("step_note_type").notNull(), // tip, warning, note, etc.
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
    steps: many(procedureSteps),
  }),
);

export const stepRelations = relations(procedureSteps, ({ many, one }) => ({
  procedureGroups: one(procedureGroups, {
    fields: [procedureSteps.procedureId],
    references: [procedureGroups.id],
  }),
  timer: one(stepTimer),
  ingredients: many(stepIngredients),
  notes: many(stepNotes),
}));

export const stepTimerRelations = relations(stepTimer, ({ one }) => ({
  step: one(procedureSteps, {
    fields: [stepTimer.stepId],
    references: [procedureSteps.id],
  }),
}));

export const stepIngredientRelations = relations(
  stepIngredients,
  ({ one }) => ({
    step: one(procedureSteps, {
      fields: [stepIngredients.stepId],
      references: [procedureSteps.id],
    }),
    ingredient: one(ingredients, {
      fields: [stepIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);

export const stepNoteRelations = relations(stepNotes, ({ one }) => ({
  step: one(procedureSteps, {
    fields: [stepNotes.stepId],
    references: [procedureSteps.id],
  }),
}));
