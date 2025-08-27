# CodeGym AI: Your AI-Powered Coding Practice Arena

CodeGym AI is a web application built with Next.js that helps you practice your coding skills. It leverages generative AI to provide a dynamic and interactive learning experience, complete with on-the-fly problem generation, code evaluation, quality analysis, and an assistant chatbot to help you when you're stuck.

This project was bootstrapped with [Firebase Studio](https://firebase.google.com/studio).

## Features

- **AI-Powered Problem Generation**: Select a topic, programming language (Java, Python, C), and complexity level to get a unique coding challenge.
- **Interactive Code Editor**: A simple, clean editor to write and test your solutions.
- **Instant Code Execution**: Run your code against the problem's expected output and get immediate feedback on its correctness.
- **Code Quality Analysis**: Get AI-driven feedback on your code's quality, focusing on aspects like readability and best practices.
- **Conversational Chatbot**: Stuck on a problem? Ask the integrated AI chatbot for hints, clarifications, or guidance.
- **Responsive Design**: A clean, modern UI that works across different screen sizes.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **AI Integration**: [Google's Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Hosting**: Pre-configured for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) or another package manager

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Google Gemini API key:
    ```
    GEMINI_API_KEY=__YOUR_API_KEY__
    ```
    You can obtain a key from the [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running at [http://localhost:9002](http://localhost:9002).

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the project files using Next.js's built-in ESLint configuration. 
