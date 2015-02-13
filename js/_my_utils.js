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
    // вывод на экран всей базы данных
    $("#_show_btn").click(function(){
        console.log("_show_btn click");
        showTodos();
    });
    //------------
    function showTodos() {


        db.allDocs({include_docs:true, descending:true}, function(err, doc){
             //console.log(doc.title);
            redrawTodosUI(doc.rows);
        });


    }
    function redrawTodosUI(todos) {
        console.log("redrawTodosUI run!");
        todos.forEach(function(todo) {
            $("._list_to_do").append("<li class='_item'>" + todo.doc.title + "</li>");
            //console.log(todo.doc.title);
        });
    }
    // основной цикл - добавление новых записей в БД
   $("#_go_form").change(function(){

       var  _text_to_do = $("#_go_form").val();
       $("._list_to_do").append("<li class='_item'>" + _text_to_do + "</li>");
       addTodo(_text_to_do);
       $("#_go_form").val('');

    });   // #_go_form

    $("#_clear_html_btn").click(function(){
        $("._item").remove();

    })
        // очистка поля html-формы И БД
      $("#_clear_db_btn").click(function(){
        PouchDB.destroy('todos', function(err, info){});  // тотальное уничтожение базы данных

        }); //#_clear_db_btn

    db.info().then(function (info) {
        console.log("--- инфа по базе ---");
        console.log(info);
    });


});  // end main()

