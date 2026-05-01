/**
 * Word Counter Tool Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('word-input');
    const wordCount = document.getElementById('word-count');
    const charCount = document.getElementById('char-count');
    const sentenceCount = document.getElementById('sentence-count');
    const readingTime = document.getElementById('reading-time');

    textArea.addEventListener('input', () => {
        const text = textArea.value.trim();
        
        // Word count
        const words = text ? text.split(/\s+/).length : 0;
        wordCount.textContent = words;

        // Character count
        charCount.textContent = text.length;

        // Sentence count
        const sentences = text ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
        sentenceCount.textContent = sentences;

        // Reading time (average 200 words per minute)
        const time = Math.ceil(words / 200);
        readingTime.textContent = time + ' min' + (time !== 1 ? 's' : '');
    });
});
