import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function offlineApiPlugin(): Plugin {
  return {
    name: 'offline-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/api/feed')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              posts: [
                {
                  id: 'post_maoo',
                  author: {
                    name: 'Maoo Lopez',
                    username: 'Maoo.lopez',
                    avatarGradient: 'linear-gradient(135deg, #FF0A78 0%, #991BEA 50%, #6366F1 100%)',
                  },
                  timeAgo: '20m ago',
                  gradient: 'linear-gradient(180deg, #531B82 0%, #7622B3 35%, #A81EBF 65%, #FF0A78 100%)',
                  likesCount: 4558,
                  commentsCount: 500,
                  likedByText: 'danieldelax and 4,558 others',
                  captionTitle: 'SACRIFICE | VIRUS',
                  captionBody: 'this photomanipulation inspired in the',
                  totalPages: 3,
                  currentPage: 1,
                  isLiked: false,
                  isSaved: false,
                },
                {
                  id: 'post_eliott',
                  author: {
                    name: 'Eliott Johnson',
                    username: 'Eliott Johnson',
                    avatarGradient: 'linear-gradient(135deg, #7A58E6 0%, #B77DE8 100%)',
                    location: 'Madrid, Spain',
                  },
                  timeAgo: '2h ago',
                  gradient: 'linear-gradient(135deg, #7A58E6 0%, #B77DE8 35%, #F5A7C4 70%, #FCD5B5 100%)',
                  likesCount: 2420,
                  commentsCount: 175,
                  likedByText: 'sofia_art and 2,419 others',
                  captionTitle: 'ETHEREAL LIGHT',
                  captionBody: 'Capturing sunset reflections across the skyline of Madrid.',
                  totalPages: 1,
                  currentPage: 1,
                  isLiked: true,
                  isSaved: true,
                },
                {
                  id: 'post_christian',
                  author: {
                    name: 'Christian Lue',
                    username: 'Christian Lue',
                    avatarGradient: 'linear-gradient(135deg, #D97706 0%, #78350F 100%)',
                    location: 'Ghent, Belgium',
                  },
                  timeAgo: '5h ago',
                  gradient: 'linear-gradient(135deg, #3A2C27 0%, #5C3E33 40%, #855E4E 75%, #1F1714 100%)',
                  likesCount: 1890,
                  commentsCount: 94,
                  likedByText: 'marco.visuals and 1,889 others',
                  captionTitle: 'BRUTALIST FORMS',
                  captionBody: 'Studies in concrete, shadow, and architectural permanence.',
                  totalPages: 1,
                  currentPage: 1,
                  isLiked: false,
                  isSaved: false,
                },
              ],
              timestamp: Date.now(),
            })
          );
          return;
        }

        if (req.url?.startsWith('/api/reels')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              reels: [
                {
                  id: 'reel_eliott',
                  author: {
                    name: 'Eliott Johnson',
                    username: 'eliott.j',
                    location: 'Madrid, Spain',
                    avatarGradient: 'linear-gradient(135deg, #3A3B4D 0%, #252636 100%)',
                  },
                  gradient: 'linear-gradient(180deg, #7E729F 0%, #B896B8 30%, #E3B2C6 65%, #F5D3DC 100%)',
                  likes: '2,4k',
                  likesCount: 2400,
                  comments: '175',
                  commentsCount: 175,
                  isLiked: true,
                  isSaved: false,
                },
                {
                  id: 'reel_christian',
                  author: {
                    name: 'Christian Lue',
                    username: 'christian.lue',
                    location: 'Ghent, Belgium',
                    avatarGradient: 'linear-gradient(135deg, #443B36 0%, #2A2320 100%)',
                  },
                  gradient: 'linear-gradient(180deg, #463B36 0%, #68584F 35%, #927C6F 70%, #BBA496 100%)',
                  likes: '1,8k',
                  likesCount: 1800,
                  comments: '92',
                  commentsCount: 92,
                  isLiked: false,
                  isSaved: true,
                },
                {
                  id: 'reel_sofia',
                  author: {
                    name: 'Sofia Martinez',
                    username: 'sofia.mtz',
                    location: 'Tokyo, Japan',
                    avatarGradient: 'linear-gradient(135deg, #1B2A4A 0%, #0F1829 100%)',
                  },
                  gradient: 'linear-gradient(180deg, #1E3A8A 0%, #3B82F6 40%, #60A5FA 70%, #93C5FD 100%)',
                  likes: '3,9k',
                  likesCount: 3900,
                  comments: '340',
                  commentsCount: 340,
                  isLiked: false,
                  isSaved: false,
                },
              ],
              timestamp: Date.now(),
            })
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), offlineApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? '.', '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
