import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = ({ user }) => {
  const { t } = useTranslation();
  return <div>{t('welcome')}, {user.email}</div>;
};

export default Dashboard;