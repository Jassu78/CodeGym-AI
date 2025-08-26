# Contributing to CodeGym AI 🤝

Thank you for your interest in contributing to CodeGym AI! This document provides guidelines and information for contributors.

## 📋 **Table of Contents**

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## 🚀 **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) 20.0.0 or later
- [npm](https://www.npmjs.com/) 9.0.0 or later
- [Git](https://git-scm.com/) for version control
- Basic knowledge of React, TypeScript, and Next.js

### **First Steps**
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see below)
4. **Create a feature branch** for your changes
5. **Make your changes** following the code standards
6. **Submit a pull request**

## 🔧 **Development Setup**

### **1. Clone and Install**
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/CodeGym-AI.git
cd CodeGym-AI

# Add upstream remote
git remote add upstream https://github.com/Jassu78/CodeGym-AI.git

# Install dependencies
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp env.example .env.local

# Add your Google Gemini API key
echo "GOOGLE_AI_API_KEY=your_api_key_here" >> .env.local
```

### **3. Start Development Server**
```bash
# Start Next.js development server
npm run dev

# Start Genkit development server (in another terminal)
npm run genkit:dev
```

### **4. Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run genkit:dev   # Start Genkit development server
```

## 📝 **Code Standards**

### **TypeScript**
- Use **strict mode** - all TypeScript strict flags are enabled
- Prefer **interfaces** over types for object shapes
- Use **generic types** when appropriate
- Avoid **any** type - use proper typing or `unknown`

### **React Components**
- Use **functional components** with hooks
- Follow **React naming conventions** (PascalCase for components)
- Implement **proper prop types** with TypeScript
- Use **React.memo** for performance optimization when needed

### **File Structure**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── feature/        # Feature-specific components
├── app/                 # Next.js App Router pages
├── lib/                 # Utility functions and types
├── hooks/               # Custom React hooks
└── ai/                  # AI flows and Genkit integration
```

### **Naming Conventions**
- **Files**: kebab-case (e.g., `code-editor.tsx`)
- **Components**: PascalCase (e.g., `CodeEditor`)
- **Functions**: camelCase (e.g., `handleCodeChange`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (e.g., `CodeEditorProps`)

### **Code Formatting**
- Use **Prettier** for consistent formatting
- **2 spaces** for indentation
- **Single quotes** for strings
- **Semicolons** at the end of statements
- **Trailing commas** in objects and arrays

## 🧪 **Testing Guidelines**

### **Test Structure**
```typescript
// Component test example
describe('CodeEditor', () => {
  it('should render with initial code', () => {
    render(<CodeEditor code="console.log('Hello')" />)
    expect(screen.getByText('console.log')).toBeInTheDocument()
  })

  it('should handle code changes', () => {
    const mockOnChange = jest.fn()
    render(<CodeEditor onChange={mockOnChange} />)
    // Test implementation
  })
})
```

### **Testing Best Practices**
- **Test behavior, not implementation**
- Use **meaningful test descriptions**
- **Mock external dependencies** (APIs, services)
- **Test edge cases** and error scenarios
- Maintain **good test coverage** (>80%)

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- CodeEditor.test.tsx
```

## 🔄 **Pull Request Process**

### **1. Before Submitting**
- [ ] **Code follows** the project's style guidelines
- [ ] **Tests pass** and coverage is maintained
- [ ] **TypeScript compilation** succeeds
- [ ] **Linting** passes without errors
- [ ] **Documentation** is updated if needed

### **2. Pull Request Template**
```markdown
## Description
Brief description of changes and why they're needed.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### **3. Review Process**
- **Code review** by maintainers
- **Automated checks** must pass
- **Address feedback** promptly
- **Squash commits** before merging

## 🐛 **Issue Reporting**

### **Bug Report Template**
```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 22]

## Additional Context
Screenshots, logs, or other relevant information.
```

### **Feature Request Template**
```markdown
## Feature Description
Clear description of the requested feature.

## Use Case
Why this feature is needed and how it would be used.

## Proposed Solution
Your suggested implementation approach.

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other relevant information.
```

## 🤝 **Community Guidelines**

### **Code of Conduct**
- **Be respectful** and inclusive
- **Help others** learn and grow
- **Provide constructive feedback**
- **Follow the project's coding standards**

### **Communication**
- **Use clear language** in issues and PRs
- **Be patient** with new contributors
- **Ask questions** when unsure
- **Share knowledge** and best practices

### **Getting Help**
- **Check existing issues** before creating new ones
- **Search documentation** for answers
- **Ask in discussions** for general questions
- **Use issue templates** for structured reporting

## 🏆 **Recognition**

### **Contributor Levels**
- **🌱 New Contributor**: First contribution
- **🌿 Regular Contributor**: Multiple contributions
- **🌳 Core Contributor**: Significant contributions
- **🌟 Maintainer**: Project leadership role

### **Contributing Areas**
- **Code**: Features, bug fixes, improvements
- **Documentation**: Guides, API docs, examples
- **Testing**: Test coverage, new test cases
- **Design**: UI/UX improvements, accessibility
- **Infrastructure**: CI/CD, deployment, monitoring

## 📚 **Resources**

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### **Development Tools**
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)

## 🎯 **Good First Issues**

Look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Looking for contributors
- `documentation` - Great for learning the codebase

## 📞 **Contact**

- **GitHub Issues**: [Report bugs or request features](https://github.com/Jassu78/CodeGym-AI/issues)
- **GitHub Discussions**: [General questions and discussions](https://github.com/Jassu78/CodeGym-AI/discussions)
- **Email**: [support@codegym-ai.com](mailto:support@codegym-ai.com)

---

**Thank you for contributing to CodeGym AI! 🚀**

Your contributions help make this project better for everyone in the coding community.
