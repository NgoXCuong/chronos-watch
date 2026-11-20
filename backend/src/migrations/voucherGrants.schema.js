export async function migrateVoucherGrants(db) {
    await db.query(`CREATE TABLE IF NOT EXISTS voucher_grants (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        voucher_id INT NOT NULL, user_id INT NOT NULL, granted_by INT NULL,
        granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_voucher_recipient (voucher_id,user_id),
        KEY idx_voucher_grant_user (user_id,granted_at),
        FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}
