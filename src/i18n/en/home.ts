// Home copy (docs/ux/CONTENT.md section 5), copied verbatim by key: `home.hero.title`
// is `home.hero.title` here. Keys that CONTENT.md defines as another key
// (`home.hero.cta` = `cta.vip_long`, `home.hero.secondary` = `cta.start_free`,
// `home.resources.cta` = `cta.all_resources`, `home.story.p1-p3` = `story.p1-p3`,
// `home.story.cta` = `cta.read_story`) are read from common.ts and story.ts, never
// copied. `*text*` marks the italic emphasis. Changing copy means changing
// CONTENT.md first.
import type { HomeDictionary } from '../index';

export const home: HomeDictionary = {
  home: {
    hero: {
      eyebrow: 'From corporate life to your financial freedom',
      title:
        'You earn well, but your money *isn\'t giving you peace of mind.*',
      lead:
        'Financial mentorship for executives and professionals at multinational companies. I help you organize your money, make the most of your career\'s benefits, and invest to build wealth and freedom.',
      trust:
        '18 years in the corporate world · More than 10 years investing',
      photo_alt: 'Gaby Kelly smiling',
    },
    ladder: {
      title:
        'You climbed the corporate ladder. *What about your freedom?*',
      p1:
        'A higher rank, more people reporting to you, ever-higher quotas, raises, travel. From the outside, everything is going well.',
      p2:
        'But even when you work from home, your mind isn\'t there. It\'s on the quota, the team, the next meeting. More and more things depend on you, and you feel that *everything depends on you*.',
      p3:
        'Meanwhile, every raise goes into a slightly more expensive lifestyle, and if your position changed tomorrow, you wouldn\'t know for sure how many months you could sustain yourself.',
      closing:
        'No one should have to choose between their career and being present for their family.',
    },
    opportunity: {
      eyebrow: 'The opportunity in your hands',
      title:
        'Your career already gave you the tools. *What\'s missing is the system.*',
      lead:
        'If you don\'t inflate your lifestyle, corporate benefits become capital to invest. Almost no one teaches you to see them that way.',
      '1': {
        title: 'A high salary and raises',
        body:
          'Every raise can go to your wealth, not to a more expensive lifestyle.',
      },
      '2': {
        title: 'Health and life insurance',
        body:
          'Expenses already covered that you don\'t pay out of pocket.',
      },
      '3': {
        title: 'Car and allowances',
        body: 'Benefits that free up cash flow every month.',
      },
      '4': {
        title: 'Travel and per diems',
        body: 'Paid meals and trips that don\'t come out of your budget.',
      },
      '5': {
        title: 'English and access to the United States',
        body: 'Doors to international investment platforms and markets.',
      },
      '6': {
        title: 'Exposure and contacts',
        body:
          'A network worth gold when you decide to build something of your own.',
      },
    },
    method: {
      eyebrow: 'The Polaris Method',
      title: 'Three steps so your salary *works for you.*',
      '1': {
        title: 'Define your North',
        body:
          'Clarity about what you want and about your relationship with money.',
      },
      '2': {
        title: 'Organize your money',
        body:
          'Your wallet system: every income and every benefit with a purpose.',
      },
      '3': {
        title: 'Invest and build wealth',
        body:
          'Deliberate investment decisions, aligned with the life you want.',
      },
    },
    resources: {
      eyebrow: 'Free resources',
      title: 'Start today, *at no cost.*',
    },
    story: {
      eyebrow: 'My story',
      title: 'From corporate life *to my freedom.*',
    },
    testimonials: {
      title: 'What people who already took the step say.',
    },
  },
  testimonial: {
    placeholder: {
      text: 'Client testimonial',
      video: 'Video testimonial from a client',
      attribution: 'Name · role · company or industry',
    },
  },
};
