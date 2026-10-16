// Language lookups for the dictionaries Agent 2 owns (form, VIP page, resource
// labels), so components pick them by `lang` the same way `getCommon` does.
import type { Language } from '../../i18n';
import { form as enForm } from '../../i18n/en/form';
import { resources as enResources } from '../../i18n/en/resources';
import { vip as enVip } from '../../i18n/en/vip';
import { form as esForm } from '../../i18n/es/form';
import { resources as esResources } from '../../i18n/es/resources';
import { vip as esVip } from '../../i18n/es/vip';
import type { FormDictionary, ResourcesDictionary, VipDictionary } from './types';

export function getForm(lang: Language): FormDictionary {
  return lang === 'en' ? enForm : esForm;
}

export function getVip(lang: Language): VipDictionary {
  return lang === 'en' ? enVip : esVip;
}

export function getResources(lang: Language): ResourcesDictionary {
  return lang === 'en' ? enResources : esResources;
}
