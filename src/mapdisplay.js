var currentMapSource = CustomMapSource

var selectedParty

var defaultMarginValues = {safe: 15, likely: 5, lean: 1, tilt: Number.MIN_VALUE}
var marginValues = cloneObject(defaultMarginValues)
var marginNames = {safe: "Safe", likely: "Likely", lean: "Lean", tilt: "Tilt"}
var editMarginID = null

const defaultRegionFillColor = TossupParty.getMarginColors().safe
var regionFillAnimationDuration = 0.1

var marginPieChartIndexes = {}
marginPieChartIndexes[DemocraticParty.getID()] = ["safe", "likely", "lean", "tilt"]
marginPieChartIndexes[TossupParty.getID()] = [TossupParty.getID()]
marginPieChartIndexes[RepublicanParty.getID()] = ["tilt", "lean", "likely", "safe"]

var marginPartyPieChartOrder = [DemocraticParty.getID(), TossupParty.getID(), RepublicanParty.getID()]

const mapRegionNameToID = {"Alabama":"AL", "Alaska":"AK", "Arizona":"AZ", "Arkansas":"AR", "California":"CA", "Colorado":"CO", "Connecticut":"CT", "Delaware":"DE", "District of Columbia":"DC", "Florida":"FL", "Georgia":"GA", "Hawaii":"HI", "Idaho":"ID", "Illinois":"IL", "Indiana":"IN", "Iowa":"IA", "Kansas":"KS", "Kentucky":"KY", "Louisiana":"LA", "ME-1":"ME-D1", "ME-2":"ME-D2", "Maine":"ME-AL", "Maryland":"MD", "Massachusetts":"MA", "Michigan":"MI", "Minnesota":"MN", "Mississippi":"MS", "Missouri":"MO", "Montana":"MT", "NE-1":"NE-D1", "NE-2":"NE-D2", "NE-3":"NE-D3", "Nebraska":"NE-AL", "Nevada":"NV", "New Hampshire":"NH", "New Jersey":"NJ", "New Mexico":"NM", "New York":"NY", "North Carolina":"NC", "North Dakota":"ND", "Ohio":"OH", "Oklahoma":"OK", "Oregon":"OR", "Pennsylvania":"PA", "Rhode Island":"RI", "South Carolina":"SC", "South Dakota":"SD", "Tennessee":"TN", "Texas":"TX", "Utah":"UT", "Vermont":"VT", "Virginia":"VA", "Washington":"WA", "West Virginia":"WV", "Wisconsin":"WI", "Wyoming":"WY"}

const regionEVArray = {
  2010: {"AL":9, "AK":3, "AZ":11, "AR":6, "CA":55, "CO":9, "CT":7, "DE":3, "DC":3, "FL":29, "GA":16, "HI":4, "ID":4, "IL":20, "IN":11, "IA":6, "KS":6, "KY":8, "LA":8, "ME-D1":1, "ME-D2":1, "ME-AL":2, "MD":10, "MA":11, "MI":16, "MN":10, "MS":6, "MO":10, "MT":3, "NE-D1":1, "NE-D2":1, "NE-D3":1, "NE-AL":2, "NV":6, "NH":4, "NJ":14, "NM":5, "NY":29, "NC":15, "ND":3, "OH":18, "OK":7, "OR":7, "PA":20, "RI":4, "SC":9, "SD":3, "TN":11, "TX":38, "UT":6, "VT":3, "VA":13, "WA":12, "WV":5, "WI":10, "WY":3},
  2000: {"AL":9, "AK":3, "AZ":10, "AR":6, "CA":55, "CO":9, "CT":7, "DE":3, "DC":3, "FL":27, "GA":15, "HI":4, "ID":4, "IL":21, "IN":11, "IA":7, "KS":6, "KY":8, "LA":9, "ME-D1":1, "ME-D2":1, "ME-AL":2, "MD":10, "MA":12, "MI":17, "MN":10, "MS":6, "MO":11, "MT":3, "NE-D1":1, "NE-D2":1, "NE-D3":1, "NE-AL":2, "NV":5, "NH":4, "NJ":15, "NM":5, "NY":31, "NC":15, "ND":3, "OH":20, "OK":7, "OR":7, "PA":21, "RI":4, "SC":8, "SD":3, "TN":11, "TX":34, "UT":5, "VT":3, "VA":13, "WA":11, "WV":5, "WI":10, "WY":3},
  1990: {"AL":9, "AK":3, "AZ":8, "AR":6, "CA":54, "CO":8, "CT":8, "DE":3, "DC":3, "FL":25, "GA":13, "HI":4, "ID":4, "IL":22, "IN":12, "IA":7, "KS":6, "KY":8, "LA":9, "ME-D1":1, "ME-D2":1, "ME-AL":2, "MD":10, "MA":12, "MI":18, "MN":10, "MS":7, "MO":11, "MT":3, "NE-D1":1, "NE-D2":1, "NE-D3":1, "NE-AL":2, "NV":4, "NH":4, "NJ":15, "NM":5, "NY":33, "NC":14, "ND":3, "OH":21, "OK":8, "OR":7, "PA":23, "RI":4, "SC":8, "SD":3, "TN":11, "TX":32, "UT":5, "VT":3, "VA":13, "WA":11, "WV":5, "WI":11, "WY":3},
  1980: {"AL":9, "AK":3, "AZ":7, "AR":6, "CA":47, "CO":8, "CT":8, "DE":3, "DC":3, "FL":21, "GA":12, "HI":4, "ID":4, "IL":24, "IN":12, "IA":8, "KS":7, "KY":9, "LA":10, "ME-D1":1, "ME-D2":1, "ME-AL":2, "MD":10, "MA":13, "MI":20, "MN":10, "MS":7, "MO":11, "MT":4, "NE-D1":1, "NE-D2":1, "NE-D3":1, "NE-AL":2, "NV":4, "NH":4, "NJ":16, "NM":5, "NY":36, "NC":13, "ND":3, "OH":23, "OK":8, "OR":7, "PA":25, "RI":4, "SC":8, "SD":3, "TN":11, "TX":29, "UT":5, "VT":3, "VA":12, "WA":10, "WV":6, "WI":11, "WY":3},
  1970: {"AL":9, "AK":3, "AZ":6, "AR":6, "CA":45, "CO":7, "CT":8, "DE":3, "DC":3, "FL":17, "GA":12, "HI":4, "ID":4, "IL":26, "IN":13, "IA":8, "KS":7, "KY":9, "LA":10, "ME-D1":1, "ME-D2":1, "ME-AL":2, "MD":10, "MA":14, "MI":21, "MN":10, "MS":7, "MO":12, "MT":4, "NE-D1":1, "NE-D2":1, "NE-D3":1, "NE-AL":2, "NV":3, "NH":4, "NJ":17, "NM":4, "NY":41, "NC":13, "ND":3, "OH":25, "OK":8, "OR":6, "PA":27, "RI":4, "SC":8, "SD":4, "TN":10, "TX":26, "UT":4, "VT":3, "VA":12, "WA":9, "WV":6, "WI":11, "WY":3}
}

const linkedRegions = [["MD", "MD-button"], ["DE", "DE-button"], ["NJ", "NJ-button"], ["CT", "CT-button"], ["RI", "RI-button"], ["MA", "MA-button"], ["VT", "VT-button"], ["NH", "NH-button"], ["HI", "HI-button"], ["ME-AL", "ME-AL-land"], ["ME-D1", "ME-D1-land"], ["ME-D2", "ME-D2-land"], ["NE-AL", "NE-AL-land"], ["NE-D1", "NE-D1-land"], ["NE-D2", "NE-D2-land"], ["NE-D3", "NE-D3-land"]]

var displayRegionDataArray = {}
var regionIDsToIgnore = [/.+-button/, /.+-land/]

var showingDataMap = false

var ignoreMapUpdateClickArray = []

var currentSliderDate
const initialKeyPressDelay = 500
const zoomKeyPressDelayForHalf = 3000
const maxDateSliderTicks = 25

const kEditing = 0
const kViewing = 1

var currentMapState = kViewing

var showingHelpBox = false

const electionDayTime = 1604361600000 //1604390400000 PST
const electorsCastVotesTime = 1607965200000
const congressCountsVotesTime = 1609952400000
const inaugurationDayTime = 1611162000000

const countdownTimes = {"Election Day": electionDayTime, "Electoral College Vote": electorsCastVotesTime, "Congress Counts Votes": congressCountsVotesTime, "Inauguration Day": inaugurationDayTime}
var currentCountdownTimeName

var evPieChart
var regionMarginStrings = []

var evPieChartCutoutPercent = 55
const minEVPieChartSliceLabelValue = 16
const minEVPieChartSliceLabelBrightness = 0.7

const kCSVFileType = "text/csv"
const kJSONFileType = "application/json"
const kPNGFileType = "image/png"
const kJPEGFileType = "image/jpeg"

var showingCompareMap = false
var compareMapSourceIDArray = [null, null]
var compareMapDataArray = [null, null]
var selectedCompareSlider = null

const shiftNumberKeycodes = [33, 64, 35, 36, 37, 94, 38, 42, 40]

var selectedDropdownDivID = null

const kPastElectionsVsPastElections = 1
const kPastElectionsVs538Projection = 2
const kPastElectionsVs538PollAvg = 3

$(async function() {
  await loadMapSVGFile()
  setOutlineDivProperties()

  $("#loader").hide()
  resizeElements(false)

  createMapSourceDropdownItems()
  createMarginEditDropdownItems()
  createCountdownDropdownItems()

  addDivEventListeners()

  populateRegionsArray()
  displayPartyTotals(getPartyTotals())

  setupEVPieChart()
  updateEVPieChart()

  updateCountdownTimer()
  setTimeout(function() {
    setInterval(function() {
      updateCountdownTimer()
    }, 1000)
  }, 1000-((new Date()).getTime()%1000))

  $.ajaxSetup({cache: false})

  updateIconsBasedOnLocalCSVData()
})

function loadMapSVGFile()
{
  var loadSVGFilePromise = new Promise((resolve, reject) => {
    $('#mapzoom').load("src/usamap.svg", function() {
      resolve()
    })
  })

  return loadSVGFilePromise
}

function setOutlineDivProperties()
{
  $('#outlines').children().each(function() {
    var outlineDiv = $(this)

    $(this).css('transition', "fill " + regionFillAnimationDuration + "s linear")
    outlineDiv.css('fill', defaultRegionFillColor)
    outlineDiv.css('cursor', "pointer")

    outlineDiv.attr('oncontextmenu', "rightClickRegion(this); return false;")
    outlineDiv.attr('onclick', "leftClickRegion(this)")
    outlineDiv.attr('onmouseenter', "mouseEnteredRegion(this)")
    outlineDiv.attr('onmouseleave', "mouseLeftRegion(this)")
  })
}

