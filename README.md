# CINEVERSE

A production-ready, Netflix-inspired streaming platform built with Next.js, TypeScript, and Tailwind CSS. Features a premium dark interface, responsive design, and complete frontend functionality using localStorage for demo persistence.

![CINEVERSE](https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)

## Features

- **Premium Dark Interface**: Cinematic design with #080808 background and #E50914 accent color
- **Fully Functional UI**: 
  - Home page with hero banner and auto-rotating featured content
  - Horizontally scrollable content rows (Trending, Popular, Top Rated, etc.)
  - Movie and TV show detail pages with full metadata
  - Professional video player with custom controls
  - Search functionality with debouncing and filters
  - My List (watchlist) with localStorage persistence
  - Continue Watching with progress tracking
  - Profile management

- **Authentication**: Demo authentication system using localStorage (ready for real auth integration)
- **TMDB Integration**: Fetches real movie/TV data with graceful fallback to mock data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Animations**: Smooth transitions with Framer Motion
- **TypeScript**: Full type safety across the application
- **Production Ready**: Optimized build, no errors, Vercel-compatible

## Technology Stack

- **Framework**: Next.js 16.4.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.0.9
- **Icons**: Lucide React
- **Animations**: Framer Motion 12.4.7
- **Data Persistence**: Browser localStorage
- **Movie Data**: TMDB API (with fallback mock data)
- **Video**: YouTube Embed API for trailers, HTML5 video for playable content
- **Deployment**: Vercel

## Project Structure

```
cineverse/
├── public/
│   └── images/
│       └── poster-placeholder.svg
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── movie/[id]/
│   │   ├── movies/
│   │   ├── my-list/
│   │   ├── profile/
│   │   ├── search/
│   │   ├── signup/
│   │   ├── tv-shows/
│   │   ├── tv/[id]/
│   │   ├── watch/
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── hero/
│   │   ├── layout/
│   │   ├── movie/
│   │   ├── navigation/
│   │   └── player/
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── WatchlistContext.tsx
│   ├── lib/
│   │   ├── mockData.ts
│   │   └── tmdb.ts
│   └── types/
│       └── index.ts
├── .env.example
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd NetflixClone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional but recommended for full functionality):
```bash
cp .env.example .env.local
```

4. Obtain a TMDB API Key (optional):
   - Go to [The Movie Database](https://www.themoviedb.org/)
   - Sign up for a free account
   - Navigate to Settings > API > Create a new key
   - Add your key to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# TMDB API Key (optional - fallback to mock data if not provided)
TMDB_API_KEY=your_tmdb_api_key_here
```

**Note**: The application works without the TMDB API key by using curated mock data. However, adding the key unlocks real-time data from TMDB's extensive database.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Automatic Deployment

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variable `TMDB_API_KEY` (optional)
6. Click "Deploy"

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy using Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Key Features Explained

### Authentication (Demo Mode)

The application uses a demo authentication system stored in localStorage:
- **Sign In**: Accepts any email/password for demo purposes
- **Sign Up**: Creates a new user profile stored locally
- **Guest Mode**: One-click access without signup
- **Profile Management**: Change username and avatar

**Note**: This is a demo implementation. For production, integrate with NextAuth.js, Clerk, Auth0, or Supabase Auth.

### My List & Continue Watching

- Data persists in localStorage
- Watchlist survives page refreshes
- Continue Watching tracks playback progress
- Remove items individually or clear all history

### Video Player

- Custom HTML5 video player with full controls
- Play/pause, volume, progress bar, fullscreen
- Keyboard shortcuts (Space, F, M, Arrow keys)
- Playback speed control (0.5x to 2x)
- Subtitles toggle
- Progress saved every 5 seconds

### Search

- Real-time search with 350ms debounce
- Search by title, genre, or keywords
- Filter by Movies, TV Shows, or All
- Recent searches saved to localStorage
- Popular suggestions

### Responsive Design

- Mobile-first approach
- Touch-friendly controls
- Adaptive hero sections
- Responsive movie cards
- Mobile navigation drawer

## Mock Data

The application includes curated mock data for:
- 8+ movies with full metadata
- 3+ TV shows with seasons and episodes
- 4 playable public-domain films (Blender Foundation)
- Genre mappings for both movies and TV

## Fallback Behavior

If TMDB API is not configured:
- Application automatically uses mock data
- All features remain functional
- No error messages or broken states
- Professional placeholder images

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for educational purposes. Movie metadata and images are provided by TMDB. Playable content consists of public-domain films from the Blender Foundation.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for movie/TV metadata
- [Blender Foundation](https://www.blender.org/foundation/) for public-domain films
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [Framer Motion](https://www.framer.com/motion/) for animations

## Support

For issues or questions, please open an issue on the GitHub repository.
