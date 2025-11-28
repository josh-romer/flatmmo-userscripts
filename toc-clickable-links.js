// ==UserScript==
// @name        FlatMMO Wiki TOC Links
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.wiki/index.php/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds copyable direct links to table of contents items
// ==/UserScript==

(function() {
    'use strict';

    // Find the table of contents
    const toc = document.querySelector('#toc');
    if (!toc) return;

    // Get all TOC links
    const tocLinks = toc.querySelectorAll('a[href^="#"]');

    tocLinks.forEach(link => {
        const hash = link.getAttribute('href');
        const fullUrl = window.location.origin + window.location.pathname + hash;

        // Create clickable link icon
        const linkIcon = document.createElement('a');
        linkIcon.textContent = '🔗';
        linkIcon.href = '#';
        linkIcon.style.marginLeft = '5px';
        linkIcon.style.textDecoration = 'none';
        linkIcon.style.fontSize = '0.8em';
        linkIcon.style.opacity = '0.5';
        linkIcon.title = 'Copy link to this section';

        // Hover effect
        linkIcon.addEventListener('mouseenter', () => {
            linkIcon.style.opacity = '1';
        });
        linkIcon.addEventListener('mouseleave', () => {
            linkIcon.style.opacity = '0.5';
        });

        // Click to copy link
        linkIcon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Copy to clipboard
            navigator.clipboard.writeText(fullUrl).then(() => {
                // Visual feedback
                const originalText = linkIcon.textContent;
                linkIcon.textContent = '✓';
                linkIcon.style.color = 'green';

                setTimeout(() => {
                    linkIcon.textContent = originalText;
                    linkIcon.style.color = '';
                }, 1000);
            }).catch(err => {
                // Fallback: show URL in a temporary tooltip
                alert('Copy this link: ' + fullUrl);
            });
        });

        // Add the link icon after the toctext span
        const toctext = link.querySelector('.toctext');
        if (toctext) {
            toctext.appendChild(linkIcon);
        }
    });
})();
