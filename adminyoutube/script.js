document.addEventListener('DOMContentLoaded', function() {
    // --- Logika Panel Admin Video ---
    const loginModal = document.getElementById('admin-modal');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');
    const adminPanel = document.getElementById('admin-panel');
    const logoutBtn = document.getElementById('logout-btn');

    const videoForm = document.getElementById('video-form');
    const videoUrlInput = document.getElementById('video-url');
    const videoTitleInput = document.getElementById('video-title');
    const videoDescInput = document.getElementById('video-desc');
    const submitVideoBtn = document.getElementById('submit-video-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const adminVideoList = document.getElementById('admin-video-list');
    const adminMessage = document.getElementById('admin-message');

    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'password123';
    const MAX_VIDEOS = 9;

    let videos = [];
    let editingVideoId = null;

    // Fungsi untuk menampilkan/menyembunyikan panel admin
    function showAdminPanel() {
        loginModal.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        renderAdminVideoList();
        checkMaxVideos();
    }

    // Fungsi untuk menampilkan modal login
    function showLogin() {
        loginModal.classList.remove('hidden');
        adminPanel.classList.add('hidden');
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            showAdminPanel();
            loginForm.reset();
            loginMessage.textContent = '';
        } else {
            loginMessage.textContent = 'Username atau password salah.';
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener('click', function() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            showLogin();
        }
    });
    
    // Load videos from local storage
    function loadVideos() {
        const storedVideos = localStorage.getItem('dewibola-videos');
        if (storedVideos) {
            videos = JSON.parse(storedVideos);
        } else {
            // Initial dummy videos if local storage is empty
            videos = [
                { id: 1, url: "https://www.youtube.com/embed/2ThQOAkZapg", title: "Video 1: Tutorial 1X2", description: "CARA PASANG MIX PARLAY 1X2 | TUTORIAL PALING MUDAH DIPAHAMI." },
                { id: 2, url: "https://www.youtube.com/embed/bvpYUj4z014", title: "Video 2: Pasang Parlay Paling Mudah", description: "CARA MUDAH BERMAIN PARLAY | TUTORIAL MIX PARLAY PALING MUDAH DIPAHAMI." },
                { id: 3, url: "https://www.youtube.com/embed/IkR2oTRmZoE", title: "Video 3: SINGLE BET HDP (HANDICAP)", description: "CARA BERMAIN SINGLE BET HDP (HANDICAP) VOOR | TUTORIAL PALING MUDAH DIPAHAMI." },
                { id: 4, url: "https://www.youtube.com/embed/CRJSnL_6tss", title: "Video 4: SINGLE BET OU OVER-UNDER", description: "CARA BERMAIN SINGLE BET OU OVER-UNDER | TUTORIAL PALING MUDAH DIPAHAMI." },
                { id: 5, url: "https://www.youtube.com/embed/fyQL4ZWYevA", title: "Video 5: SINGLE BET 1x2", description: "CARA BERMAIN SINGLE BET 1x2 | TUTORIAL PALING MUDAH DIPAHAMI." },
                { id: 6, url: "https://www.youtube.com/embed/zJCrtOlkznk", title: "Video 6: CARA DAFTAR SITUS DEWIBOLA.", description: "TUTORIAL CARA DAFTAR SITUS DEWIBOLA | CARA BUAT AKUN SITUS DEWIBOLA." },
            ];
            saveVideos();
        }
    }

    // Save videos to local storage
    function saveVideos() {
        localStorage.setItem('dewibola-videos', JSON.stringify(videos));
    }

    // Render the admin video list
    function renderAdminVideoList() {
        adminVideoList.innerHTML = '';
        if (videos.length === 0) {
            adminVideoList.innerHTML = `<p class="text-center text-gray-400">Belum ada video tutorial yang ditambahkan.</p>`;
        }
        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-red-900 shadow-sm';
            videoItem.innerHTML = `
                <div>
                    <h4 class="font-semibold text-red-200">${video.title}</h4>
                    <p class="text-sm text-gray-400">${video.description}</p>
                </div>
                <div class="flex space-x-2">
                    <button class="edit-video-btn bg-yellow-600 text-white p-2 rounded-lg text-sm" data-id="${video.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                    <button class="delete-video-btn bg-red-600 text-white p-2 rounded-lg text-sm" data-id="${video.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H4a1 1 0 00-1 1v3m14 0h-2M5 7h14" />
                        </svg>
                    </button>
                </div>
            `;
            adminVideoList.appendChild(videoItem);
        });

        // Add event listeners for new buttons
        document.querySelectorAll('.edit-video-btn').forEach(button => {
            button.addEventListener('click', handleEditClick);
        });
        document.querySelectorAll('.delete-video-btn').forEach(button => {
            button.addEventListener('click', handleDeleteClick);
        });
    }

    // Check if max videos limit is reached and update UI
    function checkMaxVideos() {
        if (videos.length >= MAX_VIDEOS) {
            submitVideoBtn.disabled = true;
            submitVideoBtn.textContent = 'Maksimal 9 Video';
            submitVideoBtn.classList.add('opacity-50', 'cursor-not-allowed');
            adminMessage.textContent = 'Maksimal 9 video telah tercapai.';
        } else {
            submitVideoBtn.disabled = false;
            submitVideoBtn.textContent = 'Tambah Video';
            submitVideoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            adminMessage.textContent = '';
        }
    }

    // Handle form submission for adding/editing video
    videoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const url = videoUrlInput.value;
        const title = videoTitleInput.value;
        const desc = videoDescInput.value;
        
        if (!url || !title || !desc) {
            adminMessage.textContent = 'Harap isi semua kolom.';
            return;
        }

        const videoId = getYouTubeId(url);
        if (!videoId) {
            adminMessage.textContent = 'URL YouTube tidak valid.';
            return;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        
        if (editingVideoId) {
            const videoIndex = videos.findIndex(v => v.id === editingVideoId);
            if (videoIndex !== -1) {
                videos[videoIndex].url = embedUrl;
                videos[videoIndex].title = title;
                videos[videoIndex].description = desc;
            }
            editingVideoId = null;
            submitVideoBtn.textContent = 'Tambah Video';
            cancelEditBtn.classList.add('hidden');
            adminMessage.textContent = 'Video berhasil diperbarui!';
        } else {
            if (videos.length >= MAX_VIDEOS) {
                adminMessage.textContent = 'Maksimal video telah tercapai.';
                return;
            }
            
            const newId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) + 1 : 1;
            const newVideo = {
                id: newId,
                url: embedUrl,
                title: title,
                description: desc
            };
            videos.push(newVideo);
            adminMessage.textContent = 'Video berhasil ditambahkan!';
        }

        saveVideos();
        renderAdminVideoList();
        checkMaxVideos();
        videoForm.reset();
        setTimeout(() => adminMessage.textContent = '', 3000); // Clear message
    });

    // Handle edit button click
    function handleEditClick(event) {
        const id = parseInt(event.currentTarget.dataset.id);
        const videoToEdit = videos.find(v => v.id === id);

        if (videoToEdit) {
            videoUrlInput.value = videoToEdit.url.replace('https://www.youtube.com/embed/', 'https://www.youtube.com/watch?v=');
            videoTitleInput.value = videoToEdit.title;
            videoDescInput.value = videoToEdit.description;
            
            editingVideoId = id;
            submitVideoBtn.textContent = 'Simpan Perubahan';
            cancelEditBtn.classList.remove('hidden');
        }
    }

    // Handle cancel edit button click
    cancelEditBtn.addEventListener('click', function() {
        videoForm.reset();
        editingVideoId = null;
        submitVideoBtn.textContent = 'Tambah Video';
        cancelEditBtn.classList.add('hidden');
    });

    // Handle delete button click
    function handleDeleteClick(event) {
        const confirmation = confirm('Apakah Anda yakin ingin menghapus video ini?');
        if (confirmation) {
            const id = parseInt(event.currentTarget.dataset.id);
            videos = videos.filter(v => v.id !== id);
            saveVideos();
            renderAdminVideoList();
            checkMaxVideos();
            adminMessage.textContent = 'Video berhasil dihapus!';
            setTimeout(() => adminMessage.textContent = '', 3000); // Clear message
        }
    }
    
    // Utility function to get YouTube video ID
    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Initial call to load videos and show login modal
    loadVideos();
    showLogin();
});
