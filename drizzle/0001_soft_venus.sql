CREATE TABLE `visa_requirements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`passport_iso2` varchar(2) NOT NULL,
	`destination_country_id` int NOT NULL,
	`requirement` enum('visa_free','visa_on_arrival','evisa','visa_required','not_allowed') NOT NULL,
	`max_stay_days` smallint,
	`notes` text,
	`last_verified_at` date,
	`official_source_url` varchar(512),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visa_requirements_id` PRIMARY KEY(`id`),
	CONSTRAINT `visa_req_unq` UNIQUE(`passport_iso2`,`destination_country_id`)
);
--> statement-breakpoint
CREATE TABLE `city_attractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`city_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(64),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`wikidata_id` varchar(32),
	CONSTRAINT `city_attractions_id` PRIMARY KEY(`id`),
	CONSTRAINT `attr_unq` UNIQUE(`city_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `city_gazetteer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`country` varchar(128),
	`subcountry` varchar(128),
	`geonameid` int,
	`source` varchar(32),
	CONSTRAINT `city_gazetteer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `country_highlights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text,
	`source` varchar(128),
	CONSTRAINT `country_highlights_id` PRIMARY KEY(`id`),
	CONSTRAINT `highlight_unq` UNIQUE(`country_id`,`title`)
);
--> statement-breakpoint
CREATE TABLE `country_holidays` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`rule` varchar(255) NOT NULL,
	`month` tinyint,
	`day` tinyint,
	`type` varchar(32),
	`name_en` varchar(191),
	`name_ar` varchar(191),
	`name_fr` varchar(191),
	`name_tr` varchar(191),
	`name_es` varchar(191),
	`position` int NOT NULL DEFAULT 0,
	CONSTRAINT `country_holidays_id` PRIMARY KEY(`id`),
	CONSTRAINT `holiday_unq` UNIQUE(`country_id`,`rule`)
);
--> statement-breakpoint
CREATE TABLE `currencies` (
	`code` varchar(3) NOT NULL,
	`name` varchar(128),
	`symbol` varchar(8),
	`decimals` tinyint,
	`num_code` varchar(3),
	`rate_eur` decimal(18,6),
	`rate_date` varchar(10),
	CONSTRAINT `currencies_code` PRIMARY KEY(`code`)
);
--> statement-breakpoint
CREATE TABLE `data_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(191) NOT NULL,
	`source_url` varchar(1024) NOT NULL,
	`contents` varchar(512),
	`format` varchar(64),
	`status` enum('applied','open','blocked') NOT NULL DEFAULT 'open',
	`note` varchar(512),
	`importer_key` varchar(64),
	`record_count` int,
	`last_refreshed_at` timestamp,
	`last_refresh_status` varchar(512),
	`position` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `data_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `data_sources_slug_unq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `heritage_sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`wikidata_id` varchar(32),
	CONSTRAINT `heritage_sites_id` PRIMARY KEY(`id`),
	CONSTRAINT `heritage_unq` UNIQUE(`country_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `timezone_names` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(64) NOT NULL,
	CONSTRAINT `timezone_names_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tourism_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entity` varchar(64) NOT NULL,
	`year` int NOT NULL,
	`arrivals` int,
	CONSTRAINT `tourism_stats_id` PRIMARY KEY(`id`),
	CONSTRAINT `tourism_unq` UNIQUE(`entity`,`year`)
);
--> statement-breakpoint
CREATE TABLE `destination_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destination_slug` varchar(191) NOT NULL,
	`destination_type` enum('country','city') NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text,
	`author_name` varchar(191) NOT NULL,
	`author_email` varchar(255) NOT NULL,
	`is_approved` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `destination_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`destination_slug` varchar(191) NOT NULL,
	`destination_type` enum('country','city') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wishlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cities` ADD `iata_code` varchar(3);--> statement-breakpoint
ALTER TABLE `cities` ADD `timezone` varchar(64);--> statement-breakpoint
ALTER TABLE `countries` ADD `currency_symbol` varchar(8);--> statement-breakpoint
ALTER TABLE `countries` ADD `population` bigint;--> statement-breakpoint
ALTER TABLE `countries` ADD `gdp` bigint;--> statement-breakpoint
ALTER TABLE `countries` ADD `area_sq_km` int;--> statement-breakpoint
ALTER TABLE `countries` ADD `capital` varchar(191);--> statement-breakpoint
ALTER TABLE `countries` ADD `languages` varchar(255);--> statement-breakpoint
ALTER TABLE `countries` ADD `demonym` varchar(128);--> statement-breakpoint
ALTER TABLE `countries` ADD `native_name` varchar(191);--> statement-breakpoint
ALTER TABLE `countries` ADD `driving_side` varchar(8);--> statement-breakpoint
ALTER TABLE `countries` ADD `national_dish` varchar(255);--> statement-breakpoint
ALTER TABLE `countries` ADD `emergency_police` varchar(32);--> statement-breakpoint
ALTER TABLE `countries` ADD `emergency_ambulance` varchar(32);--> statement-breakpoint
ALTER TABLE `countries` ADD `emergency_fire` varchar(32);--> statement-breakpoint
ALTER TABLE `countries` ADD `tourist_arrivals` bigint;--> statement-breakpoint
ALTER TABLE `countries` ADD `tourist_arrivals_year` int;--> statement-breakpoint
ALTER TABLE `countries` ADD `travel_guide` text;--> statement-breakpoint
ALTER TABLE `countries` ADD `homicide_rate` decimal(6,2);--> statement-breakpoint
ALTER TABLE `countries` ADD `homicide_year` int;--> statement-breakpoint
ALTER TABLE `countries` ADD `big_mac_usd` decimal(6,2);--> statement-breakpoint
ALTER TABLE `countries` ADD `big_mac_year` int;--> statement-breakpoint
ALTER TABLE `countries` ADD `religion` varchar(64);--> statement-breakpoint
ALTER TABLE `countries` ADD `avg_temp_c` decimal(4,1);--> statement-breakpoint
ALTER TABLE `countries` ADD `landlocked` tinyint;--> statement-breakpoint
ALTER TABLE `countries` ADD `coastline_km` int;--> statement-breakpoint
ALTER TABLE `countries` ADD `climate_monthly` text;--> statement-breakpoint
ALTER TABLE `visa_requirements` ADD CONSTRAINT `visa_requirements_destination_country_id_countries_id_fk` FOREIGN KEY (`destination_country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `city_attractions` ADD CONSTRAINT `city_attractions_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `country_highlights` ADD CONSTRAINT `country_highlights_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `country_holidays` ADD CONSTRAINT `country_holidays_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `heritage_sites` ADD CONSTRAINT `heritage_sites_country_id_countries_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `visa_req_passport_idx` ON `visa_requirements` (`passport_iso2`);--> statement-breakpoint
CREATE INDEX `visa_req_destination_idx` ON `visa_requirements` (`destination_country_id`);--> statement-breakpoint
CREATE INDEX `attr_city_idx` ON `city_attractions` (`city_id`);--> statement-breakpoint
CREATE INDEX `gaz_name_idx` ON `city_gazetteer` (`name`);--> statement-breakpoint
CREATE INDEX `gaz_country_idx` ON `city_gazetteer` (`country`);--> statement-breakpoint
CREATE INDEX `highlight_country_idx` ON `country_highlights` (`country_id`);--> statement-breakpoint
CREATE INDEX `holiday_country_idx` ON `country_holidays` (`country_id`);--> statement-breakpoint
CREATE INDEX `heritage_country_idx` ON `heritage_sites` (`country_id`);--> statement-breakpoint
CREATE INDEX `destination_reviews_slug_type_idx` ON `destination_reviews` (`destination_slug`,`destination_type`);--> statement-breakpoint
CREATE INDEX `destination_reviews_approved_idx` ON `destination_reviews` (`is_approved`);--> statement-breakpoint
CREATE INDEX `destination_reviews_created_idx` ON `destination_reviews` (`created_at`);--> statement-breakpoint
CREATE INDEX `wishlists_user_type_idx` ON `wishlists` (`user_id`,`destination_type`);--> statement-breakpoint
CREATE INDEX `wishlists_slug_type_idx` ON `wishlists` (`destination_slug`,`destination_type`);