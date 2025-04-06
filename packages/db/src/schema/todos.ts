import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const todos = pgTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
