// Function to load markdown content
async function loadMarkdownContent(section) {
    try {
        let markdownText = '';

        // Special handling for different sections
        if (section === 'faq') {
            // Load both FAQ files and concatenate them
            const response1 = await fetch('content/faq.md');
            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }
            const text1 = await response1.text();

            const response2 = await fetch('content/faq2.md');
            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response2.status}`);
            }
            const text2 = await response2.text();

            // Concatenate both FAQ contents, removing duplicate headers
            markdownText = text1 + '\n\n' + removeHeaderFromMarkdown(text2);
        } else if (section === 'audit_checkpoints' || section === 'latest_checkpoints' || section === 'latest_technical' || section === 'latest_additional' || section === 'security_iso27001' || section === 'gov_quality_manual' || section === 'data_quality_assessment') {
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
        document.querySelector(`.nav-link[data-section="${section}"]`)?.classList.add('active');

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
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const section = this.getAttribute('data-section');
        
        // Load the markdown content
        loadMarkdownContent(section);
    });
});

// Function to perform search
async function performSearch(searchTerm) {
    if (!searchTerm) {
        alert('검색어를 입력해주세요.');
        return;
    }

    // Search in all markdown files including the new field_audit section
    const sections = ['introduction', 'preparation', 'procedures', 'field_audit', 'reporting', 'audit_checkpoints', 'resources', 'security_iso27001', 'gov_quality_manual', 'data_quality_assessment'];
    let found = false;

    for (const section of sections) {
        try {
            const response = await fetch(`content/${section}.md`);
            if (!response.ok) continue;

            const content = await response.text();

            if (content.toLowerCase().includes(searchTerm.toLowerCase())) {
                // Load the section where the term was found
                await loadMarkdownContent(section);

                // Highlight the search term after content loads
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
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Load the default section (introduction) when page loads
    await loadMarkdownContent('introduction');

    // Event listeners for search
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value.trim());
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
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
