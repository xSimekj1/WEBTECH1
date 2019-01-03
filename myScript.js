var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function calendarInit(selectedDay) {

  var week = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  var currentDate = initDate(selectedDay);
  var currentMonth = getMonthInfo(currentDate, week);
  var calendar = getCalendar(currentMonth.number_of_days_in_month, currentMonth.first_day_of_month_index, week, currentDate);
  document.getElementById("calendar-month-year").innerHTML = month_name[currentDate.month - 1] + " " + currentDate.year;
  $('#calendar-dates').html('');
  document.getElementById("calendar-dates").appendChild(calendar);
  setDateOfCurrentDay(currentDate);
  GetNamesdayForToday(currentDate);
}
function initDate(selectedDay) {

  if (!selectedDay) {
    var currentDate = getCurrentDate();
  }
  else {
      selectedDay.month = (month_name.indexOf(selectedDay.month) + 1).toString();
    if (selectedDay.month.length == 1) {
      selectedDay.month = "0" + selectedDay.month;
    }
    if (selectedDay.day.length == 1) {
      selectedDay.day = "0" + selectedDay.day;
    }
    currentDate = selectedDay;
  }
  return currentDate;
}

//**********************************
// Make Calendar
//***********************************
function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
    dd = '0'+dd
  }
  if(mm<10) {
    mm = '0'+mm
  }
  today =dd + '.' + mm + '.' + yyyy;
  return {
        day: dd,
        month: mm,
        year: yyyy
    };
}

function getMonthInfo(currentDate, week) {
  var first_date = currentDate.month + " " + 1 + " " + currentDate.year;
  var tmp = new Date(first_date).toDateString();
  var first_day = tmp.substring(0, 3);
  var day_number = week.indexOf(first_day);
  var monthLength = new Date(currentDate.year, currentDate.month+1, 0).getDate();
  return{
    first_day_of_month: first_day,
    first_day_of_month_index: day_number,
    number_of_days_in_month: monthLength
  }
}

function getCalendar(numberOfDays, first_day, week, currentDate) {
  var table = document.createElement('table');
  var tr = document.createElement('tr');

  //Create days of week
  for (var i = 0; i < week.length; i++) {
    var td = document.createElement('td');
    td.innerHTML = "MTWTFSS"[i];
    tr.appendChild(td);
  }
  table.appendChild(tr);
  //Make offset for previus month days
  tr = document.createElement('tr');
  for (var i = 0; i < week.length; i++) {
    if (i == first_day) {
      break;
    }
    var td = document.createElement('td');
    td.innerHTML = "";
    tr.appendChild(td);
  }
  //generate month
  var dayIndex = 1;
  for (var i = first_day; i < week.length; i++) {
    var td = document.createElement('td');
    td.innerHTML = dayIndex;
    td.onclick = function() {
      $(this).attr("onClick", "setDateOnClick(this)");
      setDateOnClick(this);
    }
    if (dayIndex == currentDate.day) {
      td.setAttribute("id", "active")
    }
    dayIndex++;
    tr.appendChild(td);
  }
  table.appendChild(tr);
  // Rest of rows
  for (var row = 2; row <= 6; row++) {
    tr = document.createElement('tr');
    for (var i = 0; i < week.length; i++) {
      if (dayIndex > numberOfDays) {
        table.appendChild(tr);
        return table;
      }
      var td = document.createElement('td');
      td.innerHTML = dayIndex;
      td.onclick = function() {
        $(this).attr("onClick", "setDateOnClick(this)");
        setDateOnClick(this);
      }
      if (dayIndex == currentDate.day) {
        td.setAttribute("id", "active")
      }
      dayIndex++;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}
//**********************************
// Parse XML to collection
//***********************************
var getXMLFile = function(path, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", path);
  request.setRequestHeader("Content-Type", "text/xml");
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200){
      callback(request.responseXML);
    }
  };
  request.send();
}

