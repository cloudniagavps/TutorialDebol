<!-- Script JavaScript untuk mengelola interaktivitas accordion -->
        document.addEventListener('DOMContentLoaded', function() {
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
        
<script>
        document.addEventListener('DOMContentLoaded', function() {
            const stakeInput = document.getElementById('stake');
            const oddsContainer = document.getElementById('odds-container');
            const payoutDisplay = document.getElementById('payout');
            const addOddBtn = document.getElementById('add-odd-btn');

            function calculatePayout() {
                const stake = parseFloat(stakeInput.value) || 0;
                let totalOdds = 1;

                const oddInputs = document.querySelectorAll('.odd-input');
                oddInputs.forEach(input => {
                    const odd = parseFloat(input.value) || 1;
                    totalOdds *= odd;
                });

                const totalPayout = stake * totalOdds;
                
                payoutDisplay.textContent = 'IDR ' + totalPayout.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
            }

            function addOddInput() {
                if (oddsContainer.children.length >= 15) {
                    alert('Jumlah maksimal tim adalah 15.');
                    return;
                }
                const newOddIndex = oddsContainer.children.length + 1;
                const newDiv = document.createElement('div');
                newDiv.className = 'relative';
                newDiv.innerHTML = `
                    <label class="font-semibold text-red-200 block">Odds Tim ${newOddIndex}</label>
                    <input type="number" step="0.01" value="1.00" class="odd-input w-full mt-2 p-3 bg-gray-800 border-red-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500">
                `;
                oddsContainer.appendChild(newDiv);
                newDiv.querySelector('.odd-input').addEventListener('input', calculatePayout);
                calculatePayout();
            }

            stakeInput.addEventListener('input', calculatePayout);
            addOddBtn.addEventListener('click', addOddInput);
            
            document.querySelectorAll('.odd-input').forEach(input => {
                input.addEventListener('input', calculatePayout);
            });

            calculatePayout();

            // Accordion Logic
            const accordionHeaders = document.querySelectorAll('.accordion-header');
            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const content = header.nextElementSibling;
                    const isActive = header.classList.toggle('active');
                    if (isActive) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0';
                    }
                    const icon = header.querySelector('span:last-child');
                    icon.textContent = isActive ? '−' : '+';
                });
            });
        });
    </script>