function resizeElements(initilizedPieChart)
{
  var windowWidth = $(window).width()

  //1.0*svgdatawidth*zoom/windowwidth == 0.6
  var mapZoom = 0.62*windowWidth/$("#svgdata").width()
  if (navigator.userAgent.indexOf("Firefox") != -1)
  {
    $("#mapzoom").css("transform", "scale(" + mapZoom + ")")
    $("#mapzoom").css("transform-origin", "0 0")
  }
  else
  {
    $("#mapzoom").css("zoom", (mapZoom*100) + "%")
  }

  var mapWidth = $("#svgdata").width()*mapZoom
  var originalMapHeight = $("#svgdata").height()

  $(".slider").width(mapWidth-190)

  setSliderTickMarginShift("dataMapDateSliderContainer", "dataMapDateSlider", "dataMapSliderStepList")
  setSliderDateDisplayMarginShift("dateDisplay", "sliderDateDisplayContainer", "dataMapDateSlider", originalMapHeight, mapZoom)

  setSliderTickMarginShift("firstCompareSliderDateDisplayContainer", "firstCompareDataMapDateSlider", "firstCompareDataMapSliderStepList")
  setSliderDateDisplayMarginShift("firstCompareDateDisplay", "firstCompareSliderDateDisplayContainer", "firstCompareDataMapDateSlider", originalMapHeight, mapZoom)
  setSliderTickMarginShift("secondCompareSliderDateDisplayContainer", "secondCompareDataMapDateSlider", "secondCompareDataMapSliderStepList")
  setSliderDateDisplayMarginShift("secondCompareDateDisplay", "secondCompareSliderDateDisplayContainer", "secondCompareDataMapDateSlider", originalMapHeight, mapZoom)

  $("#evPieChart").width(windowWidth-windowWidth*0.12-mapWidth)
  $("#evPieChart").height(windowWidth-windowWidth*0.09-mapWidth)
  $("#evPieChart").css("background-size", $("#evPieChart").width()*evPieChartCutoutPercent/100.0*0.5)
  $("#evPieChart").css("background-position", "center")
  $("#evPieChart").css("background-repeat", "no-repeat")

  //1.0*infoboxcontainerswidth*zoom/evpiechartwidth == 1.0
  $("#infoboxcontainers").width($("#evPieChart").width())

  if (initilizedPieChart == true || initilizedPieChart == null)
  {
    updateEVPieChart()
  }
}

function setSliderTickMarginShift(sliderContainerDivID, sliderDivID, sliderTicksDivID)
{
  var shouldHideSlider = $("#" + sliderContainerDivID).is(":hidden")
  if (shouldHideSlider)
  {
    $("#" + sliderContainerDivID).show()
  }
  var marginShift = $("#" + sliderTicksDivID)[0].getBoundingClientRect().y-$("#" + sliderDivID)[0].getBoundingClientRect().y
  if (marginShift != 0)
  {
    $("#" + sliderTicksDivID).css("margin-top", "-" + marginShift + "px")
  }
  if (shouldHideSlider)
  {
    $("#" + sliderContainerDivID).hide()
  }
}

function setSliderDateDisplayMarginShift(dateDisplayDivID, sliderContainerDivID, sliderDivID, originalMapHeight, mapZoom)
{
  if (navigator.userAgent.indexOf("Firefox") != -1)
  {
    $("#" + dateDisplayDivID).css("transform", "scale(" + ($(window).width()*0.10/$("#" + dateDisplayDivID).width()) + ")")
    $("#" + dateDisplayDivID).css("transform-origin", "0 50%")
    $("#" + sliderContainerDivID).css("top", originalMapHeight*(mapZoom-1))
  }
  else
  {
    $("#" + dateDisplayDivID).css("zoom", (100*$(window).width()/1800) + "%")
  }

  $("#" + dateDisplayDivID).css("margin-top", ($("#" + sliderDivID).height()/4-1))
}

function createMapSourceDropdownItems()
{
  for (sourceNum in mapSourceIDs)
  {
    $("#mapSourcesDropdownContainer").append("<div class='dropdown-separator'></div>")

    var mapSourceID = mapSourceIDs[sourceNum]
    var mapSourceIDNoSpace = mapSourceID.replace(/\s/g, '')

    var divStringToAppend = ""

    if (mapSourceID != CustomMapSource.getID())
    {
      divStringToAppend += "<span style='float: right; padding-left: 6px; padding-right: 12px;'>"
      divStringToAppend += "<input class='comparesourcecheckbox' type='checkbox' id='" + mapSourceIDNoSpace + "-compare' onclick='addCompareMapSource(\"" + mapSourceID + "\")' style='position: relative; top: 8px; width: 24px; height: 24px;' />"
      divStringToAppend += "</span>"

      divStringToAppend += "<a id='" + mapSourceIDNoSpace + "' onclick='updateMapSource(\"" + mapSourceID + "\", \"#sourceToggleButton\")'>" + "(" + (parseInt(sourceNum)+1) + ")" + "&nbsp;&nbsp;" + mapSourceID
      divStringToAppend += "<span id='" + mapSourceIDNoSpace + "-icon' style='float: right;' onclick='downloadDataForMapSource(\"" + mapSourceID + "\", {\"" + mapSourceIDNoSpace + "-icon\":{loading: \"./assets/icon-loading.png\", error: \"./assets/icon-download-none.png\", success: \"./assets/icon-download-complete.png\", top: -1, width: 24, height: 24}}, \"" + mapSourceIDNoSpace + "\", true, true)'>"
      divStringToAppend += "<img class='status' src='./assets/icon-download-none.png' style='position: relative; top: -1px; width: 24px; height: 24px;' />"
      divStringToAppend += "</span>"
      divStringToAppend += "</a>"
    }
    else
    {
      divStringToAppend += "<a id='" + mapSourceIDNoSpace + "' onclick='updateMapSource(\"" + mapSourceID + "\", \"#sourceToggleButton\")'>" + "(" + (parseInt(sourceNum)+1) + ")" + "&nbsp;&nbsp;" + mapSourceID

      divStringToAppend += "<span id='" + mapSourceIDNoSpace + "-download-icon' style='float:right;' onclick='ignoreMapUpdateClickArray.push(\"" + mapSourceID + "\"); downloadMapFile(currentMapSource, kJSONFileType)'>"
      divStringToAppend += "<img class='status' src='./assets/icon-download.png' style='position: relative; top: -1px; width: 24px; height: 24px;' />"
      divStringToAppend += "</span>"

      divStringToAppend += "<span id='" + mapSourceIDNoSpace + "-upload-icon' style='float:right;' onclick='ignoreMapUpdateClickArray.push(\"" + mapSourceID + "\"); $(\"#uploadFileInput\").click()'>"
      divStringToAppend += "<img class='status' src='./assets/icon-upload.png' style='position: relative; top: -1px; width: 24px; height: 24px; margin-right: 5px' />"
      divStringToAppend += "</span>"

      divStringToAppend += "</a>"
    }

    $("#mapSourcesDropdownContainer").append(divStringToAppend)
  }
}

function createMarginEditDropdownItems()
{
  $("#marginsDropdownContainer").html("")
  for (marginID in marginNames)
  {
    if (marginID == "tilt") { continue } // Hardcoding tilt to be excluded
    $("#marginsDropdownContainer").append("<div class='dropdown-separator'></div>")
    $("#marginsDropdownContainer").append("<a id='" + marginID + "-edit' style='padding-top: 14px; min-height: 25px;' onclick='toggleMarginEditing(\"" + marginID + "\", this)'>" + marginNames[marginID] + "<span style='float: right; font-family: \"Bree5erif-Mono\"'>" + marginValues[marginID] + "</span></a>")
  }
}

function createCountdownDropdownItems()
{
  $("#countdownsDropdownContainer").html("")
  for (timeName in countdownTimes)
  {
    $("#countdownsDropdownContainer").append("<div class='dropdown-separator'></div>")
    $("#countdownsDropdownContainer").append("<a id='" + timeName + "-countdown' style='padding-top: 14px; min-height: 25px;' onclick='selectCountdownTime(\"" + timeName + "\", this)'>" + timeName + "</a>")
  }

  updateCountdownTimer()
  $("[id='" + currentCountdownTimeName + "-countdown']").addClass("active")
}

function addDivEventListeners()
{
  document.getElementById("clearMapButton").addEventListener('click', function(e) {
    clearMap()

    if (e.altKey)
    {
      for (mapSourceID in mapSources)
      {
        mapSources[mapSourceID].clearMapData()
        removeStatusImage(mapSourceID.replace(/\s/g, '') + "-icon")
        insertStatusImage(mapSourceID.replace(/\s/g, '') + "-icon", "./assets/icon-download-none.png", 24, 24, -1)
      }
    }
  })

  document.getElementById("sourceToggleButton").addEventListener('click', function(e) {
    if (currentMapState == kEditing || editMarginID) { return }
    if (!e.altKey)
    {
      toggleMapSource(this)
    }
    else
    {
      downloadAllMapData()
    }
  })

  $("#uploadFileInput").change(function() {
    if (!this.files || this.files.length == 0) { return }
    loadUploadedFile(this.files[0])
  })

  document.getElementById("marginEditButton").addEventListener('click', function(e) {
    toggleMarginEditing()

    if (e.altKey)
    {
      marginValues = cloneObject(defaultMarginValues)
      createMarginEditDropdownItems()

      if (showingDataMap)
      {
        displayDataMap()
      }
    }
  })
}

function getIconDivsToUpdateArrayForSourceID(mapSourceID)
{
  var iconDivID = mapSourceID.replace(/\s/g, '') + "-icon"
  //{"sourceToggleButton":{loading: "./assets/icon-loading.png", error: "./assets/icon-error.png", success: "./assets/icon-success.png"}}
  var iconDivDictionary = {}
  iconDivDictionary[iconDivID] = {loading: "./assets/icon-loading.png", error: "./assets/icon-download-none.png", success: "./assets/icon-download-complete.png", top: -1, width: 24, height: 24}

  return iconDivDictionary
}

function loadDataMap(shouldSetToMax, forceDownload)
{
  var loadDataMapPromise = new Promise(async (resolve, reject) => {
    $("#dataMapDateSliderContainer").hide()
    $("#dateDisplay").hide()

    var iconDivDictionary = getIconDivsToUpdateArrayForSourceID(currentMapSource.getID())
    var loadedSuccessfully = await downloadDataForMapSource(currentMapSource.getID(), iconDivDictionary, null, forceDownload)

    if (!loadedSuccessfully) { resolve(); return }

    setDataMapDateSliderRange(shouldSetToMax)
    displayDataMap()
    $("#dataMapDateSliderContainer").show()
    $("#dateDisplay").show()

    $("#evPieChart").attr('onclick', "currentMapSource.openHomepageLink(currentSliderDate)")

    if (currentMapSource.getIconURL())
    {
      $("#evPieChart").css("background-image", "url(" + currentMapSource.getIconURL() + ")")
    }
    else
    {
      $("#evPieChart").css("background-image", "")
    }

    resolve()
  })

  return loadDataMapPromise
}

