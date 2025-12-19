# 🔐 Guia: Implementar Login com Google

**Objetivo**: Adicionar autenticação OAuth com Google ao sistema

---

## 📋 PASSO 1: Criar Credenciais no Google Cloud

### 1.1 Acessar Google Cloud Console
1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Crie um novo projeto ou selecione um existente

### 1.2 Ativar Google+ API
1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure por "Google+ API"
3. Clique em **Enable**

### 1.3 Criar Credenciais OAuth
1. Vá em **APIs & Services** → **Credentials**
2. Clique em **Create Credentials** → **OAuth client ID**
3. Se pedir, configure a **OAuth consent screen**:
   - User Type: **External**
   - App name: **ClinicaRafaBarros**
   - User support email: seu email
   - Developer contact: seu email
   - Scopes: email, profile, openid
   - Test users: adicione seu email

4. Criar OAuth Client ID:
   - Application type: **Web application**
   - Name: **ClinicaRafaBarros Web**
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://69.62.103.58`
     - `https://app.clinicarafabarros.com.br` (quando DNS propagar)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `http://69.62.103.58/auth/google/callback`
     - `https://app.clinicarafabarros.com.br/auth/google/callback`

5. **Copie o Client ID e Client Secret** - você vai precisar!

---

## 📋 PASSO 2: Configurar Backend

### 2.1 Instalar dependências

```bash
# Na VPS
cd /root/clinicrafabarros
npm install passport passport-google-oauth20 express-session
```

### 2.2 Criar arquivo de configuração do Passport

Criar `src/config/passport.ts`:

```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env';
import { prisma } from '../lib/prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar ou criar usuário
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value },
        });

        if (!user) {
          // Criar novo usuário
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value || '',
              name: profile.displayName,
              role: 'THERAPIST', // Padrão
              password: '', // Sem senha para login Google
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
```

### 2.3 Adicionar variáveis de ambiente

Adicionar no `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id-aqui
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_CALLBACK_URL=http://69.62.103.58/auth/google/callback
SESSION_SECRET=seu-secret-super-seguro-aqui
```

### 2.4 Atualizar env.ts

Adicionar no `src/config/env.ts`:

```typescript
GOOGLE_CLIENT_ID: z.string(),
GOOGLE_CLIENT_SECRET: z.string(),
GOOGLE_CALLBACK_URL: z.string(),
SESSION_SECRET: z.string(),
```

### 2.5 Criar rotas de autenticação Google

Criar `src/routes/authGoogle.ts`:

```typescript
import { Router } from 'express';
import passport from '../config/passport';
import { generateToken } from '../utils/jwt';

const router = Router();

// Iniciar autenticação
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback do Google
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user as any;
    
    // Gerar JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Redirecionar para frontend com token
    res.redirect(`/?token=${token}`);
  }
);

export default router;
```

### 2.6 Atualizar server.ts

Adicionar:

```typescript
import session from 'express-session';
import passport from './config/passport';
import authGoogleRoutes from './routes/authGoogle';

// Antes das rotas
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Adicionar rotas
app.use('/auth', authGoogleRoutes);
```

---

## 📋 PASSO 3: Atualizar Frontend

### 3.1 Atualizar AuthContext

No `contexts/AuthContext.tsx`, atualizar `loginWithGoogle`:

```typescript
const loginWithGoogle = async (): Promise<boolean> => {
  // Redirecionar para rota do Google
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  return true;
};
```

### 3.2 Criar página de callback

Criar `pages/AuthCallback.tsx`:

```typescript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Pegar token da URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Salvar token
      localStorage.setItem('token', token);
      
      // Buscar dados do usuário
      fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(user => {
          setUser(user);
          navigate('/dashboard');
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, []);

  return <div>Autenticando...</div>;
};

export default AuthCallback;
```

---

## 📋 PASSO 4: Testar

1. Rebuild backend: `npm run build`
2. Restart PM2: `pm2 restart clinicrafabarros-api`
3. Rebuild frontend: `npm run build`
4. Deploy frontend novamente
5. Testar login com Google

---

## 🚨 IMPORTANTE

- **Segurança**: Nunca commite o Client Secret no Git
- **HTTPS**: Google OAuth funciona melhor com HTTPS
- **Domínio**: Quando DNS propagar, atualize as URLs
- **Produção**: Use variáveis de ambiente diferentes

---

## 📝 Checklist

- [ ] Criar projeto no Google Cloud
- [ ] Ativar Google+ API
- [ ] Criar OAuth credentials
- [ ] Copiar Client ID e Secret
- [ ] Instalar dependências no backend
- [ ] Criar config/passport.ts
- [ ] Atualizar .env
- [ ] Criar rotas de auth Google
- [ ] Atualizar server.ts
- [ ] Atualizar AuthContext
- [ ] Criar página de callback
- [ ] Rebuild e deploy
- [ ] Testar login

---

**Quer que eu implemente isso agora ou prefere fazer depois?**