getXMLFile("img/meniny.xml", function(xml) {
  console.log(xml);
  var date = getCurrentDate();
  var datum = date.day+date.month;
  zaznamy = xml.getElementsByTagName("zaznam");
  removeBlankAttributes(zaznamy);
  calendarInit();
})
function removeBlankAttributes(dataFromXML) {
  for (var i = 0; i < dataFromXML.length; i++) {
      var zaznam = dataFromXML[i].childNodes;
      for (var j = 0; j < zaznam.length; j++) {
        if ( zaznam[j].nodeName == "#text") {
        var el = zaznam[j];
        el.remove();
        }
      }
  }
}
//**********************************
// Get namesday from XML
//***********************************
function setDateOfCurrentDay(datum) {
  document.getElementById("date").innerHTML = "Vybratý dátum : " + datum.day + "." + datum.month + "." + datum.year;
}

function setDateFromXML(datum) {
  var month = datum.slice(0, 2);
  var day = datum.slice(2, 4);
  document.getElementById("date").innerHTML = "Vybratý dátum : " + day + "." + month + ".2019";
}

function GetNamesdayForToday(datum) {
  for (var i = 0; i < zaznamy.length; i++) {
      var zaznam = zaznamy[i].childNodes;
      for (var j = 0; j < zaznam.length; j++) {
        if ( zaznam[j].nodeName == "den") {
        var den = zaznam[j].innerHTML;
          if (den == datum.month + "" + datum.day) {
            setNamesadayToHTMLElements(zaznam);
            break;
          }
        }
      }
  }
}
function GetDayForName(meno) {
  for (var i = 0; i < zaznamy.length; i++) {
      var zaznam = zaznamy[i].childNodes;
      for (var j = 0; j < zaznam.length; j++) {
        if ( zaznam[j].innerHTML == meno) {
            setNamesadayToHTMLElements(zaznam);
            setDateFromXML(zaznam[0].innerHTML);
            break;
        }
      }
  }
}

function setNamesadayToHTMLElements(zaznam) {
  var dnesnyden, sk, cz, pl, hu, at;
  for (var i = 0; i < zaznam.length; i++) {
    if (zaznam[i].nodeName == "den") {
      dnesnyden = zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "SK") {
      sk = "SK: " + zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "SKd") {
      sk += ", " + zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "CZ") {
      cz = "CZ: " + zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "PL") {
      pl = "PL: " + zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "HU") {
      hu = "HU: " + zaznam[i].innerHTML;
    } else if (zaznam[i].nodeName == "AT") {
      at = "AT: " + zaznam[i].innerHTML;
    }
  }
  document.getElementById('namesday').innerHTML = "Meniny má:";
  document.getElementById('sk').innerHTML = sk;
  document.getElementById('cz').innerHTML = cz;
  document.getElementById('pl').innerHTML = pl;
  document.getElementById('hu').innerHTML = hu;
  document.getElementById('at').innerHTML = at;
}

function setDateOnClick(element) {
  var days = document.getElementById('calendar-dates');
  var table = days.getElementsByTagName('td');
  var day = element.innerHTML;
  var tmp = getMonthAndYearFromCalendar();
  var date = {day:day, month:tmp.month, year:tmp.year};
  $("#active").attr("id", "");
  $(element).attr("id", "active");
  calendarInit(date);
}

function getMonthAndYearFromCalendar() {
  var tmpArray = document.getElementById('calendar-month-year').innerHTML;
  tmpArray = tmpArray.split(" ");
  var month = tmpArray[0];
  var year = tmpArray[1];
  return {
        month: month,
        year: year
    };
}

function nextMonth() {
  var tmp = getMonthAndYearFromCalendar();
  var date = {day:"1", month:tmp.month, year:tmp.year};
  var monthIndex = month_name.indexOf(date.month);
  if (month_name.indexOf(date.month) >= (month_name.length - 1)) {
    date.month = "January";
    date.year++;
  }else {
    date.month = month_name[monthIndex+1];
  }
  calendarInit(date);
}

function prevMonth() {
  var tmp = getMonthAndYearFromCalendar();
  var date = {day:"1", month:tmp.month, year:tmp.year};
  var monthIndex = month_name.indexOf(date.month);
  if (date.month == "January") {
    date.month = "December";
    date.year--;
  }else {
    date.month = month_name[monthIndex-1];
  }
  calendarInit(date);
}

function FindNameInCalendar() {
  var name = document.getElementById("hladaneMeno").value;
  name = capitalizeFirstLetter(name);
  GetDayForName(name);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
