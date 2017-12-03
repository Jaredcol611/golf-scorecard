let closeCourses;
let currentCourse;
let local_obj = {latitude: 40.391617, longitude: -111.850766, radius: 100};
let numHoles;
let numPlayers = 4;
let playerName = [];

function loadMe() {
    $('.courseName').hide();
    $.post("https://golf-courses-api.herokuapp.com/courses", local_obj, function(data, status) {
        closeCourses = JSON.parse(data);
        for (let i in closeCourses.courses){
            console.log(closeCourses.courses[i].name);
            $('#selectCourse').append('<option value="' + closeCourses.courses[i].id + '" >' + closeCourses.courses[i].name + '</option>');

        }
    });
}
// onclick="getCourse(closeCourses.courses[i])"

// use.id instead of .name
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
//onclick=getCourse

//course select and option as html tags

//in function call before all this hits do $('#teeSelect').html("")
function buildCard(myTee){
    playerName.push($('.playerOne').val(), $('.playerTwo').val(), $('.playerThree').val(), $('.playerFour').val());
    if($('.playerFour').val().trim() === ""){
        numPlayers = 3;
    }
    if($('.playerThree').val().trim() === "" && $('.playerFour').val().trim() === ""){
        numPlayers = 2;
    }
    if($('.playerTwo').val().trim() === "" && $('.playerThree').val().trim() === "" && $('.playerFour').val().trim() === ""){
        numPlayers = 1;
    }
    $('.scoreColumn').html("");
    $('.playerColumn').html("");
    $('.container').hide();
    numHoles = currentCourse.course.holes;
    for(let c in numHoles){
        let holePar = currentCourse.course.holes[c].tee_boxes[myTee].par;
        $('.scoreColumn').append("<div id='column" + (Number(c)+1) + "' class='column'><div class='holeNumber'>" + (Number(c)+1) + "</div><div class='holeNumber'>Par " + holePar + "</div></div>")
    }
    //let thumbNail = currentCourse.course.thumbnail;
    $('html').css("background-image", "url(./images/course3.jpg)");
    $('.scoreColumn').append("<div class='totalColumn column'><div class='total' >Total</div></div>");
    let courseName = currentCourse.course.name;
    $('.courseName').append(courseName).show();
    fillCard();
}

function fillCard(){
  //  let playerName = input.val();
    for(let p = 1; p <= numPlayers; p++){
        $('.playerColumn').append("<div id='pl" + p +"'><div contenteditable='true'>" + playerName[p - 1] + "</div><span onclick='deletePlayer(" + p + ")'><i class=\"fa fa-minus-circle\" aria-hidden=\"true\"></i></span></div>");
       $('.totalColumn').append("<input type='text' class='holeInput' id='totalHole" + p + "'>");
        for(let h = 1; h <= numHoles.length; h++){
            $('#column' + h).append("<input type='text' id='player" + p + "hole" + h + "' class='holeInput' onkeyup='updateScore(" + p +  ")'>");
        }

    }
}

function deletePlayer(playerid){
    $('#pl' + playerid).remove();
    for(let h = 1; h <= numHoles.length; h++){
        $('#player' + playerid + 'hole' + h).remove();
        $('#totalHole' + playerid).remove();
    }
}
function updateScore(playerid){
    let playerTotal = 0;
    for(let t = 1; t <= numHoles.length; t++){
        playerTotal += Number($("#player" + playerid + "hole" + t).val());
    }
    $("#totalHole" + playerid).val(playerTotal);
}

//check to make sure if course has different tee types. make a case statement and then give it a regular. SCHNEITERS PEBBLE BROOK doesn't have tee types or holes

