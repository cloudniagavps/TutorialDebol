// Memastikan seluruh DOM (struktur halaman) sudah dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logika untuk Kalkulator Parlay ---
    
    // Ambil elemen-elemen dari HTML berdasarkan ID
    const stakeInput = document.getElementById('stake');
    const oddsContainer = document.getElementById('odds-container');
    const payoutDisplay = document.getElementById('payout');
    const addOddBtn = document.getElementById('add-odd-btn');
    
    // Objek untuk menyimpan status setiap tim
    const teamStatuses = {};

    // Fungsi untuk menghitung total kemenangan
    function calculatePayout() {
        // Ambil nilai taruhan, konversi ke angka. Jika kosong, anggap 0.
        const stake = parseFloat(stakeInput.value) || 0;
        let totalOdds = 1;
        let hasLose = false;

        // Ambil semua grup odds yang ada di halaman
        const oddGroups = document.querySelectorAll('.odd-group');
        if (oddGroups.length > 0) {
            oddGroups.forEach(group => {
                const oddInput = group.querySelector('.odd-input');
                const odd = parseFloat(oddInput.value) || 1;
                
                // Dapatkan status dari atribut data-status pada grup
                const status = group.dataset.status;

                // Perbarui total odds berdasarkan status
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

        // Tampilkan hasil dalam format mata uang IDR
        payoutDisplay.textContent = 'IDR ' + totalPayout.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Fungsi untuk menambahkan baris input odds baru
    function addOddInput() {
        // Batasi jumlah tim maksimal 15
        if (oddsContainer.children.length >= 15) {
            console.error('Jumlah maksimal tim adalah 15.');
            return;
        }

        const newOddIndex = oddsContainer.children.length + 1;
        const newDiv = document.createElement('div');
        
        // Menambahkan atribut data-id untuk identifikasi unik
        newDiv.className = 'odd-group p-4 bg-gray-800 rounded-lg border border-red-900 shadow-sm';
        newDiv.dataset.id = newOddIndex;
        newDiv.dataset.status = 'win'; // Atur status awal ke 'win'

        newDiv.innerHTML = `
            <label class="font-semibold text-red-200 block">Odds Tim ${newOddIndex}</label>
            <div class="flex items-center space-x-2 mt-2">
                <input type="number" step="0.01" value="1.00" class="odd-input flex-1 p-3 bg-gray-900 border-red-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500">
            </div>
            <div class="flex mt-3 space-x-2">
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white" data-status="win">Win</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white" data-status="wh">WH</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-yellow-600 text-white" data-status="lh">LH</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white" data-status="lose">Lose</button>
            </div>
        `;
        
        oddsContainer.appendChild(newDiv);
        
        // Tambahkan event listener untuk input odds dan tombol status yang baru
        const newOddInput = newDiv.querySelector('.odd-input');
        newOddInput.addEventListener('input', calculatePayout);
        
        const statusButtons = newDiv.querySelectorAll('.status-btn');
        statusButtons.forEach(btn => {
            btn.addEventListener('click', handleStatusButtonClick);
        });

        // Set status awal untuk tim yang baru ditambahkan
        handleStatusDisplay(newDiv, 'win');

        // Hitung ulang pembayaran setelah menambahkan tim baru
        calculatePayout();
    }

    // Fungsi untuk menangani klik pada tombol status
    function handleStatusButtonClick(event) {
        event.preventDefault();
        const parent = event.target.closest('.odd-group');
        const newStatus = event.target.dataset.status;
        
        // Perbarui status pada elemen odd-group
        parent.dataset.status = newStatus;
        
        // Atur tampilan tombol status yang aktif
        handleStatusDisplay(parent, newStatus);
        
        // Panggil ulang fungsi perhitungan payout
        calculatePayout();
    }

    // Fungsi untuk mengubah tampilan tombol status
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

    // Tambahkan event listener pada elemen yang sudah ada di awal
    stakeInput.addEventListener('input', calculatePayout);
    addOddBtn.addEventListener('click', addOddInput);
    
    // Tambahkan event listener ke setiap input odds dan tombol status yang ada saat halaman pertama kali dimuat
    document.querySelectorAll('.odd-input').forEach(input => {
        input.addEventListener('input', calculatePayout);
    });
    
    document.querySelectorAll('.odd-group').forEach(group => {
        // Atur status awal ke 'win' untuk item yang sudah ada
        group.dataset.status = 'win';
        handleStatusDisplay(group, 'win');

        group.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusButtonClick);
        });
    });
    
    // Panggil fungsi perhitungan saat pertama kali halaman dimuat untuk menampilkan nilai awal
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
});
