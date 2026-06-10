# 📚 Guia do Backend - Via Fluvial Amazônia

## ⚠️ IMPORTANTE: SEM EDGE FUNCTIONS ⚠️

**Este projeto NÃO usa Edge Functions!** 

O sistema funciona com **Supabase Client direto** no frontend comunicando com o banco de dados `kv_store_63010152`.

**Veja `/SOLUCAO-FINAL-403.md` para detalhes completos.**

---

## 🎯 Visão Geral

O backend foi implementado usando **Supabase Client JS** para acesso direto ao Key-Value Store (`kv_store_63010152`), armazenando todos os dados da landing page de pré-lançamento.

---

## 🗄️ Estrutura de Dados

### **1. Newsletter (Lista de Espera)**
Armazena emails dos usuários interessados no lançamento.

**Chave:** `newsletter:{email}`

**Dados salvos:**
```json
{
  "email": "usuario@email.com",
  "source": "cta-final",
  "subscribedAt": "2026-03-26T10:30:00.000Z",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### **2. Enquete (Poll)**
Armazena respostas da enquete de funcionalidades + sugestões abertas.

**Chave:** `poll:{timestamp}-{random}`

**Dados salvos:**
```json
{
  "selectedOptions": ["comprar", "horarios", "pagar"],
  "suggestions": "Gostaria de ver integração com GPS...",
  "submittedAt": "2026-03-26T10:35:00.000Z",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

---

## 🔌 Endpoints da API

### **Base URL**
```
https://{projectId}.supabase.co/functions/v1/make-server-63010152
```

### **Newsletter Endpoints**

#### ✉️ **POST /newsletter**
Cadastra um novo email na lista de espera.

**Request:**
```json
{
  "email": "usuario@email.com",
  "source": "cta-final"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Inscrição realizada com sucesso!",
  "position": 1248
}
```

**Response (Email duplicado):**
```json
{
  "error": "Este email já está cadastrado",
  "alreadySubscribed": true
}
```

---

#### 📊 **GET /newsletter/count**
Retorna o total de inscritos.

**Response:**
```json
{
  "count": 1248
}
```

---

#### 📋 **GET /newsletter/list**
Lista todos os inscritos (endpoint admin).

**Response:**
```json
{
  "total": 1248,
  "subscribers": [
    {
      "email": "usuario@email.com",
      "source": "cta-final",
      "subscribedAt": "2026-03-26T10:30:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

### **Poll Endpoints**

#### 📝 **POST /poll**
Envia resposta da enquete.

**Request:**
```json
{
  "selectedOptions": ["comprar", "horarios", "pagar"],
  "suggestions": "Seria legal ter notificações push"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resposta enviada com sucesso!",
  "totalResponses": 542
}
```

---

#### 📊 **GET /poll/stats**
Retorna estatísticas da enquete.

**Response:**
```json
{
  "totalResponses": 542,
  "optionCounts": {
    "comprar": 412,
    "horarios": 389,
    "acompanhar": 301,
    "pagar": 256,
    "confiaveis": 198
  },
  "suggestionsCount": 87,
  "recentSuggestions": [
    {
      "suggestion": "Integração com GPS seria ótimo",
      "submittedAt": "2026-03-26T10:35:00.000Z"
    }
  ]
}
```

---

#### 📋 **GET /poll/list**
Lista todas as respostas (endpoint admin).

**Response:**
```json
{
  "total": 542,
  "responses": [
    {
      "selectedOptions": ["comprar", "horarios"],
      "suggestions": "Adicionar modo escuro",
      "submittedAt": "2026-03-26T10:35:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

## 🖥️ Dashboard Administrativo

### **Acesso**
```
https://seu-dominio.com/admin
```

### **Funcionalidades**

#### 📊 **Visão Geral**
- Total de inscritos na newsletter
- Total de respostas da enquete
- Total de sugestões recebidas
- Taxa de engajamento (enquete / newsletter)
- Gráfico de funcionalidades mais votadas
- Lista das sugestões mais recentes

#### ✉️ **Aba Newsletter**
- Lista completa de todos os inscritos
- Informações: email, origem, data de cadastro
- **Exportação CSV** com um clique

#### 📝 **Aba Enquete**
- Lista completa de todas as respostas
- Opções selecionadas por cada usuário
- Sugestões abertas destacadas
- **Exportação CSV** com um clique

---

## 💻 Como Usar no Frontend

### **1. Importar a API**
```typescript
import { 
  subscribeNewsletter, 
  submitPoll,
  getNewsletterCount,
  getPollStats,
  listNewsletterSubscribers,
  listPollResponses
} from '../utils/api';
```

### **2. Cadastrar Email**
```typescript
const handleSubmit = async (email: string) => {
  try {
    const response = await subscribeNewsletter(email, 'cta-final');
    console.log(`Você é o inscrito #${response.position}`);
  } catch (error) {
    console.error('Erro:', error.message);
  }
};
```

### **3. Enviar Enquete**
```typescript
const handlePollSubmit = async () => {
  try {
    await submitPoll(
      ['comprar', 'horarios'],
      'Sugestão adicional aqui'
    );
    console.log('Resposta enviada!');
  } catch (error) {
    console.error('Erro:', error.message);
  }
};
```

### **4. Buscar Estatísticas**
```typescript
const loadStats = async () => {
  const count = await getNewsletterCount();
  const stats = await getPollStats();
  
  console.log(`Total de inscritos: ${count}`);
  console.log('Funcionalidade mais votada:', stats.optionCounts);
};
```

---

## 🔒 Segurança

### **Proteções Implementadas**

✅ **Validação de Email** - Verifica formato antes de salvar  
✅ **Duplicatas** - Impede cadastro do mesmo email 2x  
✅ **Normalização** - Converte emails para lowercase  
✅ **CORS** - Headers configurados corretamente  
✅ **Rate Limiting** - Proteção nativa do Supabase  
✅ **Logs** - Console.log em todas as operações  
✅ **Error Handling** - Tratamento de erros em todas as rotas  

---

## 📊 Exportação de Dados

### **Formato CSV**

O dashboard permite exportar dados em CSV com as seguintes colunas:

**Newsletter:**
```csv
email,source,subscribedAt,ip,userAgent
usuario@email.com,cta-final,2026-03-26T10:30:00.000Z,192.168.1.1,Mozilla/5.0...
```

**Enquete:**
```csv
selectedOptions,suggestions,submittedAt,ip,userAgent
"comprar; horarios","Adicionar GPS",2026-03-26T10:35:00.000Z,192.168.1.1,Mozilla/5.0...
```

---

## 🚀 Próximos Passos Recomendados

### **1. Integração com Email Marketing**
- [ ] Conectar com Mailchimp/SendGrid
- [ ] Email de boas-vindas automático
- [ ] Sequência de nurturing

### **2. Analytics Avançado**
- [ ] Google Analytics integration
- [ ] Tracking de origens de tráfego
- [ ] Funil de conversão

### **3. Notificações**
- [ ] Webhook para Slack/Discord
- [ ] Notificação quando meta de inscritos atingida
- [ ] Relatório diário automático

### **4. A/B Testing**
- [ ] Testar diferentes CTAs
- [ ] Testar variações de copy
- [ ] Otimizar taxa de conversão

---

## 🐛 Troubleshooting

### **Erro: "Email inválido"**
- Verifique se o email contém "@"
- Formato deve ser: usuario@dominio.com

### **Erro: "Este email já está cadastrado"**
- Normal - impede duplicatas
- Mostrar mensagem amigável ao usuário

### **Erro: "Erro ao processar inscrição"**
- Verificar conexão com Supabase
- Checar console do navegador
- Validar que servidor está online

### **Contador não atualiza**
- O contador busca dados reais a cada 30s
- Também tem incremento visual aleatório
- Após cadastro, mostra posição exata

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador (F12)
2. Checar logs do servidor Supabase
3. Validar que endpoints estão respondendo
4. Testar com `/health` endpoint

---

## ✅ Checklist de Implementação

- [x] Backend configurado com Supabase
- [x] Endpoints de newsletter criados
- [x] Endpoints de enquete criados
- [x] Validação de dados
- [x] Proteção contra duplicatas
- [x] Frontend integrado
- [x] Dashboard administrativo
- [x] Exportação CSV
- [x] Tratamento de erros
- [x] Loading states
- [x] Feedback visual
- [x] Contador em tempo real
- [x] Logs detalhados

---

## 🎉 Pronto para Produção!

O backend está **100% funcional** e pronto para coletar dados reais dos usuários.

**URL do Dashboard:** `/admin`  
**Teste os endpoints:** Use o console do navegador ou Postman

**Boa sorte com o lançamento da Via Fluvial Amazônia! 🚢🌊**