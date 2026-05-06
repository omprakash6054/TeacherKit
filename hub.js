/**
 * Education Tool Hub | Tool Grid & Filtering
 * British English used: Organisation, Humour, Randomiser, Standardised.
 */

const tools = [
    // Quick Content Creation
    {
        name: 'Image Resizer/Compressor',
        description: 'Fit visuals into slides. Process images locally with zero quality loss.',
        category: 'Quick Content Creation',
        icon: 'fa-compress-alt',
        link: 'compressor.html'
    },
    {
        name: 'PDF Content Editor',
        description: 'Update lesson plans or certificates. Search and replace text inside PDFs instantly.',
        category: 'Quick Content Creation',
        icon: 'fa-file-signature',
        link: 'pdf-editor.html'
    },
    {
        name: 'PDF Merger/Splitter',
        description: 'Combine handouts fast. Split large documents into manageable sections.',
        category: 'Quick Content Creation',
        icon: 'fa-layer-group',
        link: 'pdf-tool.html'
    },
    {
        name: 'PDF Compressor',
        description: 'Reduce file size without losing quality. Optimise PDFs for sharing.',
        category: 'Quick Content Creation',
        icon: 'fa-file-pdf',
        link: 'pdf-compressor.html'
    },
    {
        name: 'QR Code Generator',
        description: 'Link to resources instantly. Create custom QR codes for your classroom.',
        category: 'Quick Content Creation',
        icon: 'fa-qrcode',
        link: 'qr-generator.html'
    },
    {
        name: 'Meme Generator',
        description: 'Engage with humour. Create educational memes to spark student interest.',
        category: 'Quick Content Creation',
        icon: 'fa-laugh-wink',
        link: 'meme-generator.html'
    },
    {
        name: 'Word Counter',
        description: 'Check assignment lengths. Instant statistics for any block of text.',
        category: 'Quick Content Creation',
        icon: 'fa-calculator',
        link: 'word-counter.html'
    },
    {
        name: 'Certificate Maker',
        description: 'Recognise achievement. Create professional certificates for students in seconds.',
        category: 'Quick Content Creation',
        icon: 'fa-award',
        link: 'certificate-maker.html'
    },

    // Assessment & Grading
    {
        name: 'Random Name Picker',
        description: 'Call on students fairly. Ensure equal participation with random selection.',
        category: 'Assessment & Grading',
        icon: 'fa-user-tag',
        link: 'name-picker.html'
    },
    {
        name: 'Grade Calculator',
        description: 'Instant percentage math. Quickly determine grades from raw scores.',
        category: 'Assessment & Grading',
        icon: 'fa-percentage',
        link: 'grade-calculator.html'
    },
    {
        name: 'Timer/Stopwatch',
        description: 'Manage transitions. Keep your lessons on track with visual time cues.',
        category: 'Assessment & Grading',
        icon: 'fa-stopwatch',
        link: 'timer.html'
    },
    {
        name: 'Multiple Choice Generator',
        description: 'Quick quiz maker. Generate questions and answers in seconds.',
        category: 'Assessment & Grading',
        icon: 'fa-list-check',
        link: 'quiz-generator.html'
    },
    {
        name: 'Rubric Generator',
        description: 'Standardised grading. Create clear assessment criteria for any task.',
        category: 'Assessment & Grading',
        icon: 'fa-table',
        link: 'rubric-generator.html'
    },
    {
        name: 'Flashcard Generator',
        description: 'Interactive revision. Create and flip digital cards for study sessions.',
        category: 'Assessment & Grading',
        icon: 'fa-clone',
        link: 'flashcard-generator.html'
    },

    // Planning & Organisation
    {
        name: 'Lesson Plan Template',
        description: 'Fill-in-the-blank format. Structured templates for effective planning.',
        category: 'Planning & Organisation',
        icon: 'fa-chalkboard-user',
        link: 'lesson-plan.html'
    },
    {
        name: 'Seating Chart Generator',
        description: 'Visual classroom maps. Design the perfect layout for student success.',
        category: 'Planning & Organisation',
        icon: 'fa-chair',
        link: 'seating-chart.html'
    },
    {
        name: 'Group Maker',
        description: 'Random team assignments. Balance your groups with ease.',
        category: 'Planning & Organisation',
        icon: 'fa-users-rectangle',
        link: 'group-maker.html'
    },
    {
        name: 'Schedule Formatter',
        description: 'Clean class timetable. Professional looking schedules for your week.',
        category: 'Planning & Organisation',
        icon: 'fa-calendar-days',
        link: 'schedule-formatter.html'
    },
    {
        name: 'Objective Randomiser',
        description: 'Standards alignment. Mix and match objectives for diverse outcomes.',
        category: 'Planning & Organisation',
        icon: 'fa-shuffle',
        link: 'objective-randomiser.html'
    },

    // Student Engagement
    {
        name: 'Emoji Reaction Picker',
        description: 'Quick thumbs up/down. Gauge student sentiment instantly with icons.',
        category: 'Student Engagement',
        icon: 'fa-icons',
        link: 'emoji-reactions.html'
    },
    {
        name: 'Dice Roller',
        description: 'Math games, random selection. Virtual dice for interactive activities.',
        category: 'Student Engagement',
        icon: 'fa-dice',
        link: 'dice-roller.html'
    },
    {
        name: 'Coin Flipper',
        description: 'Decision making. A simple way to resolve choices in the classroom.',
        category: 'Student Engagement',
        icon: 'fa-coins',
        link: 'coin-flipper.html'
    },
    {
        name: 'Password Generator',
        description: 'Secure student logins. Create safe, memorable passwords for users.',
        category: 'Student Engagement',
        icon: 'fa-key',
        link: 'password-generator.html'
    },
    {
        name: 'Colour Picker',
        description: 'Visual aid creation. Select the perfect palette for your presentations.',
        category: 'Student Engagement',
        icon: 'fa-eye-dropper',
        link: 'colour-picker.html'
    },
    {
        name: 'Classroom Noise Meter',
        description: 'Manage volume. Visual feedback to help students maintain focus.',
        category: 'Student Engagement',
        icon: 'fa-volume-high',
        link: 'noise-meter.html'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');
    const filterPills = document.querySelectorAll('.filter-pill');

    let activeCategory = 'All';
    let searchQuery = '';

    function renderTools() {
        const filteredTools = tools.filter(tool => {
            const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
            const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredTools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No tools found</h3>
                    <p>Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            `;
            return;
        }

        toolsGrid.innerHTML = filteredTools.map(tool => `
            <a href="${tool.link}" class="tool-card-hub">
                <div class="tool-icon-wrap">
                    <i class="fas ${tool.icon}"></i>
                </div>
                <div class="tool-info">
                    <span class="tool-tag">${tool.category}</span>
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                </div>
            </a>
        `).join('');
    }

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTools();
    });

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.dataset.category;
            renderTools();
        });
    });

    // Initial render
    renderTools();
});
