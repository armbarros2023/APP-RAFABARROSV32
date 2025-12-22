import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Trust Proxy (necessário para Rate Limit atrás de Nginx/Reverse Proxy)
app.set('trust proxy', 1);

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por IP
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Aplicar rate limiting em todas as rotas da API
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'ClinicaRafaBarros API',
        version: '1.0.0',
        status: 'running',
        environment: env.NODE_ENV,
    });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ============================================
// START SERVER
// ============================================

const PORT = parseInt(env.PORT);

app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🚀 ClinicaRafaBarros API Server');
    console.log('================================');
    console.log(`📍 Environment: ${env.NODE_ENV}`);
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log('================================');
    console.log('');
});

export default app;
