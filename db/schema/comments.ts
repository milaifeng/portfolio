import {
  serial,
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  postSlug: varchar("post_slug", { length: 255 })
    .notNull()
    .default("guestbook"), // 留言板为特定的 slug，"guestbook"
  parentId: integer("parent_id").references((): AnyPgColumn => comments.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});
