// Global variables
let fingerprintData = null;
let puzzleSolved = false;
let currentToken = '';
let puzzleState = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 = empty space
const targetState = [1, 2, 3, 4, 5, 6, 7, 8, 0];

// Utility functions
function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessages');
    const statusEl = document.createElement('div');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    statusDiv.appendChild(statusEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (statusEl.parentNode) {
            statusEl.remove();
        }
    }, 5000);
}

function updateStep(stepNum, state) {
    const step = document.getElementById(`step${stepNum}`);
    step.className = `step ${state}`;
}

// Main fingerprinting function
function startFingerprinting() {
    const token = document.getElementById('tokenInput').value.trim();
    
    if (!token) {
        showStatus('Por favor ingresa un token válido', 'error');
        return;
    }

    currentToken = token;
    showStatus('Iniciando proceso de fingerprinting...', 'info');
    
    // Load fingerprinting library dynamically
    const script = document.createElement('script');
    script.src = `https://a3-enterprise.github.io/DeviceFingerprinting/fingerprint.js?key=DEMO&token=${encodeURIComponent(token)}`;
    
    script.onload = () => {
        showStatus('✅ Librería cargada exitosamente', 'success');
        setupEventListeners();
        initializePuzzle();
        updateStep(1, 'completed');
        updateStep(2, 'active');
    };
    
    script.onerror = () => {
        showStatus('❌ Error al cargar la librería de fingerprinting', 'error');
    };
    
    document.head.appendChild(script);
}

// Event listeners for fingerprinting
function setupEventListeners() {
    // Main result event
    window.addEventListener('fingerprintResult', (event) => {
        console.log('Fingerprint Result:', event.detail);
        fingerprintData = event.detail;
        
        if (event.detail.success) {
            showStatus('✅ Huella digital capturada exitosamente', 'success');
        } else {
            showStatus(`❌ Error en fingerprinting: ${event.detail.error}`, 'error');
        }
        
        checkCompletion();
    });

    // Success event
    window.addEventListener('fingerprintSuccess', (event) => {
        showStatus('🎉 Fingerprinting completado con éxito', 'success');
    });

    // Token error event
    window.addEventListener('fingerprintTokenError', (event) => {
        showStatus('🔑 Error de token: Token inválido o expirado', 'error');
    });

    // Network error event
    window.addEventListener('fingerprintNetworkError', (event) => {
        showStatus('🌐 Error de red: Verifica tu conexión a internet', 'error');
    });

    // HTTP error event
    window.addEventListener('fingerprintError', (event) => {
        showStatus(`⚠️ Error HTTP: ${event.detail.statusCode} - ${event.detail.message}`, 'error');
    });
}

// Puzzle functions
function initializePuzzle() {
    // Start with solved state and shuffle
    puzzleState = [...targetState];
    
    // Perform random valid moves to shuffle
    for (let i = 0; i < 100; i++) {
        const validMoves = getValidMoves();
        if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            movePiece(randomMove);
        }
    }
    
    renderPuzzle();
    showStatus('🧩 Rompecabezas iniciado. ¡Ordena los números!', 'info');
}

function renderPuzzle() {
    const puzzleDiv = document.getElementById('puzzle');
    puzzleDiv.innerHTML = '';
    
    puzzleState.forEach((num, index) => {
        const piece = document.createElement('button');
        piece.className = num === 0 ? 'puzzle-piece empty' : 'puzzle-piece';
        piece.textContent = num === 0 ? '' : num;
        piece.onclick = () => movePiece(index);
        piece.setAttribute('aria-label', num === 0 ? 'Espacio vacío' : `Número ${num}`);
        puzzleDiv.appendChild(piece);
    });

    checkPuzzleSolved();
}

function getValidMoves() {
    const emptyIndex = puzzleState.indexOf(0);
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    // Check all four directions
    if (row > 0) moves.push(emptyIndex - 3); // Up
    if (row < 2) moves.push(emptyIndex + 3); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < 2) moves.push(emptyIndex + 1); // Right

    return moves;
}

function movePiece(index) {
    const emptyIndex = puzzleState.indexOf(0);
    const validMoves = getValidMoves();
    
    if (validMoves.includes(index)) {
        // Swap pieces
        [puzzleState[emptyIndex], puzzleState[index]] = [puzzleState[index], puzzleState[emptyIndex]];
        renderPuzzle();
    }
}

function checkPuzzleSolved() {
    const solved = puzzleState.every((num, index) => num === targetState[index]);
    
    if (solved && !puzzleSolved) {
        puzzleSolved = true;
        document.getElementById('puzzleStatus').innerHTML = 
            '<div class="status success">🎉 ¡Rompecabezas resuelto correctamente!</div>';
        
        updateStep(2, 'completed');
        updateStep(3, 'active');
        showStatus('🎯 ¡Excelente! Rompecabezas completado', 'success');
        checkCompletion();
    }
}

function checkCompletion() {
    if (puzzleSolved && fingerprintData) {
        document.getElementById('analyzeBtn').disabled = false;
        showStatus('✅ Todo listo para el análisis final', 'success');
    }
}

// Analysis function
async function analyzeFingerprint() {
    if (!fingerprintData || !puzzleSolved) {
        showStatus('❌ Completa todos los pasos antes de continuar', 'error');
        return;
    }

    const resultsDiv = document.getElementById('results');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Update UI
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analizando...';
    resultsDiv.innerHTML = '<div class="status info">🔄 Enviando datos para análisis...</div>';

    try {
        // Prepare payload for analysis
        const payload = {
            token: currentToken,
            fingerprintData: fingerprintData,
            puzzleCompleted: true,
            completionTime: Date.now(),
            demoVersion: '1.0.0'
        };

        // Call analysis API
        const response = await fetch('https://dev.idfactory.me/bff/transactionFraud/fingerPrint/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            
            resultsDiv.innerHTML = `
                <div class="status success">✅ Análisis completado exitosamente</div>
                <h4>📊 Resultado del Análisis:</h4>
                <div class="fingerprint-data">${JSON.stringify(result, null, 2)}</div>
                <p><strong>Tiempo de procesamiento:</strong> ${new Date().toLocaleTimeString()}</p>
            `;
            
            showStatus('🎉 Análisis completado con éxito', 'success');
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Analysis error:', error);
        
        resultsDiv.innerHTML = `
            <div class="status error">❌ Error en el análisis: ${error.message}</div>
            <h4>📋 Datos de Fingerprinting Capturados:</h4>
            <div class="fingerprint-data">${JSON.stringify(fingerprintData, null, 2)}</div>
            <p><em>Nota: Los datos fueron capturados correctamente, pero hubo un problema con el servicio de análisis.</em></p>
        `;
        
        showStatus(`❌ Error en análisis: ${error.message}`, 'error');
    } finally {
        // Reset button
        analyzeBtn.textContent = 'Análisis Completado';
        updateStep(3, 'completed');
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('A3 Device Fingerprinting Demo loaded');
    showStatus('👋 Bienvenido al demo de A3 Device Fingerprinting', 'info');
});