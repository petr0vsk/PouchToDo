/**
 * Created by Татьяна on 25.01.15.
 */

$( document ).ready(function() {


    // Создадим базу данных
    var db = new PouchDB('_to_do_DB');
    var remoteCouch = false;

    // объявим шаблоны handlebars
    var template   =  Handlebars.compile($('#entry-template').html());



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

        });
    }
    // очистка поля html-формы, БД не трогаем
    $("#_erase_all").click(function(){
        $("._item").remove();
    });

    // удалим запись из БД после клика по крестику на заметке
    $('ul').on('click', '._right', function(){
        var doc_id = $(this).closest('li').data("id");
        db.query(function(doc, emit) {
            if (doc._id === doc_id) {
                emit(doc);
                db.remove(doc);
            }
        }, function(err, results) {
                    });
              $(this).closest('li').remove();
    });
    // изменим содержимое дважды кликнув по заметке


    // основной цикл - добавление новых записей в БД
   $("input").change(function(){
         var  _text_to_do = $("input").val();
         _add_Todo(_text_to_do);
         $("input").val('');

    });
    $('ul').on('mouseenter', 'li',  function(){
       $(this).resizable(
           {
               handles: "s, e",
               maxHeight: 300,
               maxWidth: 300,
               minHeight: 100,
               minWidth: 150
           }

       );
    }).on('mouseover', 'li',  function(){
        $(this).addClass('raised');
    }).on('mouseleave', 'li',  function(){
        $(this).removeClass('raised');
    }).on('dblclick', '._note', function(){
        $(this).editable(function(value, settings) {
            //console.log(this);
            console.log(value);
            //console.log(settings);
            return(value);
        }, {
            type      : 'text',
            onblur    : 'submit',
            tooltip   : 'DBClick to edit...',
            event     : 'dblclick'
        });
    }).on('dblclick', '._title', function(){
        $(this).editable(function(value, settings) {
            //console.log(this);
            console.log(value);
            //console.log(settings);
            return(value);
        }, {
            type      : 'textarea',
            onblur    : 'submit',
            tooltip   : 'DBClick to edit...',
            event     : 'dblclick'
        });
    });



   $("#_workplace").sortable();
   $("#_workplace").disableSelection();



});  // end main()

