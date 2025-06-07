# Ashish Umrey - Portfolio Website

A modern, responsive portfolio website built with React and Tailwind CSS showcasing my professional experience, skills, and projects.

## 🚀 Features

- **Modern Design**: Dark theme with gradient backgrounds and glassmorphism effects
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Interactive hover effects and smooth scrolling
- **Professional Sections**:
  - Hero section with contact information
  - Skills showcase with animated cards
  - Professional experience timeline
  - Education background
  - Projects portfolio
  - Achievements and certifications
  - Contact section

## 🛠️ Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling and responsive design
- **Lucide React** - Beautiful icons
- **JavaScript ES6+** - Modern JavaScript features

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashishumrey009/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Portfolio.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Colors
The portfolio uses a gradient color scheme. You can modify colors in the `Portfolio.js` component:
- **Primary**: Blue to Purple gradients
- **Secondary**: Purple to Pink gradients
- **Accent**: Green, Yellow, and Red accents

### Content
Update your personal information in the `Portfolio.js` file:
- **Personal Info**: Name, email, phone, location
- **Social Links**: LinkedIn, GitHub, Portfolio URL
- **Experience**: Add/modify work experiences
- **Education**: Update educational background
- **Skills**: Modify the skills array
- **Projects**: Add your projects with links

### Styling
Tailwind CSS classes are used throughout. Key design elements:
- `bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900` - Main background
- `backdrop-blur-sm` - Glassmorphism effect
- `hover:scale-105` - Hover animations
- `transition-all duration-300` - Smooth transitions

## 🌐 Deployment

### GitHub Pages
1. Build the project: `npm run build`
2. Deploy the `build` folder to GitHub Pages
3. Update your repository settings to serve from the `build` branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

### Vercel
1. Import your GitHub repository to Vercel
2. Vercel will automatically detect it's a React app
3. Deploy with default settings

## 📱 Mobile Optimization

The portfolio is fully responsive with:
- Mobile-first design approach
- Optimized navigation for smaller screens
- Touch-friendly interactive elements
- Readable typography across all devices

## ⚡ Performance

- Optimized React components
- Efficient CSS with Tailwind
- Smooth animations with CSS transforms
- Lazy loading for better performance

## 📞 Contact