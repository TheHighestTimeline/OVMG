---
const categories = ['Sustainability', 'Infrastructure', 'AI', 'Cloud', 'Markets', 'Policy'];
---
<footer class="mt-auto bg-gray-900 dark:bg-gray-950 text-gray-300 pt-12 pb-6">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-7 h-7 bg-green-700 rounded flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-white">The <span class="text-green-400">Footprint</span></span>
        </div>
        <p class="text-sm text-gray-400 leading-relaxed max-w-xs">
          Environmental accountability journalism for the data center industry. Covering water, land, carbon, and community impact — the costs that don't make it into press releases.
        </p>
      </div>
      <div>
        <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Coverage</h4>
        <ul class="space-y-2">
          {categories.map(cat => (
            <li><a href={`/category/${cat.toLowerCase()}`} class="text-sm text-gray-400 hover:text-white transition-colors">{cat}</a></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">Publication</h4>
        <ul class="space-y-2">
          <li><a href="/authors" class="text-sm text-gray-400 hover:text-white transition-colors">About Us</a></li>
          <li><a href="/about" class="text-sm text-gray-400 hover:text-white transition-colors">Our Mission</a></li>
          <li><a href="/rss.xml" class="text-sm text-gray-400 hover:text-white transition-colors">RSS Feed</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-gray-500">&copy; {new Date().getFullYear()} The Footprint. All rights reserved.</p>
      <p class="text-xs text-gray-600">Environmental Accountability · Data Center Industry</p>
    </div>
  </div>
</footer>
