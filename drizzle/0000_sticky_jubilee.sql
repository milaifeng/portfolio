CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"user_id" integer NOT NULL,
	"post_slug" varchar(255) DEFAULT 'guestbook' NOT NULL,
	"parent_id" integer,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"oauth_id" varchar(50),
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255),
	"avatar" varchar(512) DEFAULT '/avatar/monkey1.jpg',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_oauth_id_unique" UNIQUE("oauth_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;