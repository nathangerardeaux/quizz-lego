const images = document.querySelectorAll('.images-container img');
const message = document.getElementById('message');
const goToQuizBtn = document.getElementById('goToQuiz');

let currentPlayer = 1;
let selections = [
    localStorage.getItem('selectedImage1'),
    localStorage.getItem('selectedImage2')
];

function updateSelectionDisplay() {
    images.forEach(img => img.classList.remove('selected1', 'selected2'));
    if (selections[0]) {
        const img1 = document.querySelector(`img[data-id="${selections[0]}"]`);
        if (img1) img1.classList.add('selected1');
    }
    if (selections[1]) {
        const img2 = document.querySelector(`img[data-id="${selections[1]}"]`);
        if (img2) img2.classList.add('selected2');
    }
    if (selections[0] && selections[1]) {
        goToQuizBtn.style.display = 'inline-block';
    } else {
        goToQuizBtn.style.display = 'none';
    }
}

images.forEach(img => {
    img.addEventListener('click', () => {
        if (currentPlayer === 2 && img.dataset.id === selections[0]) {
            message.textContent = "Ce personnage est déjà choisi par le joueur 1 !";
            return;
        }
        selections[currentPlayer - 1] = img.dataset.id;
        localStorage.setItem(`selectedImage${currentPlayer}`, img.dataset.id);
        updateSelectionDisplay();
        message.textContent = `Joueur ${currentPlayer} a choisi !`;
        if (currentPlayer === 1) {
            currentPlayer = 2;
            message.textContent += " Joueur 2, à vous de choisir.";
        } else {
            message.textContent += " Les deux joueurs ont choisi !";
        }
    });
});

updateSelectionDisplay();
if (selections[0] && selections[1]) {
    message.textContent = "Les deux joueurs ont déjà choisi !";
} else if (selections[0]) {
    message.textContent = "Joueur 1 a déjà choisi. Joueur 2, à vous de choisir.";
    currentPlayer = 2;
}
goToQuizBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});