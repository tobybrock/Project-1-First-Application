
async function getWeather(city){
    const response = await $.ajax(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=3f83b809a68640b8957ad8619c559f88`)
    .catch(e => console.log(e));
    console.log(response.data[0]);
 }

$(() => {
$("#cityBtn").on('click', (e) => {
    let city = $("#cityInput").val();
    getWeather(city);
})    
})

