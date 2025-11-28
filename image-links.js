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

    // Cache for excluded page links from navbox
    let excludedPageLinks = new Set();

    // Fetch and cache all page links from the navbox template
    async function getExcludedPageLinks() {
        if (excludedPageLinks.size != 0) {
            return excludedPageLinks;
        }

        excludedPageLinks = new Set(['/index.php/Template:Navbox_Enemies']);

        try {
            const response = await fetch('/index.php/Template:Navbox_Enemies');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Find all links ONLY within mw:File spans in the flat-navbox table
            const navboxTable = doc.querySelector('table.flat-navbox');
            if (navboxTable) {
                const fileSpans = navboxTable.querySelectorAll('span[typeof="mw:File"]');
                fileSpans.forEach(span => {
                    const link = span.querySelector('a[href^="/index.php/"]');
                    if (link) {
                        const href = link.getAttribute('href');
                        if (href && !href.includes('action=edit') && !href.includes('redlink=1')) {
                            excludedPageLinks.add(href);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching navbox template:', error);
        }

        return excludedPageLinks;
    }

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

    // Find all image links
    const imageLinks = document.querySelectorAll('a:has(> .mw-file-element)');

    imageLinks.forEach(link => {

        const fileUrl = (() => {
            if(link.href.search("File") !== -1) {
                return link.href;
            }
            else {
             const filename = link.firstChild.src.split("/").pop().split("-").pop();
             return `/index.php/File:${filename}`;
            }
        } )();

        // Set ID on the link for anchor navigation
        const urlParts = fileUrl.split("/");
        const filePageName = urlParts[urlParts.length - 1];
        const imageName = decodeURIComponent(filePageName.replace('File:', ''));
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
                    // Get excluded pages from navbox
                    const excludedPages = await getExcludedPageLinks();

                    const response = await fetch(fileUrl);
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const linksContainer = doc.querySelector('ul.mw-imagepage-linkstoimage');

                    if (linksContainer) {

                        // Get the image filename from the URL
                        const urlParts = fileUrl.split('/');
                        const filePageName = urlParts[urlParts.length - 1];
                        // Extract just the filename (e.g., "File:Example.png" -> "Example.png")
                        const imageName = decodeURIComponent(filePageName.replace('File:', ''));

                        // Create the expected page path from image name
                        const imageBaseName = imageName.replace(/\.[^.]+$/, '').replace(/_/g, '_');
                        const expectedPagePath = '/index.php/' + imageBaseName;

                        // Clone the container to modify it
                        const allLinks = Array.from(linksContainer.querySelectorAll('a'));

                        // Check if the navbox template is in the file usage list
                        const navboxInUsageList = allLinks.some(a =>
                            a.getAttribute('href') === '/index.php/Template:Navbox_Enemies'
                        );
                        // TODO better fitering
                        const filteredLinks = allLinks.filter(a => {
                          const shortHref = a.getAttribute("href");
                          if (document.URL === a.href) {
                            return false;
                          }
                          if (navboxInUsageList && excludedPageLinks.has(shortHref)) {
                              return false
                          }
                          return true
                        });

                      const linkToUL = (a) => `<li><a href="${a.href}">${a.title}</a></li>`
                        // Check if there are any links left
                        if (filteredLinks.length > 0) {
                            linkCache[fileUrl] = `<ul>${filteredLinks.map(linkToUL).join("")}</ul>`
                        } else {
                            linkCache[fileUrl] = '<div style="color: #666;">No other pages use this file</div>';
                        }
                    } else {
                        linkCache[fileUrl] = '<div style="color: #666;">No links found</div>';
                    }
                } catch (error) {
                  console.log(error)
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
