/**
 * Created by Татьяна on 25.01.15.
 */

$( document ).ready(function() {


    // Создадим базу данных
    var db = new PouchDB('_to_do_DB');
    var remoteCouch = false;

    // объявим шаблоны handlebars
    var template   =  Handlebars.compile( $('#entry-template').html() );



    db.info().then(function (info) {
        console.log(info);
    })
    //добавим запись в базу данных
    function _add_Todo(text) {
        var todo = {
            _id: new Date().toISOString(),
            title: text
        };
         db.put(todo, function callback(err, result){
            if(!err){
                console.log('Todo Posted! ' + todo.title );
            }
        });

        $("#_workplace").append(template(todo)).children().last().data("id", todo._id);
    }
    //вывод всех записей на экран
    $("#_show_all").click(function(){
           db.allDocs({include_docs:true, descending:true}, function(err, doc){
            redrawTodosUI(doc.rows);
        });
    });
    // выведем в форму все записи БД, добавим в поле элемента <li> _id записи для поиска документа без обращения к БД
    function redrawTodosUI(todos) {
        $("._item").remove();
        todos.forEach(function(todo) {
            //console.log("todo.doc.title -> " + todo.doc.title + "; todo.doc._id -> " + todo.doc._id);
            var todo = {
                title: todo.doc.title,
                _id:  todo.doc._id
                       };

            $("#_workplace").append(template(todo)).children().last().data("id", todo._id);
            //$(this).children().last().data("id", todo.doc._id);
        });
    }
    // очистка поля html-формы, БД не трогаем
    $("#_erase_all").click(function(){
        $("._item").remove();
    });

    // удалим запись из БД после клика по заметке на экране
    $('ul').on('click', 'li',  function(){
        var doc_id = $(this).data("id");
        db.query(function(doc, emit) {
            if (doc._id === doc_id) {
                emit(doc);
                db.remove(doc);
            }
        }, function(err, results) {
                    });
                    $(this).remove();
    });
    // основной цикл - добавление новых записей в БД
   $("input").change(function(){
         var  _text_to_do = $("input").val();
        // $(".gridster ul").append("<li data-row='1' data-col='1' data-sizex='1' data-sizey='1'>" + _text_to_do + "</li>");
         _add_Todo(_text_to_do);
         $("input").val('');
    });





});  // end main()

