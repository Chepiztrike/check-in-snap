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
    'home': 'Home',
    'get.started': 'Get Started',
    'access.portal': 'Access Portal',
    'access.portal.button': 'Access Portal',
    'access.system': 'Access System',
    'access.system.description': 'Choose your access type to continue with the appropriate workflow',
    'select.access.type': 'Select your access type to continue',
    'mechanic.access': 'Mechanic Access',
    'mechanic.access.description': 'Access check-in, parts & service, and check-out workflows',
    'client.access': 'Client Access',
    'client.access.description': 'Track your vehicle service progress and approve services',
    'client.portal.features': 'Client Portal Features:',
    'view.inspection.results': 'View inspection results',
    'approve.services': 'Approve services',
    'track.real.time': 'Track real-time progress',
    'approve.checkout': 'Approve checkout',
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
    'enter.final.mileage': 'Enter final mileage',
    
    // Checklist items - Exterior
    'check.scratches.dents': 'Check for scratches, dents, or paint damage',
    'inspect.bumpers.panels': 'Inspect bumpers and body panels',
    'examine.lights': 'Examine lights (headlights, taillights, indicators)',
    'look.rust.corrosion': 'Look for rust or corrosion',
    'check.mirrors.glass': 'Check mirrors and glass condition',
    'document.existing.damage': 'Document any existing damage',
    
    // Checklist items - Interior
    'test.seats.adjustments': 'Test all seats and adjustments',
    'check.dashboard.cluster': 'Check dashboard and instrument cluster',
    'verify.ac.heating': 'Verify air conditioning/heating works',
    'test.radio.infotainment': 'Test radio, infotainment system',
    'inspect.upholstery': 'Inspect upholstery for tears or stains',
    'check.seatbelts.safety': 'Check seatbelts and safety features',
    
    // Checklist items - Engine
    'check.fluid.levels': 'Check fluid levels (oil, coolant, brake fluid)',
    'inspect.belts.hoses': 'Inspect belts and hoses for wear',
    'look.leaks.corrosion': 'Look for leaks or corrosion',
    'check.battery.terminals': 'Check battery terminals and condition',
    'examine.air.filter': 'Examine air filter condition',
    'note.unusual.sounds': 'Note any unusual sounds or smells',
    
    // Checklist items - Wheels
    'check.tire.tread': 'Check tire tread depth and wear patterns',
    'inspect.cuts.bulges': 'Inspect for cuts, bulges, or damage',
    'verify.tire.pressure': 'Verify proper tire pressure',
    'examine.wheel.rims': 'Examine wheel rims for damage',
    'check.spare.tire': 'Check spare tire condition',
    'look.alignment.issues': 'Look for any signs of alignment issues',
    
    // Checklist items - Warnings
    'check.engine.light': 'Check engine light status',
    'verify.dashboard.lights': 'Verify all dashboard lights function',
    'note.active.warnings': 'Note any active warning lights',
    'test.hazard.indicators': 'Test hazard lights and indicators',
    'check.fuel.gauges': 'Check fuel gauge and other gauges',
    'document.error.codes': 'Document any error codes or messages',
    
    // Checklist items - Final
    'overall.vehicle.assessment': 'Overall vehicle condition assessment',
    'additional.concerns': 'Any additional concerns or observations',
    'customer.specific.requests': 'Customer-specific requests or notes',
    'recommended.maintenance': 'Recommended maintenance or repairs',
    'schedule.followup': 'Schedule follow-up if needed',
    
    // Instructions and bullets
    '360.video.instruction': '360° video: Walk around the entire vehicle recording exterior',
    'interior.video.instruction': 'Interior video: Record dashboard, seats, and all interior areas',
    'documentation.photos.instruction': 'Documentation photos: License plate, VIN plate, odometer',
    
    // Checkout items
    'exterior.no.damage': 'Exterior condition - no new damage',
    'interior.cleanliness': 'Interior cleanliness and condition',
    'lights.functioning': 'All lights functioning properly',
    'engine.compartment.inspection': 'Engine compartment inspection',
    'fluid.levels.checked': 'Fluid levels checked',
    'tire.condition.pressure': 'Tire condition and pressure',
    'battery.terminals.connections': 'Battery terminals and connections',
    'windshield.mirrors.clean': 'Windshield and mirrors clean',
    'service.work.completed': 'Service work completed as requested',
    'tools.equipment.removed': 'All tools and equipment removed',
    'test.drive.completed': 'Test drive completed successfully',
    'customer.walkthrough.completed': 'Customer walkthrough completed',
    
    // Parts component translations
    'service.part': 'Service Part',
    'serial.number': 'Serial Number',
    'part.name': 'Part Name',
    'justification.use': 'Justification for Use',
    'upload.proof.installation': 'Upload proof of part installation',
    'enter.serial.number': 'Enter part serial number',
    'enter.part.name': 'Enter part name/description',
    'explain.part.used': 'Explain why this part was used, what issue it addresses, etc.',
    'file': 'file',
    'files': 'files',
    'upload.serial.photo': 'Upload photo',
    'capture.serial.barcode': 'Capture serial number or barcode',
    
    // Client Portal translations
    'client.portal': 'Client Portal',
    'track.service.progress': 'Track your vehicle service progress',
    'client.information': 'Client Information',
    'client.id': 'Client ID',
    'service.progress': 'Service Progress',
    'current.status.vehicle': 'Current status of your vehicle service',
    'vehicle.received': 'Vehicle Received',
    'checkin.approved.text': 'Check-in Approved',
    'services.approved': 'Services Approved',
    'checkout.approved.text': 'Check-out Approved',
    'checkin.approval.required': 'Check-in Approval Required',
    'review.approve.vehicle.inspection': 'Please review and approve the vehicle inspection results',
    'approve.checkin': 'Approve Check-in',
    'service.approvals.required': 'Service Approvals Required',
    'review.approve.each.service': 'Please review and approve each required service',
    'estimated.cost': 'Estimated Cost',
    'add.notes.optional': 'Add notes (optional)',
    'approve.service': 'Approve Service',
    'your.notes': 'Your Notes',
    'checkout.approval.required': 'Check-out Approval Required',
    'final.inspection.complete': 'Your vehicle is ready! Please review the final inspection',
    'service.completed': 'Service Completed',
    'vehicle.ready.pickup': 'Your vehicle is ready for pickup!',
    'checkin.approved': 'Check-in approved successfully',
    'checkout.approved': 'Check-out approved successfully',
    'service.approved': 'Service approved successfully',
    'loading.client.data': 'Loading client data...',
    'client.not.found': 'Client Not Found',
    'invalid.client.id': 'Invalid client ID provided',
    'return.home': 'Return Home',
    'approved': 'Approved',
    'pending.approval': 'Pending Approval',
    'client.tracking': 'Client Tracking',
    'track.service': 'Track Service',
    
    // Check-in completion translations
    'vehicle.successfully.registered': 'Your vehicle has been successfully registered',
    'check.in.successful': 'Check-in Successful!',
    'client.id.generated.instructions': 'Your client ID has been generated. Use this ID to track your service progress.',
    'your.client.id': 'Your Client ID',
    'tracking.url': 'Tracking URL',
    'next.steps': 'Next Steps',
    'save.client.id': 'Save Your Client ID',
    'save.client.id.description': 'Write down or save this ID - you\'ll need it to track your service.',
    'track.progress': 'Track Your Progress',
    'track.progress.description': 'Use the client portal to see real-time updates on your vehicle.',
    'approve.services.check': 'Approve Services',
    'approve.services.description': 'You\'ll receive notifications when services need your approval.',
    'view.service.status': 'View Service Status',
    'back.to.home': 'Back to Home',
    'client.id.copied': 'Client ID copied to clipboard',
    'tracking.url.copied': 'Tracking URL copied to clipboard',
    'copied': 'Copied!',
    'copy': 'Copy',
    
    // Client portal enhancements
    'inspection.results': 'Inspection Results',
    'detailed.inspection.findings': 'Detailed findings from your vehicle inspection',
    'service.required': 'Service Required',
    'uploaded.media': 'Uploaded Media',
    'inspection.passed': 'Passed',
    'inspection.notes': 'Inspector Notes',
    'action.required': 'Action Required',
    'service.recommendation.for': 'Professional service recommended for',
    'inspection.evidence': 'Inspection Evidence',
    
    // Mechanic workflow
    'mechanic.workflow': 'Mechanic Workflow',
    'mechanic.next.steps': 'Tools for the mechanic to proceed with service',
    'mechanic.workflow.note': 'These links open the mechanic workflow in new tabs'
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
    'home': 'Inicio',
    'get.started': 'Comenzar',
    'access.portal': 'Portal de Acceso',
    'access.portal.button': 'Acceder al Portal',
    'access.system': 'Sistema de Acceso',
    'access.system.description': 'Elige tu tipo de acceso para continuar con el flujo de trabajo apropiado',
    'select.access.type': 'Selecciona tu tipo de acceso para continuar',
    'mechanic.access': 'Acceso de Mecánico',
    'mechanic.access.description': 'Accede a los flujos de check-in, partes y servicio, y check-out',
    'client.access': 'Acceso de Cliente',
    'client.access.description': 'Rastrea el progreso del servicio de tu vehículo y aprueba servicios',
    'client.portal.features': 'Características del Portal del Cliente:',
    'view.inspection.results': 'Ver resultados de inspección',
    'approve.services': 'Aprobar servicios',
    'track.real.time': 'Rastrear progreso en tiempo real',
    'approve.checkout': 'Aprobar check-out',
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
    'enter.final.mileage': 'Ingrese kilometraje final',
    
    // Checklist items - Exterior
    'check.scratches.dents': 'Verificar rayones, abolladuras o daños en la pintura',
    'inspect.bumpers.panels': 'Inspeccionar parachoques y paneles de carrocería',
    'examine.lights': 'Examinar luces (faros, luces traseras, indicadores)',
    'look.rust.corrosion': 'Buscar óxido o corrosión',
    'check.mirrors.glass': 'Verificar condición de espejos y cristales',
    'document.existing.damage': 'Documentar cualquier daño existente',
    
    // Checklist items - Interior
    'test.seats.adjustments': 'Probar todos los asientos y ajustes',
    'check.dashboard.cluster': 'Verificar tablero e instrumentos',
    'verify.ac.heating': 'Verificar que funcione el aire acondicionado/calefacción',
    'test.radio.infotainment': 'Probar radio y sistema de infoentretenimiento',
    'inspect.upholstery': 'Inspeccionar tapicería por desgarros o manchas',
    'check.seatbelts.safety': 'Verificar cinturones de seguridad y características de seguridad',
    
    // Checklist items - Engine
    'check.fluid.levels': 'Verificar niveles de fluidos (aceite, refrigerante, líquido de frenos)',
    'inspect.belts.hoses': 'Inspeccionar correas y mangueras por desgaste',
    'look.leaks.corrosion': 'Buscar fugas o corrosión',
    'check.battery.terminals': 'Verificar terminales y condición de la batería',
    'examine.air.filter': 'Examinar condición del filtro de aire',
    'note.unusual.sounds': 'Anotar cualquier sonido o olor inusual',
    
    // Checklist items - Wheels
    'check.tire.tread': 'Verificar profundidad y patrones de desgaste de las llantas',
    'inspect.cuts.bulges': 'Inspeccionar por cortes, protuberancias o daños',
    'verify.tire.pressure': 'Verificar presión adecuada de las llantas',
    'examine.wheel.rims': 'Examinar rines por daños',
    'check.spare.tire': 'Verificar condición de la llanta de refacción',
    'look.alignment.issues': 'Buscar signos de problemas de alineación',
    
    // Checklist items - Warnings
    'check.engine.light': 'Estado de la luz de verificación del motor',
    'verify.dashboard.lights': 'Verificar que funcionen todas las luces del tablero',
    'note.active.warnings': 'Anotar cualquier luz de advertencia activa',
    'test.hazard.indicators': 'Probar luces de emergencia e indicadores',
    'check.fuel.gauges': 'Verificar medidor de combustible y otros indicadores',
    'document.error.codes': 'Documentar códigos de error o mensajes',
    
    // Checklist items - Final
    'overall.vehicle.assessment': 'Evaluación general de la condición del vehículo',
    'additional.concerns': 'Cualquier preocupación u observación adicional',
    'customer.specific.requests': 'Solicitudes o notas específicas del cliente',
    'recommended.maintenance': 'Mantenimiento o reparaciones recomendadas',
    'schedule.followup': 'Programar seguimiento si es necesario',
    
    // Instructions and bullets
    '360.video.instruction': 'Video 360°: Caminar alrededor del vehículo grabando el exterior',
    'interior.video.instruction': 'Video interior: Grabar tablero, asientos y todas las áreas interiores',
    'documentation.photos.instruction': 'Fotos de documentación: Placa, placa VIN, odómetro',
    
    // Checkout items
    'exterior.no.damage': 'Condición exterior - sin daños nuevos',
    'interior.cleanliness': 'Limpieza y condición interior',
    'lights.functioning': 'Todas las luces funcionando correctamente',
    'engine.compartment.inspection': 'Inspección del compartimento del motor',
    'fluid.levels.checked': 'Niveles de fluidos verificados',
    'tire.condition.pressure': 'Condición y presión de las llantas',
    'battery.terminals.connections': 'Terminales y conexiones de la batería',
    'windshield.mirrors.clean': 'Parabrisas y espejos limpios',
    'service.work.completed': 'Trabajo de servicio completado según solicitado',
    'tools.equipment.removed': 'Todas las herramientas y equipo removidos',
    'test.drive.completed': 'Prueba de manejo completada exitosamente',
    'customer.walkthrough.completed': 'Recorrido con el cliente completado',
    
    // Parts component translations
    'service.part': 'Parte de Servicio',
    'serial.number': 'Número de Serie',
    'part.name': 'Nombre de la Parte',
    'justification.use': 'Justificación de Uso',
    'upload.proof.installation': 'Subir prueba de instalación de la parte',
    'enter.serial.number': 'Ingrese número de serie de la parte',
    'enter.part.name': 'Ingrese nombre/descripción de la parte',
    'explain.part.used': 'Explique por qué se utilizó esta parte, qué problema resuelve, etc.',
    'file': 'archivo',
    'files': 'archivos',
    'upload.serial.photo': 'Subir foto',
    'capture.serial.barcode': 'Capturar número de serie o código de barras',
    
    // Client Portal translations
    'client.portal': 'Portal del Cliente',
    'track.service.progress': 'Rastrea el progreso del servicio de tu vehículo',
    'client.information': 'Información del Cliente',
    'client.id': 'ID del Cliente',
    'service.progress': 'Progreso del Servicio',
    'current.status.vehicle': 'Estado actual del servicio de tu vehículo',
    'vehicle.received': 'Vehículo Recibido',
    'checkin.approved.text': 'Entrada Aprobada',
    'services.approved': 'Servicios Aprobados',
    'checkout.approved.text': 'Salida Aprobada',
    'checkin.approval.required': 'Aprobación de Entrada Requerida',
    'review.approve.vehicle.inspection': 'Por favor revisa y aprueba los resultados de la inspección del vehículo',
    'approve.checkin': 'Aprobar Entrada',
    'service.approvals.required': 'Aprobaciones de Servicio Requeridas',
    'review.approve.each.service': 'Por favor revisa y aprueba cada servicio requerido',
    'estimated.cost': 'Costo Estimado',
    'add.notes.optional': 'Añadir notas (opcional)',
    'approve.service': 'Aprobar Servicio',
    'your.notes': 'Tus Notas',
    'checkout.approval.required': 'Aprobación de Salida Requerida',
    'final.inspection.complete': '¡Tu vehículo está listo! Por favor revisa la inspección final',
    'service.completed': 'Servicio Completado',
    'vehicle.ready.pickup': '¡Tu vehículo está listo para recoger!',
    'checkin.approved': 'Entrada aprobada exitosamente',
    'checkout.approved': 'Salida aprobada exitosamente',
    'service.approved': 'Servicio aprobado exitosamente',
    'loading.client.data': 'Cargando datos del cliente...',
    'client.not.found': 'Cliente No Encontrado',
    'invalid.client.id': 'ID de cliente inválido proporcionado',
    'return.home': 'Volver al Inicio',
    'approved': 'Aprobado',
    'pending.approval': 'Pendiente de Aprobación',
    'client.tracking': 'Seguimiento del Cliente',
    'track.service': 'Rastrear Servicio',
    
    // Check-in completion translations
    'vehicle.successfully.registered': 'Tu vehículo ha sido registrado exitosamente',
    'check.in.successful': '¡Entrada Exitosa!',
    'client.id.generated.instructions': 'Se ha generado tu ID de cliente. Usa este ID para rastrear el progreso de tu servicio.',
    'your.client.id': 'Tu ID de Cliente',
    'tracking.url': 'URL de Seguimiento',
    'next.steps': 'Próximos Pasos',
    'save.client.id': 'Guarda tu ID de Cliente',
    'save.client.id.description': 'Anota o guarda este ID - lo necesitarás para rastrear tu servicio.',
    'track.progress': 'Rastrea tu Progreso',
    'track.progress.description': 'Usa el portal del cliente para ver actualizaciones en tiempo real de tu vehículo.',
    'approve.services.check': 'Aprobar Servicios',
    'approve.services.description': 'Recibirás notificaciones cuando los servicios necesiten tu aprobación.',
    'view.service.status': 'Ver Estado del Servicio',
    'back.to.home': 'Volver al Inicio',
    'client.id.copied': 'ID de cliente copiado al portapapeles',
    'tracking.url.copied': 'URL de seguimiento copiada al portapapeles',
    'copied': '¡Copiado!',
    'copy': 'Copiar',
    
    // Client portal enhancements
    'inspection.results': 'Resultados de Inspección',
    'detailed.inspection.findings': 'Hallazgos detallados de la inspección de tu vehículo',
    'service.required': 'Servicio Requerido',
    'uploaded.media': 'Medios Subidos',
    'inspection.passed': 'Aprobado',
    'inspection.notes': 'Notas del Inspector',
    'action.required': 'Acción Requerida',
    'service.recommendation.for': 'Se recomienda servicio profesional para',
    'inspection.evidence': 'Evidencia de Inspección',
    
    // Mechanic workflow
    'mechanic.workflow': 'Flujo de Trabajo del Mecánico',
    'mechanic.next.steps': 'Herramientas para que el mecánico proceda con el servicio',
    'mechanic.workflow.note': 'Estos enlaces abren el flujo de trabajo del mecánico en nuevas pestañas'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check localStorage for saved language preference
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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