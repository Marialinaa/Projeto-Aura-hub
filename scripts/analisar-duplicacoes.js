#!/usr/bin/env node

/**
 * Script de Análise de Duplicação de Código
 * 
 * Analisa o repositório para identificar arquivos duplicados
 * baseando-se em hash MD5 do conteúdo.
 * 
 * Uso:
 *   node scripts/analisar-duplicacoes.js [--json] [--verbose]
 * 
 * Opções:
 *   --json      Saída em formato JSON
 *   --verbose   Mostra informações detalhadas
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configurações
const IGNORE_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  'android',
  'ios',
  '.next',
  'out',
  'coverage',
  'reports',
  '.vscode',
  '.idea'
];

const FILE_PATTERNS = /\.(ts|tsx|js|jsx|css|scss|sass|less)$/;
const MIN_FILE_SIZE = 100; // bytes

// Parse argumentos
const args = process.argv.slice(2);
const isJson = args.includes('--json');
const isVerbose = args.includes('--verbose');

/**
 * Calcula hash MD5 do conteúdo
 */
function hashFile(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Calcula hash baseado em similaridade (ignora whitespace)
 */
function hashSimilarity(content) {
  const normalized = content
    .replace(/\s+/g, ' ')  // Normaliza espaços
    .replace(/\/\/.*$/gm, '')  // Remove comentários de linha
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove comentários de bloco
    .trim();
  return crypto.createHash('md5').update(normalized).digest('hex');
}

/**
 * Calcula similaridade entre dois textos (0-100%)
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 100;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
}

/**
 * Calcula distância de Levenshtein (simplificado)
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Formata tamanho de arquivo
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Scaneia diretório recursivamente
 */
function scanDirectory(dir, results = [], ignore = IGNORE_DIRS) {
  try {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!ignore.includes(file)) {
            scanDirectory(fullPath, results, ignore);
          }
        } else if (stat.isFile() && FILE_PATTERNS.test(file)) {
          const content = fs.readFileSync(fullPath, 'utf-8').trim();
          
          if (content.length >= MIN_FILE_SIZE) {
            const hash = hashFile(content);
            const hashSim = hashSimilarity(content);
            
            results.push({
              path: fullPath,
              relativePath: path.relative(process.cwd(), fullPath),
              hash,
              hashSim,
              size: content.length,
              lines: content.split('\n').length,
              file,
              ext: path.extname(file),
              content: isVerbose ? content : undefined
            });
          }
        }
      } catch (e) {
        if (isVerbose) {
          console.error(`Erro ao processar ${fullPath}:`, e.message);
        }
      }
    }
  } catch (e) {
    if (isVerbose) {
      console.error(`Erro ao ler diretório ${dir}:`, e.message);
    }
  }
  
  return results;
}

/**
 * Agrupa arquivos por hash
 */
function groupByHash(results) {
  const hashMap = {};
  
  results.forEach(r => {
    if (!hashMap[r.hash]) {
      hashMap[r.hash] = [];
    }
    hashMap[r.hash].push(r);
  });
  
  return hashMap;
}

/**
 * Filtra apenas duplicatas
 */
function filterDuplicates(hashMap) {
  return Object.values(hashMap).filter(arr => arr.length > 1);
}

/**
 * Gera relatório em texto
 */
function generateTextReport(duplicates, results) {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('   RELATÓRIO DE ANÁLISE DE DUPLICAÇÃO DE CÓDIGO');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log(`📊 ESTATÍSTICAS GERAIS:`);
  console.log(`   Total de arquivos analisados: ${results.length}`);
  console.log(`   Arquivos duplicados: ${duplicates.reduce((acc, arr) => acc + arr.length, 0)}`);
  console.log(`   Grupos de duplicação: ${duplicates.length}`);
  
  const totalDuplicatedSize = duplicates.reduce((acc, arr) => {
    return acc + (arr[0].size * (arr.length - 1));
  }, 0);
  
  console.log(`   Espaço desperdiçado: ${formatSize(totalDuplicatedSize)}\n`);
  
  if (duplicates.length === 0) {
    console.log('✅ Nenhuma duplicação encontrada!\n');
    return;
  }
  
  console.log(`🔍 ARQUIVOS DUPLICADOS:\n`);
  
  duplicates.forEach((group, idx) => {
    console.log(`\n[${ idx + 1}/${duplicates.length}] Grupo de ${group.length} arquivos idênticos`);
    console.log(`   Hash: ${group[0].hash}`);
    console.log(`   Tamanho: ${formatSize(group[0].size)} (${group[0].lines} linhas)`);
    console.log(`   Extensão: ${group[0].ext}`);
    console.log(`   Arquivos:`);
    
    group.forEach((file, fileIdx) => {
      console.log(`      ${fileIdx + 1}. ${file.relativePath}`);
    });
  });
  
  console.log('\n═══════════════════════════════════════════════════════════\n');
  
  // Recomendações
  console.log('💡 RECOMENDAÇÕES:\n');
  
  duplicates.forEach((group, idx) => {
    const paths = group.map(f => f.relativePath);
    
    // Detectar padrões comuns
    if (paths.some(p => p.includes('back-end-aura-hubb'))) {
      console.log(`   [${idx + 1}] ⚠️  Duplicação entre server/ e server/back-end-aura-hubb/`);
      console.log(`       → Considere remover a pasta server/back-end-aura-hubb/\n`);
    } else if (paths.every(p => p.includes('config'))) {
      console.log(`   [${idx + 1}] ⚠️  Arquivos de configuração duplicados`);
      console.log(`       → Consolide em uma única configuração\n`);
    } else if (group[0].file.includes('App')) {
      console.log(`   [${idx + 1}] ⚠️  Múltiplas versões do componente App`);
      console.log(`       → Remova versões antigas/de teste\n`);
    } else {
      console.log(`   [${idx + 1}] ℹ️  Mova para módulo compartilhado ou remova duplicatas\n`);
    }
  });
  
  console.log('═══════════════════════════════════════════════════════════\n');
}

/**
 * Gera relatório em JSON
 */
function generateJsonReport(duplicates, results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.length,
      duplicatedFiles: duplicates.reduce((acc, arr) => acc + arr.length, 0),
      duplicateGroups: duplicates.length,
      wastedSpace: duplicates.reduce((acc, arr) => {
        return acc + (arr[0].size * (arr.length - 1));
      }, 0)
    },
    duplicates: duplicates.map(group => ({
      hash: group[0].hash,
      size: group[0].size,
      lines: group[0].lines,
      extension: group[0].ext,
      count: group.length,
      files: group.map(f => ({
        path: f.relativePath,
        absolutePath: f.path
      }))
    }))
  };
  
  console.log(JSON.stringify(report, null, 2));
}

/**
 * Função principal
 */
function main() {
  const startTime = Date.now();
  
  if (!isJson) {
    console.log('🔍 Analisando repositório...\n');
  }
  
  // Scaneia diretório
  const results = scanDirectory(process.cwd());
  
  if (isVerbose && !isJson) {
    console.log(`✅ ${results.length} arquivos encontrados\n`);
  }
  
  // Agrupa por hash
  const hashMap = groupByHash(results);
  
  // Filtra duplicatas
  const duplicates = filterDuplicates(hashMap);
  
  // Ordena por tamanho (maiores primeiro)
  duplicates.sort((a, b) => b[0].size - a[0].size);
  
  // Gera relatório
  if (isJson) {
    generateJsonReport(duplicates, results);
  } else {
    generateTextReport(duplicates, results);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Análise concluída em ${elapsed}s\n`);
  }
}

// Executa
main();
