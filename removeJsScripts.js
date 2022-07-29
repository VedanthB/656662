const removeJsFile = (filename, filetype) => {
    var targetelement = (filetype == "js") ? "script" : "none"
    var targetattr = (filetype == "js") ? "src" : "none"

    var allsuspects = document.getElementsByTagName(targetelement)

    for (var i = allsuspects.length; i >= 0; i--) {
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(
          targetattr)
        .indexOf(filename) != -1)
        allsuspects[i].parentNode.removeChild(allsuspects[i])
    }
  }

  removeJsFile("assets/js/vmouse.min.js", "js")
  removeJsFile("assets/js/jquery.scrollTo.min.js", "js")
  removeJsFile("assets/js/in5.config.js", "js")
  removeJsFile("assets/js/in5.config.js", "js")
  removeJsFile("assets/js/jquery.min.js", "js")
  removeJsFile("../../../ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js", "js")
