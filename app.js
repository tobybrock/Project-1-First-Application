
getPicture();
async function getWeather(city){
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=3f83b809a68640b8957ad8619c559f88`)
    .catch(e => console.log(e));
    fortnightForecast(response.data);
    console.log(response.data[0]);
    
 }

 async function getPicture(condition){
     const response = await $.ajax(`https://pixabay.com/api/?key=16762787-98934c07282a01a02ff313326&q=${condition}&image_type=photo`)
     .catch(e => console.log(e));
     console.log(response.imageURL);
 }

$(() => {
$("#cityBtn").on('click', (e) => {
    let city = $("#cityInput").val();
    hideJumbo();
    getWeather(city);
    carousel();
})    
})

function fortnightForecast(data) {
    const weatherData = $(".slides");
    for(let i =0; i < 14; i++){
        weatherData.append(`<li class="slide">${data[i].datetime} ${data[i].temp}C ${data[i].weather.description}</li>`);
        console.log(data[i]);
        
    }
}

function carousel() {
    const width = 720;
    const animationSpeed = 1000;
    let currentSlide = 1;
    const carousel = $("#carousel");
    const slideContainer =carousel.find(".slides");
    const slides = $('.slide');
    
   $(carouselBtnRight).on('click', (() =>{
        slideContainer.animate({"margin-left": "-=" + width}, animationSpeed, (() => {
            currentSlide ++;
            console.log(currentSlide);
        }));
    }));
   
    $(carouselBtnLeft).on('click', (() =>{
        slideContainer.animate({"margin-left": "+=" + width}, animationSpeed, (() => {
            currentSlide --;
            console.log(currentSlide);
            if(currentSlide === 1){
                currentSlide =1;
            }
        }));
    }));

}
function hideJumbo(){
    $("#searchCityJumbo").hide();
}