import { generateWords } from './server.js';

// let words = [
//   "APPLE", "BANANA", "CHOCOLATE", "DEVELOPER", "ELEPHANT", "FANTASTIC",
//   "GIRAFFE", "HAMBURGER", "INCREDIBLE", "JAVASCRIPT", "KNOWLEDGE",
//   "LIGHTHOUSE", "MOUNTAIN", "NOTEBOOK", "ORCHESTRA", "PUZZLE"
// ];

let selectedAmount = 0;
let data;
let selectedByUser = [];
let mistakesLeft = 4;
let pastTries = {};
let legitTry = 0;
let constructingCategory = 0;
let constructedArr = [];

let words = [];

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("intro-text").classList.add("show");
  }, 10);

  document.getElementById("words-board").addEventListener("click", () => {
    addListeners();
  })

  getWordsData();
  addListeners();
})

function pause (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWordsData() {
  data = await generateWords();
  data.mixedWords.forEach(word => {
    words.push(word);
  });

  // for (let i = words.length - 1; i > 0; i--) {
  //   let j = Math.floor(Math.random() * (i + 1));
  //   [words[i], words[j]] = [words[j], words[i]];
  // }

  allocateWords();
  initialDisplay();
}

function autoShrinkText(element) {
  const parent = element.parentElement;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  const minSize = isMobile ? 4 : 6;
  
  while (
    (element.scrollHeight > parent.clientHeight || element.scrollWidth > parent.clientWidth) &&
    parseFloat(window.getComputedStyle(element).fontSize) > minSize
  ) {
    let currentSize = parseFloat(window.getComputedStyle(element).fontSize);
    element.style.fontSize = (currentSize - 1) + 'px';
  }
}

function allocateWords() {
  // let i = constructingCategory;

  const currentIDs = [];
  const squares = document.querySelectorAll(".square");
  console.log(squares);
  squares.forEach(sq => {
    currentIDs.push(sq.id.split('-')[1]);
  });

  for (let i = 0; i < words.length; i ++) {
    document.getElementById(`square-${currentIDs[i]}`).innerHTML = '';
    const span = document.createElement('span');
    span.classList.add("fade-in-text");
    span.innerText = words[i];
    span.setAttribute("data-word", words[i]);
    span.innerHTML = span.textContent.split(' ').join('<br>');
    document.getElementById(`square-${currentIDs[i]}`).appendChild(span);

    setTimeout(() => {
      autoShrinkText(span);
      span.classList.add("show");
    }, 10);
  }
}

function initialDisplay() {
  document.getElementById("words-board").classList.remove("none")
  document.getElementById("mistakes").classList.add("show")
  document.getElementById("buttons").classList.add("show")
  document.getElementById("intro-text").classList.remove("show");
  document.getElementById("intro-text").innerText = "Create four groups of four!"
  document.getElementById("intro-text").classList.add("show");
}

function squareClick() {
  this.style.transform = "";
  this.classList.toggle("selected");
  selectedChecker();
}

function addListeners() {
  const squares = document.querySelectorAll(".square");
  if (selectedAmount < 4) {
    squares.forEach(square => {
      square.removeEventListener("click", squareClick);
      square.addEventListener("click", squareClick);
      square.style.pointerEvents = "auto";
    })

    const submit_btt = document.getElementById("submit");
    submit_btt.classList.remove("black");
    submit_btt.classList.add("pale");

    if (selectedAmount > 0) {
      const shuffle = document.getElementById("shuffle");
      shuffle.classList.add("pale");
      shuffle.removeEventListener("click", shuffleClick);
    }

    if (selectedAmount === 0) {
      const shuffle = document.getElementById("shuffle");
      shuffle.classList.remove("pale");
      shuffle.removeEventListener("click", shuffleClick);
      shuffle.addEventListener("click", shuffleClick);
    }
  }

  // const squares = document.querySelectorAll(".square");
  // squares.forEach(square => {
  //   square.addEventListener("click", function () {
  //     this.classList.toggle("selected");
  //     selectedChecker();
  //   })
  // })
}

function selectedChecker() {
  let newSelectedAmount = 0;
  let anySelected = false;
  const squares = document.querySelectorAll(".square");
  const deselect = document.getElementById("deselect");
  squares.forEach(square => {
    if (square.classList.contains("selected")) {
      anySelected = true;
      newSelectedAmount++;
      deselect.classList.remove("pale");
    }
    if (!anySelected) deselect.classList.add("pale");
  })
  selectedAmount = newSelectedAmount;
  
  const submit_btt = document.getElementById("submit");
  if (selectedAmount === 4) {
    squares.forEach(square => {
      if (!square.classList.contains("selected")) {
        square.removeEventListener("click", squareClick);
        square.style.pointerEvents = "none";
      }
    })

    submit_btt.classList.remove("pale");
    submit_btt.classList.add("black");
    submit_btt.addEventListener("click", triggerSubmit);
  } else {
    submit_btt.classList.add("pale");
    submit_btt.classList.remove("black");
    submit_btt.removeEventListener("click", triggerSubmit);
  }
}

const shuffle = document.getElementById("shuffle");
let bttClickInProgress = false;
function shuffleClick() {
  if (!bttClickInProgress && selectedAmount === 0) {
    console.log('happening')
    bttClickInProgress = true;
    shuffle.classList.toggle("pale");

    for (let i = words.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    allocateWords();

    setTimeout(() => {
      shuffle.classList.toggle("pale");
      bttClickInProgress = false;
    }, 250);
  }
}
if (selectedAmount === 0) shuffle.addEventListener("click", shuffleClick);

const deselect = document.getElementById("deselect");
function deselectClick() {
  if (selectedAmount > 0) {
    selectedAmount = 0;
    const squares = document.querySelectorAll(".square");
    squares.forEach(square => {
      square.classList.remove("selected");
    })

    addListeners();
    deselect.classList.add("pale");
    const submit_btt = document.getElementById("submit");
    submit_btt.classList.remove("black");
    submit_btt.classList.add("pale");
  }
}
deselect.addEventListener("click", deselectClick);

function triggerSubmit() {
  const deselect = document.getElementById("deselect");
  deselect.removeEventListener("click", deselectClick);
  deselect.classList.add("pale");

  const submit_btt = document.getElementById("submit");
  submit_btt.removeEventListener("click", triggerSubmit);


  console.log("triggered");
  selectedByUser = [];
  
  const squares = document.querySelectorAll(".square");
  const selected_squares = [];
  squares.forEach(square => {
    if (square.classList.contains("selected")) {
      selected_squares.push(square);
      square.removeEventListener("click", squareClick);
      square.style.pointerEvents = "none";
    }
  })
  let index = 0;
  const interval = setInterval(() => {
    if (index < selected_squares.length) {
      selected_squares[index].classList.add("lift-up");
      selectedByUser.push(selected_squares[index].firstElementChild.innerText);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 200);

  setTimeout(() => {
    selected_squares.forEach(square => {
      square.classList.remove("lift-up");
    })


    let userSorted = [...selectedByUser].sort();
    let duplicateFound = false;
    for (let key in pastTries) {
      if (JSON.stringify(pastTries[key]) === JSON.stringify(userSorted)) {
        alert("Already guessed!");
        duplicateFound = true;

        deselect.addEventListener("click", deselectClick);
        deselect.classList.remove("pale");
        submit_btt.classList.remove("black");
        submit_btt.classList.add("pale");

        selected_squares.forEach(square => {
          square.addEventListener("click", squareClick);
          square.style.pointerEvents = "auto";
        })
        break;
      }
    }
    if (!duplicateFound) {
      legitTry++;
      pastTries[legitTry] = userSorted;

      let guessed = false;
  let matchedCategoryName;
  let matchedWords;
  let levelOfComplexity;
  for (let i = 0; i < data.categories.length; i++) {
    const AIwords = data.categories[i].words;
    let AIsorted = [...AIwords].sort();

    if (userSorted.every((word, index) => word === AIsorted[index])) {
      matchedCategoryName = data.categories[i].name;
      matchedWords = data.categories[i].words;
      levelOfComplexity = i;
      guessed = true;
      break;
    }
  }

  if (guessed) {
    setTimeout(() => {
      // deselect.addEventListener("click", deselectClick);
      // deselect.classList.remove("pale");
      submit_btt.classList.remove("black");
      submit_btt.classList.add("pale");

      squares.forEach(square => {
        square.addEventListener("click", squareClick);
        square.style.pointerEvents = "auto";
      })
    }, 600);


    setTimeout(() => {
      alert("You guessed the category!");
      guessedCategoryBuilder(matchedCategoryName, matchedWords, levelOfComplexity);

      words = words.filter(word => !matchedWords.includes(word));
    }, 1100);
  } else if (!guessed) {
    selected_squares.forEach(square => {
      // square.style.backgroundColor = "gray";
      // square.style.color = "white";
      square.classList.add("shaking");
      square.classList.add("shake");
    })

    const mistakes = document.getElementById("mistakes");
    setTimeout(() => {
      selected_squares.forEach(square => {
        square.classList.remove("shake");
        square.classList.remove("shaking");
        // square.style.backgroundColor = "#5a594e";
        // square.style.color = "white";
      })

      mistakes.lastElementChild.classList.add("fade-out");

      deselect.addEventListener("click", deselectClick);
      deselect.classList.remove("pale");
      submit_btt.classList.remove("black");
      submit_btt.classList.add("pale");

      selected_squares.forEach(square => {
        square.addEventListener("click", squareClick);
        square.style.pointerEvents = "auto";
      })
    }, 600);


    setTimeout(() => {
      mistakes.lastElementChild.remove();

      if (mistakesLeft === 0) {
        alert("Next time!");
        selected_squares.forEach(square => {
          square.classList.remove("selected");
        })
        unveilAll();
      }
    }, 1100);

    mistakesLeft--;
  }
    }

  }, 1000);

  // function guessedCategoryBuilder(category, wordsArr, level) {
  //   for (let i = 0; i < 4; i++) {
  //     squareMover(wordsArr[i], constructingCategory+i);
  //   }

  //   const solved_div = document.createElement('div');
  //   solved_div.classList.add("solved");
  //   if (level === 0) {
  //     solved_div.style.backgroundColor = "#F9DF6D";
  //   } else if (level === 1) {
  //     solved_div.style.backgroundColor = "#A0C35A";
  //   } else if (level === 2) {
  //     solved_div.style.backgroundColor = "#B0C4EF";
  //   } else if (level === 3) {
  //     solved_div.style.backgroundColor = "#BA81C5";
  //   }


  //   const h3_category = document.createElement('h3');
  //   h3_category.classList.add("solved-category");
  //   h3_category.innerText = category;

  //   const h3_words = document.createElement('h3');
  //   h3_words.classList.add("solved-words");
  //   wordsArr.forEach(word => {
  //     h3_words.innerText += word + ", ";
  //   })

  //   solved_div.appendChild(h3_category);
  //   solved_div.appendChild(h3_words);

  //   // DELETE SQUARES
  //   wordsArr.forEach(word => {
  //     getElementByWord(word).remove();
  //   })

  //   solved_div.style.gridArea = `squareStartingWith-${constructingCategory}`;
  //   const replacementWord = `squareStartingWith-${constructingCategory}`;
  //   templateModifier(level, replacementWord);

  //   constructedArr.push(level);
  //   if (constructedArr.length === 4) {
  //     alert("Congratulations, you won!");
  //     document.getElementById("mistakes").classList.add("none");
  //     document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
  //   }

  //   constructingCategory += 4;
  // }

  function guessedCategoryBuilder(category, wordsArr, level) {
    let currentConstructin = constructingCategory;
        if (!constructedArr.includes(level)) {

            let counter = 0;
            const int = setInterval(() => {
              if (counter < 4) {
                squareMover(wordsArr[counter], currentConstructin + counter, 0.3);
                counter++;
              } else {
                clearInterval(int);
              }
            }, 600); 
    
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
            templateModifier((constructedArr.length - 1), replacementWord);
            const container = document.getElementById("words-board");
            const script = container.querySelector("script");
            container.insertBefore(solved_div, script);

            const shuffle = document.getElementById("shuffle");
            shuffle.classList.remove("pale");
            shuffle.removeEventListener("click", shuffleClick);
            shuffle.addEventListener("click", shuffleClick);
            selectedAmount = 0;

            setTimeout(() => {
              if (constructedArr.length === 4) {
                document.getElementById("mistakes").classList.add("none");
                document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
                setTimeout(() => {
                  alert("Congratulations, you won!\nWanna be even cooler? Play again!");
                }, 50);
            }
            }, 150);
          }, 3000);
        }
        constructingCategory += 4;
}

// BAD VERSION FOR SURE
  // function unveilAll() {
  //   let indexedObj = data.categories.map((category, number) => ({
  //     ...category,
  //     number
  //   }));

  //   let globalCounter = 0;
  //   const interval = setInterval(() => {
  //     if (globalCounter < 4) {
  //       if (!constructedArr.includes(indexedObj[globalCounter].number)) {
  //         // for (let i = 0; i < 4; i++) {
  //         //   squareMover(indexedObj[globalCounter].words[i], constructingCategory+i);
  //         // }

  //         let counter = 0;
  //           const int = setInterval(() => {
  //             if (counter < 4) {
  //               squareMover(indexedObj[globalCounter].words[counter], constructingCategory+counter);
  //               counter++;
  //             } else {
  //               clearInterval(int);
  //             }
  //           }, 100);
  
  //         setTimeout(() => {
  //           const solved_div = document.createElement('div');
  //           solved_div.classList.add("solved");
  //           if (indexedObj[globalCounter].number === 0) {
  //             solved_div.style.backgroundColor = "#F9DF6D";
  //           } else if (indexedObj[globalCounter].number === 1) {
  //             solved_div.style.backgroundColor = "#A0C35A";
  //           } else if (indexedObj[globalCounter].number === 2) {
  //             solved_div.style.backgroundColor = "#B0C4EF";
  //           } else if (indexedObj[globalCounter].number === 3) {
  //             solved_div.style.backgroundColor = "#BA81C5";
  //           }
        
        
  //           const h3_category = document.createElement('h3');
  //           h3_category.classList.add("solved-category");
  //           h3_category.innerText = indexedObj[globalCounter].name;
        
  //           const h3_words = document.createElement('h3');
  //           h3_words.classList.add("solved-words");
  //           indexedObj[globalCounter].words.forEach(word => {
  //             h3_words.innerText += word + ", ";
  //           })
        
  //           solved_div.appendChild(h3_category);
  //           solved_div.appendChild(h3_words);
  //           constructedArr.push(indexedObj[globalCounter].number);
        
  //           // DELETE SQUARES
  //           indexedObj[globalCounter].words.forEach(word => {
  //             getElementByWord(word).remove();
  //           })
  
  //           solved_div.style.gridArea = `squareStartingWith-${constructingCategory}`;
  //           const replacementWord = `squareStartingWith-${constructingCategory}`;
  //           templateModifier(indexedObj[globalCounter].number, replacementWord);
  //           const container = document.getElementById("words-board");
  //           const script = container.querySelector("script");
  //           container.insertBefore(solved_div, script);
  
            
  //         }, 500);
  //       }
  //       // document.querySelectorAll(".square").forEach(square => {
  //       //   square.remove();
  //       // })
  //       globalCounter++;
  //       constructingCategory += 4;
  //     } else {
  //       clearInterval(interval);

  //       alert("Don't be upset, you can play again!")
  //       document.getElementById("mistakes").classList.add("none");
  //       document.getElementById("buttons").innerHTML = `<button class="button" onclick="location.reload();">Play again</button>`;

  //       // document.querySelectorAll(".square").forEach(square => {
  //       //   square.remove();
  //       // })
  //     }
  //   }, 5000);
  // }

  // VERSION THAT WORKS
  // function unveilAll() {
  //   let indexedObj = data.categories.map((category, number) => ({
  //     ...category,
  //     number
  //   }));
  
  //   let globalCounter = 0;
  //   const interval = setInterval(() => {
  //     if (globalCounter < 4) {
  //       // Capture the current index in a local variable so the callbacks use the correct value
  //       const currentIndex = globalCounter;
  //       const currentConstructin = constructingCategory;
  //       if (!constructedArr.includes(indexedObj[currentIndex].number)) {
  //         let counter = 0;
  //         const int = setInterval(() => {
  //           if (counter < 4) {
  //             squareMover(indexedObj[currentIndex].words[counter], currentConstructin + counter);
  //             counter++;
  //           } else {
  //             clearInterval(int);
  //           }
  //         }, 1000);
  
  //         setTimeout(() => {
  //           const solved_div = document.createElement('div');
  //           solved_div.classList.add("solved");
  //           // Set background color based on the category number
  //           if (indexedObj[currentIndex].number === 0) {
  //             solved_div.style.backgroundColor = "#F9DF6D";
  //           } else if (indexedObj[currentIndex].number === 1) {
  //             solved_div.style.backgroundColor = "#A0C35A";
  //           } else if (indexedObj[currentIndex].number === 2) {
  //             solved_div.style.backgroundColor = "#B0C4EF";
  //           } else if (indexedObj[currentIndex].number === 3) {
  //             solved_div.style.backgroundColor = "#BA81C5";
  //           }
  
  //           const h3_category = document.createElement('h3');
  //           h3_category.classList.add("solved-category");
  //           h3_category.innerText = indexedObj[currentIndex].name;
  
  //           const h3_words = document.createElement('h3');
  //           h3_words.classList.add("solved-words");
  //           indexedObj[currentIndex].words.forEach(word => {
  //             h3_words.innerText += word + ", ";
  //           });
  
  //           solved_div.appendChild(h3_category);
  //           solved_div.appendChild(h3_words);
  //           constructedArr.push(indexedObj[currentIndex].number);
  
  //           // Remove squares for each word
  //           indexedObj[currentIndex].words.forEach(word => {
  //             getElementByWord(word).remove();
  //           });
  
  //           solved_div.style.gridArea = `squareStartingWith-${currentConstructin}`;
  //           const replacementWord = `squareStartingWith-${currentConstructin}`;
  //           templateModifier(indexedObj[currentIndex].number, replacementWord);
  //           const container = document.getElementById("words-board");
  //           const script = container.querySelector("script");
  //           container.insertBefore(solved_div, script);
  
  //         }, 5000);
  //       }
  //       globalCounter++;
  //       constructingCategory += 4;
  //     } else {
  //       clearInterval(interval);
  //       alert("Don't be upset, you can play again!");
  //       document.getElementById("mistakes").classList.add("none");
  //       document.getElementById("buttons").innerHTML = `<button class="button" onclick="location.reload();">Play again</button>`;
  //     }
  //   }, 5000);
  // }

  function unveilAll() {
    let indexedObj = data.categories.map((category, number) => ({
      ...category,
      number
    })).filter(obj => !constructedArr.includes(obj.number));


    console.log(indexedObj);

    // for (let g; g < 4; g++) {
    //   if ()
    // }
    
    let globalCounter = 0;
    
    // Define the iteration function that processes one category
    function processIteration() {
      if (globalCounter < indexedObj.length) {
        let currentIndex = globalCounter;
        let currentConstructin = constructingCategory;
        if (!constructedArr.includes(indexedObj[currentIndex].number)) {
          const isLastCategory = currentIndex === indexedObj.length - 1;

          if (isLastCategory) {
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
            // templateModifier(indexedObj[currentIndex].number, replacementWord);
            templateModifier((constructedArr.length - 1), replacementWord);
            const container = document.getElementById("words-board");
            const script = container.querySelector("script");
            container.insertBefore(solved_div, script);

            console.log(currentConstructin + " current " + constructingCategory + " global one");
            if (isLastCategory) {
              clearInterval(interval);
              document.getElementById("mistakes").classList.add("none");
              document.getElementById("buttons").innerHTML = `<button class="button again" onclick="location.reload();">Play again</button>`;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  alert("Don't be upset, you can play again!");
                });
              });
            }
          }, (isLastCategory ? 2000 : 2500));
        }
        globalCounter++;
        constructingCategory += 4;
      } else {
        clearInterval(interval);
      }
    }
    
    // Run the first iteration immediately
    processIteration();
    // Then run subsequent iterations every 5000ms
    const interval = setInterval(processIteration, (globalCounter === indexedObj.length-1 ? 2000 : 2500));
  }
  

