import { Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono'
});
