// Memastikan seluruh DOM (struktur halaman) sudah dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logika untuk Kalkulator Parlay ---
    
    // Ambil elemen-elemen dari HTML berdasarkan ID
    const stakeInput = document.getElementById('stake');
    const oddsContainer = document.getElementById('odds-container');
    const payoutDisplay = document.getElementById('payout');
    const addOddBtn = document.getElementById('add-odd-btn');

    // Fungsi untuk menghitung total kemenangan
    function calculatePayout() {
        // Ambil nilai taruhan, konversi ke angka. Jika kosong, anggap 0.
        const stake = parseFloat(stakeInput.value) || 0;
        let totalOdds = 1;

        // Ambil semua input odds yang ada di halaman
        const oddInputs = document.querySelectorAll('.odd-input');
        oddInputs.forEach(input => {
            // Ambil nilai odds, konversi ke angka. Jika kosong, anggap 1.
            const odd = parseFloat(input.value) || 1;
            totalOdds *= odd;
        });

        // Hitung total potensi kemenangan
        const totalPayout = stake * totalOdds;
        
        // Tampilkan hasil dalam format mata uang IDR
        payoutDisplay.textContent = 'IDR ' + totalPayout.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Fungsi untuk menambahkan baris input odds baru
    function addOddInput() {
        // Batasi jumlah tim maksimal 15
        if (oddsContainer.children.length >= 15) {
            // Tampilkan pesan kesalahan jika batas tercapai
            // Menggunakan `console.error` karena `alert()` tidak disarankan
            console.error('Jumlah maksimal tim adalah 15.');
            return;
        }

        const newOddIndex = oddsContainer.children.length + 1;
        const newDiv = document.createElement('div');
        
        // Menggunakan template literal untuk membuat elemen HTML baru
        newDiv.className = 'odd-group p-4 bg-gray-800 rounded-lg border border-red-900 shadow-sm';
        newDiv.innerHTML = `
            <label class="font-semibold text-red-200 block">Odds Tim ${newOddIndex}</label>
            <div class="flex items-center space-x-2 mt-2">
                <input type="number" step="0.01" value="1.00" class="odd-input flex-1 p-3 bg-gray-900 border-red-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500">
            </div>
            <div class="flex mt-3 space-x-2">
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-green-600 text-white status-active" data-status="win">Win</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white opacity-50" data-status="wh">WH</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-yellow-600 text-white opacity-50" data-status="lh">LH</button>
                <button class="status-btn flex-1 py-1.5 rounded-lg text-sm font-medium bg-red-600 text-white opacity-50" data-status="lose">Lose</button>
            </div>
        `;
        
        oddsContainer.appendChild(newDiv);
        
        // Tambahkan event listener untuk input odds yang baru
        const newOddInput = newDiv.querySelector('.odd-input');
        newOddInput.addEventListener('input', calculatePayout);
        
        // Tambahkan event listener untuk tombol status yang baru
        newDiv.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusButtonClick);
        });

        // Hitung ulang pembayaran setelah menambahkan tim baru
        calculatePayout();
    }

    // Fungsi untuk menangani klik pada tombol status (Win, WH, LH, Lose)
    function handleStatusButtonClick(event) {
        // Hapus kelas 'status-active' dari semua tombol status pada grup ini
        const parent = event.target.closest('.odd-group');
        parent.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('status-active');
            btn.classList.add('opacity-50');
        });
        
        // Tambahkan kelas 'status-active' ke tombol yang diklik
        event.target.classList.add('status-active');
        event.target.classList.remove('opacity-50');
        
        // Panggil ulang fungsi perhitungan payout
        calculatePayout();
    }

    // Tambahkan event listener pada elemen yang sudah ada di awal
    stakeInput.addEventListener('input', calculatePayout);
    addOddBtn.addEventListener('click', addOddInput);
    
    // Tambahkan event listener ke setiap input odds dan tombol status yang ada saat halaman pertama kali dimuat
    document.querySelectorAll('.odd-input').forEach(input => {
        input.addEventListener('input', calculatePayout);
    });
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', handleStatusButtonClick);
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
