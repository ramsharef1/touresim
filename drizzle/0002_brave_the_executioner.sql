CREATE TABLE `deal_clicks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deal_id` int,
	`ip_hash` varchar(64),
	`referrer` varchar(500),
	`user_agent` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `deal_clicks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('flight','hotel','tour','activity','experience') NOT NULL,
	`partner` enum('booking.com','getyourguide','skyscanner','viator','airbnb','klook','expedia') NOT NULL,
	`destination_slug` varchar(191),
	`origin_slug` varchar(191),
	`original_price` decimal(10,2),
	`deal_price` decimal(10,2) NOT NULL,
	`discount` tinyint,
	`affiliate_url` varchar(500) NOT NULL,
	`image_url` varchar(500),
	`external_id` varchar(100),
	`expires_at` timestamp NOT NULL,
	`click_count` int DEFAULT 0,
	`booking_count` int DEFAULT 0,
	`source` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `deal_clicks` ADD CONSTRAINT `deal_clicks_deal_id_deals_id_fk` FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `deal_clicks_deal_idx` ON `deal_clicks` (`deal_id`);--> statement-breakpoint
CREATE INDEX `deal_clicks_created_idx` ON `deal_clicks` (`created_at`);--> statement-breakpoint
CREATE INDEX `deals_type_expires_idx` ON `deals` (`type`,`expires_at`);--> statement-breakpoint
CREATE INDEX `deals_destination_idx` ON `deals` (`destination_slug`);--> statement-breakpoint
CREATE INDEX `deals_partner_idx` ON `deals` (`partner`);--> statement-breakpoint
CREATE INDEX `deals_created_idx` ON `deals` (`created_at`);