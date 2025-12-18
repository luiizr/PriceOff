# 🔒 Configuração Segura de Ambientes

## ✅ Implementação Feita

Criamos arquivos de **environment** para separar configurações entre desenvolvimento e produção de forma segura.

## 📁 Estrutura

```
app/src/environments/
├── environment.ts       # Desenvolvimento (local)
└── environment.prod.ts  # Produção (deploy)
```

## 🔐 Como Funciona

### **Desenvolvimento** (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // Backend local
};
```

### **Produção** (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.priceoff.com'  // Backend em produção
};
```

### **Uso no Service** (auth.service.ts)
```typescript
import { environment } from '../environments/environment';

export class AuthService {
  private apiUrl = environment.apiUrl;  // Usa o ambiente correto
}
```

## 🎯 Comportamento

### Durante Desenvolvimento (`npm run dev`):
- Usa **environment.ts**
- API: `http://localhost:3000`
- Debugging habilitado

### Durante Build de Produção (`npm run build`):
- Angular **substitui** automaticamente **environment.ts** por **environment.prod.ts**
- API: `https://api.priceoff.com`
- Código otimizado e minificado

## 🔒 Segurança

### ✅ Vantagens:

1. **URL não fica hardcoded** no código principal
2. **Separação de ambientes** (dev/prod)
3. **Fácil manutenção** - muda em um lugar só
4. **Sem exposição** de URLs de produção durante desenvolvimento
5. **Build automático** troca o arquivo certo

### 🛡️ Boas Práticas:

1. **NÃO commite** `environment.prod.ts` com URLs reais para o Git
   - Adicione ao `.gitignore`:
   ```
   /src/environments/environment.prod.ts
   ```

2. Use **variáveis de ambiente** no CI/CD para injetar URLs de produção

3. Para segredos sensíveis (API keys), use **backend** para gerenciar
   - Frontend sempre é exposto no browser
   - Segredos devem ficar no backend

## 📝 Configuração no angular.json

O Angular já está configurado para substituir os arquivos:

```json
"production": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}
```

## 🚀 Como Usar

### Desenvolvimento:
```bash
npm run dev
# Usa: http://localhost:3000
```

### Build para Produção:
```bash
npm run build
# Usa: https://api.priceoff.com
# Gera arquivos otimizados em dist/
```

### Testar Build de Produção Localmente:
```bash
npm run build
npx http-server dist/app -p 8080
```

## 🔧 Adicionar Novas Variáveis

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  apiTimeout: 30000,
  enableLogs: true,
  version: '1.0.0'
};

// Usar no código:
import { environment } from '../environments/environment';

console.log(environment.version);
if (environment.enableLogs) {
  console.log('Debugging...');
}
```

## ⚠️ Importante

❌ **NÃO use `environment` para segredos reais** (API keys, senhas, tokens)
- Frontend é exposto no browser
- Qualquer um pode ver o código JavaScript

✅ **Use `environment` para:**
- URLs de API
- Flags de features
- Configurações de UI
- Timeouts
- Versões

✅ **Segredos devem ficar no backend:**
- Chaves de API de terceiros
- Tokens de serviços
- Credenciais de banco de dados
- Secrets do JWT