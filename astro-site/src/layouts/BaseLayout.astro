---
export interface Props {
  title?: string;
  description?: string;
}
const { title = 'The Footprint', description = "Environmental accountability journalism for the data center industry." } = Astro.props;
---
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <script is:inline>
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
</head>
<body class="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 min-h-screen flex flex-col">
  <slot />
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const toggle = document.getElementById('dark-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          const html = document.documentElement;
          const isDark = html.classList.toggle('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
      }
    });
  </script>
</body>
</html>
