// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

//tilosPlayerState.title = "helo";
const context = cast.framework.CastReceiverContext.getInstance();
const options = new cast.framework.CastReceiverOptions();
context.start(options);
$(document).ready(function () {
    $("#logger").text("from script");
    window.tilosPlayerState.title = "nah";
});