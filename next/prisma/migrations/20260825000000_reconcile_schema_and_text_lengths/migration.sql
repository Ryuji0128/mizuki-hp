-- Reconcile the migration history with schema.prisma.
-- Conditional DDL keeps this migration safe on databases that previously
-- received some of these changes through `prisma db push`.

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'News' AND COLUMN_NAME = 'color') = 0,
  'ALTER TABLE `News` ADD COLUMN `color` VARCHAR(16) NOT NULL DEFAULT ''black''',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'News' AND COLUMN_NAME = 'pinned') = 0,
  'ALTER TABLE `News` ADD COLUMN `pinned` BOOLEAN NOT NULL DEFAULT false',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'imagePosition') = 0,
  'ALTER TABLE `Blog` ADD COLUMN `imagePosition` VARCHAR(32) NOT NULL DEFAULT ''center''',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

ALTER TABLE `News`
  MODIFY COLUMN `title` VARCHAR(200) NOT NULL,
  MODIFY COLUMN `url` VARCHAR(2048) NULL,
  MODIFY COLUMN `color` VARCHAR(16) NOT NULL DEFAULT 'black';

ALTER TABLE `Inquiry`
  MODIFY COLUMN `name` VARCHAR(50) NOT NULL,
  MODIFY COLUMN `email` VARCHAR(254) NOT NULL,
  MODIFY COLUMN `phone` VARCHAR(20) NOT NULL,
  MODIFY COLUMN `inquiry` TEXT NOT NULL;

ALTER TABLE `Blog`
  MODIFY COLUMN `title` VARCHAR(200) NOT NULL,
  MODIFY COLUMN `content` LONGTEXT NOT NULL,
  MODIFY COLUMN `imageUrl` VARCHAR(2048) NULL,
  MODIFY COLUMN `imagePosition` VARCHAR(32) NOT NULL DEFAULT 'center';

-- Add non-unique FK indexes before removing the historical unique index.
SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Account' AND INDEX_NAME = 'Account_userId_idx') = 0,
  'CREATE INDEX `Account_userId_idx` ON `Account`(`userId`)',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Account' AND INDEX_NAME = 'Account_userId_key') > 0,
  'DROP INDEX `Account_userId_key` ON `Account`',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Session' AND INDEX_NAME = 'Session_userId_idx') = 0,
  'CREATE INDEX `Session_userId_idx` ON `Session`(`userId`)',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

-- Recreate foreign keys only when their delete rule is not already CASCADE.
SET @statement = IF(
  (SELECT DELETE_RULE FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'Account'
     AND CONSTRAINT_NAME = 'Account_userId_fkey') <> 'CASCADE',
  'ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'Account'
     AND CONSTRAINT_NAME = 'Account_userId_fkey') = 0,
  'ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT DELETE_RULE FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'Session'
     AND CONSTRAINT_NAME = 'Session_userId_fkey') <> 'CASCADE',
  'ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;

SET @statement = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'Session'
     AND CONSTRAINT_NAME = 'Session_userId_fkey') = 0,
  'ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE migration_stmt FROM @statement;
EXECUTE migration_stmt;
DEALLOCATE PREPARE migration_stmt;
