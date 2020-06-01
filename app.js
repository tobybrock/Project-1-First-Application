
//GET weather api
async function getWeather(city) {
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=3f83b809a68640b8957ad8619c559f88`)
        .catch(e => console.log(e));
    //append data to carousel
    fortnightForecast(response.data);
}

//GET Image API
//the condition variable is a weather description from the getWeather API
async function getPicture(condition) {
    const response = await $.ajax(`https://api.unsplash.com/search/photos?page=1&query=${condition}&client_id=Qll_xnk7d3ktu5Ek9TgLO_6A8nm3ucuWCCIUVjFaq3E`)
        .catch(e => console.log(e));
    let random = Math.floor(Math.random() * Math.floor(10)); //get one of 10 random images
    return(response.results[random].urls.regular);
}
//Get Background Image
async function backgroundPicture(City) {
    const response = await $.ajax(`https://api.unsplash.com/search/photos?page=1&query=${City}&client_id=Qll_xnk7d3ktu5Ek9TgLO_6A8nm3ucuWCCIUVjFaq3E`)
        .catch(e => console.log(e));
    return(response.results[0].urls.regular);
}
async function getRandomCityTemp(){
    let capitals ="Port-au-Prince,Tegucigalpa,Budapest,Reykjavik,New Delhi,Jakarta,TehranBaghdad,Dublin,Jerusalem,Rome,Kingston,Tokyo,Amman,Astana,Nairobi,Tarawa Atoll,Pyongyang,Seoul,Pristina,KuwaitCity,Bishkek,Vientiane,Riga,Maseru,Monrovia,Tripoli,Vaduz,Vilnius,Luxembourg,Skopje,Antananarivo,Lilongwe,KualaLumpur,Male,Bamako,Valletta,Majuro,Nouakchott,PortLouis,MexicoCity,Palikir,Chisinau,Monaco,Ulaanbaatar,Podgorica,Rabat,Maputo,Naypyidaw,Windhoek,YarenDistrict,Kathmandu,Amsterdam,Wellington,Managua,Niamey,Abuja,Oslo,Muscat,Islamabad,Melekeok,PanamaCity,PortMoresby,Asuncion,Lima,Manila,Warsaw,Lisbon,Doha,Bucharest,Moscow,Kigali,Basseterre,Castries,Kingstown,Apia,SanMarino,SaoTome,Riyadh,Dakar,Belgrade,Victoria,Freetown,Singapore,Bratislava,Ljubljana,Honiara,Mogadishu,Pretoria,CapeTown,Bloemfontein,Juba,Madrid,Khartoum,Paramaribo,Mbabane,Stockholm,Bern,Damascus,Taipei,Dushanbe,Dodoma,Bangkok,Lome,Nuku’alofa,Tunis,Ankara,Ashgabat,Funafuti,Kampala,Kyiv,AbuDhabi,London,Washington,Montevideo,Tashkent,Port-Vila,VaticanCity,Caracas,Hanoi,Sanaa,Lusaka,Harare";
    const capitalArray = capitals.split(",");
    let random = Math.floor(Math.random() * Math.floor(capitalArray.length));
    let capital = capitalArray[random];
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${capital}&key=3f83b809a68640b8957ad8619c559f88`)
    .catch(e => console.log(e));
    console.log("test", response.data[0].temp);
    let temp = response.data[0].temp;
    return[capital, temp];
}

//On Ready Function
$(() => {
    $("#cityBtn").on('click', async(e) => {
        let city = $("#cityInput").val();
        let background = await backgroundPicture(city);
        if(city !== undefined){
        $("body").css("background-image", 'url("' + background + '")');
        $(".slides").empty();
        $("#header").empty();
        $("#header").append(`<h1>Fortnightly forcast for ${$("#cityInput").val()}</h1>`)
        showCarousel();
        getWeather(city);
        }
    });
        $("#cityInput").keypress(function (e) {
        if (e.which == 13) {
            let city = $("#cityInput").val();
            if(typeof(city) !== undefined){
            $("body").css("background-image", 'url("' + backgroundPicture(city) + '")');
            $(".slides").empty();
            $("#header").empty();
            $("#header").append(`<h1>Fortnightly forcast for ${$("#cityInput").val()}</h1>`);
            showCarousel();
            getWeather(city);
            }
        }
    });
    //getRandomCityTemp();
    settingsMenu();
    carousel();
    colderCapital();
});

function settingsMenu() {
    //toggles a class when li is clicked to apply and remove styling
    $(".checkbox-menu").on("change", "input[type='checkbox']", function () {
        $(this).closest("li").toggleClass("active", this.checked);
    });

    //allows settings to stay open on internal click events
    $(document).on('click', '.allow-focus', function (e) {
        e.stopPropagation();
    });
}


//This function appends API data gathered from the weather and image APIs to an unordered list inside a carousel
function fortnightForecast(data) {
    console.log(data[0]);
    const weatherData = $(".slides");
    const settingsCheck = [
        { condition: "snow", measure: "mm", name: "Total Snowfall:" },
        { condition: "wind_spd", measure: "m/s", name: "Wind Speed:" },
        { condition: "clouds", measure: "%", name: "Colud Coverage:" },
        { condition: "vis", measure: "km", name: "Visibility:" },
        { condition: "rh", measure: "%", name: "Humidity:" }
    ]
    
    for (let i = 0; i < data.length-2; i++) {
        let weatherIcon =`https://www.weatherbit.io/static/img/icons/${data[i].weather.icon}.png`;
        weatherData.append(`<li class="slide" id="slide${i}"><h2>Date: ${data[i].datetime}&emsp;${getDayName(data[i].datetime, undefined)}<br>
        Average temperature: ${data[i].temp}°C<br>
        Weather condition: ${data[i].weather.description} <img class="weatherIcon" src="${weatherIcon}"><br> </h2></li>`);

        //runs through settings checked boxes and appends data to the carousel
        for (let j = 0; j < settingsCheck.length; j++) {
            if ($(`#check${j}`).prop("checked")) {
                $(`#slide${i}`).append(`<h2>${settingsCheck[j].name} ${data[i][settingsCheck[j].condition]}${settingsCheck[j].measure}<br></h2>`);
            }
        }
        //Use weather description as the condition in GetPicture
        let weatherDescription = (data[i].weather.description);
        let replaced = weatherDescription.split(' ').join('+');
        getPicture(replaced).then((pictureUrl) => {
            $(`#slide${i}`).css(`background-image`, `url(${pictureUrl})`);
        });

    }
}

