// Function to load markdown content
async function loadMarkdownContent(section) {
    try {
        let markdownText = '';

        // Special handling for different sections
        if (section === 'faq') {
            // Load both FAQ files and concatenate them (with cache-busting)
            const response1 = await fetch('content/faq.md?t=' + Date.now());
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const text1 = await response1.text();

            const response2 = await fetch('content/faq2.md?t=' + Date.now());
            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response2.status}`);
            }
            const text2 = await response2.text();

            // Concatenate both FAQ contents, removing duplicate headers
            markdownText = text1 + '\n\n' + removeHeaderFromMarkdown(text2);
        } else if (section === 'audit_checkpoints' || section === 'latest_checkpoints' || section === 'latest_technical' || section === 'latest_additional' || section === 'security_iso27001' || section === 'gov_quality_manual' || section === 'data_quality_assessment' || section === 'proposal_management' || section === 'learning_growth' || section === 'social_identity_auth' || section === 'ai_development_methodology' || section === 'cerebras_ai') {
            // Handle the audit checkpoints sections
            if (section === 'audit_checkpoints') {
                // Load the main audit checkpoints page which links to sub-sections
                const response = await fetch('content/audit_checkpoints.md'); // Main audit checkpoints page
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                markdownText = await response.text();
            } else {
                // Handle the sub-sections
                const response = await fetch(`content/${section}.md`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                markdownText = await response.text();
            }
        } else {
            // Load single file for other sections
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            markdownText = await response.text();
        }

        const htmlContent = marked.parse(markdownText);
        document.getElementById('content-container').innerHTML = `<div class="markdown-content">${htmlContent}</div>`;

        // Render Mermaid diagrams if they exist
        setTimeout(() => {
            if (typeof mermaid !== 'undefined') {
                mermaid.init(undefined, '.mermaid, [class*="mermaid"]');
            }
        }, 100);

        // Add separators to FAQ headings if this is the FAQ section
        if (section === 'faq') {
            addSeparatorsToFaq();
        }

        // Update active nav link
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
        });
        // Also remove active class from dropdown menu links
        document.querySelectorAll('.dropdown-menu a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the clicked link
        const activeLink = document.querySelector(`.nav-link[data-section="${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        } else {
            // For dropdown items, find the link in dropdown menu
            const dropdownLink = document.querySelector(`.dropdown-menu a[data-section="${section}"]`);
            if (dropdownLink) {
                dropdownLink.classList.add('active');
            }
        }

        // Set up click handlers for internal links in the audit checkpoints section
        if (section === 'audit_checkpoints') {
            setupAuditCheckpointsLinks();
        }

        // Set external links to open in a new tab
        setExternalLinksToNewTab();
    } catch (error) {
        console.error('Error loading markdown content:', error);
        document.getElementById('content-container').innerHTML = `<p>콘텐츠를 불러오는 중 오류가 발생했습니다: ${error.message}</p>`;
    }
}

// Function to set up click handlers for links in the audit checkpoints section
function setupAuditCheckpointsLinks() {
    // Wait for the content to be rendered
    setTimeout(() => {
        const links = document.querySelectorAll('#content-container a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#latest_checkpoints') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('latest_checkpoints');
                });
            } else if (href === '#latest_technical') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('latest_technical');
                });
            } else if (href === '#latest_additional') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('latest_additional');
                });
            } else if (href === '#security_iso27001') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('security_iso27001');
                });
            } else if (href === '#gov_quality_manual') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('gov_quality_manual');
                });
            } else if (href === '#data_quality_assessment') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('data_quality_assessment');
                });
            } else if (href === '#proposal_management') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('proposal_management');
                });
            } else if (href === '#social_identity_auth') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('social_identity_auth');
                });
            } else if (href === '#ai_development_methodology') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('ai_development_methodology');
                });
            } else if (href === '#cerebras_ai') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    loadMarkdownContent('cerebras_ai');
                });
            }
        });
    }, 200); // Wait a bit for content to render
}

// Function to add separators between FAQ items
function addSeparatorsToFaq() {
    const contentContainer = document.querySelector('.markdown-content');
    if (!contentContainer) return;

    // Get all h2 elements (FAQ questions)
    const h2Elements = contentContainer.querySelectorAll('h2');

    // Add a separator div before each H2 element (except the first one)
    h2Elements.forEach((h2, index) => {
        // Add a separator div before each H2 except the first one
        if (index > 0) {
            const separator = document.createElement('div');
            separator.className = 'faq-separator';
            // Insert the separator right before the H2
            h2.parentNode.insertBefore(separator, h2);
        }
    });
}

// Helper function to remove header from markdown text (to avoid duplicate headers when concatenating)
function removeHeaderFromMarkdown(text) {
    // Remove the first line if it starts with # (header)
    return text.replace(/^#[^\n]*\n/, '');
}


// Direct jump scrolling for navigation links (no smooth scrolling)
document.querySelectorAll('.nav-link, .dropdown-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const section = this.getAttribute('data-section');

        // Load the markdown content
        loadMarkdownContent(section);
    });
});

// ── 색인 기반 검색 ────────────────────────────────────────────────────────────

let searchIndex = null;   // search-index.json 캐시
let searchDebounceTimer = null;

/** search-index.json을 최초 1회만 로드 */
async function loadSearchIndex() {
    if (searchIndex) return searchIndex;
    try {
        const res = await fetch('search-index.json');
        if (!res.ok) throw new Error('색인 파일 없음');
        searchIndex = await res.json();
    } catch (e) {
        searchIndex = [];
        console.warn('search-index.json 로드 실패 — 전문 검색으로 폴백합니다.', e);
    }
    return searchIndex;
}

