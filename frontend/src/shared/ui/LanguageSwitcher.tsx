import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from './Select';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Українська', value: 'ua' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Français', value: 'fr' },
    { label: 'Español', value: 'es' },
  ];

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      label={t('Language')}
      value={i18n.language}
      onChange={handleLanguageChange}
      options={languages}
      className="min-h-[36px] w-[140px] bg-zinc-800"
    />
  );
};
