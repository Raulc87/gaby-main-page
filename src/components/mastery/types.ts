// Shape of the Wealth Mastery page copy (docs/ux/CONTENT.md section 12), keyed as in
// CONTENT.md: `mastery.fit.yes.1` is `mastery.fit.yes['1']`. Keys that CONTENT.md defines
// as another key (`mastery.eyebrow`, `mastery.cta`, `mastery.secondary`,
// `mastery.method.eyebrow`, `mastery.guide.cta`, `mastery.testimonials.title`,
// `mastery.apply.eyebrow`, `mastery.apply.cta`) are not copied: the components read their
// source (`vip_band.eyebrow`, `cta.vip_apply`, `home.hero.secondary`, ...).

export interface MasteryPillarCopy {
  label: string;
  title: string;
  point: { '1': string; '2': string; '3': string };
}

export interface MasteryHowCopy {
  title: string;
  body: string;
}

export interface MasteryFaqCopy {
  question: string;
  answer: string;
}

export interface MasteryDictionary {
  mastery: {
    title: string;
    lead: string;
    fit: {
      title: string;
      yes: { title: string; '1': string; '2': string; '3': string; '4': string; '5': string };
      no: { title: string; '1': string; '2': string; '3': string };
    };
    method: {
      title: string;
      lead: string;
      '1': MasteryPillarCopy;
      '2': MasteryPillarCopy;
      '3': MasteryPillarCopy;
      parallel: { title: string; body: string };
    };
    how: {
      title: string;
      '1': MasteryHowCopy;
      '2': MasteryHowCopy;
      '3': MasteryHowCopy;
      '4': MasteryHowCopy;
    };
    guide: {
      eyebrow: string;
      title: string;
      p1: string;
      p2: string;
      photo: { placeholder: string };
      photo_alt: string;
    };
    faq: {
      title: string;
      '1': MasteryFaqCopy;
      '2': MasteryFaqCopy;
      '3': MasteryFaqCopy;
      '4': MasteryFaqCopy;
    };
    apply: { title: string };
  };
}
