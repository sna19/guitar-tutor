CREATE TABLE `songs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`artist` text DEFAULT '' NOT NULL,
	`sheet` text NOT NULL,
	`capo` integer DEFAULT 0 NOT NULL,
	`tempo` integer DEFAULT 90 NOT NULL,
	`pattern` text DEFAULT 'D-DU-UDU' NOT NULL,
	`level` integer,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text
);
