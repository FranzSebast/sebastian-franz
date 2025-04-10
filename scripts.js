// BibTeX Integration
document.addEventListener('DOMContentLoaded', function() {
    // Prüfen, ob die BibTeX-Bibliothek geladen wurde
    if (typeof BibTex !== 'undefined') {
        // Laden der BibTeX-Datei
        loadBibTexFile();
    } else {
        console.log('BibTeX-Bibliothek wurde nicht geladen. Manuelle Publikationsliste wird angezeigt.');
    }

    // Smooth Scrolling für Navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Funktion zum Laden der BibTeX-Datei
function loadBibTexFile() {
    fetch('publications.bib')
        .then(response => {
            if (!response.ok) {
                throw new Error('BibTeX-Datei konnte nicht geladen werden');
            }
            return response.text();
        })
        .then(bibtexContent => {
            processBibTex(bibtexContent);
        })
        .catch(error => {
            console.error('Fehler beim Laden der BibTeX-Datei:', error);
            // Falls die BibTeX-Datei nicht geladen werden kann, die manuelle Liste anzeigen
            document.getElementById('manual-publications').style.display = 'block';
        });
}

// Funktion zur Verarbeitung des BibTeX-Inhalts
function processBibTex(bibtexContent) {
    try {
        // Hier wird der BibTeX-Parser aufgerufen
        // Dies ist eine Beispielimplementierung und kann je nach verwendeter Bibliothek variieren
        const bibtex = new BibTex();
        bibtex.content = bibtexContent;
        bibtex.parse();
        
        // Container für die Ausgabe
        const outputContainer = document.getElementById('bibtex-output');
        outputContainer.innerHTML = '';
        
        // Publikationen nach Jahr sortieren (neueste zuerst)
        const sortedEntries = bibtex.entries.sort((a, b) => {
            return parseInt(b.fields.year) - parseInt(a.fields.year);
        });
        
        // Generieren der HTML-Darstellung für jede Publikation
        sortedEntries.forEach(entry => {
            const pubElement = document.createElement('div');
            pubElement.className = 'bibtex_entry';
            
            // Titel
            const titleElement = document.createElement('div');
            titleElement.className = 'bibtex_title';
            titleElement.textContent = entry.fields.title.replace(/[{}]/g, '');
            pubElement.appendChild(titleElement);
            
            // Autoren
            const authorElement = document.createElement('div');
            authorElement.className = 'bibtex_author';
            authorElement.textContent = formatAuthors(entry.fields.author);
            pubElement.appendChild(authorElement);
            
            // Journal/Conference
            if (entry.fields.journal || entry.fields.booktitle) {
                const venueElement = document.createElement('div');
                venueElement.className = 'bibtex_venue';
                venueElement.textContent = entry.fields.journal 
                    ? entry.fields.journal.replace(/[{}]/g, '') 
                    : entry.fields.booktitle.replace(/[{}]/g, '');
                
                // Volume, Number, Pages
                if (entry.fields.volume) {
                    venueElement.textContent += ', ' + entry.fields.volume;
                    if (entry.fields.number) {
                        venueElement.textContent += '(' + entry.fields.number + ')';
                    }
                }
                if (entry.fields.pages) {
                    venueElement.textContent += ', ' + entry.fields.pages.replace('--', '–');
                }
                pubElement.appendChild(venueElement);
            }
            
            // Jahr
            const yearElement = document.createElement('div');
            yearElement.className = 'bibtex_year';
            yearElement.textContent = entry.fields.year;
            pubElement.appendChild(yearElement);
            
            // DOI oder URL
            if (entry.fields.doi || entry.fields.url) {
                const linkElement = document.createElement('div');
                linkElement.className = 'bibtex_link';
                
                const link = document.createElement('a');
                link.href = entry.fields.doi 
                    ? 'https://doi.org/' + entry.fields.doi 
                    : entry.fields.url;
                link.target = '_blank';
                link.textContent = entry.fields.doi 
                    ? 'https://doi.org/' + entry.fields.doi 
                    : 'Link zur Publikation';
                
                linkElement.appendChild(link);
                pubElement.appendChild(linkElement);
            }
            
            outputContainer.appendChild(pubElement);
        });
        
        // Ausblenden der manuellen Liste, wenn BibTeX erfolgreich verarbeitet wurde
        document.getElementById('manual-publications').style.display = 'none';
        
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der BibTeX-Datei:', error);
        // Bei Fehler die manuelle Liste anzeigen
        document.getElementById('manual-publications').style.display = 'block';
    }
}

// Hilfsfunktion zur Formatierung der Autorenliste
function formatAuthors(authorsString) {
    if (!authorsString) return '';
    
    // Entfernen von BibTeX-Formatierungen wie {} und and
    let authors = authorsString.replace(/[{}]/g, '').split(' and ');
    
    // Formatierung der einzelnen Autoren
    authors = authors.map(author => {
        const parts = author.split(',');
        if (parts.length === 2) {
            // Nachname, Vorname -> Vorname Nachname
            return parts[1].trim() + ' ' + parts[0].trim();
        }
        return author;
    });
    
    // Zusammenfügen der Autorenliste
    if (authors.length === 1) {
        return authors[0];
    } else if (authors.length === 2) {
        return authors[0] + ' & ' + authors[1];
    } else {
        return authors.slice(0, -1).join(', ') + ' & ' + authors[authors.length - 1];
    }
}

// ORCID API Integration
function loadOrcidPublications(orcidId) {
    // Diese Funktion würde ORCID API verwenden, um Publikationen zu laden
    // Dies ist ein Platzhalter für eine tatsächliche Implementierung
    const apiUrl = `https://pub.orcid.org/v3.0/${orcidId}/works`;
    
    fetch(apiUrl, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Verarbeitung der ORCID-Daten
        console.log('ORCID-Daten geladen:', data);
        // Hier würde die Umwandlung in HTML-Elemente erfolgen
    })
    .catch(error => {
        console.error('Fehler beim Laden der ORCID-Daten:', error);
    });
}
