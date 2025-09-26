# A3 Device Fingerprinting - Demo de Integración

Este proyecto demuestra cómo integrar la librería de **A3 Device Fingerprinting** en una aplicación web mediante un ejemplo interactivo con rompecabezas.

## 🚀 Demo en Vivo

Visita: [https://tu-usuario.github.io/DeviceFingerprinting_Demo](https://tu-usuario.github.io/DeviceFingerprinting_Demo)

## 📋 Características

- ✅ Integración completa con la librería A3 Device Fingerprinting
- 🧩 Rompecabezas interactivo como ejemplo de uso
- 📊 Manejo de todos los eventos de fingerprinting
- 🎨 Interfaz moderna y responsiva
- 📱 Compatible con dispositivos móviles
- 🔒 Ejemplo de análisis de resultados

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/DeviceFingerprinting_Demo.git
   cd DeviceFingerprinting_Demo
   ```

2. **Abre el demo:**
   - Abre `index.html` directamente en tu navegador, o
   - Usa un servidor local:
     ```bash
     # Con Python
     python -m http.server 8000
     
     # Con Node.js
     npx serve .
     
     # Con PHP
     php -S localhost:8000
     ```

3. **Accede al demo:**
   - Navegador: `http://localhost:8000`

## 📖 Cómo Usar

### Paso 1: Configuración
1. Ingresa tu token de A3 Device Fingerprinting
2. Haz clic en "Iniciar Demo"

### Paso 2: Rompecabezas
1. Ordena los números del 1 al 8 haciendo clic en las piezas
2. Mientras resuelves, la librería captura la huella digital en segundo plano

### Paso 3: Análisis
1. Una vez completados ambos procesos, haz clic en "Analizar Huella Digital"
2. Revisa los resultados del análisis

## 🔧 Integración en tu Proyecto

### Método 1: Carga Automática (Recomendado)
```html
<script src="https://a3-enterprise.github.io/DeviceFingerprinting/fingerprint.js?key=TU_KEY&token=TU_TOKEN"></script>
```

### Método 2: Carga Manual
```html
<script src="https://a3-enterprise.github.io/DeviceFingerprinting/fingerprint.js"></script>
<script>
  window.__deviceFingerprint__({ key: 'TU_KEY', token: 'TU_TOKEN' });
</script>
```

### Manejo de Eventos
```javascript
// Evento principal - Resultado general
window.addEventListener('fingerprintResult', (event) => {
    if (event.detail.success) {
        console.log('Éxito:', event.detail.result);
        // Procesar resultado exitoso
    } else {
        console.error('Error:', event.detail.error);
        // Manejar error
    }
});

// Evento de éxito únicamente
window.addEventListener('fingerprintSuccess', (event) => {
    console.log('Fingerprinting exitoso:', event.detail);
});

// Evento de error de token
window.addEventListener('fingerprintTokenError', (event) => {
    console.error('Token inválido:', event.detail);
    // Solicitar nuevo token o mostrar error
});

// Evento de error de red
window.addEventListener('fingerprintNetworkError', (event) => {
    console.error('Error de conexión:', event.detail);
    // Reintentar o mostrar mensaje de conectividad
});

// Evento de error HTTP
window.addEventListener('fingerprintError', (event) => {
    console.error('Error HTTP:', event.detail);
    // Manejar errores del servidor
});
```

## 📁 Estructura del Proyecto

```
DeviceFingerprinting_Demo/
├── index.html          # Página principal del demo
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
├── README.md           # Documentación
└── LICENSE             # Licencia MIT
```

## 🎯 Casos de Uso

Este demo es ideal para:

- **Desarrolladores** que necesitan integrar device fingerprinting
- **Equipos de seguridad** evaluando la solución
- **Demos comerciales** para clientes potenciales
- **Pruebas de concepto** antes de implementación completa

## 🔒 Seguridad

- Los tokens se manejan de forma segura
- No se almacenan credenciales en el código
- Comunicación cifrada con los servidores A3
- Validación de datos en tiempo real

## 🌐 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles (iOS/Android)

## 📞 Soporte

Para soporte técnico o consultas sobre la integración:

- **Email:** soporte@a3-enterprise.com
- **Documentación:** [A3 Device Fingerprinting Docs](https://github.com/A3-Enterprise/DeviceFingerprinting)
- **Issues:** [GitHub Issues](https://github.com/tu-usuario/DeviceFingerprinting_Demo/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado por A3 Enterprise** - Soluciones de seguridad digital avanzada