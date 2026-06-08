---
const navLinks = [
  { href: '/category/sustainability', label: 'Sustainability' },
  { href: '/category/infrastructure', label: 'Infrastructure' },
  { href: '/category/ai', label: 'AI & Cloud' },
  { href: '/category/markets', label: 'Markets' },
  { href: '/category/policy', label: 'Policy' },
  { href: '/authors', label: 'About Us' },
];
---
<header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
  <!-- Top bar -->
  <div class="bg-green-900 text-white text-xs py-1">
    <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
      <span class="opacity-80">Environmental accountability for the data center industry</span>
      <span id="current-date" class="opacity-80"></span>
    </div>
  </div>

  <!-- Main header -->
  <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3 group">
      <div class="w-8 h-8 bg-green-700 rounded flex items-center justify-center">
        <!-- Leaf / footprint icon -->
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
        </svg>
      </div>
      <div>
        <span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">The <span class="text-green-700 dark:text-green-400">Footprint</span></span>
        <div class="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">Data Centers & The Environment</div>
      </div>
    </a>

    <nav class="hidden md:flex items-center gap-1">
      {navLinks.map(link => (
        <a href={link.href} class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
          {link.label}
        </a>
      ))}
    </nav>

    <div class="flex items-center gap-3">
      <button id="dark-toggle" aria-label="Toggle dark mode" class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <svg class="w-5 h-5 dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      </button>

      <button class="md:hidden p-2 rounded text-gray-600 dark:text-gray-400" id="mobile-menu-btn" aria-label="Menu">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile nav -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 dark:border-gray-700">
    <div class="px-4 py-2 flex flex-col gap-1">
      {navLinks.map(link => (
        <a href={link.href} class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
          {link.label}
        </a>
      ))}
    </div>
  </div>
</header>

<script>
  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });
  const el = document.getElementById('current-date');
  if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
</script>
