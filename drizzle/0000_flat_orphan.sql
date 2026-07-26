CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`name` varchar(191),
	`role` enum('admin','editor') NOT NULL DEFAULT 'editor',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unq` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`region_id` int,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`population` int,
	`hero_media_id` int,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `city_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	CONSTRAINT `city_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `city_tr_unq` UNIQUE(`city_id`,`locale`),
	CONSTRAINT `city_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `continent_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`continent_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	CONSTRAINT `continent_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `continent_tr_unq` UNIQUE(`continent_id`,`locale`),
	CONSTRAINT `continent_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `continents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(8) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `continents_id` PRIMARY KEY(`id`),
	CONSTRAINT `continents_code_unq` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `countries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`continent_id` int NOT NULL,
	`iso2` varchar(2) NOT NULL,
	`iso3` varchar(3),
	`currency_code` varchar(3),
	`phone_code` varchar(8),
	`capital_city_id` int,
	`hero_media_id` int,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `countries_id` PRIMARY KEY(`id`),
	CONSTRAINT `countries_iso2_unq` UNIQUE(`iso2`)
);
--> statement-breakpoint
CREATE TABLE `country_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	`visa_summary` text,
	`best_time_summary` text,
	CONSTRAINT `country_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `country_tr_unq` UNIQUE(`country_id`,`locale`),
	CONSTRAINT `country_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `region_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`region_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	CONSTRAINT `region_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `region_tr_unq` UNIQUE(`region_id`,`locale`),
	CONSTRAINT `region_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `regions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poi_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poi_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`name` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`description` text,
	`tips` text,
	CONSTRAINT `poi_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `poi_tr_unq` UNIQUE(`poi_id`,`locale`),
	CONSTRAINT `poi_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `pois` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city_id` int NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`price_range` enum('free','budget','moderate','expensive','luxury'),
	`opening_hours` json,
	`hero_media_id` int,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pois_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `poi_tags` (
	`poi_id` int NOT NULL,
	`tag_id` int NOT NULL,
	CONSTRAINT `poi_tags_poi_id_tag_id_pk` PRIMARY KEY(`poi_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tag_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tag_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`label` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`hub_intro` text,
	CONSTRAINT `tag_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `tag_tr_unq` UNIQUE(`tag_id`,`locale`),
	CONSTRAINT `tag_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dimension` enum('type','theme','activity','season','intent') NOT NULL,
	`value` varchar(64) NOT NULL,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_dim_value_unq` UNIQUE(`dimension`,`value`)
);
--> statement-breakpoint
CREATE TABLE `guide_relations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guide_id` int NOT NULL,
	`entity_type` enum('continent','country','region','city','poi') NOT NULL,
	`entity_id` int NOT NULL,
	CONSTRAINT `guide_relations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guide_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`guide_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`title` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`excerpt` text,
	`body` text,
	CONSTRAINT `guide_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `guide_tr_unq` UNIQUE(`guide_id`,`locale`),
	CONSTRAINT `guide_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` int,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intent_page_pois` (
	`intent_page_id` int NOT NULL,
	`poi_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `intent_page_pois_intent_page_id_poi_id_pk` PRIMARY KEY(`intent_page_id`,`poi_id`)
);
--> statement-breakpoint
CREATE TABLE `intent_page_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`intent_page_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`title` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`body` text,
	CONSTRAINT `intent_page_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `intent_tr_unq` UNIQUE(`intent_page_id`,`locale`),
	CONSTRAINT `intent_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `intent_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`place_level` enum('continent','country','region','city') NOT NULL,
	`place_id` int NOT NULL,
	`intent_type` enum('things-to-do','where-to-stay','best-time-to-visit','getting-around','itineraries','food','budget','visa','safety','weather') NOT NULL,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intent_pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `intent_unq` UNIQUE(`place_level`,`place_id`,`intent_type`)
);
--> statement-breakpoint
CREATE TABLE `itineraries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city_id` int NOT NULL,
	`duration_days` int NOT NULL,
	`index_status` enum('draft','noindex','indexed') NOT NULL DEFAULT 'draft',
	`completeness_score` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itineraries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_day_pois` (
	`itinerary_day_id` int NOT NULL,
	`poi_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `itinerary_day_pois_itinerary_day_id_poi_id_pk` PRIMARY KEY(`itinerary_day_id`,`poi_id`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itinerary_id` int NOT NULL,
	`day_number` int NOT NULL,
	CONSTRAINT `itinerary_days_id` PRIMARY KEY(`id`),
	CONSTRAINT `itinerary_day_unq` UNIQUE(`itinerary_id`,`day_number`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itinerary_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`title` varchar(191) NOT NULL,
	`slug` varchar(191) NOT NULL,
	`body` text,
	CONSTRAINT `itinerary_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `itinerary_tr_unq` UNIQUE(`itinerary_id`,`locale`),
	CONSTRAINT `itinerary_tr_slug_unq` UNIQUE(`locale`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `entity_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`media_id` int NOT NULL,
	`entity_type` enum('continent','country','region','city','poi') NOT NULL,
	`entity_id` int NOT NULL,
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `entity_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(512) NOT NULL,
	`width` int,
	`height` int,
	`credit` varchar(255),
	`license` varchar(128),
	`source` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `media_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`media_id` int NOT NULL,
	`locale` varchar(5) NOT NULL,
	`alt` varchar(255),
	CONSTRAINT `media_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_tr_unq` UNIQUE(`media_id`,`locale`)
);
--> statement-breakpoint
CREATE TABLE `affiliate_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poi_id` int,
	`city_id` int,
	`provider` varchar(64) NOT NULL,
	`product_id` varchar(128),
	`deep_link` varchar(1024) NOT NULL,
	`label` varchar(191),
	`position` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `affiliate_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsored_placements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`place_level` enum('continent','country','region','city') NOT NULL,
	`place_id` int NOT NULL,
	`advertiser` varchar(191) NOT NULL,
	`slot_type` varchar(64) NOT NULL,
	`creative_url` varchar(512),
	`target_url` varchar(1024),
	`start_date` date,
	`end_date` date,
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sponsored_placements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cities` ADD CONSTRAINT `cities_region_id_regions_id_fk` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `city_translations` ADD CONSTRAINT `city_translations_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `continent_translations` ADD CONSTRAINT `continent_translations_continent_id_continents_id_fk` FOREIGN KEY (`continent_id`) REFERENCES `continents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `countries` ADD CONSTRAINT `countries_continent_id_continents_id_fk` FOREIGN KEY (`continent_id`) REFERENCES `continents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `country_translations` ADD CONSTRAINT `country_translations_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `region_translations` ADD CONSTRAINT `region_translations_region_id_regions_id_fk` FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `regions` ADD CONSTRAINT `regions_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poi_translations` ADD CONSTRAINT `poi_translations_poi_id_pois_id_fk` FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pois` ADD CONSTRAINT `pois_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poi_tags` ADD CONSTRAINT `poi_tags_poi_id_pois_id_fk` FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `poi_tags` ADD CONSTRAINT `poi_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tag_translations` ADD CONSTRAINT `tag_translations_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_relations` ADD CONSTRAINT `guide_relations_guide_id_guides_id_fk` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guide_translations` ADD CONSTRAINT `guide_translations_guide_id_guides_id_fk` FOREIGN KEY (`guide_id`) REFERENCES `guides`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `guides` ADD CONSTRAINT `guides_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intent_page_pois` ADD CONSTRAINT `intent_page_pois_intent_page_id_intent_pages_id_fk` FOREIGN KEY (`intent_page_id`) REFERENCES `intent_pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intent_page_pois` ADD CONSTRAINT `intent_page_pois_poi_id_pois_id_fk` FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `intent_page_translations` ADD CONSTRAINT `intent_page_translations_intent_page_id_intent_pages_id_fk` FOREIGN KEY (`intent_page_id`) REFERENCES `intent_pages`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itineraries` ADD CONSTRAINT `itineraries_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_day_pois` ADD CONSTRAINT `itinerary_day_pois_itinerary_day_id_itinerary_days_id_fk` FOREIGN KEY (`itinerary_day_id`) REFERENCES `itinerary_days`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_day_pois` ADD CONSTRAINT `itinerary_day_pois_poi_id_pois_id_fk` FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_days` ADD CONSTRAINT `itinerary_days_itinerary_id_itineraries_id_fk` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `itinerary_translations` ADD CONSTRAINT `itinerary_translations_itinerary_id_itineraries_id_fk` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `entity_media` ADD CONSTRAINT `entity_media_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `media_translations` ADD CONSTRAINT `media_translations_media_id_media_id_fk` FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliate_links` ADD CONSTRAINT `affiliate_links_poi_id_pois_id_fk` FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `affiliate_links` ADD CONSTRAINT `affiliate_links_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `cities_country_idx` ON `cities` (`country_id`);--> statement-breakpoint
CREATE INDEX `cities_region_idx` ON `cities` (`region_id`);--> statement-breakpoint
CREATE INDEX `countries_continent_idx` ON `countries` (`continent_id`);--> statement-breakpoint
CREATE INDEX `regions_country_idx` ON `regions` (`country_id`);--> statement-breakpoint
CREATE INDEX `pois_city_idx` ON `pois` (`city_id`);--> statement-breakpoint
CREATE INDEX `poi_tags_tag_idx` ON `poi_tags` (`tag_id`);--> statement-breakpoint
CREATE INDEX `guide_rel_entity_idx` ON `guide_relations` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `intent_place_idx` ON `intent_pages` (`place_level`,`place_id`);--> statement-breakpoint
CREATE INDEX `itineraries_city_idx` ON `itineraries` (`city_id`);--> statement-breakpoint
CREATE INDEX `entity_media_idx` ON `entity_media` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `affiliate_poi_idx` ON `affiliate_links` (`poi_id`);--> statement-breakpoint
CREATE INDEX `affiliate_city_idx` ON `affiliate_links` (`city_id`);--> statement-breakpoint
CREATE INDEX `sponsored_place_idx` ON `sponsored_placements` (`place_level`,`place_id`);