import { LandingContentDto } from './landing.validator';

export const defaultLandingContent: LandingContentDto = {
  hero: {
    brand: 'Clizer',
    badge: 'Built for creators and media teams',
    title: 'Turn Every Long Video Into High-Performing Shorts',
    subtitle:
      'From podcasts to webinars, Clizer finds the strongest moments and delivers ready-to-post vertical clips with captions and clean framing.',
    primaryCta: 'Start Free Trial',
    secondaryCta: 'See Product Tour',
    trustText: 'No credit card required. Export in 1080p.',
    nav: [
      { label: 'Features', href: '#features' },
      { label: 'Workflow', href: '#workflow' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Results', href: '#pricing' }
    ],
    clipSource: 'founder-podcast-episode-42.mp4',
    clipCountText: '12 strong short clips detected',
    clips: ['Opening hook at 01:10 - 00:33', 'Core insight at 12:48 - 00:44', 'Story segment at 26:14 - 00:52'],
    metrics: ['Cut editing time by 70%', 'Publish 3x more clips per week', 'Optimized for Shorts, Reels, and TikTok']
  },
  marquee: [
    'Trusted by creator-led brands',
    'Podcast production teams',
    'Digital education companies',
    'Growth marketing studios',
    'Newsletter media businesses',
    'Content-first SaaS teams',
    'Agency social teams'
  ],
  features: [
    {
      title: 'Moment Detection',
      description: 'Automatically identify sections with stronger hooks, emotional peaks, and high audience retention potential.'
    },
    {
      title: 'Caption Engine',
      description: 'Generate readable captions with modern visual styles tuned for mobile-first viewing behavior.'
    },
    {
      title: 'Vertical Reframing',
      description: 'Reframe wide footage into 9:16 while keeping faces and key visual context centered.'
    },
    {
      title: 'Channel Presets',
      description: 'Apply export settings designed for YouTube Shorts, TikTok, and Instagram Reels in one click.'
    },
    {
      title: 'Brand Styles',
      description: 'Use your own colors, typography, and overlays so every clip matches your visual identity.'
    },
    {
      title: 'Team Review',
      description: 'Share drafts, collect approvals, and keep your entire clip pipeline inside one workspace.'
    }
  ],
  workflow: [
    {
      title: 'Upload',
      description: 'Bring in a podcast, webinar, interview, or any long-form video from your content library.'
    },
    {
      title: 'Configure',
      description: 'Choose clip length, tone, and platform destination using saved production presets.'
    },
    {
      title: 'Publish',
      description: 'Review top suggestions, make quick edits, and export polished shorts ready to post.'
    }
  ],
  testimonials: [
    {
      quote: 'Our team now ships daily short-form content without adding extra editors to the workflow.',
      name: 'Priya Menon',
      role: 'Creator, 220K followers'
    },
    {
      quote: 'We repurpose every client episode in under an hour, and the output quality is consistently strong.',
      name: 'Jordan Blake',
      role: 'Founder, CreatorOps Studio'
    },
    {
      quote: 'Clizer helped us build a predictable short-form pipeline instead of relying on one-off manual edits.',
      name: 'Ananya Shah',
      role: 'Head of Content, ScaleSpark'
    }
  ],
  stats: [
    { label: 'Hours saved per week', value: '26h' },
    { label: 'Average clip export time', value: '11m' },
    { label: 'Creator teams onboarded', value: '4,800+' },
    { label: 'Monthly clips produced', value: '2.1M' }
  ]
};
