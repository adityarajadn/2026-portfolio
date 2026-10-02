ALTER TABLE experiences ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
UPDATE experiences SET is_featured = TRUE WHERE id = (SELECT id FROM experiences ORDER BY sort_order ASC LIMIT 1);
