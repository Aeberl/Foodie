const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

// Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', function(e) {
    console.log(e.target)
    let targ = e.target
    //let mealer = document.getElementsByClassName('meal-info')
    if(targ){
        let target = targ.getAttribute('data-mealid')
        console.log(target)
        getMealById(target)
    }
})

/* mealsEl.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        console.log(item)
        console.log(item.classList)
        console.log(item.className)
        if (item.classList) {
            return item.classList.contains('meal-info');
        }else{
            return false;
        }
    })

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid')
        getMealById(mealID)
    }
}) */

// Fetch meal by ID
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0]
        addMealToDOM(meal)
    })
}

    // Search meal using fetch API
function searchMeal(e) {
    e.preventDefault();

    // Clear single meal
    single_mealEl.innerHTML = '';

    // Get search term

    const term = search.value;

    // Check for empty
    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            resultHeading.innerHTML = 
            `<h2>Search results for '${term}'</h2>`
            if (data.meals === null) {
                resultHeading.innerHTML = '<p>There is no result for the term</p>'
            }else {
                mealsEl.innerHTML = data.meals.map(meal => 
                    `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                    `).join('');
            }
        });
        // Clear search text
        search.value = ''
    }else {
        alert('Please enter a search term')
    }
}

// Fetch random meal from API
function getRandomMeal(){
    // Clear meals and heading
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''

    //fetch a random meal
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0]
        addMealToDOM(meal)
    })
}

// Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            )
        } else {
            break
        }
    }
    // todo: add jump or smoth scroll to a particular meal 
    //on click in search results
    
    single_mealEl.innerHTML = `
        <div class="single-meal" >
            <div>
                <h1>${meal.strMeal}</h1>
                <img src="${meal.strMealThumb}" alt=${meal.strMeal}/>
                <div class="single-meal-info">
                    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                    ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
                </div>
                <a href="id="eater"></a>
            </div>
            <div class="main">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div>
    `
}