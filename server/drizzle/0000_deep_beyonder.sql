CREATE TABLE "links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_url" text NOT NULL,
	"short_code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
