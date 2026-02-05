-- AlterTable
ALTER TABLE `platforms` ADD COLUMN `is_master` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` ALTER COLUMN `platform_id` DROP DEFAULT;