/**
 * 색인에서 query를 검색해 최대 maxResults개의 항목 반환.
 * term, context, preview 필드 모두 검색.
 */
function queryIndex(index, query, maxResults = 20) {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    return index
        .filter(e =>
            e.term.toLowerCase().includes(q) ||
            (e.context && e.context.toLowerCase().includes(q)) ||
            (e.preview && e.preview.toLowerCase().includes(q))
        )
        .slice(0, maxResults);
}

/** 검색어 부분을 <mark>로 강조 */
function markQuery(text, query) {
    if (!text || !query) return text || '';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

/** 결과 패널 렌더링 */
function renderResults(results, query) {
    const panel = document.getElementById('search-results');

    if (results.length === 0) {
        panel.innerHTML = `<div class="search-no-results">"${query}"에 대한 색인 결과가 없습니다.</div>`;
        panel.classList.add('visible');
        return;
    }

    const header = `<div class="search-results-header">${results.length}개 항목 발견</div>`;
    const items = results.map(e => {
        const termHtml    = markQuery(e.term, query);
        const contextHtml = e.context ? `<span class="result-context">${e.context}</span>` : '';
        const previewHtml = e.preview ? `<div class="result-preview">${e.preview}</div>` : '';
        return `
            <div class="search-result-item"
                 data-section="${e.section}"
                 data-term="${encodeURIComponent(e.term)}">
                <div class="result-term">${termHtml}</div>
                <div class="result-meta">
                    <span class="result-label">${e.label}</span>
                    ${contextHtml}
                </div>
                ${previewHtml}
            </div>`;
    }).join('');

    panel.innerHTML = header + items;
    panel.classList.add('visible');

    // 항목 클릭 → 해당 섹션 로드 + 원본 용어 하이라이트
    panel.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            const term    = decodeURIComponent(item.dataset.term);
            hideResults();
            document.getElementById('search-input').value = '';
            loadMarkdownContent(section).then(() => {
                setTimeout(() => highlightText(term), 150);
            });
        });
    });
}

function hideResults() {
    const panel = document.getElementById('search-results');
    panel.classList.remove('visible');
    panel.innerHTML = '';
}

/**
 * 색인 검색 — 결과 없을 때 기존 전문(full-text) 검색으로 폴백
 */
async function performSearch(searchTerm) {
    if (!searchTerm) return;

    const index   = await loadSearchIndex();
    const results = queryIndex(index, searchTerm);

    if (results.length > 0) {
        renderResults(results, searchTerm);
        return;
    }

    // ── 폴백: 전문 검색 (기존 방식) ────────────────────────────────────────
    hideResults();
    const sections = ['introduction', 'preparation', 'procedures', 'field_audit', 'reporting',
                      'proposal_management', 'audit_checkpoints', 'resources', 'security_iso27001',
                      'gov_quality_manual', 'data_quality_assessment', 'learning_growth', 'faq'];
    let found = false;
    for (const section of sections) {
        try {
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) continue;
            const content = await response.text();
            if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                await loadMarkdownContent(section);
                setTimeout(() => highlightText(searchTerm), 100);
                found = true;
                break;
            }
        } catch (error) {
            console.error(`Error searching in ${section}:`, error);
        }
    }
    if (!found) {
        alert(`"${searchTerm}"에 대한 검색 결과가 없습니다.`);
    }
}

// Add search functionality
document.addEventListener('DOMContentLoaded', async function() {
    const searchInput  = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 색인 미리 로드
    loadSearchIndex();

    // 기본 섹션 로드
    await loadMarkdownContent('introduction');

    // 실시간 입력 → 색인 드롭다운 (300ms 디바운스)
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        const term = searchInput.value.trim();
        if (term.length < 1) { hideResults(); return; }
        searchDebounceTimer = setTimeout(async () => {
            const index   = await loadSearchIndex();
            const results = queryIndex(index, term);
            renderResults(results, term);
        }, 300);
    });

    // Enter / 검색 버튼 → 결과 없으면 전문 검색 폴백
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchDebounceTimer);
            performSearch(searchInput.value.trim());
        }
        if (e.key === 'Escape') {
            hideResults();
        }
    });

    // 검색창 바깥 클릭 시 드롭다운 닫기
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideResults();
        }
    });
});

// Function to highlight search terms in the content
function highlightText(searchTerm) {
    if (!searchTerm) return;

    // Remove previous highlights
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentElement;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });

    // Find and highlight new matches in the content container
    const contentContainer = document.getElementById('content-container');
    highlightInElement(contentContainer, searchTerm);
}

// Helper function to highlight text in an element
function highlightInElement(element, searchTerm) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                return node.nodeValue.toLowerCase().includes(searchTerm.toLowerCase()) && 
                       !node.parentElement.classList.contains('highlight') ?
                    NodeFilter.FILTER_ACCEPT : 
                    NodeFilter.FILTER_REJECT;
            }
        }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }

    textNodes.forEach(textNode => {
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const parts = textNode.nodeValue.split(regex);
        
        if (parts.length > 1) {
            const fragment = document.createDocumentFragment();
            
            parts.forEach(part => {
                if (part.toLowerCase() === searchTerm.toLowerCase()) {
                    const highlightSpan = document.createElement('span');
                    highlightSpan.className = 'highlight';
                    highlightSpan.textContent = part;
                    fragment.appendChild(highlightSpan);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}
// Function to set external links to open in a new tab
function setExternalLinksToNewTab() {
    // Wait for content to be rendered
    setTimeout(() => {
        const links = document.querySelectorAll('#content-container a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Check if the link is external (starts with http:// or https://)
            if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                // Check if it's not our own domain to avoid opening internal anchor links in new tab
                if (!href.includes(window.location.hostname)) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });
    }, 100); // Wait a bit for content to render
}
