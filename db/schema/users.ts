import { serial, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  oauthId: varchar("oauth_id", { length: 50 }).unique(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  avatar: varchar("avatar", { length: 512 }).default("/avatar/monkey1.jpg"),
  createdAt: timestamp("created_at").defaultNow(),
});
