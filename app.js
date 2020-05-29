
//GET weather api
async function getWeather(city){
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=3f83b809a68640b8957ad8619c559f88`)
    .catch(e => console.log(e));
    //append data to carousel
    fortnightForecast(response.data);
    console.log(response.data[0]);
    
 }



 //GET Image API
 //the condition variable is a weather description from the getWeather API
 async function getPicture(condition){
     const response = await $.ajax(`https://pixabay.com/api/?key=16762787-98934c07282a01a02ff313326&q=${condition}&image_type=photo`)
     .catch(e => console.log(e));
     //console.log(response.hits[0].webformatURL);
     return(response.hits[0].webformatURL);
     
 }
//On Ready Function
$(() => {
$("#cityBtn").on('click', (e) => {
    let city = $("#cityInput").val();
    
    carousel();
    getWeather(city);
    
});
hideJumbo();    
showCarousel();
});

//This function appends API data gathered from the weather and image APIs to an unordered list inside a carousel
function fortnightForecast(data) {
    const weatherData = $(".slides");
    for(let i =0; i < 14; i++){
        weatherData.append(`<li class="slide">${data[i].datetime} ${data[i].temp} ${data[i].weather.description}</li>`);
        console.log(data[i].weather.description);
        //Use weather description as the condition in GetPicture
        let weatherDescription = (data[i].weather.description);
        let replaced = weatherDescription.split(' ').join('+');
        getPicture(replaced).then((pictureUrl) => {
        console.log(pictureUrl);
        console.log($(".slide").children);
       $(".slide").append(`<li class="slideImage"><img src=${pictureUrl}></li>`);
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
        let carousel = $('#carousel');
        let btnLeft = $("#carouselBtnLeft");
        let btnRight = $("#carouselBtnRight");
        carousel.show();
        btnLeft.show();
        btnRight.show();
        
    }));
}