#!/usr/bin/env node
/**
 * generate-index.js
 * 마크다운 파일에서 검색 색인(search-index.json)을 자동 추출합니다.
 *
 * 사용법:
 *   node generate-index.js
 *
 * 출력:
 *   search-index.json — 색인 항목 배열
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');
const OUTPUT_FILE = path.join(__dirname, 'search-index.json');

// 섹션 ID → 표시 이름
const SECTION_LABELS = {
    introduction:           '소개',
    preparation:            '사전준비',
    procedures:             '감리절차',
    field_audit:            '현장감리',
    reporting:              '감리보고서',
    proposal_management:    '제안서 관리',
    audit_checkpoints:      '감리 체크포인트',
    latest_checkpoints:     '최신 감리 포인트',
    latest_technical:       '기술 감리 포인트',
    latest_additional:      '추가 감리 포인트',
    resources:              '도구 및 자료',
    security_iso27001:      'ISO27001 보안',
    gov_quality_manual:     '전자정부 품질관리',
    data_quality_assessment:'데이터 품질 진단',
    learning_growth:        '학습과성장',
    social_identity_auth:   '소셜 인증 vs 본인 인증',
    ai_development_methodology: 'AI 시대 개발방법론',
    cerebras_ai:            'Cerebras AI 서비스',
    diffusion_llm:          'Diffusion LLM',
    ai_dlc:                 'AI-DLC 개발방법론',
    faq:                    'FAQ',
    faq2:                   'FAQ',
};

const ALL_SECTIONS = Object.keys(SECTION_LABELS);

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────

/** 마크다운 문법 기호를 제거하고 공백 정리 */
function clean(text) {
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold**
        .replace(/\*([^*]+)\*/g, '$1')         // *italic*
        .replace(/`([^`]+)`/g, '$1')           // `code`
        .replace(/\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/** heading 다음 줄에서 첫 의미 있는 텍스트 단락을 최대 maxLen자로 반환 */
function getPreview(lines, headingIdx, maxLen = 90) {
    for (let i = headingIdx + 1; i < Math.min(lines.length, headingIdx + 8); i++) {
        const line = lines[i].trim();
        if (
            line.length > 10 &&
            !line.startsWith('#') &&
            !line.startsWith('```') &&
            !line.startsWith('|') &&
            !line.startsWith('graph') &&
            !line.startsWith('flowchart')
        ) {
            const cleaned = clean(line);
            return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '…' : cleaned;
        }
    }
    return '';
}

// ─── 파일 파싱 ────────────────────────────────────────────────────────────────

function processFile(section) {
    const filePath = path.join(CONTENT_DIR, `${section}.md`);
    if (!fs.existsSync(filePath)) return [];

    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const entries = [];
    let currentH1 = '';
    let currentH2 = '';

    lines.forEach((line, idx) => {
        const trimmed = line.trim();

        // ── 헤딩 추출 ──────────────────────────────────────────────────────
        const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
        if (headingMatch) {
            const level  = headingMatch[1].length;
            const term   = clean(headingMatch[2]);
            const preview = getPreview(lines, idx);

            if (level === 1) currentH1 = term;
            if (level === 2) currentH2 = term;

            entries.push({
                term,
                section,
                label:   SECTION_LABELS[section] || section,
                type:    'heading',
                context: level >= 3 ? (currentH2 || currentH1) : (level === 2 ? currentH1 : ''),
                preview,
            });
            return;
        }

        // ── 굵은 텍스트 키워드 추출 (**단어**) ────────────────────────────
        const boldMatches = [...trimmed.matchAll(/\*\*([^*]{2,40})\*\*/g)];
        boldMatches.forEach(match => {
            const term = match[1].trim();

            // 숫자만이거나 너무 짧거나 헤딩과 중복인 경우 제외
            if (term.length < 3 || /^\d+$/.test(term)) return;

            const lineClean = clean(trimmed);
            entries.push({
                term,
                section,
                label:   SECTION_LABELS[section] || section,
                type:    'keyword',
                context: currentH2 || currentH1,
                preview: lineClean.length > 90 ? lineClean.slice(0, 90) + '…' : lineClean,
            });
        });

        // ── 리스트 항목 중 중요 구문 추출 (콜론/괄호 포함 설명형) ─────────
        const listMatch = trimmed.match(/^[-*]\s+(.{10,60}[：:].+)/);
        if (listMatch) {
            const raw  = listMatch[1];
            const term = clean(raw.split(/[：:]/)[0]).trim();
            if (term.length >= 4) {
                entries.push({
                    term,
                    section,
                    label:   SECTION_LABELS[section] || section,
                    type:    'keyword',
                    context: currentH2 || currentH1,
                    preview: clean(raw).slice(0, 90),
                });
            }
        }
    });

    return entries;
}

// ─── 중복 제거 ────────────────────────────────────────────────────────────────

function deduplicate(entries) {
    const seen = new Set();
    return entries.filter(e => {
        // heading은 (term + section) 기준, keyword는 (term + section + context) 기준
        const key = e.type === 'heading'
            ? `${e.term}::${e.section}`
            : `${e.term}::${e.section}::${e.context}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// ─── 메인 ─────────────────────────────────────────────────────────────────────

const allEntries = [];

ALL_SECTIONS.forEach(section => {
    const entries = processFile(section);
    if (entries.length > 0) {
        allEntries.push(...entries);
        console.log(`✓ ${section.padEnd(28)} ${String(entries.length).padStart(3)}개 항목`);
    }
});

const result = deduplicate(allEntries);

// 타입별 통계
const headings = result.filter(e => e.type === 'heading').length;
const keywords = result.filter(e => e.type === 'keyword').length;

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');

console.log('\n────────────────────────────────────────');
console.log(`헤딩 항목  : ${headings}개`);
console.log(`키워드 항목: ${keywords}개`);
console.log(`합계       : ${result.length}개`);
console.log(`출력 파일  : search-index.json`);
