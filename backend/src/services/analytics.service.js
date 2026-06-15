const supabase = require('../config/supabase');

/**
 * Get full analytics for a URL (must belong to requesting user).
 */
const getAnalytics = async (urlId, userId) => {
  // Verify ownership
  const { data: url, error: urlError } = await supabase
    .from('urls')
    .select('id, user_id, original_url, short_code, custom_alias, created_at, expires_at')
    .eq('id', urlId)
    .maybeSingle();

  if (urlError) throw new Error(urlError.message);
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

  // Fetch all visits
  const { data: visits, error: visitsError } = await supabase
    .from('visits')
    .select('id, visited_at, ip_address, browser, device, os')
    .eq('url_id', urlId)
    .order('visited_at', { ascending: false });

  if (visitsError) throw new Error(visitsError.message);

  const totalClicks = visits.length;
  const lastVisited = visits[0]?.visited_at || null;

  // --- Browser stats ---
  const browserMap = {};
  visits.forEach(({ browser }) => {
    const key = browser || 'Unknown';
    browserMap[key] = (browserMap[key] || 0) + 1;
  });
  const browserStats = Object.entries(browserMap).map(([name, count]) => ({ name, count }));

  // --- Device stats ---
  const deviceMap = {};
  visits.forEach(({ device }) => {
    const key = device || 'Unknown';
    deviceMap[key] = (deviceMap[key] || 0) + 1;
  });
  const deviceStats = Object.entries(deviceMap).map(([name, count]) => ({ name, count }));

  // --- OS stats ---
  const osMap = {};
  visits.forEach(({ os }) => {
    const key = os || 'Unknown';
    osMap[key] = (osMap[key] || 0) + 1;
  });
  const osStats = Object.entries(osMap).map(([name, count]) => ({ name, count }));

  // --- Daily click trends (last 30 days) ---
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyMap = {};
  visits
    .filter((v) => new Date(v.visited_at) >= thirtyDaysAgo)
    .forEach(({ visited_at }) => {
      const day = new Date(visited_at).toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });

  // Fill in missing days with 0 so chart looks continuous
  const dailyClicks = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyClicks.push({ date: key, clicks: dailyMap[key] || 0 });
  }

  // --- Last 7 days ---
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const last7Days = dailyClicks.slice(-7);

  // Recent visit history (last 20)
  const recentVisits = visits.slice(0, 20);

  return {
    url,
    totalClicks,
    lastVisited,
    recentVisits,
    browserStats,
    deviceStats,
    osStats,
    dailyClicks,
    last7Days,
  };
};

/**
 * Public analytics (no auth) — returns reduced stats.
 */
const getPublicAnalytics = async (shortCode) => {
  const { data: url } = await supabase
    .from('urls')
    .select('id, short_code, created_at')
    .eq('short_code', shortCode)
    .maybeSingle();

  if (!url) {
    const err = new Error('URL not found');
    err.statusCode = 404;
    throw err;
  }

  const { data: visits } = await supabase
    .from('visits')
    .select('visited_at, browser, device')
    .eq('url_id', url.id)
    .order('visited_at', { ascending: false });

  const totalClicks = visits?.length || 0;
  const lastVisited = visits?.[0]?.visited_at || null;

  return { url, totalClicks, lastVisited };
};

module.exports = { getAnalytics, getPublicAnalytics };
