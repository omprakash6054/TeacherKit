/**
 * OptiView | Professional Image Compressor
 * Functionality: Client-side compression, comparison slider, live preview, multi-format export.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    
    const processingView = document.getElementById('processing-view');
    const resultView = document.getElementById('result-view');
    
    const originalPreview = document.getElementById('original-preview');
    const compressedPreview = document.getElementById('compressed-preview');
    const originalSizeDisplay = document.getElementById('original-size');
    const compressedSizeDisplay = document.getElementById('compressed-size');
    const reductionPctDisplay = document.getElementById('reduction-pct');
    
    const qualitySlider = document.getElementById('quality-slider');
    const qualityDisplay = document.getElementById('quality-display');
    const preserveExif = document.getElementById('preserve-exif');
    const formatPills = document.querySelectorAll('.format-pill');
    const selectAllBtn = document.getElementById('select-all-formats');
    
    const downloadBtn = document.getElementById('download-btn');
    const reCompressBtn = document.getElementById('re-compress');
    const newImageBtn = document.getElementById('new-image-btn');
    
    const comparisonSlider = document.getElementById('comparison-slider');
    const compressedLayer = document.getElementById('compressed-layer');
    const dividerLine = document.getElementById('divider-line');
    
    const errorToast = document.getElementById('error-toast');
    const errorMsg = document.getElementById('error-msg');
    const toastClose = document.getElementById('toast-close');

    // --- State ---
    let currentFile = null;
    let selectedFormats = ['image/webp'];
    let isProcessing = false;
    let compressedBlobs = {}; // Stores blobs for different formats

    // --- Initialization ---
    
    // Sync Comparison Slider
    const updateSlider = (value) => {
        const percent = value;
        compressedLayer.style.clipPath = `inset(0 0 0 ${percent}%)`;
        dividerLine.style.left = `${percent}%`;
    };

    comparisonSlider.addEventListener('input', (e) => updateSlider(e.target.value));
    updateSlider(50); // Initial

    // Quality Slider Display
    qualitySlider.addEventListener('input', (e) => {
        qualityDisplay.textContent = `${e.target.value}%`;
    });

    // Format Selection (Multi-select)
    formatPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const format = pill.dataset.format;
            if (selectedFormats.includes(format)) {
                if (selectedFormats.length > 1) {
                    selectedFormats = selectedFormats.filter(f => f !== format);
                    pill.classList.remove('active');
                }
            } else {
                selectedFormats.push(format);
                pill.classList.add('active');
            }
            updateDownloadButton();
        });
    });

    // Select All Formats
    selectAllBtn.addEventListener('click', () => {
        const allFormats = Array.from(formatPills).map(p => p.dataset.format);
        if (selectedFormats.length === allFormats.length) {
            // Deselect all except WebP
            selectedFormats = ['image/webp'];
            formatPills.forEach(p => {
                if (p.dataset.format === 'image/webp') p.classList.add('active');
                else p.classList.remove('active');
            });
        } else {
            selectedFormats = allFormats;
            formatPills.forEach(p => p.classList.add('active'));
        }
        updateDownloadButton();
    });

    // File Selection
    browseBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    // Drag & Drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Actions
    reCompressBtn.addEventListener('click', () => {
        if (currentFile) compressImage(currentFile);
    });

    newImageBtn.addEventListener('click', () => {
        resetUI();
    });

    downloadBtn.addEventListener('click', async (e) => {
        if (selectedFormats.length > 1) {
            e.preventDefault();
            downloadAsZip();
        }
    });

    toastClose.addEventListener('click', () => {
        errorToast.classList.add('hidden');
    });

    // --- Core Logic ---

    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];

        if (!file.type.startsWith('image/')) {
            showError('Invalid file type. Please upload an image.');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            showError('File is too large. Maximum size is 50MB.');
            return;
        }

        currentFile = file;
        
        // Show Original Preview
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSizeDisplay.textContent = formatBytes(file.size);
            
            dropZone.classList.add('hidden');
            processingView.classList.remove('hidden');
            
            compressImage(file);
        };
        reader.readAsDataURL(file);
    }

    async function compressImage(file) {
        if (isProcessing) return;
        isProcessing = true;
        setLoadingState(true);
        compressedBlobs = {};

        const quality = parseInt(qualitySlider.value) / 100;
        
        try {
            // We'll compress for the first selected format to show the preview
            const previewFormat = selectedFormats[0];
            const mainBlob = await runCompression(file, previewFormat, quality);
            compressedBlobs[previewFormat] = mainBlob;

            displayResult(mainBlob, previewFormat);

            // Background compress other selected formats if multiple
            if (selectedFormats.length > 1) {
                for (const format of selectedFormats) {
                    if (format !== previewFormat) {
                        compressedBlobs[format] = await runCompression(file, format, quality);
                    }
                }
            }

            setLoadingState(false);
            processingView.classList.add('hidden');
            resultView.classList.remove('hidden');
            updateDownloadButton();

        } catch (error) {
            console.error('Compression failed:', error);
            showError('Failed to compress image. Try adjusting quality settings.');
            setLoadingState(false);
            
            if (resultView.classList.contains('hidden')) {
                processingView.classList.add('hidden');
                dropZone.classList.remove('hidden');
            }
        }
    }

    async function runCompression(file, format, quality) {
        // Special handling for JPG (mime is same as JPEG)
        const mimeType = format === 'image/jpg' ? 'image/jpeg' : format;
        
        const options = {
            maxSizeMB: Math.max(0.1, (file.size / (1024 * 1024)) * quality),
            maxWidthOrHeight: 4096,
            useWebWorker: true,
            initialQuality: quality,
            preserveExif: preserveExif.checked,
            fileType: mimeType
        };

        return await imageCompression(file, options);
    }

    function displayResult(blob, format) {
        const reader = new FileReader();
        reader.onload = (e) => {
            compressedPreview.src = e.target.result;
            compressedSizeDisplay.textContent = formatBytes(blob.size);
            
            const reduction = ((currentFile.size - blob.size) / currentFile.size) * 100;
            const pct = Math.max(0, Math.round(reduction));
            reductionPctDisplay.querySelector('span').textContent = `-${pct}%`;
            
            updateDownloadLink(e.target.result, format);
        };
        reader.readAsDataURL(blob);
    }

    function updateDownloadLink(dataUrl, format) {
        downloadBtn.href = dataUrl;
        const extension = format.split('/')[1];
        const fileName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
        downloadBtn.download = `${fileName}_optimized.${extension}`;
    }

    function updateDownloadButton() {
        if (selectedFormats.length > 1) {
            downloadBtn.innerHTML = `<i class="fas fa-file-zipper"></i> Download All (${selectedFormats.length})`;
        } else {
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> Download`;
            // If we have the blob for this single format, update the link
            const format = selectedFormats[0];
            if (compressedBlobs[format]) {
                const reader = new FileReader();
                reader.onload = (e) => updateDownloadLink(e.target.result, format);
                reader.readAsDataURL(compressedBlobs[format]);
            }
        }
    }

    async function downloadAsZip() {
        if (!window.JSZip) {
            showError('ZIP library not loaded. Please refresh.');
            return;
        }

        const zip = new JSZip();
        const fileName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;

        for (const format of selectedFormats) {
            const blob = compressedBlobs[format];
            if (blob) {
                const ext = format.split('/')[1];
                zip.file(`${fileName}_optimized.${ext}`, blob);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${fileName}_optimized_bundle.zip`);
    }

    function setLoadingState(isLoading) {
        isProcessing = isLoading;
        reCompressBtn.disabled = isLoading;
        if (isLoading) {
            reCompressBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            reCompressBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Re-Apply';
        }
    }

    function resetUI() {
        currentFile = null;
        fileInput.value = '';
        dropZone.classList.remove('hidden');
        resultView.classList.add('hidden');
        processingView.classList.add('hidden');
        errorToast.classList.add('hidden');
        
        originalPreview.src = '';
        compressedPreview.src = '';
        compressedBlobs = {};
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorToast.classList.remove('hidden');
        setTimeout(() => {
            errorToast.classList.add('hidden');
        }, 5000);
    }

    function formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
});

