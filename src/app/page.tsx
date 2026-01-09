import Image from 'next/image';
import { Box, Paper, Typography } from '@mui/material';
import { HomeSearchCard } from '../components/HomeSearchCard';

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <Paper
        elevation={6}
        sx={{
          width: 'min(1400px, 92vw)',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          mt: 2,
        }}
      >
        <Box sx={{ position: 'relative', height: { xs: 220, sm: 300, md: 340 } }}>
          <Image
            src="/Homepage_Image.png"
            alt="Bibliothek"
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: 70, sm: 90 },
            bgcolor: 'rgba(255,255,255,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              textAlign: 'center',
            }}
          >
            Willkommen in unserem online Buchhandel!
          </Typography>
        </Box>
      </Paper>

      <HomeSearchCard />
    </Box>
  );
}
