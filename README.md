# mefby
# Mefby - Professional Portfolio

Modern, AI-powered portfolio website showcasing Meftun Akarsu's expertise in AI Engineering, Data Science, and Autonomous Systems.

## 🚀 Features

- **Modern UI/UX**: Dark theme with smooth animations and responsive design
- **AI Chatbot**: Interactive AI assistant powered by Google Gemini
- **Portfolio Sections**: About, Services, Experience, Projects, and Contact
- **Interactive Stats**: Visual representation of technical skills
- **Client Showcase**: Display of career experience and freelance collaborations

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Google Gemini AI** for chatbot functionality

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mefby
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

   Get your Gemini API key from: https://aistudio.google.com/apikey

4. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🏗️ Build

To build for production:

```bash
npm run build
```

The production build will be in the `dist` directory.

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/mefby.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variable:
     - Name: `VITE_GEMINI_API_KEY`
     - Value: Your Gemini API key
   - Click "Deploy"

3. **Environment Variables in Vercel**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `VITE_GEMINI_API_KEY` with your API key value
   - Redeploy if needed

### Manual Deployment

You can also deploy the `dist` folder to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any other static hosting provider

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for chatbot | Yes (for chatbot) |

## 🎨 Customization

Edit the following files to customize the portfolio:

- `constants.ts` - Update profile, services, experience, projects, and skills
- `components/` - Modify React components for UI changes
- `index.html` - Update meta tags and global styles

## 📄 License

This project is private and proprietary.

## 👤 Author

**Meftun Akarsu**
- Email: meftunakrsu@gmail.com
- LinkedIn: [meftunakarsu](https://www.linkedin.com/in/meftunakarsu/)
- GitHub: [mftnakrsu](https://github.com/mftnakrsu)

---

Built with ❤️ using React, TypeScript, and Vite
