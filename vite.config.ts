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
                    name: 'Mauricio Lopez',
                    username: 'Maoo.lopez',
                    avatarGradient: 'linear-gradient(135deg, #FF0A78 0%, #E1306C 50%, #8A2BE2 100%)',
                    avatarUrl: '/src/assets/images/avatar_mauricio_designer_1792313922880.jpg',
                    location: 'Shadow Lab • Berlin',
                  },
                  timeAgo: '20m ago',
                  gradient: 'linear-gradient(180deg, #262626 0%, #1A1A1A 35%, #121212 65%, #0A0A0A 100%)',
                  imageUrl: '/src/assets/images/feed_art_biomorphic_1792313924712.jpg',
                  likesCount: 4558,
                  commentsCount: 500,
                  likedByText: 'danieldelax and 4,558 others',
                  captionTitle: 'SACRIFICE | VIRUS',
                  captionBody: 'Bio-digital sculpture study examining crystalline node formation and bioluminescent tendrils.',
                  totalPages: 3,
                  currentPage: 1,
                  isLiked: false,
                  isSaved: false,
                },
                {
                  id: 'post_elena',
                  author: {
                    name: 'Elena Rostova',
                    username: 'Elena.art',
                    avatarGradient: 'linear-gradient(135deg, #FF0A78 0%, #8A2BE2 100%)',
                    avatarUrl: '/src/assets/images/avatar_elena_artist_1792313923579.jpg',
                    location: 'Kunsthal • Rotterdam',
                  },
                  timeAgo: '1h ago',
                  gradient: 'linear-gradient(135deg, #2E2E2E 0%, #1F1F1F 35%, #141414 70%, #0A0A0A 100%)',
                  imageUrl: '/src/assets/images/shadow_artwork_one_1790311065756.jpg',
                  likesCount: 3840,
                  commentsCount: 245,
                  likedByText: 'maoo.lopez and 3,839 others',
                  captionTitle: 'NOIR REFRACTION',
                  captionBody: 'Interplay between deep obsidian volumes and subtle chromatic aberrations in darkroom lighting.',
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
                    avatarGradient: 'linear-gradient(135deg, #2A2A2A 0%, #151515 100%)',
                    avatarUrl: '/src/assets/images/avatar_christian_creator_1792313923903.jpg',
                    location: 'Ghent, Belgium',
                  },
                  timeAgo: '3h ago',
                  gradient: 'linear-gradient(135deg, #262626 0%, #1B1B1B 40%, #141414 75%, #0B0B0B 100%)',
                  imageUrl: '/src/assets/images/feed_art_brutalist_1792313925585.jpg',
                  likesCount: 2910,
                  commentsCount: 132,
                  likedByText: 'elena.art and 2,909 others',
                  captionTitle: 'BRUTALIST FORMS',
                  captionBody: 'Coastal concrete pavilion at blue hour. Geometry carved through heavy shadows and amber glow.',
                  totalPages: 1,
                  currentPage: 1,
                  isLiked: false,
                  isSaved: false,
                },
                {
                  id: 'post_claire',
                  author: {
                    name: 'Claire Dubois',
                    username: 'Claire_d',
                    avatarGradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    avatarUrl: '/src/assets/images/claire_green_profile_1790960159362.jpg',
                    location: 'Studio 9 • Paris',
                  },
                  timeAgo: '5h ago',
                  gradient: 'linear-gradient(135deg, #1F1F24 0%, #16161B 50%, #0D0D10 100%)',
                  imageUrl: '/src/assets/images/shadow_artwork_two_1790311076323.jpg',
                  likesCount: 1980,
                  commentsCount: 88,
                  likedByText: 'marco.visuals and 1,979 others',
                  captionTitle: 'CHROMA RESONANCE',
                  captionBody: 'Dual-frequency spectrum renders testing our new Shadow UI glass shader pipeline.',
                  totalPages: 2,
                  currentPage: 1,
                  isLiked: false,
                  isSaved: true,
                },
                {
                  id: 'post_encounter_1',
                  author: {
                    name: 'Kenji Sato',
                    username: 'kenji.tokyo',
                    avatarGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                    avatarUrl: '/src/assets/images/character_pointing_jacket_1791874566016.jpg',
                    location: 'Shibuya Crossing • Tokyo',
                  },
                  timeAgo: '7h ago',
                  gradient: 'linear-gradient(135deg, #1C1C22 0%, #121217 60%, #08080C 100%)',
                  imageUrl: '/src/assets/images/shadow_artwork_three_1790311086351.jpg',
                  likesCount: 5120,
                  commentsCount: 388,
                  likedByText: 'maoo.lopez and 5,119 others',
                  captionTitle: 'SHADOW ENCOUNTER #882',
                  captionBody: 'Captured physical beacon encounter at Shibuya Crossing. Chain verified +450 REP with Knight rank peers.',
                  totalPages: 1,
                  currentPage: 1,
                  isLiked: true,
                  isSaved: false,
                  postType: 'shadow_encounter',
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

        if (req.url?.startsWith('/api/v1/auth/login') || req.url?.startsWith('/api/v1/auth/register')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              accessToken: 'mock_jwt_token_shadow_session',
              user: {
                id: 'usr_arjun_01',
                email: 'arjun@goa.edu',
                name: 'Arjun Mehta',
                campus: 'Goa University',
                role: 'STUDENT',
                createdAt: new Date().toISOString(),
              },
            })
          );
          return;
        }

        if (req.url?.startsWith('/api/v1/auth/me')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              id: 'usr_arjun_01',
              email: 'arjun@goa.edu',
              name: 'Arjun Mehta',
              campus: 'Goa University',
              role: 'STUDENT',
            })
          );
          return;
        }

        if (req.url?.startsWith('/api/v1/posts')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              posts: [
                {
                  id: 'post_1',
                  content: 'Quiet floor at the central library is finally open for finals week!',
                  authorId: 'usr_arjun_01',
                  author: {
                    id: 'usr_arjun_01',
                    name: 'Arjun Mehta',
                  },
                  createdAt: new Date().toISOString(),
                  likesCount: 14,
                  commentsCount: 3,
                },
              ],
              hasMore: false,
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
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
