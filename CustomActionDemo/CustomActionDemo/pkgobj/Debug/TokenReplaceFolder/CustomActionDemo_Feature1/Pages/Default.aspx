<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/bootstrap.min.css" />
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />    
    
    <!-- Add your JavaScript to the following file -->
    <%--<script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>--%>
    <script type="text/javascript" src="../Scripts/jquery.SPServices-0.6.2.min.js"></script>
    <script type="text/javascript" src="../Scripts/App.js"></script>

</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    <WebPartPages:AllowFraming runat="server" />
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">

    <div class="container confirmation-modal">
        <div class="confirmation-header">
            <h3>Move Files For Retagging</h3>
        </div>
        <div id="confirmation-body" style="overflow-y: scroll; max-height: 205px;">
            <table width="100%" border="1">
                <thead style="background-color:#0e64b5;color:#fff;">
                    <tr>
                        <th colspan="2">
                            Moved Documents
                        </th>
                    </tr>
                </thead>
                <tbody class="confirmation-table-body">
                </tbody>
            </table>
        </div>
        <div>
            <p style="padding-top: 16px;">Please note that once they are moved, they will be deleted from their current location.</p>
            <p>Do you want to proceed?</p>
            <a onclick="moveFiles();" style="cursor: pointer; margin-right: 10px; background-color: #0e64b5; border-color: #0e64b5; color: #fff;" class="btn">Move Now</a>
        </div>
    </div>

    <div class="container" id="fileProgressBarContainer" style="display: none; padding-top: 20px;">
        <h3>Moving documents</h3>
        <div id="fileProgressBar" style="overflow-y: scroll; max-height: 175px;"></div>
    </div>

    <div class="container files">
        <div id="body-text">
            <h3>Retag Documents</h3>
        </div>
        <div id="body-table" style="overflow-y: scroll; max-height: 395px;">
            <table width="100%" border="1">
                <thead style="background-color:#0e64b5; color:#fff;">
                    <tr>
                        <th colspan="2">
                            Moved Documents
                        </th>
                    </tr>
                </thead>
                <tbody class="confirmation-table-body">
                </tbody>
            </table>
        </div>
        <div style="padding-top: 16px;">
            <a onclick="redirectRetag();" href="https://uedge.sharepoint.com/sites/U-Dox/SitePages/UDox-File-Uploader.aspx" target="_blank" class="btn" style="cursor: pointer; background-color: #0e64b5; border-color: #0e64b5; color: #fff;">Retag Documents</a>
        </div>
    </div>
</asp:Content>
