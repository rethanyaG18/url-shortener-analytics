const supabase = require('../config/supabase');
const { generateUniqueShortCode } = require('../utils/shortCode');

/**
 * Create a shortened URL for the authenticated user.
 */
const createUrl = async ({ userId, originalUrl, customAlias, expiresAt }) => {
  // If custom alias provided, check it's not taken
  if (customAlias) {
    const { data: existing } = await supabase
      .from('urls')
      .select('id')
      .eq('short_code', customAlias)
      .maybeSingle();

    if (existing) {
      const err = new Error('Custom alias already taken. Please choose another.');
      err.statusCode = 409;
      throw err;
    }
  }

  const shortCode = customAlias || (await generateUniqueShortCode(6));

  const insertData = {
    user_id: userId,
    original_url: originalUrl,
    short_code: shortCode,
  };
  if (customAlias) insertData.custom_alias = customAlias;
  if (expiresAt) insertData.expires_at = expiresAt;

  const { data, error } = await supabase
    .from('urls')
    .insert(insertData)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Get all URLs belonging to a user, with click counts.
 */
const getUserUrls = async (userId) => {
  const { data, error } = await supabase
    .from('urls')
    .select(`
      id,
      original_url,
      short_code,
      custom_alias,
      expires_at,
      created_at,
      visits(count)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  // Flatten the visit count
  return data.map((url) => ({
    ...url,
    click_count: url.visits?.[0]?.count ?? 0,
    visits: undefined,
  }));
};

/**
 * Delete a URL (only if it belongs to the requesting user).
 */
const deleteUrl = async (urlId, userId) => {
  // Verify ownership first
  const { data: url } = await supabase
    .from('urls')
    .select('id, user_id')
    .eq('id', urlId)
    .maybeSingle();

  if (!url) {
    const err = new Error('URL not found');
    err.statusCode = 404;
    throw err;
  }

  if (url.user_id !== userId) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  const { error } = await supabase.from('urls').delete().eq('id', urlId);
  if (error) throw new Error(error.message);
};

/**
 * Resolve a short code to original URL, recording the visit.
 */
const resolveAndTrack = async (shortCode, visitData) => {
  const { data: url, error } = await supabase
    .from('urls')
    .select('id, original_url, expires_at')
    .eq('short_code', shortCode)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!url) {
    const err = new Error('Short URL not found');
    err.statusCode = 404;
    throw err;
  }

  // Check expiry (bonus feature)
  if (url.expires_at && new Date(url.expires_at) < new Date()) {
    const err = new Error('This link has expired');
    err.statusCode = 410;
    throw err;
  }

  // Record the visit asynchronously (fire-and-forget to not slow redirect)
  supabase
    .from('visits')
    .insert({ url_id: url.id, ...visitData })
    .then(({ error: visitError }) => {
      if (visitError) console.error('Visit tracking error:', visitError.message);
    });

  return url.original_url;
};

module.exports = { createUrl, getUserUrls, deleteUrl, resolveAndTrack };
