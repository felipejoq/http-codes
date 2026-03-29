<div align="center">

# 🌐 HTTP Echo

### **The Ultimate HTTP Status Code Playground**

[![Live Demo](https://img.shields.io/badge/🔗%20Live%20Demo-http.uncodigo.com-00C853?style=for-the-badge&logo=google-chrome&logoColor=white)](https://http.uncodigo.com)
[![API Status](https://img.shields.io/badge/API-Online-00C853?style=for-the-badge&logo=server&logoColor=white)](https://http.uncodigo.com/http/200)
[![Rate Limit](https://img.shields.io/badge/Rate%20Limit-100%2Fmin-blue?style=for-the-badge&logo=fastapi&logoColor=white)](https://http.uncodigo.com)

<br>

[![Astro](https://img.shields.io/badge/Astro-6.0-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)

<br>

<img src="screenshot.webp" alt="HTTP Echo Screenshot" width="800" style="border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);" />

<br>

**🚀 Test any HTTP status code instantly. Free. Open Source. No signup required.**

[🌐 Try it Now](https://http.uncodigo.com) · [📚 API Docs](https://http.uncodigo.com/docs) · [💻 Self-Host](#self-hosting)

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation)
- [🎯 Use Cases](#-use-cases)
- [💻 Self-Hosting](#-self-hosting)
- [🏗️ Tech Stack](#️-tech-stack)
- [🗺️ Roadmap](#️-roadmap)

---

## ✨ Features

### 🔥 Core Features

| Feature | Description |
|---------|-------------|
| **📊 75+ Status Codes** | From 100 Continue to 599 Network Connect Timeout — including nginx, Cloudflare, and AWS-specific codes |
| **⚡ Instant API** | Test any HTTP status with a simple `curl` request |
| **🎨 Beautiful UI** | Modern, responsive design with dark/light mode |
| **🔍 Smart Search** | Find codes by number, name, or description (`/` to focus) |
| **🧪 Interactive Tester** | Try codes directly in the browser |
| **📱 Fully Responsive** | Works perfectly on desktop, tablet, and mobile |

### 🛠️ API Superpowers

| Feature | What it does |
|---------|--------------|
| **⏱️ Delays** | Simulate slow responses (`?delay=5000`) |
| **📝 Custom Body** | Return any content you want (`?body=Hello`) |
| **🔄 Redirects** | Test 3xx flows with custom destinations |
| **🎭 Custom Headers** | Add any headers to responses |
| **🚦 Rate Limiting** | Built-in protection with clear headers |
| **🌐 CORS Enabled** | Use from any origin, any framework |

---

## 🚀 Quick Start

### 🎯 One-Liners

```bash
# Test a 200 OK
curl https://http.uncodigo.com/http/200

# Get a 404 Not Found with JSON metadata
curl https://http.uncodigo.com/http/404

# Simulate a slow API (5 second delay)
curl "https://http.uncodigo.com/http/200?delay=5000"

# Custom response body
curl "https://http.uncodigo.com/http/200?body=Hello%20World"

# Test redirects without following them
curl -I "https://http.uncodigo.com/http/302?redirect_to=https://example.com"
```

### 🎨 Advanced Examples

```bash
# Return custom JSON
curl "https://http.uncodigo.com/http/200?body=%7B%22status%22%3A%22success%22%7D&content_type=application/json"

# Return HTML
curl "https://http.uncodigo.com/http/200?body=%3Ch1%3EHello%3C%2Fh1%3E&content_type=text/html"

# Add custom headers
curl "https://http.uncodigo.com/http/200?headers=%7B%22X-Request-ID%22%3A%22123%22%7D"

# View redirect info without redirecting
curl "https://http.uncodigo.com/http/302?redirect_to=https://example.com&no_redirect"

# Test rate limiting behavior
curl -i "https://http.uncodigo.com/http/429?retry_after=60"

# Custom 404 message
curl "https://http.uncodigo.com/http/404?body=Custom%20error%20message"
```

---

## 📖 API Documentation

### 🌐 Base URL

```
https://http.uncodigo.com
```

### 🔌 Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/http/{code}` | Get status code with JSON metadata |
| `POST` | `/http/{code}` | Same as GET, accepts POST requests |
| `PUT` | `/http/{code}` | Same as GET, accepts PUT requests |
| `DELETE` | `/http/{code}` | Same as GET, accepts DELETE requests |
| `PATCH` | `/http/{code}` | Same as GET, accepts PATCH requests |
| `HEAD` | `/http/{code}` | Returns headers only (no body) |
| `OPTIONS` | `/http/{code}` | Returns CORS preflight headers |

### 🔧 Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `delay` | `number` | Delay response in ms (max 30000) | `?delay=2000` |
| `body` | `string` | Custom response body (URL-encoded) | `?body=Hello%20World` |
| `content_type` | `string` | Custom Content-Type | `?content_type=text/html` |
| `headers` | `JSON` | Custom headers (URL-encoded JSON) | `?headers=%7B%22X-Custom%22%3A%22val%22%7D` |
| `redirect_to` | `URL` | Redirect destination for 3xx | `?redirect_to=https%3A%2F%2Fexample.com` |
| `no_redirect` | `flag` | Return JSON instead of redirecting | `?no_redirect` |
| `retry_after` | `number` | Retry-After header value | `?retry_after=60` |
| `allow` | `string` | Allowed methods for 405 | `?allow=GET,POST` |

### 📤 Response Format

```json
{
  "code": 404,
  "name": "Not Found",
  "description": "The requested resource could not be found...",
  "spec": "RFC 9110, Section 15.5.5",
  "request": {
    "method": "GET",
    "url": "https://http.uncodigo.com/http/404",
    "headers": {
      "accept": "*/*",
      "host": "http.uncodigo.com"
    }
  }
}
```

### 🎭 Special Behaviors

| Code Range | Behavior |
|------------|----------|
| **1xx** | Returned as `200` with `X-Original-Status` header |
| **204 / 304** | No response body |
| **3xx** | Sends `Location` header (use `?no_redirect` for JSON) |
| **401** | Adds `WWW-Authenticate: Bearer` header |
| **405** | Adds `Allow` header with allowed methods |
| **429 / 503** | Supports `Retry-After` via query param |
| **444** | Empty response (nginx behavior) |

### 🌐 CORS Headers

All responses include:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
Access-Control-Allow-Headers: *
```

### ⚡ Rate Limiting

Headers included in every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1774824000
```

When exceeded (HTTP 429):

```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the limit of 100 requests per minute",
  "retry_after": 45,
  "limit": 100,
  "window": "1 minute"
}
```

---

## 💻 Code Examples

<details>
<summary><b>🟨 JavaScript / TypeScript</b></summary>

```typescript
// Test error handling
const response = await fetch('https://http.uncodigo.com/http/500');
console.log(response.status); // 500
const data = await response.json();

// With custom body
const custom = await fetch(
  'https://http.uncodigo.com/http/200?body=Custom%20Response'
);

// Test redirect handling
const redirect = await fetch(
  'https://http.uncodigo.com/http/302?redirect_to=/test'
);
console.log(redirect.headers.get('Location')); // /test
```
</details>

<details>
<summary><b>🐍 Python</b></summary>

```python
import requests

# Test status codes
response = requests.get('https://http.uncodigo.com/http/418')
print(response.status_code)  # 418
print(response.json())

# With parameters
response = requests.get(
    'https://http.uncodigo.com/http/200',
    params={'delay': 1000, 'body': 'Hello'}
)

# Custom headers
response = requests.get(
    'https://http.uncodigo.com/http/200',
    params={'headers': '{"X-Custom":"value"}'}
)
print(response.headers['X-Custom'])  # value
```
</details>

<details>
<summary><b>🔵 Go</b></summary>

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    // Test status code
    resp, err := http.Get("https://http.uncodigo.com/http/404")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Printf("Status: %d\n", resp.StatusCode)
    fmt.Printf("Body: %s\n", body)
}
```
</details>

<details>
<summary><b>🦀 Rust</b></summary>

```rust
use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("https://http.uncodigo.com/http/200")
        .await?;
    
    println!("Status: {}", resp.status());
    println!("Body: {}", resp.text().await?);
    Ok(())
}
```
</details>

<details>
<summary><b>📱 cURL</b></summary>

```bash
# Basic usage
curl https://http.uncodigo.com/http/200

# With delay
curl "https://http.uncodigo.com/http/200?delay=3000"

# Custom body
curl "https://http.uncodigo.com/http/200?body=Hello%20World"

# Custom JSON
curl "https://http.uncodigo.com/http/200?body=%7B%22key%22%3A%22value%22%7D"

# Check headers only
curl -I "https://http.uncodigo.com/http/301?redirect_to=/test"
```
</details>

---

## 🎯 Use Cases

### 🧪 Testing & QA
- **Error Handling**: Test how your app handles 4xx/5xx errors
- **Retry Logic**: Verify exponential backoff with 503 + `?retry_after`
- **Timeout Handling**: Use `?delay` to simulate slow APIs

### 🛠️ Development
- **Mock APIs**: Build frontend while backend isn't ready
- **Webhook Testing**: Test webhook receivers with various statuses
- **Load Testing**: Generate consistent responses for benchmarking

### 📚 Education
- **Learn HTTP**: Understand status codes with real examples
- **Teaching**: Demonstrate HTTP concepts to students
- **Documentation**: Show API behavior in docs

### 🔧 DevOps
- **Health Checks**: Test load balancer configurations
- **Monitoring**: Verify alerting rules trigger correctly
- **CI/CD**: Integration tests for HTTP clients

---

## 💻 Self-Hosting

### 🐳 Docker (Coming Soon)

```bash
docker run -p 3000:3000 httpecho/httpecho:latest
```

### 🚀 Deploy to Dokploy/Railpack

1. **Fork this repository**
2. **Connect to Dokploy**:
   - Select your repository
   - Build Pack: `Railpack`
   - Port: `3000`
3. **Deploy!**

### ☁️ Deploy to Cloudflare Pages

```bash
# Clone and setup
git clone https://github.com/felipejoq/http-codes.git
cd http-codes
npm install

# Build and deploy
npm run build
npx wrangler pages deploy dist
```

### 📋 Prerequisites

- Node.js >= 22.12
- npm >= 10

### 🔧 Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/httpecho.git
cd httpecho

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | [Astro](https://astro.build) v6 | Static site + SSR API |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) v4 | Utility-first CSS |
| **Language** | [TypeScript](https://typescriptlang.org) | Type safety |
| **Adapter** | [@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/) | Node.js deployment |
| **Runtime** | Node.js 22+ | Server runtime |
| **Platform** | [Dokploy](https://dokploy.com) / [Railpack](https://railpack.com) | Container deployment |

### 📁 Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Header.astro     # Navigation + theme toggle
│   ├── CodeCard.astro   # Status code cards
│   ├── SearchBar.astro  # Search with keyboard shortcuts
│   ├── CopyButton.astro # Clipboard copy
│   └── TryIt.astro      # Interactive API tester
├── data/
│   └── http-codes.ts    # 75+ HTTP codes database
├── layouts/
│   └── BaseLayout.astro # HTML shell + SEO
├── pages/
│   ├── index.astro      # Homepage
│   ├── docs/index.astro # API documentation
│   ├── codes/           # Browse codes
│   └── http/[code].ts   # API endpoint
├── lib/
│   └── rate-limit.ts    # Rate limiting logic
└── styles/
    └── global.css       # Tailwind + custom styles
```

---

## 🗺️ Roadmap

- [x] 75+ HTTP status codes
- [x] Custom response bodies
- [x] Custom headers
- [x] Redirect handling
- [x] Rate limiting
- [x] Dark/light mode
- [x] Search functionality
- [x] Interactive tester
- [ ] Docker image
- [ ] WebSocket support
- [ ] Response templates
- [ ] API authentication
- [ ] Usage analytics
- [ ] GraphQL endpoint

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

- [Astro](https://astro.build) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [IETF](https://ietf.org) for HTTP specifications

---

<div align="center">

**Made with ❤️ by [Felipe](https://uncodigo.com)**

[🌐 http.uncodigo.com](https://http.uncodigo.com) · [⭐ Star this repo](https://github.com/felipejoq/http-codes) · [🐛 Report Bug](https://github.com/felipejoq/http-codes/issues)

</div>
