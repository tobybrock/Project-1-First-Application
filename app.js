
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
     const response = await $.ajax(`https://pixabay.com/api/?key=16762787-98934c07282a01a02ff313326&q=${condition}&image_type=photo`)
     .catch(e => console.log(e));
     //console.log(response.hits[0].webformatURL);
     let random = Math.floor(Math.random() * Math.floor(5));
     return(response.hits[random].webformatURL);
 }

//On Ready Function
$(() => {
$("#cityBtn").on('click', (e) => {
    let city = $("#cityInput").val();
    
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
    const weatherData = $(".slides");
    const settingsCheck = [
        "snow",
        "wind_spd",
        "clouds",
        "vis",
        "rh"
    ]
    for(let i =0; i < 14; i++){
        weatherData.append(`<li class="headerSlide">${getDayName(data[i].datetime, undefined)}</li>`);
        //runs through settings checked boxes and appends data to the carousel
        for(let ii = 0; ii < settingsCheck.length; ii++){
            if($(`#check${ii}`).prop("checked") == true){
                weatherData.append(`<li class="slide" id="slide${i}">${data[i].settingsCheck[ii]}<br></li>`);
        }
    }
        weatherData.append(`<li class="slide" id="slide${i}">${data[i].datetime}<br>${data[i].temp}<br>${data[i].weather.description}</li>`);
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
        let carousel = $('#carousel');
        let btnLeft = $("#carouselBtnLeft");
        let btnRight = $("#carouselBtnRight");
        carousel.show();
        btnLeft.show();
        btnRight.show();
        
    }));
}