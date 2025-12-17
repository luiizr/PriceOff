# 🎨 Tela Inicial - Sistema de Autenticação

## ✅ Componentes Criados

### 1. **AuthService** ([auth.service.ts](./src/services/auth.service.ts))
- Gerencia autenticação (login, registro, logout)
- Armazena token JWT no localStorage
- Observable para estado do usuário
- Integração com API do backend (http://localhost:3000)

### 2. **LoginComponent** ([login.component.ts](./src/components/auth/login.component.ts))
- Formulário de login (email + senha)
- Validação de campos
- Exibição de erros
- Loading state

### 3. **RegisterComponent** ([register.component.ts](./src/components/auth/register.component.ts))
- Formulário de registro (nome, email, senha, confirmar senha)
- Validação de senhas (coincidência e tamanho mínimo)
- Validação de campos
- Loading state

### 4. **TelaInicialComponent** ([telaInicial.component.ts](./src/inicial/telaInicial/telaInicial.component.ts))
- Tela principal da aplicação
- Verifica se usuário está logado
- Mostra modal de autenticação se não estiver logado
- Alterna entre login e registro
- Dashboard quando usuário logado

## 🔄 Fluxo de Funcionamento

### Quando Usuário NÃO está logado:

```
1. App carrega
   ↓
2. TelaInicialComponent verifica autenticação
   ↓
3. AuthService.isAuthenticated() retorna false
   ↓
4. Modal de autenticação aparece no centro
   ↓
5. Usuário pode alternar entre Login/Registro
   ↓
6. Ao submeter formulário:
   - AuthService faz POST para API
   - API retorna token JWT + dados do usuário
   - Token é salvo no localStorage
   - Usuário é atualizado no Observable
   ↓
7. Modal fecha e dashboard aparece
```

### Quando Usuário JÁ está logado:

```
1. App carrega
   ↓
2. TelaInicialComponent verifica autenticação
   ↓
3. AuthService carrega token do localStorage
   ↓
4. AuthService.isAuthenticated() retorna true
   ↓
5. Dashboard é exibido imediatamente
   ↓
6. Usuário pode clicar em "Sair" para fazer logout
```

## 🎨 Interface Visual

### Modal de Autenticação:
- Fundo com gradiente roxo
- Card branco centralizado
- Tabs para alternar Login/Registro
- Formulários estilizados
- Botões com feedback visual
- Mensagens de erro destacadas
- Link para alternar entre modos

### Dashboard (Logado):
- Header com nome do usuário e botão de logout
- Fundo cinza claro
- Cards de funcionalidades
- Layout responsivo

## 📡 Integração com Backend

### Endpoints utilizados:

**POST /auth/login**
```typescript
Body: { email: string, password: string }
Response: { access_token: string, user: { id, name, email } }
```

**POST /auth/register**
```typescript
Body: { name: string, email: string, password: string }
Response: { access_token: string, user: { id, name, email } }
```

### Headers automáticos (futuro):
Para rotas protegidas, você pode criar um interceptor que adiciona o token automaticamente:
```typescript
Authorization: Bearer <token>
```

## 🔧 Como Usar

### 1. Certifique-se que o backend está rodando:
```bash
cd api
npm run start:dev
```

### 2. Inicie o frontend:
```bash
cd app
npm run dev
```

### 3. Acesse: http://localhost:4200

## 🎯 Fluxo Passo a Passo

### Primeiro Acesso:
1. Página abre com modal de autenticação
2. Clique em "Criar Conta"
3. Preencha: Nome, Email, Senha
4. Clique em "Criar Conta"
5. Se sucesso → Dashboard aparece
6. Se erro → Mensagem de erro é exibida

### Login:
1. Clique em "Login" na tab
2. Preencha: Email, Senha
3. Clique em "Entrar"
4. Se sucesso → Dashboard aparece
5. Se erro → Mensagem de erro (ex: "Credenciais inválidas")

### Logout:
1. No dashboard, clique em "Sair"
2. Token é removido do localStorage
3. Modal de autenticação aparece novamente

## 💾 Persistência

O token JWT é salvo no `localStorage`:
- **Key:** `token`
- **Value:** Token JWT da API

Os dados do usuário também são salvos:
- **Key:** `user`
- **Value:** JSON com `{ id, name, email }`

**Comportamento:**
- Token persiste mesmo após fechar o navegador
- Ao reabrir, usuário continua logado (se token não expirou)
- Logout limpa ambos do localStorage

## 🎨 Personalização

### Cores:
- **Login:** Verde (#4CAF50)
- **Registro:** Azul (#2196F3)
- **Logout:** Vermelho (#f44336)
- **Gradiente:** Roxo (#667eea → #764ba2)

### Animações:
- Modal: slideIn (0.3s)
- Cards: hover com translateY
- Botões: transições suaves

## 📱 Responsividade

O layout é responsivo e funciona em:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔐 Segurança

✅ Token JWT armazenado no localStorage  
✅ Validação de formulários no frontend  
✅ Senhas nunca expostas (type="password")  
✅ Validação de senha no registro (mínimo 6 caracteres)  
✅ Confirmação de senha no registro  

## 🚀 Próximos Passos

1. **Interceptor HTTP** para adicionar token automaticamente
2. **Guard de Rota** para proteger páginas
3. **Refresh Token** para renovar token expirado
4. **Validação de Email** com regex
5. **Força da senha** com indicador visual
6. **Esqueci minha senha** com recuperação
7. **Loading global** durante requisições

## 📂 Estrutura de Arquivos

```
app/src/
├── services/
│   └── auth.service.ts           # Gerencia autenticação
├── components/
│   └── auth/
│       ├── login.component.ts     # Componente de login
│       ├── login.component.html
│       ├── login.component.scss
│       ├── register.component.ts  # Componente de registro
│       ├── register.component.html
│       └── register.component.scss
├── inicial/
│   └── telaInicial/
│       ├── telaInicial.component.ts    # Tela principal
│       ├── telaInicial.component.html
│       └── telaInicial.component.scss
└── app/
    ├── app.config.ts              # HttpClient configurado
    ├── app.component.ts           # Importa TelaInicial
    └── app.component.html         # Renderiza TelaInicial
```

## ✨ Funcionalidades Implementadas

✅ Modal de autenticação centralizado  
✅ Alternância entre Login e Registro  
✅ Validação de formulários  
✅ Integração com API backend  
✅ Armazenamento de token JWT  
✅ Verificação automática de autenticação  
✅ Dashboard para usuários logados  
✅ Logout funcional  
✅ Feedback visual (loading, erros)  
✅ Design moderno e responsivo  
✅ Animações suaves  

## 🎬 Demonstração

### Estado Inicial (Não Logado):
![Modal de Login/Registro aparece automaticamente]

### Após Login:
![Dashboard com boas-vindas e cards]

### Logout:
![Volta para modal de autenticação]
