#!/usr/bin/env node

/**
 * Script de Refatoração Automatizada
 * 
 * Remove duplicações e otimiza estrutura do projeto
 * 
 * Uso:
 *   node scripts/refatorar-duplicacoes.js [--dry-run] [--backup]
 * 
 * Opções:
 *   --dry-run   Simula as mudanças sem executar
 *   --backup    Cria backup antes de fazer mudanças
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse argumentos
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const shouldBackup = args.includes('--backup');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`  ${title}`, 'cyan');
  console.log('='.repeat(60) + '\n');
}

/**
 * Cria backup da pasta
 */
function createBackup(source, backupName) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupPath = path.join(path.dirname(source), `${backupName}-backup-${timestamp}`);
    
    log(`📦 Criando backup: ${backupPath}`, 'yellow');
    
    if (!isDryRun) {
      // Copia recursivamente
      fs.cpSync(source, backupPath, { recursive: true });
      log(`✅ Backup criado com sucesso`, 'green');
    } else {
      log(`[DRY-RUN] Backup seria criado em: ${backupPath}`, 'yellow');
    }
    
    return backupPath;
  } catch (err) {
    log(`❌ Erro ao criar backup: ${err.message}`, 'red');
    throw err;
  }
}

/**
 * Remove diretório recursivamente
 */
function removeDirectory(dirPath) {
  try {
    log(`🗑️  Removendo: ${dirPath}`, 'yellow');
    
    if (!isDryRun) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      log(`✅ Diretório removido`, 'green');
    } else {
      log(`[DRY-RUN] Diretório seria removido: ${dirPath}`, 'yellow');
    }
  } catch (err) {
    log(`❌ Erro ao remover diretório: ${err.message}`, 'red');
    throw err;
  }
}

/**
 * Remove arquivo
 */
function removeFile(filePath) {
  try {
    log(`🗑️  Removendo arquivo: ${filePath}`, 'yellow');
    
    if (!isDryRun) {
      fs.unlinkSync(filePath);
      log(`✅ Arquivo removido`, 'green');
    } else {
      log(`[DRY-RUN] Arquivo seria removido: ${filePath}`, 'yellow');
    }
  } catch (err) {
    log(`❌ Erro ao remover arquivo: ${err.message}`, 'red');
    throw err;
  }
}

/**
 * Busca por referências em arquivos
 */
function searchReferences(pattern, extensions = ['ts', 'tsx', 'js', 'jsx', 'json']) {
  const results = [];
  
  function searchInDir(dir, ignore = ['node_modules', 'dist', 'build', '.git']) {
    try {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !ignore.includes(file)) {
          searchInDir(fullPath, ignore);
        } else if (stat.isFile()) {
          const ext = path.extname(file).slice(1);
          if (extensions.includes(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const lines = content.split('\n');
              
              lines.forEach((line, idx) => {
                if (line.includes(pattern)) {
                  results.push({
                    file: fullPath,
                    line: idx + 1,
                    content: line.trim()
                  });
                }
              });
            } catch (e) {
              // Ignora erros de leitura
            }
          }
        }
      }
    } catch (e) {
      // Ignora erros de acesso
    }
  }
  
  searchInDir(process.cwd());
  return results;
}

/**
 * Executa refatoração
 */
