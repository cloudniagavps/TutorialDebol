/* Menggunakan font Inter untuk tampilan yang bersih */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
body {
    font-family: 'Inter', sans-serif;
    background: linear-gradient(45deg,#1d0101,#130000,#180202,#240000);
}
/* Styling untuk transisi yang halus pada konten accordion */
.accordion-content {
    transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
}
.accordion-content.show {
    max-height: 500px; /* Batas tinggi yang cukup besar agar konten terlihat */
    opacity: 1;
}
/* Rotasi ikon chevron saat accordion dibuka */
.accordion-toggle .chevron {
    transition: transform 0.3s ease;
}
.accordion-toggle.active .chevron {
    transform: rotate(180deg);
}
/* Responsif video container */
.video-container {
    position: relative;
    padding-bottom: 56.25%; /* Rasio aspek 16:9 */
    height: 0;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.video-container iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
/* Animasi baru untuk Floating Contact */
.animated-shake {
    animation: shake-hard 1s cubic-bezier(.36,.07,.19,.97) infinite;
}
.animated-pulse {
    animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}

@keyframes shake-hard {
    10%, 90% { transform: translate3d(-2px, 0, 0); }
    20%, 80% { transform: translate3d(4px, 0, 0); }
    30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
    40%, 60% { transform: translate3d(8px, 0, 0); }
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
