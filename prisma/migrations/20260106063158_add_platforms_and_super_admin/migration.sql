-- CreateTable: platforms
CREATE TABLE `platforms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `platforms_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default platform (DressMe)
INSERT INTO `platforms` (`id`, `code`, `name`, `domain`, `description`, `is_active`, `created_at`, `updated_at`)
VALUES (1, 'dressme', 'DressMe', 'dressme.tgoo.eu', 'Plataforma de geração de looks com IA', true, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

-- AlterEnum: Add SUPER_ADMIN to Role enum
ALTER TABLE `users` MODIFY `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER';

-- DropIndex: Remove unique constraint from email
ALTER TABLE `users` DROP INDEX `users_email_key`;

-- AlterTable: Add platform_id column with default value
ALTER TABLE `users` ADD COLUMN `platform_id` INTEGER NOT NULL DEFAULT 1;

-- Update existing users to belong to DressMe platform
UPDATE `users` SET `platform_id` = 1 WHERE `platform_id` = 1;

-- CreateIndex: Add unique constraint for email + platform_id
CREATE UNIQUE INDEX `users_email_platform_id_key` ON `users`(`email`, `platform_id`);

-- CreateIndex: Add index on platform_id
CREATE INDEX `users_platform_id_idx` ON `users`(`platform_id`);

-- AddForeignKey: Add foreign key constraint
ALTER TABLE `users` ADD CONSTRAINT `users_platform_id_fkey` FOREIGN KEY (`platform_id`) REFERENCES `platforms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