function executarRefatoracao() {
  logSection('INÍCIO DA REFATORAÇÃO');
  
  if (isDryRun) {
    log('⚠️  MODO DRY-RUN ATIVADO - Nenhuma mudança será feita', 'yellow');
  }
  
  if (shouldBackup) {
    log('💾 Modo backup ativado', 'blue');
  }
  
  console.log('');
  
  // FASE 1: Verificar referências
  logSection('FASE 1: Verificação de Referências');
  
  log('🔍 Buscando referências a "back-end-aura-hubb"...', 'blue');
  const refs = searchReferences('back-end-aura-hubb');
  
  if (refs.length > 0) {
    log(`⚠️  Encontradas ${refs.length} referências:`, 'yellow');
    refs.forEach(ref => {
      console.log(`   ${ref.file}:${ref.line}`);
      console.log(`      ${ref.content}`);
    });
    
    if (!isDryRun) {
      log('\n❌ ABORTANDO: Corrija as referências antes de continuar', 'red');
      process.exit(1);
    }
  } else {
    log('✅ Nenhuma referência encontrada', 'green');
  }
  
  // FASE 2: Backup
  if (shouldBackup && !isDryRun) {
    logSection('FASE 2: Criação de Backup');
    
    const serverPath = path.join(process.cwd(), 'server', 'back-end-aura-hubb');
    if (fs.existsSync(serverPath)) {
      createBackup(serverPath, 'back-end-aura-hubb');
    }
  }
  
  // FASE 3: Remover pasta duplicada
  logSection('FASE 3: Remoção de Duplicatas Críticas');
  
  const duplicatedServerPath = path.join(process.cwd(), 'server', 'back-end-aura-hubb');
  if (fs.existsSync(duplicatedServerPath)) {
    log('📁 Removendo server/back-end-aura-hubb/...', 'blue');
    removeDirectory(duplicatedServerPath);
  } else {
    log('ℹ️  Pasta server/back-end-aura-hubb/ não encontrada', 'yellow');
  }
  
  // FASE 4: Limpar arquivos frontend redundantes
  logSection('FASE 4: Limpeza de Arquivos Frontend');
  
  const frontendFilesToRemove = [
    path.join(process.cwd(), 'client', 'App-teste.tsx'),
    path.join(process.cwd(), 'client', 'App-original.tsx'),
  ];
  
  frontendFilesToRemove.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      removeFile(filePath);
    } else {
      log(`ℹ️  Arquivo não encontrado: ${path.basename(filePath)}`, 'yellow');
    }
  });
  
  // FASE 5: Remover pasta src vazia
  logSection('FASE 5: Limpeza de Estrutura');
  
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    try {
      const srcContents = fs.readdirSync(srcPath, { withFileTypes: true });
      const isEmpty = srcContents.every(item => {
        if (item.isDirectory()) {
          const subPath = path.join(srcPath, item.name);
          const subContents = fs.readdirSync(subPath);
          return subContents.length === 0;
        }
        return false;
      });
      
      if (isEmpty) {
        log('📁 Removendo pasta src/ vazia...', 'blue');
        removeDirectory(srcPath);
      } else {
        log('ℹ️  Pasta src/ contém arquivos, mantendo', 'yellow');
      }
    } catch (err) {
      log(`⚠️  Erro ao verificar pasta src/: ${err.message}`, 'yellow');
    }
  }
  
  // FASE 6: Consolidar configurações Vite
  logSection('FASE 6: Consolidação de Configurações');
  
  const viteConfigJs = path.join(process.cwd(), 'vite.config.js');
  const viteConfigTs = path.join(process.cwd(), 'vite.config.ts');
  
  if (fs.existsSync(viteConfigJs) && fs.existsSync(viteConfigTs)) {
    log('⚠️  Encontrados vite.config.js e vite.config.ts', 'yellow');
    log('📝 Recomendação: Revise manualmente e remova vite.config.js se necessário', 'blue');
    
    if (!isDryRun) {
      log('ℹ️  Mantendo ambos por segurança - revise manualmente', 'yellow');
    }
  }
  
  // FASE 7: Relatório Final
  logSection('RELATÓRIO FINAL');
  
  if (isDryRun) {
    log('✅ Simulação concluída - Execute sem --dry-run para aplicar mudanças', 'green');
  } else {
    log('✅ Refatoração concluída com sucesso!', 'green');
    console.log('');
    log('📋 Próximos passos:', 'blue');
    console.log('   1. Execute: npm test');
    console.log('   2. Execute: npm run build');
    console.log('   3. Execute: cd server && npm run build');
    console.log('   4. Verifique se tudo funciona corretamente');
    console.log('   5. Commit: git commit -m "Refactor: Remove duplicate code"');
  }
  
  console.log('');
}

// Execução principal
try {
  executarRefatoracao();
} catch (err) {
  log(`\n❌ ERRO FATAL: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
}