function downloadDataForMapSource(mapSourceID, divsToUpdateStatus, mapIDToIgnore, forceDownload, refreshMap, onlyAttemptLocalFetch)
{
  if (mapIDToIgnore != null)
  {
    ignoreMapUpdateClickArray.push(mapIDToIgnore)
  }
  var downloadDataPromise = new Promise(async (resolve, reject) => {
    for (divID in divsToUpdateStatus)
    {
      removeStatusImage(divID)
    }

    for (divID in divsToUpdateStatus)
    {
      insertStatusImage(divID, divsToUpdateStatus[divID].loading, divsToUpdateStatus[divID].width, divsToUpdateStatus[divID].height, divsToUpdateStatus[divID].top)
    }

    var loadedSuccessfully = await mapSources[mapSourceID].loadMap(forceDownload, onlyAttemptLocalFetch)
    for (divID in divsToUpdateStatus)
    {
      removeStatusImage(divID)
    }

    if (!loadedSuccessfully)
    {
      for (divID in divsToUpdateStatus)
      {
        insertStatusImage(divID, divsToUpdateStatus[divID].error, divsToUpdateStatus[divID].width, divsToUpdateStatus[divID].height, divsToUpdateStatus[divID].top)
      }
      resolve(false)
    }
    else
    {
      for (divID in divsToUpdateStatus)
      {
        insertStatusImage(divID, divsToUpdateStatus[divID].success, divsToUpdateStatus[divID].width, divsToUpdateStatus[divID].height, divsToUpdateStatus[divID].top)
      }

      if (refreshMap && currentMapSource.getID() == mapSourceID)
      {
        setDataMapDateSliderRange()
        displayDataMap()
        $("#dataMapDateSliderContainer").show()
        $("#dateDisplay").show()
      }
      resolve(true)
    }
  })

  return downloadDataPromise
}

async function downloadAllMapData()
{
  var sourcesLoaded = 0
  for (sourceIDNum in mapSourceIDs)
  {
    var iconDivDictionary = getIconDivsToUpdateArrayForSourceID(mapSourceIDs[sourceIDNum])
    downloadDataForMapSource(mapSourceIDs[sourceIDNum], iconDivDictionary, null, true).then(function(loadedSuccessfully) {
      if (showingDataMap && mapSourceIDs[sourceIDNum] == currentMapSource.getID() && loadedSuccessfully)
      {
        loadDataMap(true)
      }

      sourcesLoaded += 1
      if (sourcesLoaded < mapSourceIDs.length)
      {
        $("#loader").show()
      }
    })
  }
}

async function fetchLocalCSVData()
{
  for (sourceIDNum in mapSourceIDs)
  {
    var iconDivDictionary = getIconDivsToUpdateArrayForSourceID(mapSourceIDs[sourceIDNum])
    await downloadDataForMapSource(mapSourceIDs[sourceIDNum], iconDivDictionary, null, false, false, true)
  }
}

async function updateIconsBasedOnLocalCSVData()
{
  for (sourceIDNum in mapSourceIDs)
  {
    var csvIsStored = await CSVDatabase.hasCSV(mapSourceIDs[sourceIDNum])
    if (csvIsStored)
    {
      var divsToUpdateStatus = getIconDivsToUpdateArrayForSourceID(mapSourceIDs[sourceIDNum])
      for (divID in divsToUpdateStatus)
      {
        removeStatusImage(divID)
        insertStatusImage(divID, divsToUpdateStatus[divID].success, divsToUpdateStatus[divID].width, divsToUpdateStatus[divID].height, divsToUpdateStatus[divID].top)
      }
    }
  }
}

function insertStatusImage(divID, icon, width, height, top)
{
  $("#" + divID).html($("#" + divID).html() + ('<span class="status">&nbsp;&nbsp;&nbsp;<img src="' + icon + '" style="position: relative; top: ' + (top || 2) + 'px; width: ' + (width || 16) + 'px; height: ' + (height || 16) + 'px;" /></span>'))
}

function removeStatusImage(divID)
{
  $("#" + divID + " .status").remove()
}

function setDataMapDateSliderRange(shouldSetToMax, sliderDivID, sliderTickDivID, mapDates)
{
  shouldSetToMax = shouldSetToMax || false
  sliderDivID = sliderDivID || "dataMapDateSlider"
  sliderTickDivID = sliderTickDivID || "dataMapSliderStepList"
  mapDates = mapDates || currentMapSource.getMapDates()

  var startDate = new Date(mapDates[0])
  var endDate = new Date(mapDates[mapDates.length-1])

  var previousValueWasLatest = $("#" + sliderDivID).val() == $("#" + sliderDivID).attr('max')

  $("#" + sliderDivID).attr('max', mapDates.length+1)

  if (currentSliderDate == null || shouldSetToMax || previousValueWasLatest)
  {
    $("#" + sliderDivID).val(mapDates.length+1)
    currentSliderDate = endDate
  }
  else
  {
    var previousDate = currentSliderDate.getTime()
    var closestDate = mapDates[0]
    var closestDateIndex = 0
    for (dateNum in mapDates)
    {
      if (Math.abs(previousDate-mapDates[dateNum]) < Math.abs(closestDate-previousDate))
      {
        closestDate = mapDates[dateNum]
        closestDateIndex = dateNum
      }
    }

    $("#" + sliderDivID).val(parseInt(closestDateIndex)+1)
    currentSliderDate = new Date(closestDate)
  }

  $("#" + sliderTickDivID).empty()
  if (mapDates.length <= maxDateSliderTicks)
  {
    for (dateNum in mapDates)
    {
      $("#" + sliderTickDivID).append("<span class='tick'></span>")
    }
    $("#" + sliderTickDivID).append("<span class='tick'></span>")
  }
}

function updateSliderDateDisplay(dateToDisplay, overrideDateString, sliderDateDisplayDivID)
{
  sliderDateDisplayDivID = sliderDateDisplayDivID || "dateDisplay"

  var dateString
  if (overrideDateString != null)
  {
    dateString = overrideDateString
  }
  else
  {
    dateString = (zeroPadding(dateToDisplay.getMonth()+1)) + "/" + zeroPadding(dateToDisplay.getDate()) + "/" + dateToDisplay.getFullYear()
  }

  $("#" + sliderDateDisplayDivID).html(dateString)
  currentSliderDate = dateToDisplay
}

function displayDataMap(dateIndex)
{
  dateIndex = dateIndex || $("#dataMapDateSlider").val()

  var mapDates = currentMapSource.getMapDates()
  var dateToDisplay
  var overrideDateString
  if (dateIndex-1 > mapDates.length-1)
  {
    dateToDisplay = new Date(mapDates[dateIndex-1-1])
    overrideDateString = "Latest (" + (zeroPadding(dateToDisplay.getMonth()+1)) + "/" + zeroPadding(dateToDisplay.getDate()) + "/" + dateToDisplay.getFullYear() + ")"
  }
  else
  {
    dateToDisplay = new Date(mapDates[dateIndex-1])
  }

  updateSliderDateDisplay(dateToDisplay, overrideDateString)

  updatePoliticalPartyCandidateNames(dateToDisplay.getTime())
  updateMapElectoralVoteText()

  var currentMapDataForDate = currentMapSource.getMapData()[dateToDisplay.getTime()]

  for (regionNum in currentMapDataForDate)
  {
    var regionDataCallback = getRegionData(currentMapDataForDate[regionNum].region)
    var regionData = regionDataCallback.regionData
    var regionsToFill = regionDataCallback.linkedRegionIDs

    regionData.margin = currentMapDataForDate[regionNum].margin
    regionData.partyID = currentMapDataForDate[regionNum].partyID
    regionData.chanceIncumbent = currentMapDataForDate[regionNum].chanceIncumbent
    regionData.chanceChallenger = currentMapDataForDate[regionNum].chanceChallenger

    updateRegionFillColors(regionsToFill, currentMapDataForDate[regionNum], false)
  }

  updateEVPieChart()

  if (currentRegionID && currentMapState == kViewing)
  {
    updateStateBox(currentRegionID)
  }

  showingDataMap = true
}

function updatePoliticalPartyCandidateNames(mapDate)
{
  var candidateNames = currentMapSource.getCandidateNames(mapDate)
  for (partyID in politicalParties)
  {
    if (partyID in candidateNames)
    {
      politicalParties[partyID].setCandidateName(candidateNames[partyID])
    }
  }
}

function updateMapElectoralVoteText()
{
  var regionIDs = Object.values(mapRegionNameToID)
  for (regionNum in regionIDs)
  {
    var regionChildren = $("#" + regionIDs[regionNum] + "-text").children()
    if (regionChildren.length == 1)
    {
      regionChildren[0].innerHTML = regionIDs[regionNum] + " " + regionEVArray[getCurrentDecade()][regionIDs[regionNum]]
    }
    else if (regionChildren.length == 2)
    {
      regionChildren[1].innerHTML = regionEVArray[getCurrentDecade()][regionIDs[regionNum]]
    }
  }
}

function toggleMapSource(buttonDiv)
{
  var mapSourceArrayIndex = mapSourceIDs.indexOf(currentMapSource.getID())
  mapSourceArrayIndex++
  if (mapSourceArrayIndex > mapSourceIDs.length-1)
  {
    mapSourceArrayIndex = 0
  }

  updateMapSource(mapSourceIDs[mapSourceArrayIndex], buttonDiv)
}

function updateMapSource(sourceID, buttonDiv, forceDownload)
{
  if (ignoreMapUpdateClickArray.includes(sourceID.replace(/\s/g, '')))
  {
    ignoreMapUpdateClickArray.splice(ignoreMapUpdateClickArray.indexOf(sourceID), 1)
    return
  }

  currentMapSource = mapSources[sourceID]

  updateMapSourceButton()
  loadDataMap(false, forceDownload)
}

function updateMapSourceButton(revertToDefault)
{
  revertToDefault = revertToDefault || false
  $("#mapSourcesDropdownContainer .active").removeClass("active")
  if (revertToDefault)
  {
    $("#sourceToggleButton").html("Select Source")
  }
  else
  {
    $("#sourceToggleButton").html("Source: " + currentMapSource.getID())
    $("#" + currentMapSource.getID().replace(/\s/g, '')).addClass("active")
  }

  if (currentMapState == kEditing && currentMapSource.getID() == CustomMapSource.getID())
  {
    $("#editDoneButton").html("Done")
  }
  else if (currentMapState == kEditing && currentMapSource.getID() != CustomMapSource.getID())
  {
    toggleEditing(kViewing)
  }
  else if (currentMapState != kEditing && currentMapSource.getID() == CustomMapSource.getID())
  {
    $("#editDoneButton").html("Edit")
  }
  else
  {
    $("#editDoneButton").html("Copy")
  }

  if (showingCompareMap && currentMapSource.getID() != CustomMapSource.getID())
  {
    updateCompareMapSlidersVisibility(false)
  }
  else if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
  {
    updateCompareMapSlidersVisibility(true)
  }
}

