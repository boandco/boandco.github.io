var readyString = `Site is live`
var errorString = `Couldn't update site`
var loadingString = `Updating site`

var checkBuildStatusInterval
var checkBuildStatusInterval_running = false

var state

window.addEventListener('load', () => {
  var init = new MutationObserver(function(changes) {
    if (document.querySelector('.css-v758ki-AppMainContainer') && document.querySelector('.css-e9z4u8-AppHeaderSiteLink')) {
      init.disconnect()
      swapLink()

      ApplicationListener.observe(document.querySelector('.css-v758ki-AppMainContainer'), {
        childList: true,
        subtree: false
      })
      imageUploadListener.observe(document.querySelector('.ReactModalPortal'), {
        childList: true
      })
    }
  })
  var ApplicationListener = new MutationObserver(function(changes) {    
    if (document.querySelector('.css-e9z4u8-AppHeaderSiteLink') && !checkBuildStatusInterval_running) {
      swapLink()
    }
    if (document.querySelector('.evqrzhe6')) {
      deleteItemListener.observe(document.querySelector('.evqrzhe6'), {
        childList: true,
        subtree: true
      })
    } else {
      deleteItemListener.disconnect()
      setTimeout(() => {
        if (!checkBuildStatusInterval_running) {
          swapLink()
        }
      }, 1800)
    }
  })
  var imageUploadListener = new MutationObserver(function(changes) {
    if (document.querySelector('.e11970yf0')) {
      imageListListener.observe(document.querySelector('.e11970yf0'), {
        childList: true,
        subtree: true
      })
    } else {
      imageListListener.disconnect()
    }
  })
  var imageListListener = new MutationObserver(function(changes) {
    if (document.querySelector('.css-e9z4u8-AppHeaderSiteLink')) {
      setTimeout(swapLink, 1800)
    }
  })
  var deleteItemListener = new MutationObserver(function(changes) {
    if (document.querySelector('.css-e9z4u8-AppHeaderSiteLink')) {
      setTimeout(swapLink, 1800)
    }
  })

  init.observe(document.querySelector('body'), {
    childList: true
  })
})

function swapLink() {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", `https://api.netlify.com/api/v1/sites/${siteID}/deploys?production=true&per_page=1`, true); // true for asynchronous 
  xmlHttp.send(null);
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //Set state
      state = JSON.parse(xmlHttp.responseText)[0].state

      //Setup elements
      const links = document.querySelectorAll('.css-e9z4u8-AppHeaderSiteLink')
      links.forEach((link) => {
        var indicator
        if (!link.classList.contains('loaded')) {
          indicator = document.createElement('div')
          indicator.classList.add('indicator')
        } else {
          indicator = link.childNodes[0]
        }

        //Handle state
        if (state == 'ready') {
          updateStatus(link, indicator, readyString, 'ready')
          clearBuildStatus()
        } else if (state == 'error') {
          updateStatus(link, indicator, errorString, 'error')
          clearBuildStatus()
        } else {
          updateStatus(link, indicator, loadingString, 'loading')
          checkBuildStatus()
        }
        
        //Make changes
        link.classList.add('status-indicator', 'loaded')
        link.insertBefore(indicator, link.firstChild)
      })
    }
  }
}
function updateStatus(link, indicator, string, state) {
  //clear interval
  link.innerText = string
  if (indicator.getAttribute('state') != state && indicator.getAttribute('state')) {
    indicator.classList.replace(indicator.getAttribute('state'), state)
    indicator.setAttribute('state', state)
  } else {
    indicator.classList.add(state)
    indicator.setAttribute('state', state)
  }
}
function clearBuildStatus() {
  clearInterval(checkBuildStatusInterval)
  checkBuildStatusInterval_running = false
}
function checkBuildStatus() {
  if (!checkBuildStatusInterval_running) {
    checkBuildStatusInterval_running = true
    checkBuildStatusInterval = setInterval(swapLink, 1000)
  }
}