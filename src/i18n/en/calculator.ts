// Calculator copy (EN). Owned by Implementation Agent 2. Source: docs/ux/CONTENT.md
// section 11 (Gaby's calculator, phase 2d), copied verbatim and checked by
// tests/unit/i18n/calculator-content.test.ts.
import type { CalculatorDictionary } from '../../lib/calculator/types';

export const calculator: CalculatorDictionary = {
  eyebrow: 'Free diagnosis · 3 minutes',
  title: 'How many months could you sustain yourself *if your position changed?*',
  lead: 'Five figures, three minutes. Find out how long your money would last today without your salary.',
  figures: {
    title: 'Your numbers',
    currency: {
      label: 'Currency',
      usd: 'USD',
      crc: 'Colones',
    },
    exampleNote: 'It comes with an example filled in. Replace it with your numbers.',
    expenses: {
      label: 'How much do you spend a month to live the way you live today?',
      hint: 'Home, food, schools, car, insurance, going out. Everything.',
    },
    savings: {
      label: 'How much do you have in savings accounts and wallets?',
    },
    investments: {
      label: 'How much do you have in investments you could sell in less than a month?',
      hint: 'Funds, stocks, ETFs, certificates of deposit. Don\'t include your home.',
    },
    solidarity: {
      label: 'How much do you have in your solidarity association (asociación solidarista)?',
      hint: 'What you would receive if you left the company. If you don\'t know, enter 0.',
    },
    passive: {
      label: 'How much comes in each month without working?',
      hint: 'Rent, dividends, interest.',
    },
    shares: {
      label: 'How much of your investments is in your company\'s shares?',
      placeholder: 'Choose an option',
      options: {
        none: 'I don\'t have shares in my company',
        under_20: 'Less than 20%',
        from_20_to_50: 'Between 20% and 50%',
        over_50: 'More than 50%',
      },
    },
  },
  errors: {
    expenses: 'Enter how much you spend a month so we can calculate.',
    shares: 'Choose how much of your investments is in your company\'s shares.',
    number: 'Enter a number of 0 or more.',
  },
  next: 'Calculate my months',
  capture: {
    title: 'Your result is ready',
    body: 'Leave us your details to see it.',
    bodyWithGuide: 'Where should we send it? You\'ll also get the guide "How to start investing as an executive".',
    phoneLabel: 'WhatsApp (optional)',
    consent: {
      text: 'I agree to the processing of my personal data as described in the {privacy_notice_link} to see my result and receive it by email.',
      linkLabel: 'Privacy Notice',
    },
    marketing: 'I want to receive Gaby\'s emails: six emails over two weeks on how to organize and invest my money, with invitations to an initial call, then a weekly email. I can unsubscribe at any time.',
    submit: 'See my result',
  },
  result: {
    label: 'Your months of freedom',
    unit: { one: 'month', many: 'months' },
    zones: {
      critical: {
        label: 'Critical zone',
        title: 'Your peace of mind depends on your next paycheck.',
        body: 'If your position changed tomorrow, you\'d have less than three months of margin. The good news: with a good salary, this number can grow fast once you have a system.',
      },
      alert: {
        label: 'Alert zone',
        title: 'You have a cushion, but it\'s thin.',
        body: 'You could sustain yourself for a few months, but a change at work would force you to decide under pressure. The next step is to set money aside with a purpose every month.',
      },
      building: {
        label: 'Building your base',
        title: 'You\'re on track. Now it\'s time to put it to work.',
        body: 'You have a real base. The challenge is to keep that money from standing still: to have it start generating income so not everything depends on your salary.',
      },
      path_to_freedom: {
        label: 'Path to freedom',
        title: 'You have room to decide calmly.',
        body: 'You can make career decisions from freedom. The next level is for your investments to pay a growing share of your expenses.',
      },
      solid_cushion: {
        label: 'Solid cushion',
        title: 'Your money already gives you years of peace of mind.',
        body: 'You have more than three years of margin. The question now is whether that wealth is working as hard as it could and is well diversified.',
      },
      financially_free: {
        label: 'Financially free',
        title: 'Your passive income already covers your expenses.',
        body: 'You\'ve won the game: your investments pay for your life. Now it\'s about protecting and growing that wealth.',
      },
    },
    gaugeMax: '36+ months',
    available: 'Money available without your salary',
    gap: 'What you need to cover each month',
    alert: { lead: 'Watch your concentration.', body: 'A large part of your investments is in your own company. If the company does badly, you could lose your salary and your savings at the same time.' },
    nextStep: { title: 'How do I raise this number?', body: 'With a system: wallets, your company\'s benefits working for you, and an investment plan. It\'s what we build together in Wealth Mastery, with the Polaris Method.' },
    emailNote: 'We\'ve sent your result and the guide "How to start investing as an executive" to your email.',
    disclaimer: 'This calculation is an educational estimate based on the figures you entered. It doesn\'t include taxes, fees or changes in your expenses, and it isn\'t investment advice. Gaby Kelly is an investor and mentor, not a financial advisor.',
    restart: 'Calculate again',
  },
};
