let closeCourses;
let currentCourse;
let numHoles;
let numPlayers = 0;
let playerName = [];
let parTotal = 0;
let totalYards = 0;
let holePar;
let lati;
let longi;
let holeYards;
let local_obj;
let zipSearch;
let handicap;
let totalHCP = 0;
let arr = [];
let key = 'AIzaSyCDt-DBTk2MCvsZZI_9pB7IInyxu3pJt0Y';
//lat 40.391617 lng -111.850766 -- original local_obj

function getLocation(zipCode){
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address='+zipCode+'&key='+key+'', function(data, status){
        zipSearch = data;
        console.log(data);
        lati = zipSearch.results[0].geometry.location.lat;
        longi = zipSearch.results[0].geometry.location.lng;
        local_obj = {latitude: lati, longitude: longi, radius: 100};
        loadCourse();
        $('#selectCourse').html("");
    })
}
function loadCourse() {
    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function(data, status) {
        closeCourses = JSON.parse(data);
        for (let i in closeCourses.courses){
            console.log(closeCourses.courses[i].name);
            $('#selectCourse').append('<option value="' + closeCourses.courses[i].id + '">' + closeCourses.courses[i].name + '</option>');
        }
    });
}
function getCourse(courseId){
    $('.scoreColumn').html("");
    $('#teeSelect').html("");
    $.get("https://golf-courses-api.herokuapp.com/courses/" + courseId, function(data){
        currentCourse = JSON.parse(data);
        console.log(currentCourse);
        for(let t in currentCourse.course.tee_types){
            let teeName = currentCourse.course.tee_types[t].tee_type;
            $('#teeSelect').append("<option value='" + t + "'>"+ teeName +"</option>");
        }
    });
}
function buildCard(myTee){

    if($('.playerOne').val().trim() !== ""){
        playerName.push($('.playerOne').val());
        numPlayers++;
    }
    if($('.playerTwo').val().trim() !== ""){
        playerName.push($('.playerTwo').val());
        numPlayers++
    }
    if($('.playerThree').val().trim() !== ""){
        playerName.push($('.playerThree').val());
        numPlayers++
    }
    if($('.playerFour').val().trim() !== ""){
        playerName.push($('.playerFour').val());
        numPlayers++
    }
    // for(let i in playerName){
    //     if(playerName[Number(i)] === playerName[(Number(i)+1)]){
    //         console.log("same!!");
    //     }
    // }
    if($('.playerOne').val().trim() === "" && $('.playerTwo').val().trim() === "" && $('.playerThree').val().trim() === "" && $('.playerFour').val().trim() === ""){
       alert("Please enter a player.");
    } else {
        $('.container').hide();
        $('html').css("background-image", "url(./images/course3.jpg)");
        numHoles = currentCourse.course.holes;
        for (let c in numHoles) {
            holePar = currentCourse.course.holes[c].tee_boxes[myTee].par;
            $('.scoreColumn').append("<div id='column" + (Number(c) + 1) + "' class='column'><div class='holeNumber'>" + (Number(c) + 1) + "</div><div class='holeNumber'>Par " + holePar + "</div></div>");
            parTotal += holePar;
            holeYards = currentCourse.course.holes[c].tee_boxes[myTee].yards;
            handicap = currentCourse.course.holes[c].tee_boxes[myTee].hcp;
            if (handicap === undefined) {
                handicap = "0";
            }
            totalYards += holeYards;
            totalHCP += handicap;
            $('#column' + (Number(c) + 1)).append("<div class='yards'>Yards:</div><div class='yards2'>" + holeYards + "</div><div class='handicap'>HCP:</div><div class='handicap2'>" + handicap + "</div>");
        }
        //let thumbNail = currentCourse.course.thumbnail;
        $('.scoreColumn').append("<div class='totals column'><div class='total' >Totals:</div><div class='total'>Par " + parTotal + "</div><div class='yards'>Yards:</div><div class='yards2'>" + totalYards + "</div></div>");
        $('.scoreColumn').append("<div class='totalColumn column'><div class='score'>Score</div></div>");
        let courseName = currentCourse.course.name;
        $('.courseName').append(courseName).show();
        $('.clear').show();
        fillCard();
        if(numHoles.length <= 9){
            $('.card').css("justifyContent", "center");
        }
    }
}
function fillCard(){
    $('#column9').after("<div class='inOut' id='out'><div class='title'>Out Score</div><div class='break'></div></div>");
    $('#column18').after("<div class='inOut' id='in'><div class='title'>In<br>Score</div><div class='break'></div></div>");
    for(let p = 1; p <= numPlayers; p++){
        $('.playerColumn').append("<div id='pl" + p +"'><span onclick='deletePlayer(" + p + ")'><i class=\"fa fa-minus-circle\" aria-hidden=\"true\"></i></span>  <div contenteditable='true'>" + playerName[p - 1] + "</div></div>");
        $('#out').append("<input type='number' class='holeInput' id='player" + p + "Out' value='0' tabindex='-1' readonly>");
        $('#in').append("<input type='number' class='holeInput' id='player" + p + "In' value='0' tabindex='-1' readonly>");
       $('.totalColumn').append("<input type='number' class='holeInput' id='totalHole" + p + "' value='0' tabindex='-1' readonly>");
        for(let h = 1; h <= numHoles.length; h++){
            $('#column' + h).append("<input type='number' id='player" + p + "hole" + h + "' class='holeInput' onkeyup='updateScore("+p+")' max='15' min='0'>");
        }
    }
}
function deletePlayer(playerid){
    $('#pl' + playerid).remove();
    for(let h = 1; h <= numHoles.length; h++) {
        $('#player' + playerid + 'hole' + h).remove();
        $('#totalHole' + playerid).remove();
    }
        $('#player' + playerid + 'In').remove();
        $('#player' + playerid + 'Out').remove();
        toastr.warning("Player " + playerid + " has been deleted");
}
//be sure to get front and back 9 in here
function updateScore(playerid) {
    let playerTotal = 0;
    let outTotal = 0;
    let inTotal = 0;
    for (let t = 1; t <= numHoles.length; t++) {
        playerTotal += Number($("#player" + playerid + "hole" + t).val());
        $("#totalHole" + playerid).val(playerTotal);
    }
    for(let t = 1; t <= 9; t++) {
        outTotal += Number($("#player" + playerid + "hole" + t).val());
        $('#player' + playerid + "Out").val(outTotal);
        $('#player' + playerid + "In").val("");
    }
    for(let t = 10; t <= 18; t++) {
        inTotal += Number($("#player" + playerid + "hole" + t).val());
        $('#player' + playerid + "In").val(inTotal);
    }
    if(numHoles.length <= 9) {
        if($('#player' + playerid + 'hole9').val() >= 1) {
            if ($('#totalHole' + playerid).val() < parTotal) {
                window.setTimeout(function() {
                    toastr.success("Player " + playerid + " had a great game, with " + (parTotal - playerTotal) + " under par!")
                }, 500)
            }
            else if ($('#totalHole' + playerid).val() > parTotal){
                window.setTimeout(function () {
                toastr.error("Player " + playerid + "\'s score was " + (playerTotal - parTotal) + " above par. Better luck next time!")
            }, 500)
                }
            else {
                window.setTimeout(function() {
                    toastr.info("Player " + playerid + "\'s score was on par! Good job! Next time, you'll get under par!")
                }, 500)
            }
            }
        }
    else {
        if($('#player' + playerid + 'hole18').val() >= 1) {
            if ($('#totalHole' + playerid).val() < parTotal) {
                window.setTimeout(function(){
                    toastr.success("Player " + playerid + " had a great game, with " + (parTotal - playerTotal) + " under par!")
                }, 500)
            }
            else if($('#totalHole' + playerid).val() > parTotal) {
                window.setTimeout(function () {
                    toastr.error("Player " + playerid + "\'s score was " + (playerTotal - parTotal) + " above par. Better luck next time!")
                }, 500)
            }
            else {
                window.setTimeout(function() {
                    toastr.info("Player " + playerid + "\'s score was on par! Good job! Next time, you'll get under par!")
                }, 500)
                }
            }
        }
}
// function clearCard(){
//     $('input').val("");
// }