import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'autocheck.pro': 'AutoCheck Pro',
    'sign.in': 'Sign in',
    'streamlined.car.service': 'Streamlined Car Service',
    'every.time': 'Every Time',
    'professional.vehicle.description': 'Professional vehicle documentation system with guided checklists, media capture, and comprehensive reporting for modern auto service centers.',
    'checkin.process': 'Check-In Process',
    'checkin.description': 'Complete vehicle inspection with photo documentation',
    'parts.service': 'Parts & Service',
    'parts.description': 'Document parts usage and service procedures',
    'vehicle.checkout': 'Vehicle Check-Out',
    'checkout.description': 'Customer approval and quality verification',
    'get.started': 'Get Started',
    'ready.transform': 'Ready to Transform Your Service Process?',
    'start.workflow': 'Start with any workflow that fits your current needs.'
  },
  es: {
    'autocheck.pro': 'AutoCheck Pro',
    'sign.in': 'Iniciar sesión',
    'streamlined.car.service': 'Servicio Automotriz Eficiente',
    'every.time': 'Cada Vez',
    'professional.vehicle.description': 'Sistema profesional de documentación vehicular con listas de verificación guiadas, captura de medios y reportes completos para centros de servicio automotriz modernos.',
    'checkin.process': 'Proceso de Entrada',
    'checkin.description': 'Inspección completa del vehículo con documentación fotográfica',
    'parts.service': 'Partes y Servicio',
    'parts.description': 'Documentar uso de partes y procedimientos de servicio',
    'vehicle.checkout': 'Salida del Vehículo',
    'checkout.description': 'Aprobación del cliente y verificación de calidad',
    'get.started': 'Comenzar',
    'ready.transform': '¿Listo para Transformar tu Proceso de Servicio?',
    'start.workflow': 'Comienza con cualquier flujo de trabajo que se ajuste a tus necesidades actuales.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};