//Create a carousel
function carousel() {
    const width = 720;
    const animationSpeed = 1000;
    let currentSlide = 1;
    const carousel = $("#carousel");
    const slideContainer = carousel.find(".slides");
    //animate on click to move the carousel right
    
    $(carouselBtnRight).on('click', (() => {
        if (currentSlide < 14) {
            slideContainer.animate({ "margin-left": "-=" + width }, animationSpeed, (() => {
                currentSlide++;
                console.log(currentSlide);
            }));
        }
    }));
    //animate on click to move the carousel 
            $(carouselBtnLeft).on('click', (() => {
            if (currentSlide > 1) {
            slideContainer.animate({ "margin-left": "+=" + width }, animationSpeed, (() => {
                currentSlide--;
                console.log(currentSlide);
            }));
            }
    }));
}
//Get day from date
function getDayName(dateStr, locale) {
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

//show the carousel after search is clicked
function showCarousel() {
        let carousel = $("#carousel");
        let btnLeft = $("#carouselBtnLeft");
        let btnRight = $("#carouselBtnRight");
        let carouselJumbo = $(".carouselJumbo");
        let quizJumbo = $(".quizJumbo");
        carousel.show();
        btnLeft.show();
        btnRight.show();
        carouselJumbo.css("display", "flex");
        quizJumbo.show();
}

    async function colderCapital() {
        let values = await getRandomCityTemp();
        let cap1 = values[0];
        let temp1 = values[1];
        let values2 = await getRandomCityTemp();
        let cap2 = values2[0];
        let temp2 = values2[1];
        let winstreak = $("#winstreak");
    const colder = $(".colderCapitalCity");
    let counter = 0;
    winstreak.append(counter);
    let quizBtn = $(".quizBtn");
    let leftBtn = $("#leftBtn");
    let rightBtn = $("#rightBtn");
    leftBtn.text(cap1);
    rightBtn.text(cap2);
   $("#nextRoundBtn").on('click', async function(){
    values = await getRandomCityTemp();
    cap1 = values[0];
    temp1 = values[1];
    values2 = await getRandomCityTemp();
    cap2 = values2[0];
    temp2 = values2[1];
    winstreak = $("#winstreak");
    leftBtn.text(cap1);
    rightBtn.text(cap2);
    quizBtn.removeClass("disabled");
   });
    if(temp1 > temp2){
        leftBtn.on('click', (() =>{
            alert(`Incorrect ${cap2} is ${temp2}°C while ${cap1} is ${temp1}°C`);
            counter = 0;
            winstreak.empty();
            winstreak.append(counter);
            quizBtn.addClass("disabled");
        }));
        rightBtn.on('click', (() =>{
            alert(`Correct! ${cap2} is ${temp2}°C while ${cap1} is ${temp1}°C`);
            counter ++;
            winstreak.empty();
            winstreak.append(counter);
            quizBtn.addClass("disabled");
        }));
    } else if(temp1 < temp2){
        leftBtn.on('click', (() =>{
            alert(`Correct! ${cap1} is ${temp1}°C while ${cap2} is ${temp2}°C`);
            counter ++;
            winstreak.empty();
            winstreak.append(counter);
            quizBtn.addClass("disabled");
        }));
        rightBtn.on('click', (() =>{
            alert(`Incorrect ${cap1} is ${temp1}°C while ${cap2} is ${temp2}°C`);
            counter = 0;
            winstreak.empty();
            winstreak.append(counter);
            quizBtn.addClass("disabled");
        }));
    }
    
}