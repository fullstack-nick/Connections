function guessedCategoryBuilder(category, wordsArr, level) {
    for (let i = 0; i < 4; i++) {
      squareMover(wordsArr[i], constructingCategory+i);
    }

    const solved_div = document.createElement('div');
    solved_div.classList.add("solved");
    if (level === 0) {
      solved_div.style.backgroundColor = "#F9DF6D";
    } else if (level === 1) {
      solved_div.style.backgroundColor = "#A0C35A";
    } else if (level === 2) {
      solved_div.style.backgroundColor = "#B0C4EF";
    } else if (level === 3) {
      solved_div.style.backgroundColor = "#BA81C5";
    }


    const h3_category = document.createElement('h3');
    h3_category.classList.add("solved-category");
    h3_category.innerText = category;

    const h3_words = document.createElement('h3');
    h3_words.classList.add("solved-words");
    wordsArr.forEach(word => {
      h3_words.innerText += word + ", ";
    })

    solved_div.appendChild(h3_category);
    solved_div.appendChild(h3_words);

    // DELETE SQUARES
    wordsArr.forEach(word => {
      getElementByWord(word).remove();
    })

    solved_div.style.gridArea = `squareStartingWith-${constructingCategory}`;
    const replacementWord = `squareStartingWith-${constructingCategory}`;
    templateModifier(level, replacementWord);

    constructedArr.push(level);
    if (constructedArr.length === 4) {
      alert("Congratulations, you won!");
      document.getElementById("mistakes").classList.add("none");
      document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
    }

    constructingCategory += 4;
}

function unveilAll() {
    let indexedObj = data.categories.map((category, number) => ({
      ...category,
      number
    }));
    
    let globalCounter = 0;
    
    // Define the iteration function that processes one category
    function processIteration() {
      if (globalCounter < 4) {
        const currentIndex = globalCounter;
        const currentConstructin = constructingCategory;
        if (!constructedArr.includes(indexedObj[currentIndex].number)) {

          if (currentIndex === 3) {
            let counter = 0;
            const int = setInterval(() => {
              if (counter < 4) {
                squareMover(indexedObj[currentIndex].words[counter], currentConstructin + counter, 0.2);
                counter++;
              } else {
                clearInterval(int);
              }
            }, 400); 
          } else {
            let counter = 0;
            const int = setInterval(() => {
              if (counter < 4) {
                squareMover(indexedObj[currentIndex].words[counter], currentConstructin + counter, 0.25);
                counter++;
              } else {
                clearInterval(int);
              }
            }, 500); 
          }
    
          setTimeout(() => {
            const solved_div = document.createElement('div');
            solved_div.classList.add("solved");
            // Set background color based on the category number
            if (indexedObj[currentIndex].number === 0) {
              solved_div.style.backgroundColor = "#F9DF6D";
            } else if (indexedObj[currentIndex].number === 1) {
              solved_div.style.backgroundColor = "#A0C35A";
            } else if (indexedObj[currentIndex].number === 2) {
              solved_div.style.backgroundColor = "#B0C4EF";
            } else if (indexedObj[currentIndex].number === 3) {
              solved_div.style.backgroundColor = "#BA81C5";
            }
    
            const h3_category = document.createElement('h3');
            h3_category.classList.add("solved-category");
            h3_category.innerText = indexedObj[currentIndex].name;
    
            const h3_words = document.createElement('h3');
            h3_words.classList.add("solved-words");
            indexedObj[currentIndex].words.forEach(word => {
              h3_words.innerText += word + ", ";
            });
    
            solved_div.appendChild(h3_category);
            solved_div.appendChild(h3_words);
            constructedArr.push(indexedObj[currentIndex].number);
    
            // Remove squares for each word
            indexedObj[currentIndex].words.forEach(word => {
              getElementByWord(word).remove();
            });

            autoShrinkText(h3_words);
    
            solved_div.style.gridArea = `squareStartingWith-${currentConstructin}`;
            const replacementWord = `squareStartingWith-${currentConstructin}`;
            templateModifier(indexedObj[currentIndex].number, replacementWord);
            const container = document.getElementById("words-board");
            const script = container.querySelector("script");
            container.insertBefore(solved_div, script);
          }, (currentIndex === 3 ? 2000 : 2500));
        }
        globalCounter++;
        constructingCategory += 4;
      } else {
        clearInterval(interval);

        alert("Don't be upset, you can play again!");
        document.getElementById("mistakes").classList.add("none");
        document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
      }
    }
    
    // Run the first iteration immediately
    processIteration();
    // Then run subsequent iterations every 5000ms
    const interval = setInterval(processIteration, (globalCounter === 3 ? 2000 : 2500));
}

function correct_builder(category, wordsArr, level) {
    const currentConstructin = constructingCategory;
        if (!constructedArr.includes(level)) {

            let counter = 0;
            const int = setInterval(() => {
              if (counter < 4) {
                squareMover(wordsArr[counter], currentConstructin + counter, 0.25);
                counter++;
              } else {
                clearInterval(int);
              }
            }, 500); 
    
          setTimeout(() => {
            const solved_div = document.createElement('div');
            solved_div.classList.add("solved");
            // Set background color based on the category number
            if (level === 0) {
              solved_div.style.backgroundColor = "#F9DF6D";
            } else if (level === 1) {
              solved_div.style.backgroundColor = "#A0C35A";
            } else if (level === 2) {
              solved_div.style.backgroundColor = "#B0C4EF";
            } else if (level === 3) {
              solved_div.style.backgroundColor = "#BA81C5";
            }
    
            const h3_category = document.createElement('h3');
            h3_category.classList.add("solved-category");
            h3_category.innerText = category;
    
            const h3_words = document.createElement('h3');
            h3_words.classList.add("solved-words");
            wordsArr.forEach(word => {
              h3_words.innerText += word + ", ";
            });
    
            solved_div.appendChild(h3_category);
            solved_div.appendChild(h3_words);
            constructedArr.push(level);
    
            // Remove squares for each word
            wordsArr.forEach(word => {
              getElementByWord(word).remove();
            });

            autoShrinkText(h3_words);
    
            solved_div.style.gridArea = `squareStartingWith-${currentConstructin}`;
            const replacementWord = `squareStartingWith-${currentConstructin}`;
            templateModifier(level, replacementWord);
            const container = document.getElementById("words-board");
            const script = container.querySelector("script");
            container.insertBefore(solved_div, script);
          }, 2500);
        }
        constructingCategory += 4;

        if (constructedArr.length === 4) {
            alert("Congratulations, you won!\nWanna be even cooler? Play again!");
            document.getElementById("mistakes").classList.add("none");
            document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
        }
}