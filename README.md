
# **TalkFlow N8N Integration**

A real-time chat application integrated with **N8N workflows** for automated responses and processing.

## **Features**
- Real-time chat interface
- **N8N workflow integration**
- **Message history persistence**
- Mobile-responsive design
- Dark/light mode support
- **Code syntax highlighting with copy and playground integration**
- Markdown support
- Image upload and preview
- Configurable site title and welcome message

## **Getting Started**

### **Prerequisites**
- **Node.js & npm** – Install using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **N8N Instance** - You'll need access to an N8N instance with a webhook endpoint

### **Environment Configuration**
Create a `.env` file in the root directory with the following variables:

```env
# Required
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
VITE_N8N_WEBHOOK_USERNAME=your_webhook_username
VITE_N8N_WEBHOOK_SECRET=your_webhook_secret

# Optional
VITE_WELCOME_MESSAGE="Welcome message for your chat"
VITE_SITE_TITLE="Your Site Title"
```

### **Development Setup**

```bash
# Clone the repository
git clone https://github.com/jimmartinquisitive/talkflow-n8n.git

# Navigate to project directory
cd talkflow-n8n

# Install dependencies
npm install

# Start the development server
npm run dev
```

### **Production Build**

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### **Docker Deployment**

1. **Using Docker Run**:
```bash
docker run -d -p 8009:80 \
  -e VITE_N8N_WEBHOOK_URL="your_n8n_webhook_url" \
  -e VITE_N8N_WEBHOOK_USERNAME="your_username" \
  -e VITE_N8N_WEBHOOK_SECRET="your_secret" \
  -e VITE_WELCOME_MESSAGE="Your welcome message" \
  -e VITE_SITE_TITLE="Your Site Title" \
  jimmartinquis/n8n-chatui:latest
```

2. **Using Docker Compose**:
   - Update the environment variables in your `docker-compose.yml`
   - Run:
```bash
docker-compose up -d
```

## **Project Structure**
```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

## **Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to GitHub (`git push origin feature-branch`)
5. Open a Pull Request

## **License**
This project is open-source and available under the MIT License.
