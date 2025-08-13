import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations object
const translations = {
  en: {
    // Header & Navigation
    'app.title': 'AutoCheck Pro',
    'app.signin': 'Sign in',
    'nav.back': 'Back',
    'nav.progress': 'Progress',
    
    // Main Page
    'main.hero.title': 'Streamlined Car Service',
    'main.hero.subtitle': 'Every Time',
    'main.hero.description': 'Professional vehicle documentation system with guided checklists, media capture, and comprehensive reporting for modern auto service centers.',
    'main.checkin.title': 'Check-In Process',
    'main.checkin.description': 'Complete vehicle inspection with photo documentation',
    'main.parts.title': 'Parts & Service',
    'main.parts.description': 'Document parts usage and service procedures',
    'main.checkout.title': 'Vehicle Check-Out',
    'main.checkout.description': 'Customer approval and quality verification',
    'main.cta.title': 'Ready to Transform Your Service Process?',
    'main.cta.description': 'Start with any workflow that fits your current needs.',
    'button.getstarted': 'Get Started',
    
    // Forms
    'form.customer.name': 'Customer name',
    'form.customer.phone': 'Phone number',
    'form.customer.email': 'Email address',
    'form.vehicle.plate': 'License plate',
    'form.vehicle.model': 'Car model',
    'form.vehicle.year': 'Car year',
    'form.vehicle.vin': 'VIN',
    'form.vehicle.mileage': 'Mileage',
    'form.vehicle.entrydate': 'Entry date',
    'form.vehicle.servicedate': 'Service Date',
    'form.vehicle.checkoutdate': 'Checkout Date',
    'form.vehicle.finalmileage': 'Final Mileage',
    'form.notes': 'Notes',
    'form.notes.placeholder': 'Add any specifics the technician should know...',
    
    // Actions
    'action.next': 'Next',
    'action.back': 'Back',
    'action.finish': 'Finish check-in',
    'action.export': 'Export Data',
    'action.addpart': 'Add Part',
    'action.approved': 'Approved',
    
    // Check-in
    'checkin.title': 'Car Check-In',
    'checkin.vehicle.details': 'Vehicle details',
    'checkin.exterior': 'Exterior condition',
    'checkin.interior': 'Interior condition',
    'checkin.engine': 'Engine bay',
    'checkin.wheels': 'Wheels & Tires',
    'checkin.warnings': 'Dash/Warning lights',
    'checkin.final': 'Final notes',
    'checkin.documentation': 'Vehicle Documentation',
    'checkin.media.required': 'Required media for vehicle intake:',
    'checkin.media.360': '360° video: Walk around the entire vehicle recording exterior',
    'checkin.media.interior': 'Interior video: Record dashboard, seats, and all interior areas',
    'checkin.media.docs': 'Documentation photos: License plate, VIN plate, odometer',
    'checkin.upload.title': 'Upload vehicle documentation',
    'checkin.checklist': 'Inspection Checklist',
    'checkin.upload.photos': 'Upload photos/videos',
    'checkin.completed': 'Check-in completed!',
    
    // Parts Service
    'parts.title': 'Parts & Service Documentation',
    'parts.vehicle.details': 'Vehicle Details',
    'parts.general.docs': 'General Service Documentation',
    'parts.upload.general': 'Upload general service photos/videos',
    'parts.used': 'Parts Used in Service',
    'parts.none': 'No parts added yet. Click "Add Part" to document parts used in this service.',
    'parts.serial': 'Serial Number',
    'parts.name': 'Part Name',
    'parts.justification': 'Justification for Use',
    'parts.justification.placeholder': 'Explain why this part was necessary...',
    'parts.upload.proof': 'Upload proof of installation',
    'parts.exported': 'Data exported successfully',
    'parts.exported.desc': 'Parts service data has been downloaded as JSON file.',
    
    // Checkout
    'checkout.title': 'Vehicle Check-Out',
    'checkout.general.docs': 'General Checkout Documentation',
    'checkout.upload.final': 'Upload final inspection photos/videos',
    'checkout.progress': 'Customer Approval Progress',
    'checkout.items.approved': 'items approved',
    'checkout.checklist': 'Customer Approval Checklist',
    'checkout.checklist.desc': 'Each item must be reviewed with the customer and approved before vehicle pickup.',
    'checkout.exported': 'Checkout data exported successfully',
    'checkout.exported.desc': 'Vehicle checkout data has been downloaded as JSON file.',
  },
  es: {
    // Header & Navigation
    'app.title': 'AutoCheck Pro',
    'app.signin': 'Iniciar sesión',
    'nav.back': 'Atrás',
    'nav.progress': 'Progreso',
    
    // Main Page
    'main.hero.title': 'Servicio Automotriz Optimizado',
    'main.hero.subtitle': 'Cada Vez',
    'main.hero.description': 'Sistema profesional de documentación vehicular con listas de verificación guiadas, captura de medios y reportes integrales para centros de servicio automotriz modernos.',
    'main.checkin.title': 'Proceso de Ingreso',
    'main.checkin.description': 'Inspección completa del vehículo con documentación fotográfica',
    'main.parts.title': 'Partes y Servicio',
    'main.parts.description': 'Documentar uso de partes y procedimientos de servicio',
    'main.checkout.title': 'Salida del Vehículo',
    'main.checkout.description': 'Aprobación del cliente y verificación de calidad',
    'main.cta.title': '¿Listo para Transformar tu Proceso de Servicio?',
    'main.cta.description': 'Comienza con cualquier flujo de trabajo que se adapte a tus necesidades actuales.',
    'button.getstarted': 'Comenzar',
    
    // Forms
    'form.customer.name': 'Nombre del cliente',
    'form.customer.phone': 'Número de teléfono',
    'form.customer.email': 'Dirección de correo',
    'form.vehicle.plate': 'Placa del vehículo',
    'form.vehicle.model': 'Modelo del auto',
    'form.vehicle.year': 'Año del auto',
    'form.vehicle.vin': 'VIN',
    'form.vehicle.mileage': 'Kilometraje',
    'form.vehicle.entrydate': 'Fecha de ingreso',
    'form.vehicle.servicedate': 'Fecha de Servicio',
    'form.vehicle.checkoutdate': 'Fecha de Salida',
    'form.vehicle.finalmileage': 'Kilometraje Final',
    'form.notes': 'Notas',
    'form.notes.placeholder': 'Añade cualquier detalle específico que el técnico deba saber...',
    
    // Actions
    'action.next': 'Siguiente',
    'action.back': 'Atrás',
    'action.finish': 'Finalizar ingreso',
    'action.export': 'Exportar Datos',
    'action.addpart': 'Añadir Parte',
    'action.approved': 'Aprobado',
    
    // Check-in
    'checkin.title': 'Ingreso del Auto',
    'checkin.vehicle.details': 'Detalles del vehículo',
    'checkin.exterior': 'Condición exterior',
    'checkin.interior': 'Condición interior',
    'checkin.engine': 'Compartimento del motor',
    'checkin.wheels': 'Ruedas y Neumáticos',
    'checkin.warnings': 'Luces del tablero/advertencia',
    'checkin.final': 'Notas finales',
    'checkin.documentation': 'Documentación del Vehículo',
    'checkin.media.required': 'Medios requeridos para el ingreso del vehículo:',
    'checkin.media.360': 'Video 360°: Caminar alrededor de todo el vehículo grabando el exterior',
    'checkin.media.interior': 'Video interior: Grabar tablero, asientos y todas las áreas interiores',
    'checkin.media.docs': 'Fotos de documentación: Placa, placa VIN, odómetro',
    'checkin.upload.title': 'Subir documentación del vehículo',
    'checkin.checklist': 'Lista de Verificación de Inspección',
    'checkin.upload.photos': 'Subir fotos/videos',
    'checkin.completed': '¡Ingreso completado!',
    
    // Parts Service
    'parts.title': 'Documentación de Partes y Servicio',
    'parts.vehicle.details': 'Detalles del Vehículo',
    'parts.general.docs': 'Documentación General del Servicio',
    'parts.upload.general': 'Subir fotos/videos generales del servicio',
    'parts.used': 'Partes Utilizadas en el Servicio',
    'parts.none': 'No se han añadido partes aún. Haz clic en "Añadir Parte" para documentar las partes utilizadas en este servicio.',
    'parts.serial': 'Número de Serie',
    'parts.name': 'Nombre de la Parte',
    'parts.justification': 'Justificación de Uso',
    'parts.justification.placeholder': 'Explica por qué esta parte fue necesaria...',
    'parts.upload.proof': 'Subir prueba de instalación',
    'parts.exported': 'Datos exportados exitosamente',
    'parts.exported.desc': 'Los datos del servicio de partes han sido descargados como archivo JSON.',
    
    // Checkout
    'checkout.title': 'Salida del Vehículo',
    'checkout.general.docs': 'Documentación General de Salida',
    'checkout.upload.final': 'Subir fotos/videos de inspección final',
    'checkout.progress': 'Progreso de Aprobación del Cliente',
    'checkout.items.approved': 'elementos aprobados',
    'checkout.checklist': 'Lista de Verificación de Aprobación del Cliente',
    'checkout.checklist.desc': 'Cada elemento debe ser revisado con el cliente y aprobado antes de la entrega del vehículo.',
    'checkout.exported': 'Datos de salida exportados exitosamente',
    'checkout.exported.desc': 'Los datos de salida del vehículo han sido descargados como archivo JSON.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
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