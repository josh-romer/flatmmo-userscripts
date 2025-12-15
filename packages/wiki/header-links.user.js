// ==UserScript==
// @name        FlatMMO Wiki Header Links
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.wiki/index.php/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds anchor links to headers on wiki pages
// ==/UserScript==

(function() {
    'use strict';

    // Find all headers (h1-h6)
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    headers.forEach(header => {
        // Get text content
        const text = header.textContent.trim();
        if (!text) return;

        // Check if header already has an ID, or create one
        let id = header.id;
        if (!id) {
            // Create a URL-safe ID from the text
            id = text.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
            header.id = id;
        }

        // Skip if header already has a link with this href (avoid duplicates)
        if (header.querySelector(`a[href="#${id}"]`)) return;

        // Create anchor link
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = '#';
        link.style.marginLeft = '5px';
        link.style.textDecoration = 'none';
        link.style.color = '#999';
        link.style.fontSize = '0.9em';
        link.title = `Link to ${text}`;

        // Add hover effect
        link.addEventListener('mouseenter', () => {
            link.style.color = '#0645ad';
        });
        link.addEventListener('mouseleave', () => {
            link.style.color = '#999';
        });

        // Add link to header
        header.appendChild(link);
    });
})();
