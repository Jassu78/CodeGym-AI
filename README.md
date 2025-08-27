# CodeGym AI 🚀

**Your AI-Powered Coding Practice Arena**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Transform your coding skills with the power of AI!** CodeGym AI is a modern, interactive web application that provides personalized coding challenges, real-time AI feedback, and an intelligent coding assistant to help you master programming concepts.

## ✨ **Features**

### 🎯 **Core Learning Experience**
- **🤖 AI-Powered Problem Generation** - Dynamic coding challenges that adapt to your skill level
- **💻 Professional Code Editor** - Monaco Editor with syntax highlighting and language support
- **🔍 Intelligent Code Analysis** - Get detailed feedback on code quality and optimization
- **📚 Structured Learning Paths** - Progressive difficulty levels across Java, Python, and C
- **📱 Responsive Design** - Seamless experience across all devices

### 🚀 **AI Assistant & Feedback**
- **💬 Context-Aware Chatbot** - Ask questions about your specific problem and code
- **🎯 Smart Code Execution** - AI-based evaluation with detailed output analysis
- **💡 Progressive Hints System** - Get help when stuck without spoiling solutions
- **📊 Performance Analytics** - Track your progress and learning patterns

### 🎨 **Modern UI/UX**
- **🌙 Dark/Light Theme Support** - Choose your preferred visual experience
- **🎭 Smooth Animations** - Micro-interactions and transitions for better engagement
- **♿ Accessibility First** - Built with WCAG compliance and best practices
- **📱 Mobile-First Design** - Optimized for touch devices and small screens

## 🚀 **Quick Start**

### **Prerequisites**
- [Node.js](https://nodejs.org/) 20.0.0 or later
- [npm](https://www.npmjs.com/) 9.0.0 or later
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jassu78/CodeGym-AI.git
   cd CodeGym-AI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp env.example .env.local
   
   # Add your Google Gemini API key
   echo "GOOGLE_AI_API_KEY=your_api_key_here" >> .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🛠 **Tech Stack**

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 15.3.3 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.0 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 3.4.1 |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) | Latest |
| **AI Integration** | [Google Gemini via Genkit](https://genkit.ai/) | 1.14.1 |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) | 4.7.0 |
| **State Management** | React Hooks + Context | Built-in |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) | 7.54.2 |
| **Validation** | [Zod](https://zod.dev/) | 3.24.2 |

## 🏗 **Architecture**

```
CodeGym-AI/
├── src/
│   ├── ai/                    # AI flows and Genkit integration
│   │   ├── flows/            # AI-powered features (chatbot, code analysis)
│   │   └── genkit.ts         # Genkit configuration
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes for AI flows
│   │   ├── actions.ts        # Server actions for client interactions
│   │   └── layout.tsx        # Root layout and metadata
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── chatbot.tsx      # AI chatbot interface
│   │   ├── code-editor.tsx  # Monaco code editor
│   │   └── feedback-panel.tsx # AI feedback display
│   ├── lib/                  # Utility functions and types
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Helper functions
│   └── hooks/               # Custom React hooks
├── public/                   # Static assets
├── docs/                     # Documentation
└── .genkit/                 # Genkit configuration files
```

## 🎯 **Usage Guide**

### **1. Getting Started**
- Choose your programming language (Java, Python, C)
- Select difficulty level (Easy, Medium, Hard)
- Browse available problem categories

### **2. Solving Problems**
- Read the problem statement and requirements
- Write your solution in the Monaco code editor
- Use the AI assistant for hints and guidance
- Submit your code for evaluation

### **3. AI Feedback**
- Receive detailed code quality analysis
- Get optimization suggestions and best practices
- Ask specific questions about your code
- Track your learning progress

### **4. Progress Monitoring**
- View comprehensive learning statistics
- Track solving streaks and achievements
- Analyze performance across different areas
- Set learning goals and milestones

## 🔧 **Development**

### **Available Scripts**
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit development server
```

### **Environment Variables**
```bash
# Required
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:9002
NODE_ENV=development
```

### **Code Style**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with Next.js rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Other Platforms**
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment support
- **Docker**: Containerized deployment available

## 🤝 **Contributing**

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📊 **Project Status**

| Feature | Status | Notes |
|---------|--------|-------|
| **Core UI** | ✅ Complete | Responsive design with mobile optimization |
| **AI Integration** | ✅ Complete | Google Gemini via Genkit |
| **Code Editor** | ✅ Complete | Monaco Editor with syntax highlighting |
| **Problem Generation** | ✅ Complete | AI-powered dynamic challenges |
| **Code Analysis** | ✅ Complete | Quality feedback and suggestions |
| **Progress Tracking** | 🟡 Partial | Basic tracking implemented |
| **Real Code Execution** | ❌ Not Started | Planned for future release |
| **Community Features** | ❌ Not Started | User collaboration planned |

## 🗺 **Roadmap**

### **Phase 1: Core Features** ✅
- [x] AI-powered problem generation
- [x] Professional code editor
- [x] Intelligent code analysis
- [x] Responsive mobile design

### **Phase 2: Enhanced Learning** 🚧
- [ ] Real code compilation and execution
- [ ] Advanced progress analytics
- [ ] Personalized learning paths
- [ ] Achievement system

### **Phase 3: Community & Collaboration** 📋
- [ ] User authentication and profiles
- [ ] Solution sharing and discussion
- [ ] Collaborative problem solving
- [ ] Community challenges

### **Phase 4: Advanced Features** 📋
- [ ] Multi-language support expansion
- [ ] Advanced AI tutoring
- [ ] Mobile applications
- [ ] Enterprise features

## 🐛 **Known Issues**

- **Chatbot Context**: Sometimes provides generic responses instead of problem-specific help
- **Mobile Performance**: Large code files may cause performance issues on low-end devices
- **API Rate Limits**: Google Gemini API has usage limits that may affect heavy usage

## 📚 **Documentation**

- **[API Reference](docs/api.md)** - Complete API documentation
- **[Component Library](docs/components.md)** - UI component documentation
- **[AI Integration](docs/ai-integration.md)** - Genkit and AI flow documentation
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

## 🤝 **Support & Community**

- **📖 Documentation**: [docs/](docs/) folder
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/Jassu78/CodeGym-AI/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Jassu78/CodeGym-AI/discussions)
- **📧 Email**: [support@codegym-ai.com](mailto:support@codegym-ai.com)

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Google Gemini** for AI capabilities
- **Next.js Team** for the amazing framework
- **shadcn/ui** for beautiful components
- **Monaco Editor** for professional code editing
- **Open Source Community** for inspiration and tools

---

**Built with ❤️ by the CodeGym AI Team**

*Transform your coding skills with the power of AI!*

[⬆ Back to top](#codegym-ai-) 
