# SpeakCEO - Young Entrepreneurship Program

A comprehensive platform for teaching entrepreneurship to young minds through an interactive 90-day program.

## 🚀 Features

- **90-Day Young CEO Program**
  - Interactive video lessons
  - Weekly quizzes and tasks
  - Project-based learning
  - Progress tracking
  - XP and badge system

- **Interactive Learning**
  - Live classes
  - AI-powered learning assistant
  - Real-time progress tracking
  - Downloadable resources
  - Note-taking capabilities

- **Student Dashboard**
  - Personal progress tracking
  - Achievement system
  - Learning analytics
  - Resource library
  - Community features

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, Framer Motion
- **State Management**: Zustand
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **API Integration**: OpenAI
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/speakceo.git
   cd speakceo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Preview the build:
   ```bash
   npm run preview
   ```

3. Deploy to your hosting platform of choice.

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

## 📁 Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── lib/              # Utilities and helpers
├── contexts/         # React contexts
├── types/            # TypeScript types
├── utils/            # Helper functions
└── assets/           # Static assets
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🔍 Code Quality

- Run linter:
  ```bash
  npm run lint
  ```

- Run type check:
  ```bash
  npm run typecheck
  ```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Component Documentation](docs/COMPONENTS.md)
- [Database Schema](docs/SCHEMA.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Project Manager: [Name]
- Lead Developer: [Name]
- UI/UX Designer: [Name]
- Content Creator: [Name]

## 📞 Support

For support, email support@speakceo.ai or join our Slack channel. 