function toggleMarginEditing(marginID, div)
{
  if (editMarginID)
  {
    var marginValueToSet = parseFloat($("#" + editMarginID + "-text").val()) || defaultMarginValues[editMarginID]
    marginValueToSet = Math.round(marginValueToSet*Math.pow(10, 1))/Math.pow(10, 1)
    if (marginValueToSet > 100)
    {
      marginValueToSet = 100
    }

    var marginIDArray = Object.keys(marginNames)
    if (marginValueToSet < marginValues[marginIDArray[marginIDArray.indexOf(editMarginID)+1]])
    {
      marginValueToSet = marginValues[marginIDArray[marginIDArray.indexOf(editMarginID)+1]]
    }
    if (marginIDArray.indexOf(editMarginID) > 0 && marginValueToSet > marginValues[marginIDArray[marginIDArray.indexOf(editMarginID)-1]])
    {
      marginValueToSet = marginValues[marginIDArray[marginIDArray.indexOf(editMarginID)-1]]
    }

    var shouldRefreshMap = false
    if (marginValueToSet != marginValues[editMarginID])
    {
      shouldRefreshMap = true
    }

    marginValues[editMarginID] = marginValueToSet

    if (shouldRefreshMap && showingDataMap)
    {
      displayDataMap()
    }

    $("#" + editMarginID + "-edit").html(marginNames[editMarginID] + "<span style='float: right; font-family: \"Bree5erif-Mono\"'>" + marginValues[editMarginID] + "</span>")
  }

  if (marginID == editMarginID)
  {
    marginID = null
  }
  editMarginID = marginID

  if (marginID)
  {
    $(div).html(marginNames[marginID] + "<input class='marginTextInput' type='text' id='" + marginID + "-text' value='" + marginValues[marginID] + "'>")
    $("#" + marginID + "-text").focus()

    $("#marginEditButton").addClass('active')
    $("#editDoneButton").addClass('topnavdisable')
    $("#sourceToggleButton").addClass('topnavdisable')
    $("#mapSourcesDropdownContainer").hide()
  }
  else
  {
    $("#marginEditButton").removeClass('active')
    $("#editDoneButton").removeClass('topnavdisable')
    $("#sourceToggleButton").removeClass('topnavdisable')
    $("#mapSourcesDropdownContainer").show()
  }
}

function selectCountdownTime(countdownTimeName, countdownButtonDiv)
{
  $("#countdownsDropdownContainer .active").removeClass("active")
  $(countdownButtonDiv).addClass("active")

  currentCountdownTimeName = countdownTimeName
  updateCountdownTimer()
}

function clearMap()
{
  if (currentMapSource != CustomMapSource)
  {
    updateMapSourceButton(true)
    currentMapSource = CustomMapSource
  }
  else
  {
    CustomMapSource.setTextMapData("date\n" + getTodayString())
    CustomMapSource.setIconURL("")
    loadDataMap(false, true)
  }

  if (showingCompareMap)
  {
    showingCompareMap = false

    $(".comparesourcecheckbox").prop('checked', false)

    compareMapSourceIDArray = [null, null]
    updateCompareMapSlidersVisibility()

    $(".compareitemtext").html("&lt;Empty&gt;")
    $(".compareitemimage").css('display', "none")
    $(".compareitemimage").attr('src', "")
  }

  marginValues = cloneObject(defaultMarginValues)
  createMarginEditDropdownItems()

  updatePoliticalPartyCandidateNames()
  updateMapElectoralVoteText()

  displayRegionDataArray = {}
  populateRegionsArray()

  $('#outlines').children().each(function() {
    var regionDataCallback = getRegionData($(this).attr('id'))
    var regionIDsToFill = regionDataCallback.linkedRegionIDs
    var regionData = regionDataCallback.regionData

    updateRegionFillColors(regionIDsToFill, regionData, false)
  })

  updateEVPieChart()
  if (currentRegionID != null)
  {
    updateStateBox(currentRegionID)
  }

  $("#dataMapDateSliderContainer").hide()
  $("#dateDisplay").hide()

  $("#evPieChart").css("background-image", "")

  showingDataMap = false
}

function toggleHelpBox(helpButtonDiv)
{
  showingHelpBox = !showingHelpBox
  if (showingHelpBox)
  {
    $("#helpboxcontainer").show()
    $("#toggleHelpBoxButton").addClass('active')
    $("#evPieChartContainer").hide()
    $("#creditboxcontainer").hide()
  }
  else
  {
    $("#helpboxcontainer").hide()
    $("#toggleHelpBoxButton").removeClass('active')
    $("#evPieChartContainer").show()
    $("#creditboxcontainer").show()
  }
}

function populateRegionsArray()
{
  $('#outlines').children().each(function() {
    var regionID = $(this).attr('id')
    for (regexNum in regionIDsToIgnore)
    {
      if (regionIDsToIgnore[regexNum].test(regionID))
      {
        return
      }
    }

    displayRegionDataArray[regionID] = {partyID: TossupParty.getID(), margin: 0}
  })
}

function selectParty(div)
{
  if (currentMapState == kEditing)
  {
    var partyID = $(div).attr('id')

    if (selectedParty != null)
    {
      $("#" + selectedParty.getID()).removeClass('active')
    }

    if (selectedParty != null && selectedParty.getID() == partyID)
    {
      selectedParty = null
      $(div).removeClass('active')
    }
    else
    {
      selectedParty = politicalParties[partyID]
      $(div).addClass('active')
    }
  }
}

function selectAllParties()
{
  $("#partyButtonDiv").children().each(function() {
    $(this).addClass('active')
  })
}

function deselectAllParties()
{
  $("#partyButtonDiv").children().each(function() {
    $(this).removeClass('active')
  })
  selectedParty = null
}

function toggleEditing(stateToSet)
{
  if (editMarginID) { return }

  if (stateToSet == null)
  {
    switch (currentMapState)
    {
      case kEditing:
      currentMapState = kViewing
      break

      case kViewing:
      currentMapState = kEditing
      break
    }
  }
  else
  {
    currentMapState = stateToSet
  }

  switch (currentMapState)
  {
    case kEditing:
    deselectAllParties()

    $("#editDoneButton").html("Done")
    $("#editDoneButton").addClass('active')

    $("#stateboxcontainer").hide()

    $("#marginEditButton").addClass('topnavdisable')
    $("#marginsDropdownContainer").hide()

    var currentMapIsCustom = (currentMapSource.getID() == CustomMapSource.getID())
    CustomMapSource.updateMapData(displayRegionDataArray, getCurrentDateOrToday(), !currentMapIsCustom)

    if (!currentMapIsCustom)
    {
      currentMapSource = CustomMapSource
      updateMapSourceButton()
      loadDataMap()
    }
    break

    case kViewing:
    selectAllParties()

    if (currentMapSource.getID() == CustomMapSource.getID())
    {
      $("#editDoneButton").html("Edit")
    }
    else
    {
      $("#editDoneButton").html("Copy")
    }
    $("#editDoneButton").removeClass('active')

    $("#marginEditButton").removeClass('topnavdisable')
    $("#marginsDropdownContainer").show()

    if (currentMapSource.getID() == CustomMapSource.getID())
    {
      CustomMapSource.updateMapData(displayRegionDataArray, getCurrentDateOrToday(), false)
    }

    if (showingDataMap && currentRegionID)
    {
      updateStateBox(currentRegionID)
    }
    break
  }
}

function leftClickRegion(div)
{
  if (currentMapState == kEditing)
  {
    if (ignoreNextClick)
    {
      ignoreNextClick = false
      return
    }

    var regionID = $(div).attr('id')
    if (regionIDsChanged.includes(regionID)) { return }

    var regionDataCallback = getRegionData(regionID)
    var regionData = regionDataCallback.regionData
    var regionIDsToFill = regionDataCallback.linkedRegionIDs

    if (selectedParty != null && regionData.partyID != selectedParty.getID())
    {
      regionData.partyID = selectedParty.getID()
      regionData.margin = marginValues.safe
    }
    else if (selectedParty != null)
    {
      var marginValueArray = Object.values(marginValues)
      var marginValueIndex = marginValueArray.indexOf(regionData.margin)
      if (marginValueIndex == -1)
      {
        for (marginValueNum in marginValueArray)
        {
          if (regionData.margin >= marginValueArray[marginValueNum])
          {
            regionData.margin = marginValueArray[marginValueNum]
            break
          }
        }
        marginValueIndex = marginValueArray.indexOf(regionData.margin)
      }

      marginValueIndex += 1
      if (marginValueIndex > marginValueArray.length-1)
      {
        marginValueIndex = 0
      }

      regionData.margin = marginValueArray[marginValueIndex]
    }
    else
    {
      regionData.partyID = TossupParty.getID()
      regionData.margin = 0
    }

    updateRegionFillColors(regionIDsToFill, regionData)
  }
  else if (currentMapState == kViewing && showingDataMap && currentRegionID)
  {
    currentMapSource.openRegionLink(currentRegionID, currentSliderDate)
  }
}

function rightClickRegion(div)
{
  if (currentMapState == kEditing)
  {
    var regionDataCallback = getRegionData($(div).attr('id'))
    var regionData = regionDataCallback.regionData
    var regionIDsToFill = regionDataCallback.linkedRegionIDs

    if (selectedParty != null && regionData.partyID != selectedParty.getID())
    {
      regionData.partyID = selectedParty.getID()
      regionData.margin = marginValues.tilt
    }
    else if (selectedParty != null)
    {
      var marginValueArray = Object.values(marginValues)
      var marginValueIndex = marginValueArray.indexOf(regionData.margin)
      if (marginValueIndex == -1)
      {
        for (marginValueNum in marginValueArray)
        {
          if (regionData.margin >= marginValueArray[marginValueNum])
          {
            regionData.margin = marginValueArray[marginValueNum]
            break
          }
        }
        marginValueIndex = marginValueArray.indexOf(regionData.margin)
      }

      marginValueIndex -= 1
      if (marginValueIndex < 0)
      {
        marginValueIndex = marginValueArray.length-1
      }

      regionData.margin = marginValueArray[marginValueIndex]
    }
    else
    {
      regionData.partyID = TossupParty.getID()
      regionData.margin = 0
    }

    updateRegionFillColors(regionIDsToFill, regionData)
  }
}

function getRegionData(regionID)
{
  var baseRegionIDCallback = getBaseRegionID(regionID)
  regionID = baseRegionIDCallback.baseID
  var linkedRegionIDs = baseRegionIDCallback.linkedIDs

  var regionData = displayRegionDataArray[regionID]

  return {regionData: regionData, linkedRegionIDs: linkedRegionIDs}
}

