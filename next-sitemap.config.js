/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:          process.env.NEXT_PUBLIC_SITE_URL || 'https://lestagionicreative.it',
  generateRobotsTxt: false, // already in public/
  exclude:           ['/admin', '/admin/*'],
  changefreq:        'weekly',
  priority:          0.7,
  transform: async (config, path) => {
    if (path === '/') return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() }
    if (path.startsWith('/prodotto/')) return { loc: path, changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() }
    return { loc: path, changefreq: config.changefreq, priority: config.priority, lastmod: new Date().toISOString() }
  },
}