function templateModifier(rowIndex, replacementWord) {
    const container = document.getElementById('words-board');
    
    const currentTemplate = getComputedStyle(container).gridTemplateAreas;

    const rowsMatch = currentTemplate.match(/"[^"]+"/g);
    const rows = rowsMatch.map(row => row.replace(/"/g, ''));

    // let rows = currentTemplate.replace(/"/g, '').split(/\s*\n\s*/);
    
    rows[rowIndex] = `${replacementWord} ${replacementWord} ${replacementWord} ${replacementWord}`;
    const valueToSet = rows.map(row => `"${row}"`).join('\n');
    
    // container.style.gridTemplateAreas = rows.map(row => `"${row}"`).join('\n');
    container.style.setProperty("grid-template-areas", valueToSet);
    // container.style.gridTemplateAreas = "222";

    console.log("working?");
    console.log(getComputedStyle(document.getElementById('words-board')).gridTemplateAreas);
}

// Example usage:
// templateModifier(1, "dog");


  // squares.forEach(square => {
  //   if (square.classList.contains("selected")) {
  //     square.classList.add("lift-up");
  //     setTimeout(() => {
        
  //     }, timeout);
  //     selectedByUser.push(square.firstElementChild.innerText);
  //   }

  //   pause(50);
  // })

  // WORKS STARTING FROM HERE

  // let userSorted = [...selectedByUser].sort();
  // Object.values(pastTries).forEach(value => {
  //   if (value === userSorted) {
  //     return alert("Already guessed!");
  //   } else {
  //     legitTry++;
  //     pastTries[legitTry] = userSorted;
  //   }
  // })
  
  // let guessed = false;
  // let matchedCategoryName;
  // for (let i = 0; i < data.categories.length; i++) {
  //   const AIwords = data.categories[i].words;
  //   let AIsorted = [...AIwords].sort();

  //   if (userSorted.every((word, index) => word === AIsorted[index])) {
  //     matchedCategoryName = data.categories[i].name;
  //     guessed = true;
  //     break;
  //   }
  // }

  // if (guessed) {
  //   console.log("я вахуи");
  //   // guessedCategoryBuilder(matchedCategoryName);
  // } else if (!guessed) {
  //   // SHAKE
  //   // REMOVE MISTAKE
  //   // DISABLE SUBMIT
  //   // RETURN LISTENERS
    
  //   selected_squares.forEach(square => {
  //     square.classList.add("shake");
  //   })
  //   setTimeout(() => {
  //     selected_squares.forEach(square => {
  //       square.classList.remove("shake");
  //     })
  //   }, 600);

  //   const mistakes = document.getElementById("mistakes");
  //   mistakes.lastElementChild.classList.add("fade-out");
  //   setTimeout(() => {
  //     mistakes.lastElementChild.remove();
  //   }, 800);
  // }
}

// function squareMover(whichOne, whereTo) {
//   // document.getElementById(`square-${whereTo}`).setAttribute("style", `grid-area: square-${whichOne}`);
//   // document.getElementById(`square-${whichOne}`).setAttribute("style", `grid-area: square-${whereTo}`);
//   document.getElementById(`square-${whereTo}`).style.gridArea  = `square-${whichOne}`;
//   document.getElementById(`square-${whichOne}`).style.gridArea  = `square-${whereTo}`;

//   const rectWhichOne = document.getElementById(`square-${whichOne}`).getBoundingClientRect();
//   const rectWhereTo = document.getElementById(`square-${whereTo}`).getBoundingClientRect();
//   let deltaX = rectWhereTo.left - rectWhichOne.left;
//   let deltaY = rectWhereTo.top - rectWhichOne.top;
//   gsap.to(`#square-${whichOne}`, { x: deltaX, y: deltaY, duration: 0.5, ease: "power2.inOut" });
//   gsap.to(`#square-${whereTo}`, { x: -deltaX, y: -deltaY, duration: 0.5, ease: "power2.inOut" });
//   setTimeout(() => {
//     // document.getElementById(`square-${whereTo}`).setAttribute("style", `grid-area: square-${whichOne}`);
//     // document.getElementById(`square-${whichOne}`).setAttribute("style", `grid-area: square-${whereTo}`);
    
//     document.getElementById(`square-${whereTo}`).style.transform = "";
//     document.getElementById(`square-${whichOne}`).style.transform = "";
//     // swapSquares(`square-${whichOne}`, `square-${whereTo}`);
//   }, 500);


//   // gsap.to(`#square-${whereTo}`, { 
//   //   x: "random(-100, 100)", 
//   //   y: "random(-100, 100)", 
//   //   duration: 1, 
//   //   stagger: 0.1 
//   // });
// }

// function squareMover(whichOne, whereTo) {
//   const squareOne = document.getElementById(`square-${whichOne}`);
//   const squareTwo = document.getElementById(`square-${whereTo}`);

//   // 1) FIRST: measure their initial positions
//   const firstRectOne = squareOne.getBoundingClientRect();
//   const firstRectTwo = squareTwo.getBoundingClientRect();

//   // 2) SWAP them in the grid (this changes their final position immediately)
//   squareOne.style.gridArea = `square-${whereTo}`;
//   squareTwo.style.gridArea = `square-${whichOne}`;

//   // (Optional) force a reflow so the browser knows their "new" positions
//   // before we measure again:
//   squareOne.offsetWidth; 
//   squareTwo.offsetWidth;

//   // 3) LAST: measure their final positions
//   const lastRectOne = squareOne.getBoundingClientRect();
//   const lastRectTwo = squareTwo.getBoundingClientRect();

//   // 4) INVERT: Calculate how far each square has moved
//   const dxOne = firstRectOne.left - lastRectOne.left;
//   const dyOne = firstRectOne.top - lastRectOne.top;
//   const dxTwo = firstRectTwo.left - lastRectTwo.left;
//   const dyTwo = firstRectTwo.top - lastRectTwo.top;

//   // Immediately move each square back to its old position via transform
//   // so that visually, it appears unchanged for an instant
//   gsap.set(squareOne, { x: dxOne, y: dyOne });
//   gsap.set(squareTwo, { x: dxTwo, y: dyTwo });

//   // 5) PLAY: Animate them to their new (natural) positions
//   gsap.to(squareOne, { x: 0, y: 0, duration: 0.5, ease: "power2.inOut" });
//   gsap.to(squareTwo, { x: 0, y: 0, duration: 0.5, ease: "power2.inOut" });
// }

// Start: the square with ID 0 is in position 0, ID 1 is in position 1, etc.
let positions = [...Array(16).keys()]; 
console.log(positions)
// i.e. positions = [0, 1, 2, 3, 4, ..., 15]

function getElementAtPosition(pos) {
  // ID of the square at that position
  const squareID = positions[pos];
  // Return the DOM element with that ID
  return document.getElementById(`square-${squareID}`);
}

function getElementByWord(word) {
  const span = document.querySelector(`div.square span[data-word='${word}']`);
  return span.parentElement;
}

function squareMover(fromWord, toPos, timing) {
  if (fromWord === toPos) return; // no-op

  // 1) Identify the DOM elements currently in fromWord, toPos
  const squareOne = getElementByWord(fromWord); // e.g. ID square-5
  const areaOne = getComputedStyle(squareOne).gridArea;
  console.log(squareOne);
  const areOneLast = areaOne.split('-')[1];
  // let idPartOne = element.id.split('-')[1];
  const squareTwo = getElementAtPosition(toPos);   // e.g. ID square-0

  // 2) FIRST - measure their initial bounding boxes
  const firstRect1 = squareOne.getBoundingClientRect();
  const firstRect2 = squareTwo.getBoundingClientRect();

  // 3) LAST - swap them in the grid
  squareOne.style.gridArea = `square-${toPos}`;
  squareTwo.style.gridArea = areaOne;

  // Force the browser to recalc layout
  squareOne.offsetWidth; 
  squareTwo.offsetWidth;

  // 4) measure their final bounding boxes (after swapping in the DOM)
  const lastRect1 = squareOne.getBoundingClientRect();
  const lastRect2 = squareTwo.getBoundingClientRect();

  // 5) INVERT transform: figure out how far they moved
  const dx1 = firstRect1.left - lastRect1.left;
  const dy1 = firstRect1.top - lastRect1.top;
  const dx2 = firstRect2.left - lastRect2.left;
  const dy2 = firstRect2.top - lastRect2.top;

  // Move them back to where they started (so visually they haven't moved yet)
  gsap.set(squareOne, { x: dx1, y: dy1 });
  gsap.set(squareTwo, { x: dx2, y: dy2 });

  // 6) PLAY - animate to their new position
  gsap.to(squareOne, { x: 0, y: 0, duration: timing, ease: "power2.inOut" });
  gsap.to(squareTwo, { x: 0, y: 0, duration: timing, ease: "power2.inOut" });
  // gsap.to(squareTwo { squareTwo.style.transform = ""} )

  // onComplete: () => {gsap.set(squareOne, { clearProps: "all" })}
  // onComplete: () => {gsap.set(squareTwo, { clearProps: "all" })}

  // 7) Update the positions array so it stays correct
  // e.g. if #5 was in fromWord and #0 was in toPos, we swap them
  [positions[areOneLast], positions[toPos]] = [positions[toPos], positions[areOneLast]];

  

  // squareOne.classList.add("square");
  // squareTwo.classList.add("square");
}

// squareMover(0, 5); 

// setTimeout(() => {
//   squareMover(0, 5); 
// }, 1000); 


// function swapSquares(square1, square2) {
//   const gridContainer = document.getElementById("words-board");
  
//   if (!gridContainer) {
//       console.error("Grid container not found");
//       return;
//   }
  
//   let gridTemplate = getComputedStyle(gridContainer).gridTemplateAreas;
//   gridTemplate = gridTemplate.replace(/"/g, '');
  
//   let rows = gridTemplate.split(/\s*\n\s*/).map(row => row.trim().split(/\s+/));
  
//   let pos1, pos2;
  
//   for (let r = 0; r < rows.length; r++) {
//       for (let c = 0; c < rows[r].length; c++) {
//           if (rows[r][c] === square1) pos1 = { r, c };
//           if (rows[r][c] === square2) pos2 = { r, c };
//       }
//   }
  
//   if (!pos1 || !pos2) {
//       console.error("One or both squares not found");
//       return;
//   }
  
//   [rows[pos1.r][pos1.c], rows[pos2.r][pos2.c]] = [rows[pos2.r][pos2.c], rows[pos1.r][pos1.c]];
  
//   let newTemplate = rows.map(row => `"${row.join(' ')}"`).join('\n');
//   gridContainer.style.gridTemplateAreas = newTemplate;
// }
