// My story page copy, English (docs/ux/CONTENT.md section 6). See ../es/story.ts.
import type { StoryContent } from '../es/story';

export const story: StoryContent = {
  eyebrow: 'My story',
  title: 'From corporate life *to my freedom.*',
  p1: 'I worked for 18 years in the corporate world as a sales manager for distribution channels, with Intel, Microsoft and Oracle partners. Ever-higher quotas, travel, good benefits.',
  p2: 'I was a single mother, and climbing the ladder cost me a lot of time with my daughter. I was there in body, but my mind was still at work. And I realized late the opportunity I had in my hands to build something else.',
  p3: 'Today, after more than 10 years building my portfolio with specialized advisors, I help corporate executives and professionals turn a good salary into wealth, without waiting as long as I did.',
  media: {
    label: "I've been interviewed on",
    '1': 'Canal 13',
    '2': 'Radio Azul',
    '3': 'Radio Fides',
    '4': 'Talks',
  },
  experience: {
    label: 'Corporate experience',
    logo_alt: { microsoft: 'Microsoft', oracle: 'Oracle' },
    intel: 'Intel',
  },
  bio: { placeholder: 'Bio and credentials' },
  photo: { placeholder: 'Session photos' },
};
