(() => {
    'use strict';

    // === DOM refs ===
    const inputEl = document.getElementById('command-input');
    const cursorBlock = document.getElementById('cursor-block');
    const terminalBody = document.getElementById('terminal-body');
    const terminalHeader = document.getElementById('terminal-header');
    const promptEl = document.getElementById('prompt');
    const detailBody = document.getElementById('detail-body');
    const navBack = document.getElementById('nav-back');
    const navHome = document.getElementById('nav-home');

    // === Shared Data ===
    const PROJECTS = [
        {
            name: 'lisco-portfolio',
            desc: 'This interactive terminal-style portfolio site.',
            tech: ['HTML', 'CSS', 'JavaScript'],
        },
        {
            name: 'Smart City Web Portal',
            desc: 'OSU capstone — proof-of-concept portal for a Smart City built on the Salesforce platform. Served as Scrum Master and UI developer.',
            tech: ['Salesforce', 'JavaScript', 'Agile/Scrum'],
        },
    ];

    const SKILL_CATEGORIES = [
        { title: 'Languages', items: ['C#', 'JavaScript', 'TypeScript', 'Python', 'Java', 'SQL', 'HTML', 'CSS'] },
        { title: 'Frameworks', items: ['.NET / EF Core', 'React', 'GraphQL'] },
        { title: 'Infrastructure', items: ['Azure', 'AWS', 'SQL Server', 'RabbitMQ'] },
        { title: 'AI Tools', items: ['ChatGPT', 'GitHub Copilot', 'Claude', 'Gemini', 'Cursor'] },
        { title: 'Practices', items: ['Git', 'Agile', 'Scrum'] },
    ];

    // === State ===
    let bootDone = false;
    let isTyping = false;
    let viewHistory = [];       // stack of view names (e.g. 'welcome', 'about', 'projects')
    let currentView = null;     // current view name
    let isNavigating = false;   // true when back/home triggers a view change

    // === Prompt text (responsive) ===
    const PROMPT_FULL = 'visitor@josh-lisco:~$';
    const PROMPT_SHORT = '$';

    function getPrompt() {
        return window.innerWidth <= 600 ? PROMPT_SHORT : PROMPT_FULL;
    }

    function updatePrompt() {
        promptEl.textContent = getPrompt();
    }

    // === Detail panel helpers ===
    function setDetailView(contentHtml) {
        detailBody.innerHTML = contentHtml;
        detailBody.scrollTop = 0;
    }

    /** Navigate to a named view, pushing current onto history */
    function navigateTo(viewName) {
        if (!isNavigating && currentView) {
            viewHistory.push(currentView);
        }
        currentView = viewName;
        updateNavButtons();
    }

    function updateNavButtons() {
        navBack.disabled = viewHistory.length === 0;
        navHome.disabled = currentView === 'welcome';
    }

    /** Render a view by name (no navigation side effects) */
    function renderView(name) {
        const views = {
            welcome:    () => setDetailView(welcomeCardHtml()),
            about:      () => setDetailView(detailAbout()),
            experience: () => setDetailView(detailExperience()),
            projects:   () => setDetailView(detailProjects()),
            skills:     () => setDetailView(detailSkills()),
            contact:    () => setDetailView(detailContact()),
            links:      () => setDetailView(detailLinks()),
        };
        if (views[name]) views[name]();
    }

    // === Helpers ===
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /** Create a clickable command span */
    function cmdLink(name) {
        return `<span class="cmd-link" role="button" tabindex="0" data-cmd="${escapeHtml(name)}">${escapeHtml(name)}</span>`;
    }

    /** Create an external link */
    function extLink(url, label) {
        return `<a class="ext-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    }

    /** Calculate age from birthdate */
    function getAge() {
        const birth = new Date(1997, 11, 25); // Dec 25, 1997
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }

    /** Create a detail-panel pill */
    function pill(text) {
        return `<span class="pill">${escapeHtml(text)}</span>`;
    }

    // === Detail Panel Content Builders ===
    function welcomeCardHtml() {
        return `
            <div class="detail-card welcome-card">
                <div class="welcome-name">Josh Lisco</div>
                <div class="welcome-title">Senior Software Engineer at IGS Energy Solar</div>
                <hr class="card-separator">
                <p>Welcome to my interactive portfolio. Click a command below or type one in the terminal.</p>
                <div class="welcome-commands">
                    ${cmdLink('about')} — Who I am<br>
                    ${cmdLink('experience')} — Where I've worked<br>
                    ${cmdLink('projects')} — What I've built<br>
                    ${cmdLink('skills')} — Technologies I use<br>
                    ${cmdLink('contact')} — Get in touch<br>
                    ${cmdLink('links')} — Quick link-in-bio list
                </div>
            </div>
        `;
    }

    function showWelcomeCard() {
        navigateTo('welcome');
        setDetailView(welcomeCardHtml());
    }

    function detailAbout() {
        return `
            <div class="detail-card">
                <h2>About Me</h2>
                <hr class="card-separator">
                <p>I'm Josh Lisco — a ${getAge()}-year-old Japanese American software engineer based in Columbus, Ohio. I build full-stack applications, focused on clean code and practical solutions.</p>
                <div class="about-facts">
                    <div class="about-fact"><span class="about-label">Position</span> Senior Software Engineer at IGS Energy Solar</div>
                    <div class="about-fact"><span class="about-label">Education</span> BS in Computer Science &amp; Engineering, The Ohio State University (2020)</div>
                    <div class="about-fact"><span class="about-label">Age</span> ${getAge()}</div>
                    <div class="about-fact"><span class="about-label">Heritage</span> Japanese American</div>
                    <div class="about-fact"><span class="about-label">Location</span> Columbus, Ohio</div>
                </div>
            </div>
        `;
    }

    function detailProjects() {
        const cards = PROJECTS.map(p => `
            <div class="project-card">
                <h3>${escapeHtml(p.name)}</h3>
                <p>${escapeHtml(p.desc)}</p>
                <div class="pills">${p.tech.map(pill).join('')}</div>
            </div>
        `).join('');
        return `
            <div class="detail-card">
                <h2>Projects</h2>
                <hr class="card-separator">
                ${cards}
            </div>
        `;
    }

    function detailSkills() {
        const groups = SKILL_CATEGORIES.map(cat => `
            <div class="skill-group">
                <h3>${escapeHtml(cat.title)}</h3>
                <div class="pills">${cat.items.map(pill).join('')}</div>
            </div>
        `).join('');
        return `
            <div class="detail-card">
                <h2>Skills &amp; Technologies</h2>
                <hr class="card-separator">
                <div class="skills-grid">${groups}</div>
            </div>
        `;
    }

    function detailContact() {
        return `
            <div class="detail-card">
                <h2>Contact</h2>
                <hr class="card-separator">
                <div class="contact-item">
                    <span class="contact-label">Phone</span>
                    ${extLink('tel:+16143594430', '(614) 359-4430')}
                </div>
                <div class="contact-item">
                    <span class="contact-label">Email</span>
                    ${extLink('mailto:josh.y.lisco@gmail.com', 'josh.y.lisco@gmail.com')}
                </div>
                <div class="contact-item">
                    <span class="contact-label">LinkedIn</span>
                    ${extLink('https://www.linkedin.com/in/josh-lisco-b87a19164', 'linkedin.com/in/josh-lisco')}
                </div>
            </div>
        `;
    }

    function detailLinks() {
        return `
            <div class="detail-card">
                <h2>Links</h2>
                <hr class="card-separator">
                <div class="links-list">
                    ${extLink('https://www.linkedin.com/in/josh-lisco-b87a19164', 'LinkedIn')}
                    ${extLink('mailto:josh.y.lisco@gmail.com', 'Email')}
                </div>
            </div>
        `;
    }

    function detailExperience() {
        const jobs = [
            {
                company: 'IGS Energy',
                location: 'Columbus, Ohio',
                tenure: '5+ years',
                roles: [
                    { title: 'Senior Software Engineer', period: 'Jul 2023 — Present' },
                    { title: 'Software Engineer', period: 'Jul 2021 — Jun 2023' },
                    { title: 'Software Engineer', period: 'Jun 2020 — Jun 2021' },
                ],
                details: [
                    'Built and maintained production applications for account management, billing configuration, and payment processing.',
                    'Developed tools for monitoring and analyzing energy usage and cost trends over time.',
                    'Worked across the full stack on customer-facing platforms managing energy services and account settings.',
                ],
            },
            {
                company: 'NetJets',
                location: 'Columbus, Ohio',
                tenure: '2 years',
                roles: [
                    { title: 'IT Software Development Intern', period: 'May 2018 — May 2020' },
                ],
                details: [
                    'Developed web applications for international flight operations and flight schedule optimization.',
                    'Built React/Redux components and AWS Lambdas for front-end and back-end services.',
                ],
            },
        ];

        const timeline = jobs.map(job => `
            <div class="exp-entry">
                <div class="exp-company">
                    <h3>${escapeHtml(job.company)}</h3>
                    <span class="exp-meta">${escapeHtml(job.location)} &middot; ${escapeHtml(job.tenure)}</span>
                </div>
                ${job.roles.map(r => `
                    <div class="exp-role">
                        <span class="exp-title">${escapeHtml(r.title)}</span>
                        <span class="exp-period">${escapeHtml(r.period)}</span>
                    </div>
                `).join('')}
                ${job.details ? `<ul class="exp-details">${job.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('');

        return `
            <div class="detail-card">
                <h2>Experience</h2>
                <hr class="card-separator">
                ${timeline}
            </div>
        `;
    }

    // === Command Definitions ===
    const COMMANDS = {
        about:      () => { navigateTo('about'); setDetailView(detailAbout()); },
        experience: () => { navigateTo('experience'); setDetailView(detailExperience()); },
        projects:   () => { navigateTo('projects'); setDetailView(detailProjects()); },
        skills:     () => { navigateTo('skills'); setDetailView(detailSkills()); },
        contact:    () => { navigateTo('contact'); setDetailView(detailContact()); },
        links:      () => { navigateTo('links'); setDetailView(detailLinks()); },
        help:     () => showWelcomeCard(),
        clear:    () => showWelcomeCard(),
        sudo:     () => setDetailView(`<div class="detail-card"><p style="color:var(--accent-red)">Nice try. Permission denied.</p></div>`),
        hello:    () => setDetailView(`<div class="detail-card"><p style="color:var(--accent-green)">Hey there! Thanks for stopping by.</p></div>`),
    };
    COMMANDS.hi = COMMANDS.hello;

    // === Execute a command string ===
    function execCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        if (COMMANDS[cmd]) {
            COMMANDS[cmd]();
        } else {
            setDetailView(`<div class="detail-card"><p style="color:var(--accent-red)">Command not found: ${escapeHtml(cmd)}</p><p>Type ${cmdLink('help')} or click a command on the left.</p></div>`);
        }
    }

    // === Click-to-execute animation ===
    function typeAndExec(cmd) {
        if (isTyping) return;
        isTyping = true;
        inputEl.value = '';
        inputEl.focus();
        let i = 0;
        const interval = setInterval(() => {
            if (i < cmd.length) {
                inputEl.value += cmd[i];
                updateCursor();
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    execCommand(inputEl.value);
                    inputEl.value = '';
                    updateCursor();
                    isTyping = false;
                }, 120);
            }
        }, 45);
    }

    // === Cursor visibility ===
    function updateCursor() {
        if (inputEl.value.length > 0) {
            cursorBlock.classList.add('hidden');
        } else {
            cursorBlock.classList.remove('hidden');
        }
    }

    // === Tab completion ===
    function tabComplete() {
        const partial = inputEl.value.trim().toLowerCase();
        if (!partial) return;
        const allCmds = Object.keys(COMMANDS);
        const matches = allCmds.filter((c) => c.startsWith(partial));
        if (matches.length === 1) {
            inputEl.value = matches[0];
            updateCursor();
        }
    }

    // === Input event handlers ===
    inputEl.addEventListener('keydown', (e) => {
        if (isTyping) {
            e.preventDefault();
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            if (!bootDone) return;
            execCommand(inputEl.value);
            inputEl.value = '';
            updateCursor();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            tabComplete();
        }
    });

    inputEl.addEventListener('input', updateCursor);

    // Click anywhere in terminal body to focus input
    terminalBody.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        inputEl.focus();
    });

    // Delegate click/keyboard on command links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.cmd-link');
        if (link) {
            e.preventDefault();
            const cmd = link.dataset.cmd;
            if (cmd && bootDone) typeAndExec(cmd);
        }
    });

    document.addEventListener('keydown', (e) => {
        const link = e.target.closest('.cmd-link');
        if (link && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            const cmd = link.dataset.cmd;
            if (cmd && bootDone) typeAndExec(cmd);
        }
    });

    // === Nav button handlers ===
    navBack.addEventListener('click', () => {
        if (viewHistory.length === 0) return;
        isNavigating = true;
        const prev = viewHistory.pop();
        currentView = prev;
        renderView(prev);
        updateNavButtons();
        isNavigating = false;
    });

    navHome.addEventListener('click', () => {
        if (currentView === 'welcome') return;
        isNavigating = true;
        viewHistory = [];
        currentView = 'welcome';
        renderView('welcome');
        updateNavButtons();
        isNavigating = false;
    });

    // === Resize handling ===
    window.addEventListener('resize', updatePrompt);

    // === Boot Sequence ===
    function boot() {
        showWelcomeCard();

        function headerLine(html, className) {
            const div = document.createElement('div');
            div.className = 'output-line' + (className ? ' ' + className : '');
            div.innerHTML = html;
            terminalHeader.appendChild(div);
        }

        const lines = [
            { html: `<span class="output-bold">lisco-portfolio v1.0.0</span>`, delay: 0 },
            { html: '────────────────────────────────────────', cls: 'output-separator', delay: 100 },
            { html: '', delay: 200 },
            { html: `Hey, I'm <span class="output-bold">Josh Lisco</span>.`, delay: 300 },
            { html: `<span class="output-muted">Senior Software Engineer.</span>`, delay: 450 },
            { html: '', delay: 600 },
            { html: 'Quick links:', delay: 700 },
            { html: `  ${cmdLink('about')}       Who I am`, delay: 800 },
            { html: `  ${cmdLink('experience')}  Where I've worked`, delay: 900 },
            { html: `  ${cmdLink('projects')}    What I've built`, delay: 1000 },
            { html: `  ${cmdLink('skills')}      Technologies I use`, delay: 1100 },
            { html: `  ${cmdLink('contact')}     Get in touch`, delay: 1200 },
            { html: '', delay: 1350 },
            { html: `Type a command below or click one above.`, cls: 'output-muted', delay: 1500 },
        ];

        lines.forEach((line) => {
            setTimeout(() => {
                headerLine(line.html, line.cls || '');
            }, line.delay);
        });

        setTimeout(() => {
            bootDone = true;
            inputEl.focus();
        }, 1600);
    }

    // === Init ===
    updatePrompt();
    updateCursor();
    boot();
})();
