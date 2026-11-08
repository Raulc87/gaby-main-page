// Calculator copy (EN). Owned by Implementation Agent 2. Source: docs/ux/CONTENT.md
// section 11 (copied verbatim, checked by tests/unit/i18n/calculator-content.test.ts).
// All keys are provisional: the page is a shell with a placeholder formula until Gaby's
// calculator replaces the questions, formula and zones (US-035).
import type { CalculatorDictionary } from '../../lib/calculator/types';

export const calculator: CalculatorDictionary = {
  eyebrow: 'Free diagnosis · 3 minutes',
  title: 'How many months could you sustain yourself *if your position changed?*',
  lead: 'Five figures about your money today. Use the same currency for all of them.',
  figures: {
    expenses: {
      label: 'Your household\'s monthly expenses',
      hint: 'What you spend in a normal month: housing, food, utilities, transport, education.',
    },
    debt: {
      label: 'Monthly debt payments',
      hint: 'Cards, loans and other installments. If you have none, enter 0.',
    },
    savings: {
      label: 'Available savings',
      hint: 'Money you could use now: savings accounts, cash, emergency fund.',
    },
    investments: {
      label: 'Investments you could sell within a month',
      hint: 'Stocks, funds or ETFs. Don\'t include your home or your pension. If you have none, enter 0.',
    },
    other_income: {
      label: 'Monthly income without your salary',
      hint: 'Rent, a business of your own or other income that would continue if you left your position. If you have none, enter 0.',
    },
  },
  next: 'See my result',
  errors: {
    number: 'Enter a number of 0 or more.',
    no_outflow: 'Your expenses and debt payments can\'t add up to 0.',
  },
  capture: {
    title: 'Your result is ready',
    body: 'Leave us your details to see it.',
    phoneLabel: 'WhatsApp (optional)',
    consent: {
      text: 'I agree to the processing of my personal data as described in the {privacy_notice_link} to see my result and receive it by email.',
      linkLabel: 'Privacy Notice',
    },
    marketing: 'I want to receive Gaby\'s emails: six emails over two weeks on how to organize and invest my money, with invitations to an initial call, then a weekly email. I can unsubscribe at any time.',
    submit: 'See my result',
  },
  result: {
    label: 'With your money today, without your salary, you could sustain yourself for',
    months: '{months} months',
    covered: 'Your other income already covers your expenses and debts.',
    emailNote: 'We\'ve sent your result and the guide "How to start investing as an executive" to your email.',
    disclaimer: 'This calculation is an educational estimate based on the figures you entered; it is not financial advice.',
    restart: 'Calculate again',
  },
  zones: {
    alert: {
      title: 'Alert zone',
      body: 'Less than 6 months. It\'s time to organize your money and build your cushion.',
    },
    building: {
      title: 'Building zone',
      body: 'From 6 to under 12 months. You\'re on track: now it\'s about putting your money to work.',
    },
    freedom: {
      title: 'Freedom zone',
      body: '12 months or more. You have room to make career decisions from freedom.',
    },
  },
};
