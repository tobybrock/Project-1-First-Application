
//GET weather api
async function getWeather(city){
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=3f83b809a68640b8957ad8619c559f88`)
    .catch(e => console.log(e));
    //append data to carousel
    fortnightForecast(response.data);
 }
 
 //GET Image API
 //the condition variable is a weather description from the getWeather API
 async function getPicture(condition){
     const response = await $.ajax(`https://api.unsplash.com/search/photos?page=1&query=${condition}&client_id=Qll_xnk7d3ktu5Ek9TgLO_6A8nm3ucuWCCIUVjFaq3E`)
     .catch(e => console.log(e));
     let random = Math.floor(Math.random() * Math.floor(10)); //get one of 10 random images
     return( response.results[random].urls.regular);
 }

//On Ready Function
$(() => {
$("#cityBtn").on('click', (e) => {
    let city = $("#cityInput").val();
    $("#header").append(`<h1>Fortnightly forcast for ${$("#cityInput").val()}</h1>`);
    carousel();
    getWeather(city);
});

settingsMenu();
hideJumbo();    
showCarousel();
});

function settingsMenu() {
    //toggles a class when li is clicked to apply and remove styling
    $(".checkbox-menu").on("change", "input[type='checkbox']", function() {
        $(this).closest("li").toggleClass("active", this.checked);
     });

     //allows settings to stay open on internal click events
     $(document).on('click', '.allow-focus', function (e) {
        e.stopPropagation();
      });
}
//This function appends API data gathered from the weather and image APIs to an unordered list inside a carousel
function fortnightForecast(data) {
    console.log(data);
    const weatherData = $(".slides");
    const settingsCheck = [
        {condition:"snow", measure:"mm", name:"Total Snowfall:"},
        {condition:"wind_spd", measure:"m/s", name:"Wind Speed:"},
        {condition:"clouds", measure:"%", name:"Colud Coverage:"},
        {condition:"vis", measure:"km", name:"Visibility:"},
        {condition:"rh", measure:"%", name:"Humidity:"}
    ]
    for(let i =0; i < 14; i++){
        console.log( "data", data[i]);
        //runs through settings checked boxes and appends data to the carousel
      
        weatherData.append(`<li class="slide" id="slide${i}">Date: ${data[i].datetime}&emsp;${getDayName(data[i].datetime, undefined)}<br>
        Average temperature: ${data[i].temp}°C<br>
        Weather condition: ${data[i].weather.description}<br></li>`);

        for(let j = 0; j < settingsCheck.length; j++){
            if($(`#check${j}`).prop("checked")){
                console.log(data[i][settingsCheck[j].condition]);
                $(`#slide${i}`).append(`${settingsCheck[j].name} ${data[i][settingsCheck[j].condition]}${settingsCheck[j].measure}<br>`);
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
    const slideContainer =carousel.find(".slides");
    
    //animate on click to move the carousel right

   $(carouselBtnRight).on('click', (() =>{
       if(currentSlide < 14){
        slideContainer.animate({"margin-left": "-=" + width}, animationSpeed, (() => {
            currentSlide ++;
            console.log(currentSlide);
        }));
    }
    }));
   
     //animate on click to move the carousel 
     
    $(carouselBtnLeft).on('click', (() =>{
        if(currentSlide > 1){
        slideContainer.animate({"margin-left": "+=" + width}, animationSpeed, (() => {
            currentSlide --;
            console.log(currentSlide);
        }));
    }
    }));

}
//Get day from date
function getDayName(dateStr, locale)
{
    var date = new Date(dateStr);
    return date.toLocaleDateString(locale, { weekday: 'long' });        
}

//hide Jumbotron after search is clicked **will need styling
function hideJumbo(){
    $("#cityBtn").on('click', (() => {
        let jumbo = $(".searchCityJumbo");
        jumbo.hide();

    }));
    
}

//show the carousel after search is clicked **will need styling
function showCarousel() {
    $("#cityBtn").on('click', (() => {
        let carousel = $("#carousel");
        let btnLeft = $("#carouselBtnLeft");
        let btnRight = $("#carouselBtnRight");
        let carouselJumbo = $(".carouselJumbo");
        carousel.show();
        btnLeft.show();
        btnRight.show();
        carouselJumbo.css("display", "flex");
    }));
}