function getBaseRegionID(regionID)
{
  var linkedRegionIDs = [regionID]
  var foundRegion = regionID in displayRegionDataArray

  for (linkedRegionSetNum in linkedRegions)
  {
    for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
    {
      if (linkedRegions[linkedRegionSetNum][linkedRegionIDNum] == regionID)
      {
        for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
        {
          var linkedRegionToTest = linkedRegions[linkedRegionSetNum][linkedRegionIDNum]
          if (regionID != linkedRegionToTest)
          {
            linkedRegionIDs.push(linkedRegionToTest)
          }
          if (!foundRegion && linkedRegionToTest in displayRegionDataArray)
          {
            regionID = linkedRegionToTest
          }
        }
        return {baseID: regionID, linkedIDs: linkedRegionIDs}
      }
    }
  }

  return {baseID: regionID, linkedIDs: linkedRegionIDs}
}

function updateRegionFillColors(regionIDsToUpdate, regionData, shouldUpdatePieChart)
{
  var fillColor
  if (regionData.partyID == null || regionData.partyID == TossupParty.getID())
  {
    fillColor = TossupParty.getMarginColors().tilt
  }
  else
  {
    fillColor = politicalParties[regionData.partyID].getMarginColors()[getMarginIndexForValue(regionData.margin, regionData.partyID)]
  }

  for (regionIDNum in regionIDsToUpdate)
  {
    var regionDiv = $("#" + regionIDsToUpdate[regionIDNum])
    regionDiv.css('animation-fill-mode', 'forwards')
    regionDiv.css('fill', fillColor)
  }

  displayPartyTotals(getPartyTotals())
  if (shouldUpdatePieChart == null || shouldUpdatePieChart == true)
  {
    updateEVPieChart()
  }
}

function getMarginIndexForValue(margin, partyID)
{
  for (marginName in marginValues)
  {
    if (Math.abs(margin) >= marginValues[marginName])
    {
      return marginName
    }
  }
}

function getPartyTotals()
{
  var partyTotals = {}

  for (partyIDNum in politicalPartyIDs)
  {
    partyTotals[politicalPartyIDs[partyIDNum]] = 0
  }

  for (regionID in displayRegionDataArray)
  {
    var partyIDToSet = displayRegionDataArray[regionID].partyID
    if (displayRegionDataArray[regionID].partyID == null)
    {
      partyIDToSet = TossupParty.getID()
    }
    partyTotals[partyIDToSet] += regionEVArray[getCurrentDecade()][regionID]
  }

  return partyTotals
}

function displayPartyTotals(partyTotals)
{
  for (partyID in partyTotals)
  {
    $("#" + partyID).html(politicalParties[partyID].getCandidateName() + " (" + partyTotals[partyID] + ")")
  }
}

function setupEVPieChart()
{
  // Hardcoding two parties
  var democraticPartyColors = DemocraticParty.getMarginColors()
  var republicanPartyColors = RepublicanParty.getMarginColors()
  var tossupPartyColor = TossupParty.getMarginColors().safe

  var data = {
    datasets: [
      {
        data: [0, 0, 0, 0, 538, 0, 0, 0, 0],
        backgroundColor: [
          democraticPartyColors.safe,
          democraticPartyColors.likely,
          democraticPartyColors.lean,
          democraticPartyColors.tilt,
          tossupPartyColor,
          republicanPartyColors.tilt,
          republicanPartyColors.lean,
          republicanPartyColors.likely,
          republicanPartyColors.safe
        ],
        labels: [
          "Safe Dem",
          "Likely Dem",
          "Lean Dem",
          "Tilt Dem",
          "Tossup",
          "Tilt Rep",
          "Lean Rep",
          "Likely Rep",
          "Safe Rep"
        ]
      },
      {
        data: [0, 538, 0],
        backgroundColor: [
          democraticPartyColors.safe,
          tossupPartyColor,
          republicanPartyColors.safe
        ],
        labels: [
          "Democratic",
          "Tossup",
          "Republican"
        ]
      }
    ],
  }

  var options = {
    responsive: false,
    cutoutPercentage: evPieChartCutoutPercent,
    rotation: 0.5*Math.PI,
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: "#ddd"
      }
    },
    legend: {
      display: false
    },
    tooltips: {
      titleFontSize: 15,
      titleFontStyle: "bold",
      bodyFontSize: 15,
      bodyFontStyle: "bold",
      displayColors: false,
      callbacks: {
        title: function(tooltipItem, data) {
          var label = data.datasets[tooltipItem[0].datasetIndex].labels[tooltipItem[0].index] || ''
          label += ': '
          label += data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]

          return label
        },
        label: function(tooltipItem, data) {
          if (tooltipItem.datasetIndex != 0) { return }
          var labelArray = regionMarginStrings[tooltipItem.index].concat()
          return labelArray
        },
        labelTextColor: function(tooltipItem, chart) {
          var color = chart.config.data.datasets[tooltipItem.datasetIndex].backgroundColor[tooltipItem.index]
          return adjustBrightness(color, minEVPieChartSliceLabelBrightness)
        }
      }
    },
    plugins: {
      datalabels: {
        color: function(context) {
          var value = context.dataset.data[context.dataIndex]
          return value < minEVPieChartSliceLabelValue ? "rgb(0, 0, 0, 0)" : "#fff"
        },
        font: {
          family: "Bree5erif-Mono",
          size: Math.round(24*$(window).width()/1800),
          weight: "bold"
        }
      }
    }
  }

  var ctx = document.getElementById('evPieChart').getContext('2d')
  evPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  })
}

function updateEVPieChart()
{
  var marginTotals = [] // TODO: Fix hardcoding of two parties for pie chart; Use object for marginTotals, etc
  for (partyIDNum in politicalPartyIDs)
  {
    for (marginNum in politicalParties[politicalPartyIDs[partyIDNum]].getMarginColors())
    {
      marginTotals.push(0)
    }
  }

  regionMarginStrings = []
  for (partyIDNum in politicalPartyIDs)
  {
    for (marginNum in politicalParties[politicalPartyIDs[partyIDNum]].getMarginColors())
    {
      regionMarginStrings.push([])
    }
  }
  regionMarginStrings.push([])

  for (regionID in displayRegionDataArray)
  {
    var regionParty = displayRegionDataArray[regionID].partyID
    var regionMargin = displayRegionDataArray[regionID].margin
    var pieChartIndex
    if (regionParty == null || regionParty == TossupParty.getID())
    {
      pieChartIndex = 0
      for (partyIDNum in marginPartyPieChartOrder)
      {
        if (marginPartyPieChartOrder[partyIDNum] == TossupParty.getID()) { break }
        pieChartIndex += marginPieChartIndexes[marginPartyPieChartOrder[partyIDNum]].length
      }
    }
    else
    {
      pieChartIndex = 0
      for (partyIDNum in marginPartyPieChartOrder)
      {
        if (marginPartyPieChartOrder[partyIDNum] == regionParty) { break }
        pieChartIndex += marginPieChartIndexes[marginPartyPieChartOrder[partyIDNum]].length
      }
      pieChartIndex += marginPieChartIndexes[regionParty].indexOf(getMarginIndexForValue(regionMargin, regionParty))
    }

    marginTotals[pieChartIndex] += regionEVArray[getCurrentDecade()][regionID]
    regionMarginStrings[pieChartIndex].push(regionID + " +" + decimalPadding(Math.round(regionMargin*10)/10, currentMapSource.getAddDecimalPadding()))
  }

  for (regionArrayNum in regionMarginStrings)
  {
    regionMarginStrings[regionArrayNum].sort((marginString1, marginString2) => {
      return parseFloat(marginString1.split("+")[1]) > parseFloat(marginString2.split("+")[1]) ? 1 : -1
    })
  }

  var partyTotals = Object.values(getPartyTotals())
  var evNotTossup = 0
  for (partyTotalNum in partyTotals)
  {
    evNotTossup += partyTotals[partyTotalNum]
  }
  if (partyTotals.length == 0)
  {
    for (partyIDNum in politicalPartyIDs)
    {
      partyTotals.push(0)
    }
  }

  partyTotals = partyTotals.concat().splice(0,Math.ceil(partyTotals.length/2)).concat(partyTotals.concat().splice(Math.ceil(partyTotals.length/2)))
  evPieChart.data.datasets[1].data = partyTotals

  var safeMarginTotals = [marginTotals[0], marginTotals[4], marginTotals[8]] // Hardcoding two parties
  if (safeMarginTotals.toString() == partyTotals.toString())
  {
    evPieChart.data.datasets[0].hidden = true
    evPieChart.data.datasets[0].data = []
  }
  else
  {
    evPieChart.data.datasets[0].hidden = false
    evPieChart.data.datasets[0].data = marginTotals
  }

  evPieChart.update()
}

function getCurrentDecade()
{
  return currentSliderDate == null ? 2010 : (Math.floor((currentSliderDate.getFullYear()-1)/10)*10)
}

function getCurrentDateOrToday()
{
  var dateToUse = new Date(getTodayString()).getTime()
  if (currentSliderDate)
  {
    dateToUse = currentSliderDate.getTime()
  }

  return dateToUse
}

function getTodayString(delimiter, includeTime)
{
  var currentTimeDate = new Date()
  return getMDYDateString(currentTimeDate, delimiter, includeTime)
}

function getMDYDateString(date, delimiter, includeTime)
{
  delimiter = delimiter || "/"

  var dateString = (date.getMonth()+1) + delimiter + date.getDate() + delimiter + date.getFullYear()

  if (includeTime)
  {
    dateString += delimiter + zeroPadding(date.getHours()) + delimiter + zeroPadding(date.getMinutes())
  }

  return dateString
}

function updateStateBox(regionID)
{
  var regionData = getRegionData(regionID).regionData
  if (regionID == null || regionData.partyID == null || regionData.partyID == TossupParty.getID())
  {
    $("#stateboxcontainer").hide()
    return
  }
  $("#stateboxcontainer").show()

  var regionMarginString
  var roundedMarginValue = decimalPadding(Math.round(regionData.margin*10)/10, currentMapSource.getAddDecimalPadding())
  regionMarginString = politicalParties[regionData.partyID].getCandidateName() + " +" + roundedMarginValue

  if (regionData.chanceChallenger && regionData.chanceIncumbent)
  {
    regionMarginString += "<br></span><span style='font-size: 17px; padding-top: 5px; padding-bottom: 5px; display: block; line-height: 100%;'>Chances<br>"
    regionMarginString += "<span style='color: " + politicalParties[incumbentChallengerPartyIDs.challenger].getMarginColors().lean + ";'>" // Hardcoding challenger first
    regionMarginString += decimalPadding(Math.round(regionData.chanceChallenger*1000)/10)
    regionMarginString += "%</span>&nbsp;&nbsp;&nbsp;<span style='color: " + politicalParties[incumbentChallengerPartyIDs.incumbent].getMarginColors().lean + ";'>"
    regionMarginString += decimalPadding(Math.round(regionData.chanceIncumbent*1000)/10)
    regionMarginString += "%</span></span>"
  }
  //Couldn't get safe colors to look good
  // + "<span style='color: " + politicalParties[regionData.partyID].getMarginColors()[getMarginIndexForValue(roundedMarginValue, regionData.partyID)] + "; -webkit-text-stroke-width: 0.5px; -webkit-text-stroke-color: white;'>"
  $("#statebox").html(getKeyByValue(mapRegionNameToID, currentRegionID) + "<br>" + "<span style='color: " + politicalParties[regionData.partyID].getMarginColors().lean + ";'>" + regionMarginString + "</span>")
}

