/**
 * Created by Татьяна on 25.01.15.
 */




$( document ).ready(function() {
    var db = new PouchDB('todos');
    var remoteCouch = false;
    function addTodo(text) {
        var todo = {
            _id: new Date().toISOString(),
            title: text,
            completed: false
        };
        db.put(todo, function callback(err, result) {
            if (!err) {
                console.log('Successfully posted a todo!');
            }
        });
    }

   // основной цикл - изменение формы
   $("#_go_form").change(function(){

       var  _text_to_do = $("#_go_form").val();
       $("._list_to_do").append("<li class='_item'>" + _text_to_do + "</li>");
       addTodo(_text_to_do);
       $("#_go_form").val(" ");

    });   // #_go_form



    //var db = new PouchDB('todos');
    //var remoteCouch = false;

});