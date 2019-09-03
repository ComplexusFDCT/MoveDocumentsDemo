var appUrl = GetUrlKeyValue("SPAppWebUrl");
var hostUrl = GetUrlKeyValue("SPHostUrl");
var listItemIds = GetUrlKeyValue("SPListItemId").split(",");
var listGuid = GetUrlKeyValue("SPListId");
var fileName = "";
var fileNames = [];
var libraryName = "";
var html = "";

$(function () {    
    if (listItemIds[0] != "null") {
        createConfirmationBox();
    }
});

function createConfirmationBox() {
    $("#s4-ribbonrow").hide();
    $('#dialogTitleSpan').remove();
    $('.confirmation-header').append('<p>You are about to move ' + listItemIds.length + ' files to the Upload Drop-off library for retagging.</p>');

    var library = getListName();
    var count = 1;
    library.done(function (data, textStatus, jqXHR) {
        libraryName = data.d.Title;

        listItemIds.forEach(function (value, index) {
            var url = String.format("{0}/_api/SP.AppContextSite(@target)/web/lists/getbytitle('{1}')/getitembyid({2})?$select=File&$expand=File&@target='{3}'", appUrl, libraryName, value, hostUrl);

            var getFiles = $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });            

            getFiles.done(function (data, textStatus, jqXHR) {
                var lastIndex = data.d.File.ServerRelativeUrl.lastIndexOf('/');
                fileName = data.d.File.ServerRelativeUrl.substr(lastIndex);                               
                fileNames.push(fileName);
                createTableBody(count, fileName);
                count = count + 1;
            });

            getFiles.fail(failHandler);
        });

        $(".confirmation-modal").show();
    });
}

function createTableBody(count, fileName) {

    var extension = fileName.split(".")[1];

    html = '<tr>' +
               '<td class="firstcol">' + count + '.</td>' + 
               '<td>' +
                   '<i data-icon-name="' + extension + '20_svg" role="presentation" aria-hidden="true" class="root_65' + extension + '41 icon_0c9cb012 root-183" style="padding-right: 10px;">' +
                       '<img style="width:20px;height:20px;" src="https://spoprod-a.akamaihd.net/files/fabric/assets/item-types-fluent/20/' + extension + '.svg?refresh1"/>' + 
                   '</i>' + fileName.replace("/", "") + 
               '</td>' +
           '</tr>';

    $('.confirmation-table-body').append(html);
}

function Copyfiles() {
    fileNames.forEach(function (value, index) {
        SP.SOD.executeFunc('sp.js', 'SP.ClientContext', moveFile(value));        
        completeAnimation("fileProgressBarContainer", "files");    
    });

    $("#body-text").append('<p>Please Note: You have successfully moved ' + fileNames.length + ' files to the Upload Drop-off library for retagging.</p>');
    $("#body-text").append('<p>Please click the button below to be redirected to the File Uploader where you will be able to retag the documents, after which they will be re-routed to the correct location.</p>');
}

function cancelMoveFiles() {
    $("#DlgClose35475e67-411a-44fd-adc2-36094bd856eb").click();
}

function moveFiles() {
    Copyfiles();
}

function redirectRetag() {
    $("#DlgClose35475e67-411a-44fd-adc2-36094bd856eb").click();
}

function completeAnimation(parentDiv, htmlBlock) {
    $('.progress-bar').animate({ width: "100%" }, 250);
    setTimeout(function () {
        $('.progress-bar').css({ width: "100%" });
        setTimeout(function () {
            $("#" + parentDiv).html("");
            $(".confirmation-modal").hide();
            $(".files").hide();
            $('.' + htmlBlock).show();
        }, 100);
    }, 3500);
}

function failHandler(jqXHR, textStatus, errorThrown) {
    var response = "";
    try {
        var parsed = JSON.parse(jqXHR.responseText);
        response = parsed.error.message.value;
    } catch (e) {
        response = jqXHR.responseText;
    }
    console.log("Call failed. Error: " + response);
}

function moveFile(fileValue) {
    var fromLibrary = String.format("/sites/LawrenceDevelopment/{0}{1}", libraryName, fileValue);
    var toLibrary = "/sites/LawrenceDevelopment/DocumentsMoved" + fileValue;

    var oUrl = String.format("{0}/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('{1}')/copyto(strnewurl='{2}',boverwrite=true)?@target='{3}'", appUrl, fromLibrary, toLibrary, hostUrl);
    $.ajax({
        url: oUrl,
        type: "POST",
        headers: {
            "Accept": "application/json; odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        beforeSend: function () {
            $('#fileProgressBarContainer').show();
            $('#fileProgressBar').append('<div class="progress"><div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span style="padding: 10px;">' + fileValue.replace("/", "") + '</span></div></div>');
            $('.progress-bar').animate({ width: "30%" }, 250);
        },
        success: function (data) {
            deleteFile(fileValue);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function getListName() {
    var url = String.format("{0}/_api/SP.AppContextSite(@target)/web/lists(guid'{1}')?@target='{2}'", appUrl, listGuid.replace("{", "").replace("}", ""), hostUrl);

    return $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" }
    });
}

function deleteFile(file) {

    var fromLibrary = String.format("/sites/LawrenceDevelopment/{0}{1}", libraryName, file);
    var url = String.format("{0}/_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('{1}')?@target='{2}'", appUrl, fromLibrary, hostUrl);

    $.ajax({
        url: url,
        method: "POST",
        headers: {
            "accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function () {
            console.log(file);
        },
        error: function (data) {
            console.log(data);
        }
    });
}