function updateCountdownTimer()
{
  var currentDate = new Date()

  var countdownTime
  if (currentCountdownTimeName != null)
  {
    countdownTime = countdownTimes[currentCountdownTimeName]
  }
  else
  {
    countdownTime = Object.values(countdownTimes).sort().slice(-1)[0]
    for (timeName in countdownTimes)
    {
      if (currentDate.getTime() < countdownTimes[timeName])
      {
        countdownTime = countdownTimes[timeName]
        break
      }
    }

    currentCountdownTimeName = getKeyByValue(countdownTimes, countdownTime)
  }

  var timeUntilDay = Math.abs(countdownTime-currentDate.getTime())
  var timeHasPassed = Math.sign(countdownTime-currentDate.getTime()) == -1

  var daysUntilDay = Math.floor(timeUntilDay/(1000*60*60*24))
  var hoursUntilDay = Math.floor(timeUntilDay/(1000*60*60)%24)
  var minutesUntilDay = Math.floor(timeUntilDay/(1000*60)%60)
  var secondsUntilDay = Math.floor(timeUntilDay/1000%60)

  $("#countdownDisplay").html((timeHasPassed ? "+" : "–") + " " + daysUntilDay + "<span style='font-size: 16px;'> day" + (daysUntilDay == 1 ? "" : "s") + "</span>&nbsp;&nbsp;" + zeroPadding(hoursUntilDay) + "<span style='font-size: 16px;'> hr" + (hoursUntilDay == 1 ? "" : "s") + "</span>&nbsp;&nbsp;" + zeroPadding(minutesUntilDay) + "<span style='font-size: 16px;'> min" + (minutesUntilDay == 1 ? "" : "s") + "</span>&nbsp;&nbsp;" + zeroPadding(secondsUntilDay) + "<span style='font-size: 16px;'> s" + "</span>")
}

$("html").on('dragenter', function(e) {
  e.stopPropagation()
  e.preventDefault()
})

$("html").on('dragover', function(e) {
  e.stopPropagation()
  e.preventDefault()
})

$("html").on('drop', function(e) {
  e.stopPropagation()
  e.preventDefault()

  var file = e.originalEvent.dataTransfer.files[0]
  loadUploadedFile(file)
})

function loadUploadedFile(file)
{
  var fr = new FileReader()

  switch (file.type)
  {
    case kJSONFileType:
    fr.onload = jsonFileLoaded
    fr.readAsText(file)
    break

    case kCSVFileType:
    fr.onload = csvFileLoaded
    fr.readAsText(file)
    break

    case kJPEGFileType:
    case kPNGFileType:
    fr.onload = imageFileLoaded
    fr.readAsDataURL(file)
    break

    default:
    return
  }
}

function jsonFileLoaded(e)
{
  if (!e.target.result) { return }

  var jsonMapData = JSON.parse(e.target.result)
  if (!jsonMapData || !jsonMapData.mapData) { return }

  if (jsonMapData.marginValues && Object.keys(jsonMapData.marginValues).toString() == Object.keys(marginValues).toString())
  {
    marginValues = jsonMapData.marginValues
  }
  else
  {
    marginValues = cloneObject(defaultMarginValues)
  }
  createMarginEditDropdownItems()

  if (jsonMapData.iconURL)
  {
    CustomMapSource.setIconURL(jsonMapData.iconURL)
  }
  else
  {
    CustomMapSource.setIconURL("")
  }

  CustomMapSource.setTextMapData(jsonMapData.mapData)

  currentMapSource = CustomMapSource
  updateMapSourceButton()
  loadDataMap(false, true)
}

function csvFileLoaded(e)
{
  var textMapData = e.target.result
  if (!textMapData) { return }

  CustomMapSource.setTextMapData(textMapData)

  currentMapSource = CustomMapSource
  updateMapSourceButton()
  loadDataMap(false, true)
}

function imageFileLoaded(e)
{
  var backgroundURL = "url('" + e.target.result + "')"
	$("#evPieChart").css("background-image", backgroundURL)
}

function downloadMapFile(mapSourceToDownload, fileType)
{
  if (!mapSourceToDownload.getTextMapData()) { return }

  var downloadLinkDiv = $(document.createElement("a"))
  downloadLinkDiv.hide()

  var pieChartIconURL = $("#evPieChart").css("background-image")
  if (pieChartIconURL)
  {
    pieChartIconURL = pieChartIconURL.replace("url(\"", "").replace("\")", "")
  }

  var fileToDownload = getMapFileBlob(mapSourceToDownload.getTextMapData(), fileType, pieChartIconURL)
  downloadLinkDiv.attr('href', window.URL.createObjectURL(fileToDownload))
  downloadLinkDiv.attr('download', "custom-map-" + getTodayString("-", true))

  downloadLinkDiv[0].click()

  downloadLinkDiv.remove()
}

function getMapFileBlob(textMapData, fileType, pieChartIconURL)
{
  var dataString
  switch (fileType)
  {
    case kJSONFileType:
    dataString = JSON.stringify({mapData: textMapData, marginValues: marginValues, iconURL: pieChartIconURL})
    break

    case kCSVFileType:
    dataString = textMapData
    break

    default:
    dataString = ""
    break
  }

  var fileToDownload = new Blob([dataString], {type: fileType})
  return fileToDownload
}

async function toggleCompareMapSourceCheckbox(mapSourceID, overrideAdd)
{
  var checkboxID = mapSourceID.replace(/\s/g, '') + '-compare'
  if (!$('#' + checkboxID).prop('disabled') || overrideAdd)
  {
    $('#' + checkboxID).prop('checked', !$('#' + checkboxID).prop('checked') || overrideAdd)
    await addCompareMapSource(mapSourceID)
  }
}

async function addCompareMapSource(mapSourceID)
{
  var checkboxID = mapSourceID.replace(/\s/g, '') + "-compare"
  var checkboxChecked = $("#" + checkboxID).prop('checked')

  var compareSourcesUpdated
  var mapSourceToUncheck
  if (checkboxChecked && compareMapSourceIDArray[0] == null && compareMapSourceIDArray[1] == null)
  {
    compareSourcesUpdated = [true, true]
    compareMapSourceIDArray[0] = mapSourceID
    compareMapSourceIDArray[1] = mapSourceID
  }
  else if (checkboxChecked && compareMapSourceIDArray[0] == compareMapSourceIDArray[1])
  {
    compareSourcesUpdated = [false, true]
    compareMapSourceIDArray[1] = mapSourceID
  }
  else if (checkboxChecked)
  {
    compareSourcesUpdated = [true, true]
    mapSourceToUncheck = shouldSwapCompareMapSources(compareMapSourceIDArray[0], compareMapSourceIDArray[1]) ? compareMapSourceIDArray[0] : compareMapSourceIDArray[1]
    compareMapSourceIDArray[0] = compareMapSourceIDArray[0] == mapSourceToUncheck ? mapSourceID : compareMapSourceIDArray[0]
    compareMapSourceIDArray[1] = compareMapSourceIDArray[1] == mapSourceToUncheck ? mapSourceID : compareMapSourceIDArray[1]
  }
  else if (!checkboxChecked && compareMapSourceIDArray[0] != compareMapSourceIDArray[1])
  {
    if (compareMapSourceIDArray[0] == mapSourceID)
    {
      compareSourcesUpdated = [true, false]
      compareMapSourceIDArray[0] = compareMapSourceIDArray[1]
    }
    else if (compareMapSourceIDArray[1] == mapSourceID)
    {
      compareSourcesUpdated = [false, true]
      compareMapSourceIDArray[1] = compareMapSourceIDArray[0]
    }
  }
  else if (!checkboxChecked && compareMapSourceIDArray[0] == compareMapSourceIDArray[1])
  {
    clearMap()
    return
  }

  if (mapSourceToUncheck)
  {
    $("#" + mapSourceToUncheck.replace(/\s/g, '') + "-compare").prop('checked', false)
  }

  await updateCompareMapSources(compareSourcesUpdated, false)

  showingCompareMap = true
  updateCompareMapSlidersVisibility()
}

function updateCompareMapSources(compareSourcesToUpdate, overrideSwapSources, swapSliderValues)
{
  var updateCompareMapSourcesPromise = new Promise(async (resolve, reject) => {
    if (compareSourcesToUpdate[0])
    {
      var iconDivDictionary = getIconDivsToUpdateArrayForSourceID(compareMapSourceIDArray[0])
      $('.comparesourcecheckbox').prop('disabled', true)
      await downloadDataForMapSource(compareMapSourceIDArray[0], iconDivDictionary, null, false)
      $('.comparesourcecheckbox').prop('disabled', false)
    }
    if (compareSourcesToUpdate[1])
    {
      var iconDivDictionary = getIconDivsToUpdateArrayForSourceID(compareMapSourceIDArray[1])
      $('.comparesourcecheckbox').prop('disabled', true)
      await downloadDataForMapSource(compareMapSourceIDArray[1], iconDivDictionary, null, false)
      $('.comparesourcecheckbox').prop('disabled', false)
    }

    if (shouldSwapCompareMapSources(compareMapSourceIDArray[0], compareMapSourceIDArray[1]) && !overrideSwapSources)
    {
      swapCompareMapSources()
      compareSourcesToUpdate = [true, true]
    }

    var overrideDateValues = [null, null]
    if (swapSliderValues)
    {
      overrideDateValues[0] = $("#secondCompareDataMapDateSlider").val()
      overrideDateValues[1] = $("#firstCompareDataMapDateSlider").val()
    }

    if (compareSourcesToUpdate[0])
    {
      setDataMapDateSliderRange(true, "firstCompareDataMapDateSlider", "firstCompareDataMapSliderStepList", mapSources[compareMapSourceIDArray[0]].getMapDates())
      $("#firstCompareDataMapDateSlider").val(overrideDateValues[0] || mapSources[compareMapSourceIDArray[0]].getMapDates().length+1)
      setCompareSourceDate(0, overrideDateValues[0] || mapSources[compareMapSourceIDArray[0]].getMapDates().length+1)
      $("#compareItemImage-0").css('display', "block")
      $("#compareItemImage-0").prop('src', mapSources[compareMapSourceIDArray[0]].getIconURL())
    }
    if (compareSourcesToUpdate[1])
    {
      setDataMapDateSliderRange(true, "secondCompareDataMapDateSlider", "secondCompareDataMapSliderStepList", mapSources[compareMapSourceIDArray[1]].getMapDates())
      $("#secondCompareDataMapDateSlider").val(overrideDateValues[1] || mapSources[compareMapSourceIDArray[1]].getMapDates().length+1)
      setCompareSourceDate(1, overrideDateValues[1] || mapSources[compareMapSourceIDArray[1]].getMapDates().length+1)
      $("#compareItemImage-1").css('display', "block")
      $("#compareItemImage-1").prop('src', mapSources[compareMapSourceIDArray[1]].getIconURL())
    }

    resolve()
  })

  return updateCompareMapSourcesPromise
}

