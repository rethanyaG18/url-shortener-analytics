const { nanoid } = require('nanoid');
const supabase = require('../config/supabase');

/**
 * Generate a unique short code of given length.
 * Retries on collision up to maxAttempts times.
 */
async function generateUniqueShortCode(length = 6, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = nanoid(length);

    const { data, error } = await supabase
      .from('urls')
      .select('id')
      .eq('short_code', code)
      .maybeSingle();

    if (error) throw new Error(`DB error checking short code: ${error.message}`);
    if (!data) return code; // no collision — use it
  }
  throw new Error('Failed to generate unique short code after multiple attempts');
}

module.exports = { generateUniqueShortCode };
