import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Index page
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
    'start.workflow': 'Start with any workflow that fits your current needs.',
    
    // Auth page
    'welcome.back': 'Welcome back',
    'sign.in.create.account': 'Sign in or create an account to begin the checklist.',
    'sign.up': 'Sign up',
    'email': 'Email',
    'password': 'Password',
    'please.wait': 'Please wait...',
    'create.account': 'Create account',
    'signed.in.demo': 'Signed in (demo mode)',
    'account.created.demo': 'Account created (demo mode)',
    
    // Check-in page
    'car.checkin': 'Car Check-In',
    'progress': 'Progress',
    'vehicle.details': 'Vehicle details',
    'exterior.condition': 'Exterior condition',
    'interior.condition': 'Interior condition',
    'engine.bay': 'Engine bay',
    'wheels.tires': 'Wheels & Tires',
    'dash.warning.lights': 'Dash/Warning lights',
    'final.notes': 'Final notes',
    'customer.name': 'Customer name',
    'phone.number': 'Phone number',
    'email.address': 'Email address',
    'license.plate': 'License plate',
    'car.model': 'Car model',
    'car.year': 'Car year',
    'vin': 'VIN',
    'mileage': 'Mileage',
    'entry.date': 'Entry date',
    'vehicle.documentation': 'Vehicle Documentation',
    'required.media.intake': 'Required media for vehicle intake:',
    'upload.vehicle.documentation': 'Upload vehicle documentation',
    'inspection.checklist': 'Inspection Checklist',
    'upload.photos.videos': 'Upload photos/videos',
    'notes': 'Notes',
    'add.specifics.technician': 'Add any specifics the technician should know...',
    'back': 'Back',
    'next': 'Next',
    'export.data': 'Export Data',
    'finish.checkin': 'Finish check-in',
    'checkin.completed': 'Check-in completed!',
    
    // Parts & Service page
    'parts.service.documentation': 'Parts & Service Documentation',
    'service.date': 'Service Date',
    'general.service.documentation': 'General Service Documentation',
    'upload.general.service': 'Upload general service photos/videos',
    'parts.used.service': 'Parts Used in Service',
    'add.part': 'Add Part',
    'no.parts.added': 'No parts added yet. Click "Add Part" to document parts used in this service.',
    'data.exported.successfully': 'Data exported successfully',
    'parts.service.downloaded': 'Parts service data has been downloaded as JSON file.',
    
    // Check-out page
    'vehicle.checkout.page': 'Vehicle Check-Out',
    'checkout.date': 'Checkout Date',
    'final.mileage': 'Final Mileage',
    'general.checkout.documentation': 'General Checkout Documentation',
    'upload.final.inspection': 'Upload final inspection photos/videos',
    'customer.approval.progress': 'Customer Approval Progress',
    'items.approved': 'items approved',
    'customer.approval.checklist': 'Customer Approval Checklist',
    'each.item.reviewed': 'Each item must be reviewed with the customer and approved before vehicle pickup.',
    'checkout.data.exported': 'Checkout data exported successfully',
    'vehicle.checkout.downloaded': 'Vehicle checkout data has been downloaded as JSON file.',
    
    // Common/UI
    'year': 'Year',
    'current.mileage': 'Enter current mileage',
    'enter.customer.name': 'Enter customer name',
    'enter.phone.number': 'Enter phone number',
    'enter.email.address': 'Enter email address',
    'enter.car.model': 'Enter car model',
    'enter.year': 'Enter year',
    'enter.license.plate': 'Enter license plate',
    'enter.final.mileage': 'Enter final mileage'
  },
  es: {
    // Index page
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
    'start.workflow': 'Comienza con cualquier flujo de trabajo que se ajuste a tus necesidades actuales.',
    
    // Auth page
    'welcome.back': 'Bienvenido de vuelta',
    'sign.in.create.account': 'Inicia sesión o crea una cuenta para comenzar la lista de verificación.',
    'sign.up': 'Registrarse',
    'email': 'Correo electrónico',
    'password': 'Contraseña',
    'please.wait': 'Por favor espera...',
    'create.account': 'Crear cuenta',
    'signed.in.demo': 'Sesión iniciada (modo demo)',
    'account.created.demo': 'Cuenta creada (modo demo)',
    
    // Check-in page
    'car.checkin': 'Entrada de Vehículo',
    'progress': 'Progreso',
    'vehicle.details': 'Detalles del vehículo',
    'exterior.condition': 'Condición exterior',
    'interior.condition': 'Condición interior',
    'engine.bay': 'Compartimento del motor',
    'wheels.tires': 'Ruedas y Neumáticos',
    'dash.warning.lights': 'Luces del tablero/advertencia',
    'final.notes': 'Notas finales',
    'customer.name': 'Nombre del cliente',
    'phone.number': 'Número de teléfono',
    'email.address': 'Dirección de correo',
    'license.plate': 'Placa del vehículo',
    'car.model': 'Modelo del auto',
    'car.year': 'Año del auto',
    'vin': 'VIN',
    'mileage': 'Kilometraje',
    'entry.date': 'Fecha de entrada',
    'vehicle.documentation': 'Documentación del Vehículo',
    'required.media.intake': 'Medios requeridos para la recepción del vehículo:',
    'upload.vehicle.documentation': 'Subir documentación del vehículo',
    'inspection.checklist': 'Lista de Verificación de Inspección',
    'upload.photos.videos': 'Subir fotos/videos',
    'notes': 'Notas',
    'add.specifics.technician': 'Añade cualquier detalle que el técnico deba saber...',
    'back': 'Atrás',
    'next': 'Siguiente',
    'export.data': 'Exportar Datos',
    'finish.checkin': 'Finalizar entrada',
    'checkin.completed': '¡Entrada completada!',
    
    // Parts & Service page
    'parts.service.documentation': 'Documentación de Partes y Servicio',
    'service.date': 'Fecha de servicio',
    'general.service.documentation': 'Documentación General del Servicio',
    'upload.general.service': 'Subir fotos/videos generales del servicio',
    'parts.used.service': 'Partes Utilizadas en el Servicio',
    'add.part': 'Añadir Parte',
    'no.parts.added': 'No se han añadido partes aún. Haz clic en "Añadir Parte" para documentar las partes utilizadas en este servicio.',
    'data.exported.successfully': 'Datos exportados exitosamente',
    'parts.service.downloaded': 'Los datos del servicio de partes se han descargado como archivo JSON.',
    
    // Check-out page
    'vehicle.checkout.page': 'Salida del Vehículo',
    'checkout.date': 'Fecha de salida',
    'final.mileage': 'Kilometraje final',
    'general.checkout.documentation': 'Documentación General de Salida',
    'upload.final.inspection': 'Subir fotos/videos de inspección final',
    'customer.approval.progress': 'Progreso de Aprobación del Cliente',
    'items.approved': 'elementos aprobados',
    'customer.approval.checklist': 'Lista de Aprobación del Cliente',
    'each.item.reviewed': 'Cada elemento debe ser revisado con el cliente y aprobado antes de la entrega del vehículo.',
    'checkout.data.exported': 'Datos de salida exportados exitosamente',
    'vehicle.checkout.downloaded': 'Los datos de salida del vehículo se han descargado como archivo JSON.',
    
    // Common/UI
    'year': 'Año',
    'current.mileage': 'Ingrese el kilometraje actual',
    'enter.customer.name': 'Ingrese nombre del cliente',
    'enter.phone.number': 'Ingrese número de teléfono',
    'enter.email.address': 'Ingrese dirección de correo',
    'enter.car.model': 'Ingrese modelo del auto',
    'enter.year': 'Ingrese año',
    'enter.license.plate': 'Ingrese placa del vehículo',
    'enter.final.mileage': 'Ingrese kilometraje final'
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