function shouldSwapCompareMapSources(firstMapSourceID, secondMapSourceID)
{
  return mapSources[firstMapSourceID].getMapDates().slice(-1)[0] < mapSources[secondMapSourceID].getMapDates().slice(-1)[0]
}

function swapCompareMapSources()
{
  var tempSourceID = compareMapSourceIDArray[0]
  compareMapSourceIDArray[0] = compareMapSourceIDArray[1]
  compareMapSourceIDArray[1] = tempSourceID
}

function updateCompareMapSlidersVisibility(overrideShowHide)
{
  var showCompareSliders = overrideShowHide
  if (showCompareSliders == null)
  {
    showCompareSliders = showingCompareMap
  }

  if (showCompareSliders)
  {
    $("#firstCompareSliderDateDisplayContainer").show()
    $("#secondCompareSliderDateDisplayContainer").show()

    $("#sliderDateDisplayContainer").hide()
  }
  else
  {
    $("#firstCompareSliderDateDisplayContainer").hide()
    $("#secondCompareSliderDateDisplayContainer").hide()

    $("#sliderDateDisplayContainer").show()
  }

  if (showingCompareMap)
  {
    $("#compareButton").addClass('active')
    $("#compareArrayDropdownContainer").show()
    $("#comparePresetsDropdownContainer").hide()
  }
  else
  {
    $("#compareButton").removeClass('active')
    $("#compareArrayDropdownContainer").hide()
    $("#comparePresetsDropdownContainer").show()
  }
}

function setMapCompareItem(compareArrayIndex)
{
  if (!showingDataMap) { return }
  compareMapDataArray[compareArrayIndex] = cloneObject(displayRegionDataArray)
  $("#compareItem-" + compareArrayIndex).html(currentMapSource.getID() + " : " + getMDYDateString(currentSliderDate))
}

function setCompareSourceDate(compareArrayIndex, dateIndex)
{
  var mapDates = mapSources[compareMapSourceIDArray[compareArrayIndex]].getMapDates()

  var dateToDisplay
  var overrideDateString
  if (dateIndex-1 > mapDates.length-1)
  {
    dateToDisplay = new Date(mapDates[dateIndex-1-1])
    overrideDateString = "Latest (" + (zeroPadding(dateToDisplay.getMonth()+1)) + "/" + zeroPadding(dateToDisplay.getDate()) + "/" + dateToDisplay.getFullYear() + ")"
  }
  else
  {
    dateToDisplay = new Date(mapDates[dateIndex-1])
  }
  updateSliderDateDisplay(dateToDisplay, overrideDateString, compareArrayIndex == 0 ? "firstCompareDateDisplay" : "secondCompareDateDisplay")

  $("#compareItem-" + compareArrayIndex).html(compareMapSourceIDArray[compareArrayIndex] + " (" + getMDYDateString(dateToDisplay) + ")")

  compareMapDataArray[compareArrayIndex] = mapSources[compareMapSourceIDArray[compareArrayIndex]].getMapData()[dateToDisplay.getTime()]
  applyCompareToCustomMap()
}

function applyCompareToCustomMap()
{
  if (compareMapDataArray.length < 2 || compareMapDataArray[0] == null || compareMapDataArray[1] == null) { return }

  var resultMapArray = {}
  for (regionID in compareMapDataArray[0])
  {
    if (compareMapDataArray[0][regionID].partyID == TossupParty.getID())
    {
      resultMapArray[regionID] = cloneObject(compareMapDataArray[0][regionID])
    }
    else
    {
      resultMapArray[regionID] = {}

      if (compareMapDataArray[0][regionID].partyID == compareMapDataArray[1][regionID].partyID)
      {
        resultMapArray[regionID].margin = compareMapDataArray[0][regionID].margin-compareMapDataArray[1][regionID].margin
      }
      else
      {
        resultMapArray[regionID].margin = compareMapDataArray[0][regionID].margin+compareMapDataArray[1][regionID].margin
      }

      resultMapArray[regionID].partyID = compareMapDataArray[0][regionID].partyID
    }
  }

  CustomMapSource.updateMapData(resultMapArray, (new Date(getTodayString())).getTime(), true)
  currentMapSource = CustomMapSource
  updateMapSourceButton()
  loadDataMap()
}

async function loadCompareItemMapSource(compareItemNum)
{
  currentMapSource = mapSources[compareMapSourceIDArray[compareItemNum]]
  updateMapSourceButton()
  await loadDataMap()

  var dateIndexToSet
  switch (compareItemNum)
  {
    case 0:
    dateIndexToSet = $("#firstCompareDataMapDateSlider")[0].value
    break

    case 1:
    dateIndexToSet = $("#secondCompareDataMapDateSlider")[0].value
    break
  }

  $("#dataMapDateSlider").val(dateIndexToSet)
  displayDataMap(dateIndexToSet)
  updateCompareMapSlidersVisibility(false)
}

async function loadComparePreset(comparePresetNum)
{
  switch (comparePresetNum)
  {
    case kPastElectionsVsPastElections:
    await toggleCompareMapSourceCheckbox(PastElectionResultMapSource.getID(), true)
    await toggleCompareMapSourceCheckbox(PastElectionResultMapSource.getID(), true)

    $("#secondCompareDataMapDateSlider").val(mapSources[compareMapSourceIDArray[1]].getMapDates().length+1-2)
    setCompareSourceDate(1, mapSources[compareMapSourceIDArray[1]].getMapDates().length+1-2)
    break

    case kPastElectionsVs538Projection:
    await toggleCompareMapSourceCheckbox(PastElectionResultMapSource.getID(), true)
    await toggleCompareMapSourceCheckbox(FiveThirtyEightProjectionMapSource.getID(), true)
    break

    case kPastElectionsVs538PollAvg:
    await toggleCompareMapSourceCheckbox(PastElectionResultMapSource.getID(), true)
    await toggleCompareMapSourceCheckbox(FiveThirtyEightPollAverageMapSource.getID(), true)
    break
  }
}

var arrowKeysDown = {left: 0, right: 0, up: 0, down: 0}
var arrowKeyTimeouts = {}

document.addEventListener('keydown', function(e) {
  if (e.which >= 37 && e.which <= 40 && showingDataMap)
  {
    switch (e.which)
    {
      case 37:
      if (arrowKeysDown.left > 0) { return }
      arrowKeysDown.left = 1
      arrowKeyTimeouts.left = setTimeout(function() { arrowKeyCycle("left") }, initialKeyPressDelay)

      incrementSlider("left")
      break

      case 39:
      if (arrowKeysDown.right > 0) { return }
      arrowKeysDown.right = 1
      arrowKeyTimeouts.right = setTimeout(function() { arrowKeyCycle("right") }, initialKeyPressDelay)

      incrementSlider("right")
      break

      case 40:
      if (arrowKeysDown.down > 0) { return }
      arrowKeysDown.down = 1
      arrowKeyTimeouts.down = setTimeout(function() { arrowKeyCycle("down") }, initialKeyPressDelay)

      incrementSlider("down")
      break

      case 38:
      if (arrowKeysDown.up > 0) { return }
      arrowKeysDown.up = 1
      arrowKeyTimeouts.up = setTimeout(function() { arrowKeyCycle("up") }, initialKeyPressDelay)

      incrementSlider("up")
      break
    }
  }
})

function arrowKeyCycle(keyString)
{
  switch (arrowKeysDown[keyString])
  {
    case 0:
    break

    case 1:
    arrowKeysDown[keyString] = 2
    case 2:
    incrementSlider(keyString)
    var mapDatesLength = currentMapSource.getMapDates().length

    if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
    {
      switch (selectedCompareSlider)
      {
        case null:
        return

        case 0:
        mapDatesLength = mapSources[compareMapSourceIDArray[0]].getMapDates().length
        break

        case 1:
        mapDatesLength = mapSources[compareMapSourceIDArray[1]].getMapDates().length
        break
      }
    }

    setTimeout(function() { arrowKeyCycle(keyString) }, zoomKeyPressDelayForHalf*2.0/mapDatesLength)
    break
  }
}

function incrementSlider(keyString)
{
  var sliderDiv = $("#dataMapDateSlider")[0]

  if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
  {
    switch (selectedCompareSlider)
    {
      case null:
      if (keyString != "down" && keyString != "up")
      {
        return
      }
      sliderDiv = null
      break

      case 0:
      sliderDiv = $("#firstCompareDataMapDateSlider")[0]
      break

      case 1:
      sliderDiv = $("#secondCompareDataMapDateSlider")[0]
      break
    }
  }

  if ($(sliderDiv).is(":hidden")) { return }

  switch (keyString)
  {
    case "left":
    if (sliderDiv.value == 0) { return }
    sliderDiv.value -= 1
    break

    case "right":
    if (sliderDiv.value == sliderDiv.max) { return }
    sliderDiv.value -= -1 //WHY DO I HAVE TO DO THIS BS
    break

    case "down":
    if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
    {
      switch (selectedCompareSlider)
      {
        case null:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = 1
        $("#secondCompareDataMapDateSlider")[0].style.opacity = null
        selectedCompareSlider = 0
        break

        case 0:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = null
        $("#secondCompareDataMapDateSlider")[0].style.opacity = 1
        selectedCompareSlider = 1
        break

        case 1:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = null
        $("#secondCompareDataMapDateSlider")[0].style.opacity = null
        selectedCompareSlider = null
        break
      }
      return
    }

    if (sliderDiv.value == 0) { return }
    if (sliderDiv.value < 5)
    {
      sliderDiv.value = 0
    }
    else
    {
      sliderDiv.value -= 5
    }
    break

    case "up":
    if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
    {
      switch (selectedCompareSlider)
      {
        case null:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = null
        $("#secondCompareDataMapDateSlider")[0].style.opacity = 1
        selectedCompareSlider = 1
        break

        case 0:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = null
        $("#secondCompareDataMapDateSlider")[0].style.opacity = null
        selectedCompareSlider = null
        break

        case 1:
        $("#firstCompareDataMapDateSlider")[0].style.opacity = 1
        $("#secondCompareDataMapDateSlider")[0].style.opacity = null
        selectedCompareSlider = 0
        break
      }
      return
    }

    if (sliderDiv.value == sliderDiv.max) { return }
    if (parseInt(sliderDiv.max)-sliderDiv.value < 5)
    {
      sliderDiv.value = sliderDiv.max
    }
    else
    {
      sliderDiv.value -= -5 //WHY DO I HAVE TO DO THIS BS
    }
    break
  }

  if (showingCompareMap && currentMapSource.getID() == CustomMapSource.getID())
  {
    switch (selectedCompareSlider)
    {
      case 0:
      setCompareSourceDate(0, $("#firstCompareDataMapDateSlider")[0].value)
      break

      case 1:
      setCompareSourceDate(1, $("#secondCompareDataMapDateSlider")[0].value)
      break
    }
  }
  else
  {
    displayDataMap(sliderDiv.value)
  }
}

