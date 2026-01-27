-- Unlock ALL iframes (set all to active, no locks)
UPDATE iframes 
SET status = 'active', 
    updated_at = NOW();

-- Verify all are now active
SELECT id, email, url, status, updated_at 
FROM iframes 
ORDER BY updated_at DESC;
