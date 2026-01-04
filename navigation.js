// Smooth page transitions without full reload
(function() {
    'use strict';

    // Cache for loaded pages
    const pageCache = new Map();
    
    // Get the main content area
    const main = document.querySelector('main');
    const nav = document.querySelector('nav');
    
    if (!main || !nav) return;

    // Handle navigation
    function navigate(url, pushState = true) {
        // Normalize URL
        if (url === '/' || url === '/index.html') {
            url = '/';
        }
        
        // Don't navigate if already on this page
        const currentPath = window.location.pathname === '/' ? '/' : window.location.pathname;
        if (currentPath === url) return;

        // Smooth fade out
        main.style.opacity = '0';
        main.style.transition = 'opacity 0.15s ease-out';

        // Check cache first
        if (pageCache.has(url)) {
            setTimeout(() => {
                updatePage(pageCache.get(url), url, pushState);
            }, 100);
            return;
        }

        // Try clean URL first, then .html as fallback
        const tryUrl = url.endsWith('.html') ? url : (url === '/' ? '/index.html' : url + '.html');
        
        // Fetch the new page
        fetch(tryUrl)
            .then(response => {
                if (!response.ok) {
                    // Try without .html
                    return fetch(url);
                }
                return response;
            })
            .then(response => response.text())
            .then(html => {
                // Parse the HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Extract main content
                const newMain = doc.querySelector('main');
                if (newMain) {
                    const content = newMain.innerHTML;
                    pageCache.set(url, content);
                    setTimeout(() => {
                        updatePage(content, url, pushState);
                    }, 100);
                } else {
                    // Fallback to normal navigation
                    window.location.href = url;
                }
            })
            .catch(error => {
                console.error('Navigation error:', error);
                // Fallback to normal navigation
                window.location.href = url;
            });
    }

    function updatePage(content, url, pushState) {
        // Update content
        main.innerHTML = content;
        
        // Update URL without reload
        if (pushState) {
            window.history.pushState({ url: url }, '', url);
        }
        
        // Update page title from the fetched page
        fetch(url.endsWith('.html') ? url : (url === '/' ? '/index.html' : url + '.html'))
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const title = doc.querySelector('title');
                if (title) {
                    document.title = title.textContent;
                }
            })
            .catch(() => {
                // If fetch fails, try to get title from current page
                const title = document.querySelector('title');
                if (title) {
                    // Keep current title
                }
            });
        
        // Smooth fade in
        setTimeout(() => {
            main.style.opacity = '1';
            main.style.transition = 'opacity 0.2s ease-in';
        }, 50);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Re-initialize any scripts if needed
        initializePage();
    }

    function initializePage() {
        // Re-highlight active nav link
        const currentPath = window.location.pathname;
        nav.querySelectorAll('a').forEach(link => {
            const linkPath = new URL(link.href, window.location.origin).pathname;
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '/index.html') ||
                (currentPath === '/index.html' && linkPath === '/')) {
                link.style.color = '#000';
            } else {
                link.style.color = '';
            }
        });
    }

    // Intercept all internal link clicks
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Only handle internal links
        if (href && 
            !href.startsWith('http') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('#') &&
            !link.hasAttribute('target')) {
            
            e.preventDefault();
            const url = new URL(href, window.location.origin).pathname;
            navigate(url, true);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.url) {
            navigate(e.state.url, false);
        } else {
            // Fallback: reload the page
            window.location.reload();
        }
    });

    // Cache current page on load
    if (main) {
        pageCache.set(window.location.pathname, main.innerHTML);
    }

    // Initialize active link highlighting
    initializePage();
})();

