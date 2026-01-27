-- Unlock all iframes (set status to 'active')
UPDATE iframes 
SET status = 'active', 
    updated_at = NOW()
WHERE status = 'locked';

-- Verify the update
SELECT id, email, url, status, updated_at 
FROM iframes 
ORDER BY updated_at DESC 
LIMIT 20;
