const quizList = document.getElementById('quiz-list');

let questions = [];
let responses = [];
let goodResponses = [];

let currentQuestionIndex = 0;

async function chargerQuestions() {
    try {
        const reponse = await fetch('../questionE.json');
        const donnees = await reponse.json();
        const questionAll = donnees.quizz.easy;

        for (const questionData of questionAll) {
            questions.push(questionData.question);
            responses.push(questionData.options);
            goodResponses.push(questionData.correctAnswer);
        }

        console.log('Questions chargées avec succès:', questions);
        afficherQuestion(); 

    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
    }
}

function afficherQuestion() {
    quizList.innerHTML = ''; // Nettoie l'affichage précédent

    if (currentQuestionIndex >= questions.length) {
        const fin = document.createElement('h2');
        fin.textContent = "Félicitations ! Vous avez terminé le quiz ! 🎉";
        quizList.appendChild(fin);
        return;
    }

    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');

    const questionText = document.createElement('h2');
    questionText.textContent = questions[currentQuestionIndex];
    questionBlock.appendChild(questionText);

    responses[currentQuestionIndex].forEach(reponse => {
        const btn = document.createElement('button');
        btn.textContent = reponse;
        btn.classList.add('reponse-button');

        btn.addEventListener('click', () => {
            if (reponse === goodResponses[currentQuestionIndex]) {
                alert("Bonne réponse !");
                currentQuestionIndex++; 
                afficherQuestion(); // Rafraîchir l'affichage
            } else {
                alert("Mauvaise réponse, réessaie !");
            }
        });

        questionBlock.appendChild(btn);
    });

    quizList.appendChild(questionBlock);
}

chargerQuestions();
