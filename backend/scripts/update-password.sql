-- Update the password for the test user
UPDATE users
SET password = '$2b$10$XeHgCDKKOaZuQxuWcKS93ujdRjn6zVT0INh0IG1jWb8I2OY9DNyTS'
WHERE email = 'john@example.com';
