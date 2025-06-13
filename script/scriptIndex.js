const quizList = document.getElementById('quiz-list');

let questions = [];
let responses = [];
let goodResponses = [];

let currentQuestionIndex = 0;
let currentPlayer = 1;
let scorePlayer1 = 0;
let scorePlayer2 = 0;

const legoImages = [
    "../img/lego-rouge.jpg",
    "../img/lego-vert.jpg",
    "../img/lego-jaune.jpg",
    "../img/lego-bleu.jpg"
];

const selectedCharactersContainer = document.getElementById('selected-characters');

const selectedImage1 = localStorage.getItem('selectedImage1');
const selectedImage2 = localStorage.getItem('selectedImage2');

if (selectedImage1 && selectedImage2) {
    selectedCharactersContainer.innerHTML = `
        <div class="selected-images-layout">
            <div class="player-image left">
                <img src="../img/${getImageFileName(selectedImage1)}" alt="Joueur 1" />
                <p id="score-player-1" class="player-score">Score : 0</p>
            </div>
            <div class="player-image right">
                <img src="../img/${getImageFileName(selectedImage2)}" alt="Joueur 2" />
                <p id="score-player-2" class="player-score">Score : 0</p>
            </div>
        </div>
    `;
}


function mettreAJourScores() {
    const score1 = document.getElementById('score-player-1');
    const score2 = document.getElementById('score-player-2');

    if (score1) score1.textContent = `Score : ${scorePlayer1}`;
    if (score2) score2.textContent = `Score : ${scorePlayer2}`;
}


function getImageFileName(id) {
    switch (id) {
        case "1": return "cole.png";
        case "2": return "Jay.png";
        case "3": return "kai.png";
        case "4": return "Zane.png";
        default: return "default.png";
    }
}

async function chargerQuestions() {
    try {
        const reponse = await fetch('../questionE.json');
        const donnees = await reponse.json();
        let questionAll = alArray(donnees.quizz.easy).slice(0, 10);


        for (const questionData of questionAll) {
            questions.push(questionData.question);
            responses.push(questionData.options);
            goodResponses.push(questionData.correctAnswer);
        }

        afficherQuestion();
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
    }
}

function alArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function afficherQuestion() { //bcp de complexité a cause des differente condition
    quizList.innerHTML = '';

    if (currentQuestionIndex >= questions.length) {
        const fin = document.createElement('div');
        fin.innerHTML = `
            <h2>Fin du quiz !</h2>
            <p>Score Joueur 1 : ${scorePlayer1}</p>
            <p>Score Joueur 2 : ${scorePlayer2}</p>
            <h3>${scorePlayer1 === scorePlayer2 ? "Égalité !" : scorePlayer1 > scorePlayer2 ? "Joueur 1 gagne !" : "Joueur 2 gagne !"}</h3>
        `;
        quizList.appendChild(fin);
        return;
    }
    //les differente balise ou les donné seront mis
    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');

    const questionText = document.createElement('h2');
    questionText.textContent = `Joueur ${currentPlayer}, à toi !`;
    questionBlock.appendChild(questionText);

    const questionContent = document.createElement('p');
    questionContent.textContent = questions[currentQuestionIndex];
    questionBlock.appendChild(questionContent);

    const optionsWrapper = document.createElement('div');
    optionsWrapper.classList.add('options-wrapper');

    const messageDiv = document.createElement('div'); 
    messageDiv.classList.add('feedback-message');
    questionBlock.appendChild(messageDiv);
    //fin 
    responses[currentQuestionIndex].forEach((reponse, index) => {
        //les differnte balises ou les donnée seront mis 
        const container = document.createElement('div');
        container.classList.add('option-container');

        const image = document.createElement('img');
        image.src = legoImages[index % legoImages.length];
        image.alt = "Image réponse";
        image.classList.add('option-image');

        const overlay = document.createElement('div');
        overlay.classList.add('option-text');
        overlay.textContent = reponse;

        container.appendChild(image);
        container.appendChild(overlay);
        //fin

        //vérification des réponse donné
        container.addEventListener('click', () => {
            if (reponse === goodResponses[currentQuestionIndex]) {
                messageDiv.textContent = `Bonne réponse, Joueur ${currentPlayer} !`;
                messageDiv.style.color = "green";
                if (currentPlayer === 1) {
                    scorePlayer1++;
                } else {
                    scorePlayer2++;
                }
            } else {
                messageDiv.textContent = `Mauvaise réponse, Joueur ${currentPlayer} !`;
                messageDiv.style.color = "red";
            }

            // Désactiver les autres clics pendant délai
            optionsWrapper.style.pointerEvents = "none";
            mettreAJourScores();

            setTimeout(() => {
                currentQuestionIndex++;
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                afficherQuestion();
            }, 1000);
        });

        optionsWrapper.appendChild(container);
    });

    questionBlock.appendChild(optionsWrapper);
    quizList.appendChild(questionBlock);
}


chargerQuestions();
