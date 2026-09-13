# 🧪 Padrões de Testes e Validação

Este documento define o processo de teste automatizado e manual para manter a estabilidade do **Planilha RPG**.

---

## 1. Suíte de Testes Automatizados (`test_runner.js`)

O projeto dispõe de uma suíte nativa em Node.js (`test_runner.js`) para validação rápida de código e regras sem necessidade de abrir o navegador:

```bash
node test_runner.js
```

### Escopo da Cobertura de Testes:
1. **Validação de Sintaxe**:
   - Analisa AST/sintaxe de todos os arquivos em `src_js_*.js` e `src_data_*.js`.
2. **Integridade da Build**:
   - Executa `builder.js` e inspeciona se o arquivo `planilha do rpg.html` é gerado com tamanho correto e tags requeridas.
3. **Regras D&D 5E e Lógica de Negócio**:
   - Cálculos matemáticos de bônus de proficiência e modificadores de atributo.
   - Preservação de PV atual e máximo ao entrar em combate.
   - Adição em lote de monstros (Qtd > 1) com numeração sequencial e iniciativa individual.
   - Sincronização bidirecional de PV entre combate e ficha do jogador.
   - Exclusão em cascata (remove de `PLAYERS`, limpa do combate ativo e tokens do VTT).

---

## 2. Checklist de Validação Manual no Navegador

1. **Fichas dos Alunos**:
   - Criar, editar, clonar e excluir ficha.
   - Ajustes de PV rápidos e descanso curto/longo coletivo.
   - Ordenação dinâmica por Nome, Aluno, Nível e % PV.
2. **Combate & Bestiário**:
   - Adicionar múltiplas criaturas do Bestiário definindo a quantidade no input `Qtd`.
   - Modificar a iniciativa de um monstro ou aluno clicando no valor de iniciativa.
   - Aplicar dano rápido (-5, -1, +1, +5) e verificar os status de `🩸 Sangrando` e `💀 0 PV`.
3. **VTT Grid & Telão**:
   - Mover tokens no mapa tático e verificar a sincronização com o Telão.
