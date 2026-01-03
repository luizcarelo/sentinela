import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com o Banco de Dados
const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sentinel_core',
  password: process.env.DB_PASSWORD || 'secure_production_password',
  port: process.env.DB_PORT || 5432,
});

// Test DB Connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    console.error('Is the PostgreSQL container running? (docker compose up -d)');
  } else {
    console.log('Database Connected Successfully');
    release();
  }
});

// Permissive CORS for development
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Middleware para tratamento de erros async
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// --- Endpoints ---

// Root endpoint to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Sentinel API Server is running', status: 'OK' });
});

// 1. Listar Empresas (Companies)
app.get('/api/companies', asyncHandler(async (req, res) => {
  const result = await pool.query(`
    SELECT 
      id, name, document, status, 
      agent_status as "agentStatus", 
      agent_ip as "agentIp", 
      total_devices as "totalDevices", 
      contact 
    FROM companies
    ORDER BY name ASC
  `);
  res.json(result.rows);
}));

// 2. Listar Dispositivos (Devices)
app.get('/api/devices', asyncHandler(async (req, res) => {
  const { companyId } = req.query;
  
  let query = `
    SELECT 
      id, company_id as "companyId", name, ip, port, type, vendor, 
      model, location, status, uptime, last_seen as "lastSeen", 
      firmware, mac, tags 
    FROM devices
  `;
  
  const params = [];
  if (companyId) {
    query += ` WHERE company_id = $1`;
    params.push(companyId);
  }
  
  query += ` ORDER BY name ASC`;

  const result = await pool.query(query, params);
  res.json(result.rows);
}));

// 3. Listar Alertas (Alerts)
app.get('/api/alerts', asyncHandler(async (req, res) => {
  const { companyId } = req.query;
  
  // Join com devices para pegar o nome do dispositivo
  let query = `
    SELECT 
      a.id, a.company_id as "companyId", a.device_id as "deviceId", 
      d.name as "deviceName", a.severity, a.message, a.timestamp, a.acknowledged
    FROM alerts a
    LEFT JOIN devices d ON a.device_id = d.id
  `;

  const params = [];
  if (companyId) {
    query += ` WHERE a.company_id = $1`;
    params.push(companyId);
  }

  query += ` ORDER BY a.timestamp DESC`;

  const result = await pool.query(query, params);
  
  // Formatar timestamp para string legível
  const formattedRows = result.rows.map(row => ({
    ...row,
    timestamp: new Date(row.timestamp).toLocaleString('pt-BR')
  }));

  res.json(formattedRows);
}));

// 4. Reconhecer Alerta (Acknowledge)
app.post('/api/alerts/:id/ack', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE alerts SET acknowledged = true WHERE id = $1', [id]);
  res.json({ success: true });
}));

// Healthcheck
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', db: 'Connected' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', error: error.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: `Route ${req.method} ${req.url} not found` });
});

app.listen(port, () => {
  console.log(`Sentinel API Server running on http://localhost:${port}`);
  console.log(`Ensure DB is running at ${pool.options.host}:${pool.options.port}`);
});