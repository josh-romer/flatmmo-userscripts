// ==UserScript==
// @name        FlatMMO Wiki Image Links Modal
// @namespace   Violentmonkey Scripts
// @match       https://flatmmo.wiki/index.php/*
// @grant       none
// @version     1.0
// @author      -
// @description Shows links to pages that use an image in a modal on hover
// ==/UserScript==

(function() {
    'use strict';

    // Cache for fetched link data
    const linkCache = {};
    let hideTimeout = null;

    // Get current page path for comparison
    const currentPath = window.location.pathname;

    // Create modal element
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #a2a9b1';
    modal.style.borderRadius = '4px';
    modal.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    modal.style.padding = '10px';
    modal.style.maxWidth = '300px';
    modal.style.maxHeight = '400px';
    modal.style.overflowY = 'auto';
    modal.style.zIndex = '10000';
    modal.style.display = 'none';
    modal.style.fontSize = '14px';
    document.body.appendChild(modal);

    // Find all image links (both file description pages and inline file links)
    const fileDescriptionLinks = document.querySelectorAll('a.mw-file-description');
    const inlineFileLinks = document.querySelectorAll('span[typeof="mw:File"] a');
    const imageLinks = [...fileDescriptionLinks, ...inlineFileLinks];

    imageLinks.forEach(link => {
        const img = link.querySelector('img.mw-file-element');
        if (!img) return;

        // For inline file links, get the image name from the src attribute
        let fileUrl = link.href;
        let imageName;

        // Check if this is a file description link or an inline link
        if (link.classList.contains('mw-file-description')) {
            // File description link - use href
            const urlParts = fileUrl.split('/');
            const filePageName = urlParts[urlParts.length - 1];
            imageName = decodeURIComponent(filePageName.replace('File:', ''));
        } else {
            // Inline file link - extract from img src
            const imgSrc = img.getAttribute('src') || img.getAttribute('srcset')?.split(' ')[0];
            if (!imgSrc) return;

            // Extract filename from path like "/images/thumb/7/7e/Woodchips.png/40px-Woodchips.png"
            const srcParts = imgSrc.split('/');
            // Get the actual filename (not the thumbnail version)
            const filename = srcParts.find(part => part.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i) && !part.includes('px-'));
            if (!filename) return;

            imageName = decodeURIComponent(filename);
            // Construct the file page URL
            fileUrl = window.location.origin + '/index.php/File:' + imageName;
        }

        // Set ID on the link for anchor navigation
        const anchor = imageName.replace(/\s+/g, '_').replace(/\.[^.]+$/, '');
        link.id = 'File:' + anchor;

        // Show modal on hover
        link.addEventListener('mouseenter', async (e) => {
            // Clear any pending hide timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            modal.style.display = 'block';
            modal.innerHTML = '<div style="color: #666;">Loading...</div>';

            // Position modal near cursor
            const rect = link.getBoundingClientRect();
            modal.style.left = (rect.right + 10) + 'px';
            modal.style.top = rect.top + 'px';

            // Fetch links if not cached
            if (!linkCache[fileUrl]) {
                try {
                    const response = await fetch(fileUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const linksContainer = doc.querySelector('ul.mw-imagepage-linkstoimage');

                    if (linksContainer) {
                        // Clone the container to modify it
                        const filteredContainer = linksContainer.cloneNode(true);

                        // Get the image filename from the URL
                        const urlParts = fileUrl.split('/');
                        const filePageName = urlParts[urlParts.length - 1];
                        // Extract just the filename (e.g., "File:Example.png" -> "Example.png")
                        const imageName = decodeURIComponent(filePageName.replace('File:', ''));

                        // Remove links that point to the current page and add anchors
                        const links = filteredContainer.querySelectorAll('a');
                        links.forEach(a => {
                            if (a.getAttribute('href') === currentPath) {
                                a.parentElement.remove();
                            } else {
                                // Add anchor to link to the specific image on the page
                                const currentHref = a.getAttribute('href');
                                // Create anchor from filename (replace spaces and special chars)
                                const anchor = imageName.replace(/\s+/g, '_').replace(/\.[^.]+$/, '');
                                a.setAttribute('href', currentHref + '#File:' + anchor);
                            }
                        });

                        // Check if there are any links left
                        if (filteredContainer.querySelectorAll('li').length > 0) {
                            linkCache[fileUrl] = filteredContainer.outerHTML;
                        } else {
                            linkCache[fileUrl] = '<div style="color: #666;">No other pages use this file</div>';
                        }
                    } else {
                        linkCache[fileUrl] = '<div style="color: #666;">No links found</div>';
                    }
                } catch (error) {
                    linkCache[fileUrl] = '<div style="color: #d33;">Error loading links</div>';
                }
            }

            // Display cached links
            modal.innerHTML = '<div style="font-weight: bold; margin-bottom: 8px; color: #202122;">Pages using this file:</div>' + linkCache[fileUrl];
        });

        link.addEventListener('mouseleave', () => {
            // Delay hiding the modal to give time to move mouse to it
            hideTimeout = setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
    });

    // Keep modal open when hovering over it
    modal.addEventListener('mouseenter', () => {
        // Clear any pending hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    });

    modal.addEventListener('mouseleave', () => {
        // Hide modal when leaving it
        modal.style.display = 'none';
    });
})();
