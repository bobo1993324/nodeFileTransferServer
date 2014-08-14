$(function(){
    $("#uploadInput").fileupload({
        dataType: "json",
        done: function(e, data) {
            console.log("post done");
        },
        fail: function(e, data) {
            console.log("post failed" + JSON.stringify(e));
        }
    });
})