const weatherCard1 = $(".Weather-card-1")
const weatherCard2 = $(".Weather-card-2")
const weatherCard3 = $(".Weather-card-3")
const weatherCard4 = $(".Weather-card-4")
const weatherCard5 = $(".Weather-card-5")
const historyEl = $(".history")

const currentWeather = $(".Current-Weather")
const inputSearch = $("#input-search-city")
const searchButton = $("#submit")
var currentCard = weatherCard1
var localHistory = []
var historyLoaded = false
if (localStorage.getItem('localHistory')) {
    var localHistory = JSON.parse(localStorage.getItem('localHistory'))
    console.log(localHistory)
    loadHistory()
} else {
    var localHistory = [];
}


searchButton.click(function(e) {
    e.preventDefault()
    var city = inputSearch.val();
    currentCard = weatherCard1;
    getCurrentWeather(city)
    getForecast(city)
    if(localHistory.indexOf(city) === -1){
        localStorage.setItem("last-search",city)
        if (!($('button').hasClass(`${city}`))){
            
            localHistory.push(`${city}`)
            localStorage.setItem("localHistory", JSON.stringify(localHistory))
        }  
    }
   
    loadHistory(city)
})
historyEl.click(function(e){
    var city = e.target.innerText
    getCurrentWeather(city)
    getForecast(city)
    
})



function getCurrentWeather(city) {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=1c7ba168ec80866d4c17db02597dbb6f`,
        method: "GET"

    }).then(function (response) {
        var date = new Date();
        currentWeather.empty()
        currentWeather.addClass('border');
        currentWeather.append(
            $(`<h1>${response.name}</h1>`),
            $(`<h2>${date}</h2>`),
            $(`<h3>${response.weather[0].description}</h3>`),
            $(`<img src="http://openweathermap.org/img/w/${response.weather[0].icon}.png"></img>`),
            $(`<h3>currentWeather ${response.main.temp}&#176</h3>`),
            $(`<h3>humidity ${response.main.humidity}</h3>`),
            $(`<h3>windSpeed ${response.wind.speed}</h3>`),
        )
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&APPID=1c7ba168ec80866d4c17db02597dbb6f`,
            method: "GET"

        }).then(function (response) {
            currentWeather.append(
                $(`<h3>UV Index ${response.value}</h3>`)
            )
        })
    })
}

function getForecast(city) {
    currentCard = weatherCard1
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=1c7ba168ec80866d4c17db02597dbb6f`,
        method: "GET"

    }).then(function (response) {
        emptyCard();
        for (let i = 0; i < 40; i += 1) {
            currentCard.addClass('border')
            currentCard.append(
                $(`<p>${response.city.name}</p>`),
                $(`<p>${moment(response.list[i].dt_txt).format("dddd")}</p>`),
                $(`<p>${response.list[i].weather[0].description}</p>`),
                $(`<img src="http://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png"></img>`),
                $(`<p>currentWeather ${response.list[i].main.temp}&#176</p>`),
                $(`<p>humidity ${response.list[i].main.humidity}</p>`),
                $(`<p>windSpeed ${response.list[i].wind.speed}</p>`),

            )
            currentCard = currentCard.next();
            

        }
    })
}

function emptyCard(){
 weatherCard1.empty()
 weatherCard2.empty()
 weatherCard3.empty()
 weatherCard4.empty()
 weatherCard5.empty()
}

function loadHistory(city){
    historyEl.empty()
    if (historyLoaded === true) {
    for(var i = 0; i < localHistory.length; i++){
        historyEl.append($(`<button class="btn btn-outline-secondary ${city}">${localHistory[i]}</button>`))
        }
    } else if (historyLoaded === false) {
        for(var i = 0; i < localHistory.length; i++){
            historyEl.append($(`<button class="btn btn-outline-secondary ${localHistory[i]}">${localHistory[i]}</button>`))
            }
            historyLoaded = true
    }
}