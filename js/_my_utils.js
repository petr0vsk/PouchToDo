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
                console.log('Successfully posted a ' +  todo.title);
            }
        });
    }
    // Show the current list of todos by reading them from the database
    function showTodos() {
        console.log("showTodos run!");
        db.allDocs({include_docs:true, descending:true}, function(err, doc){
            console.log(doc.title);
            redrawTodosUI(doc.rows);
        });
    }
    function redrawTodosUI(todos) {
        console.log("redrawTodosUI run!");
        todos.forEach(function(todo) {
            $("._list_to_do").append("<li class='_item'>" + todo.title + "</li>");
        });
    }




    // основной цикл - изменение формы
   $("#_go_form").change(function(){

       var  _text_to_do = $("#_go_form").val();
       $("._list_to_do").append("<li class='_item'>" + _text_to_do + "</li>");
       addTodo(_text_to_do);
       $("#_go_form").val('');

    });   // #_go_form

    // очистка поля html-формы, БД не трогаем
      $("#_clear_btn").click(function(){

           $("._item").remove();

      });

    // вывод на экран всей базы данных
    $("#_show_btn").click(function(){
        console.log("_show_btn click");
        showTodos();


    });

});  // end main()

