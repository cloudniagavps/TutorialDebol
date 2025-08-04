// Memastikan seluruh DOM (struktur halaman) sudah dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
        
        // --- Logika untuk Kalkulator Parlay ---
        const stakeInput = document.getElementById('stake');
        const oddsContainer = document.getElementById('odds-container');
        const payoutDisplay = document.getElementById('payout');
        const addOddBtn = document.getElementById('add-odd-btn');
        
        function calculatePayout() {
            const stake = parseFloat(stakeInput.value) || 0;
            let totalOdds = 1;
            let hasLose = false;

            const oddGroups = document.querySelectorAll('.odd-group');
            if (oddGroups.length > 0) {
                oddGroups.forEach(group => {
                    const oddInput = group.querySelector('.odd-input');
                    const odd = parseFloat(oddInput.value) || 1;
                    const status = group.dataset.status;

                    if (status === 'win') {
                        totalOdds *= odd;
                    } else if (status === 'wh') {
                        totalOdds *= (1 + ((odd - 1) / 2));
                    } else if (status === 'lh') {
                        totalOdds *= 0.5;
                    } else if (status === 'lose') {
                        hasLose = true;
                    }
                });
            }
            
            let totalPayout = 0;
            if (!hasLose) {
                totalPayout = stake * totalOdds;
            }

            payoutDisplay.textContent = 'IDR ' + totalPayout.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        }

        function addOddInput() {
            if (oddsContainer.children.length >= 15) {
                console.error('Jumlah maksimal tim adalah 15.');
                return;
            }

            const newOddIndex = oddsContainer.children.length + 1;
            const newDiv = document.createElement('div');
            
            newDiv.className = 'odd-group p-4 bg-gray-800 rounded-lg border border-red-900 shadow-sm';
            newDiv.dataset.id = newOddIndex;
            newDiv.dataset.status = 'win';

            newDiv.innerHTML = `
                <label class="font-semibold text-red-200 block">Odds Tim ${newOddIndex}</label>
                <div class="flex items-center space-x-2 mt-2">
                    <input type="number" step="0.01" value="1.00" class="odd-input flex-1 p-3 bg-gray-900 border-red-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500">
                    <button class="remove-btn text-red-400 hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex mt-3 space-x-2">
                    <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white" data-status="win">Win</button>
                    <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white" data-status="wh">WH</button>
                    <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-yellow-600 text-white" data-status="lh">LH</button>
                    <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white" data-status="lose">Lose</button>
                </div>
            `;
            
            oddsContainer.appendChild(newDiv);
            
            const newOddInput = newDiv.querySelector('.odd-input');
            newOddInput.addEventListener('input', calculatePayout);
            
            const statusButtons = newDiv.querySelectorAll('.status-btn');
            statusButtons.forEach(btn => {
                btn.addEventListener('click', handleStatusButtonClick);
            });

            const removeButton = newDiv.querySelector('.remove-btn');
            removeButton.addEventListener('click', removeOddInput);

            handleStatusDisplay(newDiv, 'win');

            calculatePayout();
        }

        function removeOddInput(event) {
            const groupToRemove = event.target.closest('.odd-group');
            if (groupToRemove) {
                groupToRemove.remove();
            }

            updateOddLabels();
            
            calculatePayout();
        }

        function updateOddLabels() {
            const oddGroups = document.querySelectorAll('.odd-group');
            oddGroups.forEach((group, index) => {
                const label = group.querySelector('label');
                label.textContent = `Odds Tim ${index + 1}`;
            });
        }

        function handleStatusButtonClick(event) {
            event.preventDefault();
            const parent = event.target.closest('.odd-group');
            const newStatus = event.target.dataset.status;
            
            parent.dataset.status = newStatus;
            
            handleStatusDisplay(parent, newStatus);
            
            calculatePayout();
        }

        function handleStatusDisplay(group, newStatus) {
            group.querySelectorAll('.status-btn').forEach(btn => {
                btn.classList.remove('opacity-100');
                btn.classList.add('opacity-50');
            });
            const activeBtn = group.querySelector(`.status-btn[data-status="${newStatus}"]`);
            if (activeBtn) {
                activeBtn.classList.remove('opacity-50');
                activeBtn.classList.add('opacity-100');
            }
        }

        stakeInput.addEventListener('input', calculatePayout);
        addOddBtn.addEventListener('click', addOddInput);
        
        document.querySelectorAll('.odd-input').forEach(input => {
            input.addEventListener('input', calculatePayout);
        });
        
        document.querySelectorAll('.odd-group').forEach(group => {
            group.dataset.status = 'win';
            handleStatusDisplay(group, 'win');

            group.querySelectorAll('.status-btn').forEach(btn => {
                btn.addEventListener('click', handleStatusButtonClick);
            });
            const removeButton = group.querySelector('.remove-btn');
            removeButton.addEventListener('click', removeOddInput);
        });
        
        calculatePayout();

    // --- Logika untuk Accordion (bagian FAQ dan Pemahaman Taruhan) ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isActive = toggle.classList.contains('active');

            // Buka atau tutup accordion yang diklik
            if (isActive) {
                toggle.classList.remove('active');
                content.classList.remove('show');
            } else {
                // Tutup semua accordion yang sedang terbuka
                document.querySelectorAll('.accordion-toggle').forEach(otherToggle => {
                    otherToggle.classList.remove('active');
                    otherToggle.nextElementSibling.classList.remove('show');
                });
                toggle.classList.add('active');
                content.classList.add('show');
            }
        });
       });
    // --- Logika untuk merender video dari localStorage ---
    const videoListContainer = document.getElementById('video-list-container');
    
    function renderPublicVideos() {
        const storedVideos = localStorage.getItem('dewibola-videos');
        const videos = storedVideos ? JSON.parse(storedVideos) : [];

        videoListContainer.innerHTML = '';
        if (videos.length === 0) {
            videoListContainer.innerHTML = `<p class="text-center text-gray-400 col-span-3">Belum ada video tutorial yang ditambahkan.</p>`;
            return;
        }

        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'flex flex-col items-center p-4 bg-gray-900 rounded-xl shadow-lg border border-gray-800';
            videoCard.innerHTML = `
                <div class="video-container w-full">
                    <iframe
                        src="${video.url}"
                        title="${video.title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
                <h4 class="mt-4 text-lg font-semibold text-gray-100">${video.title}</h4>
                <p class="text-sm text-gray-400 mt-2">${video.description}</p>
            `;
            videoListContainer.appendChild(videoCard);
        });
    }

    renderPublicVideos();
    });
