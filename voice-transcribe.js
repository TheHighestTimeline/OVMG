[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5173
  targetPort = 8888
  framework = "#custom"

[functions]
  node_bundler = "esbuild"
  included_files = []
