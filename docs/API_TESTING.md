# 🧪 Guia de Testes da API - Via Fluvial Amazônia

## 🎯 Como Testar os Endpoints

### **Opção 1: Testando pelo Console do Navegador**

Abra o console (F12) em qualquer página do site e execute:

```javascript
// Teste 1: Cadastrar Email na Newsletter
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/newsletter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'teste@example.com',
    source: 'teste-manual'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Newsletter:', data))
.catch(err => console.error('❌ Erro:', err));

// Teste 2: Buscar Total de Inscritos
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/newsletter/count', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Total:', data))
.catch(err => console.error('❌ Erro:', err));

// Teste 3: Enviar Enquete
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/poll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    selectedOptions: ['comprar', 'horarios'],
    suggestions: 'Seria legal ter um app mobile!'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Poll:', data))
.catch(err => console.error('❌ Erro:', err));

// Teste 4: Buscar Estatísticas da Enquete
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/poll/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Stats:', data))
.catch(err => console.error('❌ Erro:', err));
```

---

### **Opção 2: Testando com cURL**

```bash
# Teste 1: Cadastrar Email
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/newsletter \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "teste@example.com",
    "source": "teste-curl"
  }'

# Teste 2: Buscar Total de Inscritos
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/newsletter/count \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Teste 3: Listar Todos os Inscritos
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/newsletter/list \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Teste 4: Enviar Enquete
curl -X POST \
  https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/poll \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "selectedOptions": ["comprar", "horarios", "pagar"],
    "suggestions": "Adicionar notificações push"
  }'

# Teste 5: Estatísticas da Enquete
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/poll/stats \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Teste 6: Listar Todas as Respostas
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-63010152/poll/list \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

### **Opção 3: Testando com Postman**

1. **Importe esta Collection:**

```json
{
  "info": {
    "name": "Via Fluvial API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Newsletter - Subscribe",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{ANON_KEY}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"teste@example.com\",\n  \"source\": \"postman\"\n}"
        },
        "url": {
          "raw": "https://{{PROJECT_ID}}.supabase.co/functions/v1/make-server-63010152/newsletter",
          "protocol": "https",
          "host": [
            "{{PROJECT_ID}}",
            "supabase",
            "co"
          ],
          "path": [
            "functions",
            "v1",
            "make-server-63010152",
            "newsletter"
          ]
        }
      }
    },
    {
      "name": "Newsletter - Get Count",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{ANON_KEY}}"
          }
        ],
        "url": {
          "raw": "https://{{PROJECT_ID}}.supabase.co/functions/v1/make-server-63010152/newsletter/count",
          "protocol": "https",
          "host": [
            "{{PROJECT_ID}}",
            "supabase",
            "co"
          ],
          "path": [
            "functions",
            "v1",
            "make-server-63010152",
            "newsletter",
            "count"
          ]
        }
      }
    },
    {
      "name": "Poll - Submit",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{ANON_KEY}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"selectedOptions\": [\"comprar\", \"horarios\"],\n  \"suggestions\": \"Adicionar modo escuro\"\n}"
        },
        "url": {
          "raw": "https://{{PROJECT_ID}}.supabase.co/functions/v1/make-server-63010152/poll",
          "protocol": "https",
          "host": [
            "{{PROJECT_ID}}",
            "supabase",
            "co"
          ],
          "path": [
            "functions",
            "v1",
            "make-server-63010152",
            "poll"
          ]
        }
      }
    },
    {
      "name": "Poll - Get Stats",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{ANON_KEY}}"
          }
        ],
        "url": {
          "raw": "https://{{PROJECT_ID}}.supabase.co/functions/v1/make-server-63010152/poll/stats",
          "protocol": "https",
          "host": [
            "{{PROJECT_ID}}",
            "supabase",
            "co"
          ],
          "path": [
            "functions",
            "v1",
            "make-server-63010152",
            "poll",
            "stats"
          ]
        }
      }
    }
  ]
}
```

2. **Crie Environment Variables:**
   - `PROJECT_ID`: Seu ID do projeto Supabase
   - `ANON_KEY`: Sua chave pública (anon key)

---

### **Opção 4: Testando Diretamente no Site**

#### **Teste da Newsletter:**
1. Acesse a página inicial
2. Role até a seção "Acompanhe o lançamento"
3. Digite um email válido
4. Clique em "Quero acompanhar"
5. Verifique:
   - ✅ Loading state durante envio
   - ✅ Mensagem de sucesso
   - ✅ Posição na fila exibida
   - ✅ Toast de confirmação

#### **Teste da Enquete:**
1. Role até a seção "Queremos ouvir você"
2. Selecione uma ou mais opções
3. Digite uma sugestão (opcional)
4. Clique em "Enviar resposta"
5. Verifique:
   - ✅ Loading state durante envio
   - ✅ Mensagem de agradecimento
   - ✅ Destaque se sugestão foi enviada
   - ✅ Toast de confirmação

#### **Teste do Dashboard:**
1. Acesse `/admin`
2. Verifique os cards de estatísticas:
   - ✅ Total de inscritos
   - ✅ Total de respostas
   - ✅ Total de sugestões
   - ✅ Taxa de engajamento
3. Navegue pelas abas:
   - ✅ Visão Geral (gráficos + sugestões)
   - ✅ Newsletter (lista de emails)
   - ✅ Enquete (respostas detalhadas)
4. Teste a exportação:
   - ✅ Botão "Exportar CSV" funciona
   - ✅ Arquivo baixado corretamente

---

## 🔍 Verificando Logs

### **Frontend (Console)**
1. Abra DevTools (F12)
2. Vá na aba "Console"
3. Veja logs das operações:
   ```
   Newsletter subscription successful: {success: true, position: 123}
   Poll submission successful: {success: true, totalResponses: 45}
   ```

### **Backend (Supabase)**
1. Acesse o painel do Supabase
2. Vá em "Database" → "Table Editor" → "kv_store_63010152"
3. Veja os registros salvos em tempo real

---

## ✅ Checklist de Testes

### **Newsletter**
- [ ] Cadastrar email válido funciona
- [ ] Email duplicado retorna erro apropriado
- [ ] Email inválido é bloqueado
- [ ] Contador atualiza após cadastro
- [ ] Posição na fila é exibida corretamente
- [ ] Toast de sucesso aparece
- [ ] Estado de loading funciona
- [ ] Erro é exibido quando servidor está offline

### **Enquete**
- [ ] Selecionar opções funciona
- [ ] Enviar sem selecionar opção bloqueia
- [ ] Sugestões opcionais funcionam
- [ ] Enviar com sugestão salva corretamente
- [ ] Toast de sucesso aparece
- [ ] Estado de loading funciona
- [ ] Mensagem de agradecimento aparece

### **Dashboard**
- [ ] Estatísticas carregam corretamente
- [ ] Gráfico de barras exibe percentuais
- [ ] Sugestões recentes aparecem
- [ ] Lista de emails completa
- [ ] Lista de respostas completa
- [ ] Exportação CSV funciona
- [ ] Botão atualizar recarrega dados
- [ ] Abas navegam corretamente

---

## 🐛 Erros Comuns e Soluções

### **Erro: "Failed to fetch"**
**Causa:** Servidor offline ou CORS
**Solução:** 
1. Verifique se servidor está rodando
2. Confirme CORS configurado corretamente
3. Teste endpoint `/health`

### **Erro: "Email inválido"**
**Causa:** Formato de email incorreto
**Solução:** Use formato: `usuario@dominio.com`

### **Erro: "Este email já está cadastrado"**
**Causa:** Email já existe no banco
**Solução:** Use outro email ou verifique duplicata

### **Erro: "Unauthorized"**
**Causa:** Token de autorização inválido
**Solução:** Verifique `publicAnonKey` em `/utils/supabase/info.tsx`

### **Dashboard não carrega dados**
**Causa:** Erro na API ou banco vazio
**Solução:**
1. Verifique console do navegador
2. Cadastre dados de teste primeiro
3. Teste endpoints manualmente

---

## 📊 Dados de Teste Recomendados

### **Cadastrar 10 emails de teste:**
```javascript
const emails = [
  'usuario1@test.com',
  'usuario2@test.com',
  'usuario3@test.com',
  'usuario4@test.com',
  'usuario5@test.com',
  'usuario6@test.com',
  'usuario7@test.com',
  'usuario8@test.com',
  'usuario9@test.com',
  'usuario10@test.com',
];

emails.forEach(async (email) => {
  await fetch('YOUR_API_URL/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_KEY'
    },
    body: JSON.stringify({ email, source: 'test' })
  });
});
```

### **Cadastrar 5 enquetes de teste:**
```javascript
const polls = [
  { selectedOptions: ['comprar', 'horarios'], suggestions: 'App mobile seria ótimo' },
  { selectedOptions: ['pagar', 'confiaveis'], suggestions: 'Integração com Google Maps' },
  { selectedOptions: ['acompanhar', 'horarios'], suggestions: '' },
  { selectedOptions: ['comprar'], suggestions: 'Notificações de promoções' },
  { selectedOptions: ['confiaveis', 'pagar', 'acompanhar'], suggestions: 'Chat com suporte' },
];

polls.forEach(async (poll) => {
  await fetch('YOUR_API_URL/poll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_KEY'
    },
    body: JSON.stringify(poll)
  });
});
```

---

## 🎉 Sucesso!

Se todos os testes passaram, seu backend está **100% funcional** e pronto para produção! 🚀

**Próximo passo:** Compartilhe o link `/admin` apenas com pessoas autorizadas para visualizar os dados.