document.addEventListener('keyup', function(e) {
  if (e.which >= 37 && e.which <= 40)
  {
    switch (e.which)
    {
      case 37:
      arrowKeysDown.left = 0
      clearTimeout(arrowKeyTimeouts.left)
      break

      case 39:
      arrowKeysDown.right = 0
      clearTimeout(arrowKeyTimeouts.right)
      break

      case 40:
      arrowKeysDown.down = 0
      clearTimeout(arrowKeyTimeouts.down)
      break

      case 38:
      arrowKeysDown.up = 0
      clearTimeout(arrowKeyTimeouts.up)
      break
    }
  }
})

function deselectDropdownButton()
{
  $('.dropdown-content').css('display', '')
  removeActiveClassFromDropdownButton()
  selectedDropdownDivID = null
}

function removeActiveClassFromDropdownButton()
{
  switch (selectedDropdownDivID)
  {
    case "compareDropdownContent":
    if (!showingCompareMap)
    {
      $("#compareButton").removeClass('active')
    }
    break

    case "marginsDropdownContent":
    if (!editMarginID)
    {
      $("#marginEditButton").removeClass('active')
    }
    break

    case "mapSourcesDropdownContent":
    $("#sourceToggleButton").removeClass('active')
    break
  }
}

document.addEventListener('keypress', async function(e) {
  if (currentMapState == kViewing && !editMarginID && !selectedDropdownDivID && e.which >= 49 && e.which <= 57 && e.which-49 < mapSourceIDs.length)
  {
    currentMapSource = mapSources[mapSourceIDs[e.which-49]]
    updateMapSourceButton()
    await loadDataMap()
    if (currentRegionID)
    {
      updateStateBox(currentRegionID)
    }
  }
  else if (currentMapState == kViewing && !editMarginID && e.which == 48)
  {
    clearMap()
  }
  else if (selectedDropdownDivID && e.which >= 49 && e.which <= 57)
  {
    switch (selectedDropdownDivID)
    {
      case "compareDropdownContent":
      if (e.which >= 3+49) { return }

      $(".comparesourcecheckbox").prop('checked', false)
      compareMapSourceIDArray = [null, null]

      loadComparePreset(e.which-(49-1))

      case "marginsDropdownContent":
      if (e.which >= 2+49) { return }

      switch (e.which)
      {
        case 49:
        marginValues = cloneObject(defaultMarginValues)
        break

        case 50:
        marginValues = {safe: 5, likely: 3, lean: 1, tilt: Number.MIN_VALUE}
        break
      }

      createMarginEditDropdownItems()
      if (showingDataMap)
      {
        displayDataMap()
      }
      break

      case "mapSourcesDropdownContent":
      if (e.which >= mapSourceIDs.length+49) { return }

      currentMapSource = mapSources[mapSourceIDs[e.which-49]]
      updateMapSourceButton()
      await loadDataMap(true, true)
      if (currentRegionID)
      {
        updateStateBox(currentRegionID)
      }
      break
    }
  }
  else if (currentMapState == kEditing && e.which >= 48 && e.which <= 57 && e.which-48 <= politicalPartyIDs.length)
  {
    var partyToSelect = e.which-48
    if (partyToSelect == 0)
    {
      selectParty()
    }
    else
    {
      selectParty($("#" + politicalPartyIDs[partyToSelect-1]))
    }
  }
  else if (e.which == 13)
  {
    if (editMarginID)
    {
      toggleMarginEditing()
    }
    else
    {
      toggleEditing()
    }
  }
  else if (e.which == 82 || e.which == 114)
  {
    resizeElements()
  }
  else if (shiftNumberKeycodes.includes(e.which) && shiftNumberKeycodes.indexOf(e.which) < mapSourceIDs.length-1)
  {
    var mapSourceIDToCompare = mapSourceIDs[shiftNumberKeycodes.indexOf(e.which)]
    toggleCompareMapSourceCheckbox(mapSourceIDToCompare, false)
  }
  else if (e.which == 99 || e.which == 109 || e.which == 115)
  {
    removeActiveClassFromDropdownButton()

    var contentDivIDToToggle = ""
    var dropdownButtonDivID = ""
    switch (e.which)
    {
      case 99:
      contentDivIDToToggle = "compareDropdownContent"
      dropdownButtonDivID = "compareButton"
      break

      case 109:
      contentDivIDToToggle = "marginsDropdownContent"
      dropdownButtonDivID = "marginEditButton"
      break

      case 115:
      contentDivIDToToggle = "mapSourcesDropdownContent"
      dropdownButtonDivID = "sourceToggleButton"
      break
    }

    var shouldShowContentDiv = $("#" + contentDivIDToToggle).css('display') != "block"

    $(".dropdown-content").css('display', "")

    if (shouldShowContentDiv)
    {
      $("#" + contentDivIDToToggle).css('display', "block")
      $("#" + dropdownButtonDivID).addClass('active')
      selectedDropdownDivID = contentDivIDToToggle
    }
    else
    {
      removeActiveClassFromDropdownButton()
      selectedDropdownDivID = null
    }
  }
})

var mouseIsDown = false
var regionIDsChanged = []
var startRegionID
var mouseMovedDuringClick = false
var currentRegionID
var ignoreNextClick = false

document.addEventListener('mousedown', function(e) {
  if (currentMapState == kEditing)
  {
    startRegionID = currentRegionID
    mouseIsDown = true
  }
})

document.oncontextmenu = function() {
  if (currentMapState == kEditing)
  {
    regionIDsChanged = []
    mouseIsDown = false
    mouseMovedDuringClick = false
    startRegionID = null
  }
}

function mouseEnteredRegion(div)
{
  var regionID = getBaseRegionID($(div).attr('id')).baseID
  currentRegionID = regionID
  if (currentMapState == kEditing && mouseIsDown && !regionIDsChanged.includes(regionID))
  {
    leftClickRegion(div)
    regionIDsChanged.push(regionID)
  }
  else if (currentMapState == kViewing && showingDataMap)
  {
    updateStateBox(regionID)
  }

  $(div).css('stroke', '#ffffff')
  for (linkedRegionSetNum in linkedRegions)
  {
    for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
    {
      if (linkedRegions[linkedRegionSetNum][linkedRegionIDNum] == regionID)
      {
        for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
        {
          $("#" + linkedRegions[linkedRegionSetNum][linkedRegionIDNum]).css('stroke', '#ffffff')
        }
      }
    }
  }
}

function mouseLeftRegion(div)
{
  var regionID = getBaseRegionID($(div).attr('id')).baseID
  if (currentRegionID == regionID)
  {
    currentRegionID = null
  }

  if (currentMapState == kViewing)
  {
    $("#stateboxcontainer").hide()
  }

  $(div).css('stroke', '#181922')
  for (linkedRegionSetNum in linkedRegions)
  {
    for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
    {
      if (linkedRegions[linkedRegionSetNum][linkedRegionIDNum] == regionID)
      {
        for (linkedRegionIDNum in linkedRegions[linkedRegionSetNum])
        {
          $("#" + linkedRegions[linkedRegionSetNum][linkedRegionIDNum]).css('stroke', '#181922')
        }
      }
    }
  }
}

document.addEventListener('mousemove', function(e) {
  if (currentMapState == kEditing)
  {
    if (mouseIsDown)
    {
      mouseMovedDuringClick = true
    }
    if (mouseIsDown && currentRegionID && !regionIDsChanged.includes(currentRegionID))
    {
      leftClickRegion($("#" + currentRegionID))
      regionIDsChanged.push(currentRegionID)
    }
  }
  if (currentRegionID)
  {
    $("#stateboxcontainer").css("left", e.x+5)
    $("#stateboxcontainer").css("top", e.y+5)
  }
})

document.addEventListener('mouseup', function() {
  if (currentMapState == kEditing)
  {
    regionIDsChanged = []
    mouseIsDown = false
    if (currentRegionID != null && startRegionID == currentRegionID && mouseMovedDuringClick)
    {
      ignoreNextClick = true
    }
    mouseMovedDuringClick = false
    startRegionID = null
  }
})

function zeroPadding(num)
{
  if (num < 10)
  {
    return "0" + num
  }
  return num
}

function decimalPadding(num, shouldAddDecimalPadding)
{
  if (shouldAddDecimalPadding == null)
  {
    shouldAddDecimalPadding = true
  }

  if (num-Math.floor(num) == 0 && shouldAddDecimalPadding)
  {
    return num + ".0"
  }
  return num.toString()
}

function getKeyByValue(object, value)
{
  return Object.keys(object).find(key => object[key] == value)
}

function adjustBrightness(hexColorString, minBrightness)
{
  var rgb = hexToRGB(hexColorString)
  if (!rgb) { return }

  var hsv = RGBtoHSV(rgb)
  if (hsv.v < minBrightness)
  {
    hsv.v = minBrightness
  }

  return RGBToHex(HSVtoRGB(hsv))
}

function hexToRGB(hex)
{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function RGBToHex(rgb) {
  return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
}

function RGBtoHSV(r, g, b) {
  if (arguments.length === 1) {
    g = r.g, b = r.b, r = r.r
  }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
    d = max - min,
    h,
    s = (max === 0 ? 0 : d / max),
    v = max / 255

  switch (max) {
    case min: h = 0; break
    case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break
    case g: h = (b - r) + d * 2; h /= 6 * d; break
    case b: h = (r - g) + d * 4; h /= 6 * d; break
  }

  return {
    h: h,
    s: s,
    v: v
  }
}

function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h
  }
  i = Math.floor(h * 6)
  f = h * 6 - i
  p = v * (1 - s)
  q = v * (1 - f * s)
  t = v * (1 - (1 - f) * s)
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break
    case 1: r = q, g = v, b = p; break
    case 2: r = p, g = v, b = t; break
    case 3: r = p, g = q, b = v; break
    case 4: r = t, g = p, b = v; break
    case 5: r = v, g = p, b = q; break
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

function cloneObject(objectToClone)
{
  var newObject = JSON.parse(JSON.stringify(objectToClone))

  return newObject
}
