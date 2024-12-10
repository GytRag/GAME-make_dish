const order = document.querySelector('.order') as HTMLDivElement;
const ingredients = document.querySelector('.ingredients') as HTMLDivElement;
const scoreBoard = document.querySelector('.scoreBoard') as HTMLElement;
const points = document.querySelector('.points') as HTMLElement;
const time = document.querySelector('.time') as HTMLElement;

// buttons
const startBtn = document.querySelector('.startBtn') as HTMLButtonElement;
const saveBtn = document.querySelector('.saveBtn') as HTMLButtonElement;
const loadBtn = document.querySelector('.loadBtn') as HTMLButtonElement;


// interface
interface DishesInterface {
    dish: string
    ingredients: string[]
}
interface DishArrayInterface {
    name: string,
    product: string[],
    match: boolean[]
}
interface gameStatInterface {
    sumPoints: number,
    seconds: number
}

//arrays
const dishes: DishesInterface[] = [
    {
        "dish": "Toast 🍞",
        "ingredients": ["🍞", "🧈"]
    },
    {
        "dish": "Salad 🥗",
        "ingredients": ["🥬", "🥕", "🥒"]
    },
    {
        "dish": "Hot Dog 🌭",
        "ingredients": ["🌭", "🍞", "🧅"]
    },
    {
        "dish": "Pizza 🍕",
        "ingredients": ["🍞", "🍅", "🧀"]
    },
    {
        "dish": "Pasta 🍝",
        "ingredients": ["🍝", "🍅", "🧀", "🌿"]
    },
    {
        "dish": "Burger 🍔",
        "ingredients": ["🥩", "🍞", "🧀", "🍅", "🥬"]
    },
    {
        "dish": "Taco 🌮",
        "ingredients": ["🌮", "🥩", "🧀", "🥬", "🍅"]
    },
    {
        "dish": "Sushi 🍣",
        "ingredients": ["🍚", "🐟", "🥢", "🥑", "🍋"]
    },
    {
        "dish": "Ramen 🍜",
        "ingredients": ["🍜", "🥩", "🥚", "🌿", "🧄", "🧅"]
    },
    {
        "dish": "Feast 🍽️",
        "ingredients": ["🍗", "🍖", "🍞", "🍷", "🥗", "🧁", "🍇"]
    }
]
const allIngredientsArrFull: string[] = []
for (let i = 0; i < dishes.length; i++) {
    allIngredientsArrFull.push(...dishes[i].ingredients)
}
const allIngredientsArr: string[] = [...new Set(allIngredientsArrFull)];
let dishesSort: DishesInterface[] = dishes;
let dishArr: DishArrayInterface[] = [];

// game play statistic
let gameStat: gameStatInterface = {
    sumPoints: 0,
    seconds: 60
}

// game play variables
let gameOn = true;
const addSeconds: number = 10;

// save game
saveBtn.onclick = () => {
    gameOn = false;
    localStorage.setItem('kitchenStat', JSON.stringify(gameStat));
}

// load game
loadBtn.onclick = () => {
    if(localStorage.getItem('kitchenStat') !== null) {
        //@ts-ignore
        gameStat = JSON.parse(localStorage.getItem('kitchenStat'))
        letTheGameBegin()
    }else {
        letTheGameBegin()
    }
}

// game start
startBtn.onclick = () => {
    letTheGameBegin()
}

function letTheGameBegin(){
    startBtn.style.display = 'none';
    loadBtn.style.display = 'none';
    saveBtn.style.display = 'block';
    scoreBoard.style.display = 'flex';

    gamePlay()
    setInterval(print, 1000)

    function print() {
        if(gameStat.seconds > 0 && gameOn){
            gameStat.seconds--;
            time.innerText = `Time: ${gameStat.seconds}`
        }else return

    }
    function gamePlay() {

        points.innerText = `Points: ${gameStat.sumPoints}`;
        dishesSort.sort(() => 0.5 - Math.random());

        ingredients.innerHTML = '';
        order.innerHTML = '';
        dishArr = [];

        allIngredientsArr.map((item) => {
            ingredients.innerHTML += `<div class="ingred">${item}</div>`
        })

        for (let i = 0; i < 3; i++) {
            dishArr.push({
                name: dishesSort[i].dish,
                product: dishesSort[i].ingredients,
                match: []
            })
            for (let j = 0; j < dishArr[i].product.length; j++) {
                dishArr[i].match.push(false)
            }
        }

        dishArr.map((item, index) => {
            order.innerHTML += `
            <div class="">
                <div class="orederName">${item.name}</div>
                <div class="orderIngredients d-flex flex-wrap" id="${index}"></div>
            </div>
            `
            const orderIngredients = document.querySelectorAll('.orderIngredients') as NodeListOf<HTMLDivElement>;

            dishArr[index].product.map((x, i) => {
                orderIngredients[index].innerHTML += `
            <div>${x}</div>
            `
            })

            const ingredient = document.querySelectorAll('.ingred') as NodeListOf<HTMLDivElement>;
            const notTrue = (el: boolean) => !el;
            updateProduct()

            function updateProduct() {

                if(gameOn){
                    if (gameStat.seconds >= 0){
                        ingredient.forEach((btn) => {
                            btn.onclick = (event) => {

                                // @ts-ignore
                                const eTi: string = event.target.innerText

                                function checkToGreen(num: number) {
                                    if (dishArr[num].product.indexOf(eTi) >= 0) {
                                        dishArr[num].match[dishArr[num].product.indexOf(eTi)] = true;
                                        orderIngredients[num].innerHTML = '';
                                        dishArr[num].product.map((x, i) => {
                                            if (i === dishArr[num].product.indexOf(eTi) || dishArr[num].match[i]) {
                                                orderIngredients[num].innerHTML += `
                                 <div class="green">${x}</div>
                             `
                                            } else {
                                                orderIngredients[num].innerHTML += `
                                 <div>${x}</div>
                             `
                                            }

                                        })
                                    }
                                }

                                if (dishArr[0].match.some(notTrue)) {
                                    checkToGreen(0)
                                } else if (dishArr[1].match.some(notTrue)) {
                                    checkToGreen(1)
                                } else if (dishArr[2].match.some(notTrue)) {
                                    checkToGreen(2)
                                }

                                if (!dishArr[0].match.some(notTrue) && !dishArr[1].match.some(notTrue) && !dishArr[2].match.some(notTrue)) {
                                    gameStat.sumPoints++;
                                    gameStat.seconds += addSeconds;
                                    time.innerText = `Time: ${gameStat.seconds}`
                                    gamePlay()
                                }
                                updateProduct()
                            }

                        })
                    }
                    else {

                    }
                }
                else {
                    time.innerText = `Time: ${gameStat.seconds}`
                    return
                }

            }

        })
    }
}