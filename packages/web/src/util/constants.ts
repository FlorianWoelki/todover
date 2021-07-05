import { translate } from '@todover/i18n/src/i18n';

export const staticItemClass = 'static-item';

export const days = () => [
  translate('days.sunday.name'),
  translate('days.monday.name'),
  translate('days.tuesday.name'),
  translate('days.wednesday.name'),
  translate('days.thursday.name'),
  translate('days.friday.name'),
  translate('days.saturday.name'),
];

export const months = () => [
  translate('months.january.name'),
  translate('months.february.name'),
  translate('months.march.name'),
  translate('months.april.name'),
  translate('months.may.name'),
  translate('months.june.name'),
  translate('months.july.name'),
  translate('months.august.name'),
  translate('months.september.name'),
  translate('months.october.name'),
  translate('months.november.name'),
  translate('months.december.name'),
];

export const dragAndDropDataId = 'todoId';
