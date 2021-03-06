1. Для кого [не] предназначены эти файлы

Содержимое данного репозитория может быть интересно разработчикам, имеющим опыт работы с Eludia.pm. И только им.

Здесь представлено минимальное эталонное приложение (как бы "Hello World") аналога Eludia.pm следующего поколения. 

Теперь платформа Eludia разделена на 2 части, написанные на разных языках и предназначенные для функционирования по разные стороны сети:

* elu.js — на клиенте;
* dia.pm — на сервере.

В настоящем README.txt рассказано, что представляет из себя новое ПО и в каком порядке удобнее знакомиться с текстами.

2. Установка

Чтобы смотреть, как это работает, нужно выполнить следующее:

* Установить nginx. Версия 1.11.12 подходит, 1.0.12 — нет.
* Склонировать в новую директорию (https://github.com/do-/dia.pm) Dia.pm
* Завести пустую БД
* Склонировать в новую директорию данное приложение (внимание: оно содержит git-подмодуль https://github.com/do-/elu.js в директории front/root/_/libs/elu)
* Скопировать back/conf/elud.json.orig в back/conf/elud.json и прописать туда параметры БД
* Скопировать содержимое front/conf/nginx.conf.orig в общий nginx.conf, подправить там пути по месту, [пере]запустить nginx
* Открыть командную строку в директории back и запустить 

	perl -CS -I{где у вас Dia.pm} -MDia::Content::HTTP::FCGI::single -estart 2>>logs/error.log

Теперь можно идти на host, который сконфигурирован на предопследнем шаге как "# front end HTTP server".

А чтобы подправлять по ходу дела -- ещё:

* установить node.js (https://nodejs.org/en/download/);
* установить Grunt (https://gruntjs.com/getting-started);
* зайти в директорию front и там:
** установить необходимые модули Grunt (npm install);
** запустить grunt.

В результате последнего действия Grunt начнёт следить за редактируемыми файлами и по ходу их изменения и заниматься чем-то вроде фоновой компиляции.

3. Читаем исходники

3.1. Ядро

Прежде всего, следует заглянуть в Dia. 

Легко видеть, что Presentation больше нет. Теперь то, что написано на Perl с использованием Eludia.pm -- лишь источник данных в чистом виде.

Другое важное изменение: функция handler вынесена из ядра. У каждого приложения будет свой центральный обработчик, подсовывание общего кода в select_subset/select_menu больше не требуется. Как и сама 2-уровневая структура subset+menu с обязательным вызовом на каждый запрос.

Встроенная система аутентификации переделана на httpOnly cookie, но с максимальным сохранением привычных вещей. Даже доступен $_REQUEST {sid}, хотя теперь sessions.id -- счётчик, как у всех таблиц.

Помимо Presentation и явно завязанных на него вещей (типа подсистемы URL rewriting) выброшена ещё куча старого хлама: как полностью неработоспособного (Auth::NTLM), так и просто лишнего в общем коде (Peering).

Сюда же примыкает отмена обязательного логирования действий. Да, что-то подобное в каждом конкретном приложении нужно, но неограниченно растущая реляционная таблица с неиндексируемым текстом -- это не то, что должно навязываться ядром. Кому удобен имено такой логинг -- пожалуйста: это 1-2 строки в handler.

Прекращена поддержка совместимости с какими-либо mod_perl; глобальную переменную $r использовать не следует. Да и не получится: это теперь вообще не объект. Оставлен только один способ общения с фронтальным Web-сервером: FastCGI. CGI::Simple стал обязателен.

3.2. Back-приложение

Теперь посмотрим на то, что представляет из себя серверная часть приложения в рамках конкретного, хотя и  модельного, проекта. Всё, что с ним связано, сосредоточено в директории back/.

Если вы уже настроили тестовый стенд, то наверняка заметили новый файл в знакомой директории: conf/elud.json. Наконец-то наш FastCGI-сервер получил собственную конфигурацию. Больше мы ловить свои параметры по httpd.conf и nginx.conf не будем. Единственный важный параметр, не прописываемый туда — путь к логу ошибок. Причина: туда должны писаться и ошибки, случившиеся до чтения конфигурации. Соответственно, направлять 2-й поток в файл должен тот, кто запускает процесс.

Директория docroot для back-приложения не имеет смысла. Доступные директории в файловой системе должны определяться не на уровне HTTP-сервера, а средставами приложения. В данном примере это параметр $preconf -> {files} -> {root}.

В lib многое знакомо. Отсутствие директории Presentation непривычно, но понятно. Config.pm теперь в основном содержит определение функции handler. Волшебные параметры, обязательные действия на каждый запрос, аутентификационные хитрости, логирование -- это всё туда.

В Model появилось определение индекса нового типа, с восклицательным знаком на конце:

	keys => {
		login => 'login!',
	},

Как вы хорошо знаете, у нас традиционно не использовались UNIQUE-индексы. Не то, чтобы от тотальной некомпетентности. Это было связано с организацией хранения данных, при которой актуальные (fake=0), удалённые (fake=-1) и недовведённые  (fake > 0) записи соседствуют в одной таблице. Обычно условие UNIQUE имеет смысл лишь для актуальных данных, а среди удалённых — как раз нельзя запрещать держать дубликаты, иначе системой будет невозможно пользоваться. PostgreSQL уже очень давно имел как раз необходимую функциональность — CREATE INDEX ... WHERE; в MSSQL такое тоже есть; аналогичного эффекта можно добиться в Oracle через индексы по функциям, но мы изначально ориентировались на MySQL, где ничего похожего не было. Сейчас приоритеты меняются, а MySQL постепенно доделывается в нужную сторону. В общем, в Dia.pm добавлена поддержка частичных UNIQUE-индексов, а в b8 (do_update_users / do_undelete_users) показано, как этим пользоваться — вместо vld_unique, недопустимого в многозадачном режиме.

Дальнейшее развитие темы: в SQL/Dialect/PostgreSQL.pm добавлена API-функция sql_do_upsert, аналогичная sql_select_id, но работающая без глобальных блокировок, за одно атомарное действие в транзакции. Там нет необходимости (с другой стороны, и возможности) явно указывать ключ синхронизации: вместо этого для таблицы должен быть заявлен ровно один частичный UNIQUE-индекс. Префиксы '-' для имён полей не поддерживаются: все упомянутые поля используются вне зависимости от содержимого БД. Для PostgreSQL это реализовано через INSERT ... ON CONFLICT UPDATE, если будут проекты на Oracle/MS SQL  -- применим MERGE INTO. В MySQL оператор INSERT ... ON DUPLICATE KEY UPDATE есть, но UNIQUE-индексы только безусловные, так что перспективы пока не ясны.

Ещё одна новинка в Model: указание значения по умолчанию без необходимости выписывать хэш с ключом COLUMN_DEF. Вот как задаётся роль 2-я роль для новых записей в users (пробелы вокруг '=' удаляются, то, что справа — считается за COLUMN_DEF):

	id_role  => 'int = 2',

Если DEFAULT задан таким образом, поле автоматически объявляется NOT NULL. И наоборот (как и ранее): если DEFAULT не определён, NULL-значения допустимы. Причина всё та же: создание записей, у которых явно указываются значения только id и fake.

В Content уже почти всё как раньше. Разве что место волшебного типа 'login' занял сообтветствующий БДф 'sessions' со стандартными действиями create и delete.

Поскольку все запросы к back оформлены POST'ами с телами типа JSON, $_REQUEST может содержать не только скалярные значения. Поля форм ввода теперь не помечаются префиксом '_', а сводятся в хэш. То есть $_REQUEST {id} на месте, а $_REQUEST {_label} заменён на $_REQUEST {data} -> {label}. По этой причине магия, связанная с содержимым %_REQUEST (тип DEFAULT, старый вариант sql_do_update) потеряла актуальность почти полностью.

Все сообщения валидации выдаются из процедур do_... через die '#_field#:...'. Никаких отдельных validate_ быть не должно. (Уже лет 10)

Если же die не вызывать, то результат процедуры do_... передаётся на клиент и может использоваться тамошним обработчиком по своему усмотрению. Никакого автоматического перенаправления больше нет. К слову: back в принципе не может самостоятельно перенаправить браузер клиента куда-либо. Он вообще не должен знать, что есть браузеры и их можно перенаправлять. Back может выдать id, а уже js в браузере разбирается: то ли собрать с ним URI и открыть соответствующую вкладку, то ли сделать ещё что-то.

В подавляющем большинстве случаев Content-процедура должна формировать объект данных, пригодный для непосредственной обработки посредством JSON.pm. Естественно, при этом всё его содержимое располагается в памяти одновременно. Однако есть возможность выдавать некоторые поля и в потоковом режиме: соответствующие значения должны быть ссылками на подпрограммы, вызывающие print. Пример: поле photo в get_item_of_users.

Пароли хранятся в SHA256 с 2 "солями": одна в БД, другая -- в $preconf -> {salt_file}. Если он указан и непуст (желательно подлиннее), кража БД без самого файла не даёт возможности зайти в приложение. Если пуст -- работает известный вам пароль по умолчанию.

3.3. Front-приложение

И вот, наконец, принципиально новая, наиболее объёмная часть проекта: статический сайт, полностью реализующий логику отображения. 

Структура директорий может поначалу показаться сумбурной, однако в основном она обусловлена стремлением обеспечить поддержку произвольных "красивых" URI и обработку разного рода исключительных ситуаций.

3.3.1. Основные директории

Два главных каталога, которые следует иметь в виду:
* front/root/_/libs -- общий корень всех внешних библиотек, к которым, наряду со сторонними requirejs, jquery и less относятся и заменители наших Presentation.pm и TurboMilk.pm: elu.js и tmilk;
* front/root/_/app -- корень библиотеки конкретного приложения.

В отличие от знакомого нам Eludia.pm, здесь изначально предполагается подключение произвольного числа HTML/js-библиотек, а собственный skin может и отсутствовать вовсе. Последнее актуально для Windows-образных GUI с использованием ExtJS, KendoUI, w2ui и т. п., но для проекта с уникальным дизайном обязательно понадобится своя библиотека окошек/менюшек. В настоящем демо показано, как реализовать знакомый UI 10-летней давности средствами HTML5.

А вот некоторый минимальный js API, общий для всех проектов (аналог Presentation.pm без $_SKIN'а) будет располагаться по фиксированному адресу средт libs и включаться в код на правах git-submodule'я.

3.3.1.1. Версионность

Итак, почти все статические файлы приложения содержатся в директории front/root/_. Если их URL будут строго соответствовать именам на диске, возникнет проблема с кэшированием содержимого на стороне клиента: при изменении js-файлов пользоаватели будут случайным образом либо загружать их заново, либо использовать старые копии.

Единственный надёжный способ избежать этих проблем — добавлять номер версии в каждый статический URL. 

Чтобы не тратить много сил и не генерировать лишних ошибок, удобно локализовать этот номер в корне URL, остатвив все файлы на местах. Например, для версии 3_11 вместо /_/app/handler.js будет использоваться URL /__v3_11/app/handler.js. Выдача нужного файла по этому адресу обеспечивается следующим правилом в front/conf/app.conf:

	rewrite ^/__/w+/(.*)$ /_/$1 last;

При формировании каждого статического URL используется глобальная переменная sessionStorage.getItem ('staticRoot'), устанавливаемая в начале процесса загрузки скриптом, прописанным в index.html.

Всё бы хорошо, но как обеспечить своевременную накрутку счётчика версий? Чтобы при каждом редактировании js или css внутри index.html обновлялся номер. Только автоматом: иначе разработчик обязательно об этом забудет. Для этой цели можно было бы использовать git hooks, но это было бы ровно против мнения разработчиков git по данному поводу. А значит, ничего хорошего не получилось бы.

Решение этой и ещё нескольких аналогичных задач описано в следующем разделе.

3.3.1.2. Компиляция статики

При разработке Web-приложения, у которого существенная часть логики вынесена в JS/CSS, помимо автообновления номера версии, по соображениям оптимизации практически неизбежно возникает ещё 2 повода для постоянного слежения за исходниками и периодической перегенерации некоторых файлов:

* сборка/минификация многочисленных js-библиотек в одну монолитную;

* генерация CSS из LESS, SASS или чего-то подобного (да, LESS реализован на js и может работать в браузере, но при серьёзных объёмах и использовании @import'ов это становится неприемлемо медленно).

Эти процессы напоминают компиляцию (скажем, *.java в *.class), однако отличаются тем, что исходники и "бинарники" имеют практически одинаковые типы данных и почти что взаимозаменяемы. По этой причине принято решение даже хранить "скомпилированный" код в git вместе с исходной формой для того, чтобы можно было разворачивать и обновлять проект на целевом сервере прямо из git, без дополнительных процедур сборки и установки установочного комплекта.

Но как же всё-таки обеспечить поддержку "бинарников" в соостветствии с исходниками? В рассматриваемом примере все эти задачи решены при помощи Grunt, который, будучи сам реализован на js, и имея библиотеку подходящих модулей, подходит для таких целей как нельзя кстати.

Особенно радует grunt-contrib-watch, позволяющий подписаться на извещения о выбранных директориях и заказать определённые действия при изменении файлов. Помимо компиляции LESS и оптимизации Requirejs, это автоинкремент номера версии (другим модулем: grunt-bump) и его обновление в index.html (ещё одним: grunt-text-replace).

Таким образом, на среде разработки при любой правке LESS- или js-файла (при запущенном grunt) не только обновляется css/js, но ещё увеличивается и прописывается в index.html новый staticRoot. При ближайшем обновлении страницы (без прерывания сессии) браузер запрашивает скомпилированную статику уже из новой директории.

3.3.2. Порядок формирования типичной страницы

Вернёмся к директории приложения. Во front/root видны вспомогательные каталоги с префиксом '_': вроде _unmaintainable_browser -- чтобы все URI вроде /users/123/ могли без проблем быть настроены на один-единственный файл: 

 front/root/index.html (часть приложения)

чей основной смысл -- загрузка библиотеки requirejs со стартовым скриптом

 _/app/handler.js      (часть приложения)

который разбирается с URI и состоянием сессии, устанавливает глобальные переменные со знакомыми именами $_REQUEST и $_USER и запускает функцию

 showIt ()             (часть ядра)
 
которая сводится к показу *блока* для текущего $_REQUEST.type.

3.3.3. Что такое "блоки"

"Блоки" -- это аналог хорошо знакомых нам "типов экранов". Только они занимают не всю видимую область, а каждый свою часть. Блок реализован в виде 3 одноимённых файлов, расположенных в разных директориях:

* front/root/_/app/html -- шаблон HTML
* front/root/_/app/js/data -- аналог Content
* front/root/_/app/js/view -- аналог Presentation

Основное, что может быть сделано с блоком -- его инициализация (функция ядра use.block). Она идёт в 3 этапа:

* загрузка ($.load) шаблона HTML
* загрузка (requirejs) data-модуля и его запуск
* загрузка (requirejs) view-модуля и его запуск с передачей ранее полученных HTML и data.

Может показаться, что такая схема слишком дорога по ресурсам, но с учётом кэширования речь идёт лишь о вызове подпрограмм.

В виде блоков реализовано не только то, что ранее было экранами (список пользователей, карточка пользователя), но и части общего дизайна (страница в целом, элементы верхней панели: часы и имя пользователя). В данном проекте handler.js всегда грузит блок main (общий дизайн -- который в свою очередь вызывает блоки верхней панели) и потом в зависимости от сессии: либо login-блок (что, заметим, НЕ вызывает перенаправления на другой URI), либо блок требуемого типа. От проекта к проекту эта логика может различаться, поэтому она вынесена в приложение.

3.3.4. Типовой блок-карточка (user)

Рассмотрим, как устроены блоки, на примере полноценной формы ввода: карточки пользователя.

3.3.4.1. HTML

Открываем файл front/root/_/app/html/user.html. Это HTML5-код фрагмента экрана. 

Атрибутов форматирования нет, даже class заявлен только для двух верхних элементов: всё оформление вынесено в front/root/_/libs/tmilk/tmilk.less.

Тега <form> тоже нет: как идёт сбор введённых данных, показано ниже.

Зато у input'ов присутствуют атрибуты валидации: required и pattern. Они используются дважды: при подсветке (см *.less) и при проверке перед отправкой запроса (для тяжёлых дальтоников). Это НЕ снимает необходимости в серверной валидации, но чем меньше лишних запросов, тем лучше.

Ещё в HTML-тексте можно заметить нестандартные (но допустимые) атрибуты с префиксом data-. Они используются при интерполяции данных в HTML-шаблон. Например:
* data-off удаляет содержащий его элемент при истинном значении соответствующего поля (аналог опции off в draw_form/draw_table);
* data-on наоборот, удаляет его при ложном значении (off => !(...));
* data-text и data-html вызывают соответствующие методы jQuery, трописывая, таким образом, текст в область;
* data-img устанавливает фоном изображение, переданное в Base64 (используется механизм data URI, см. https://tools.ietf.org/html/rfc2397);
* data-list тиражирует элемент по значению списка (как бы foreach). 

Всё это напоминает очередной шаблонный язык, поэтому внесём ясность: клиентского PHP (то есть AngularJs) у нас не будет. Привязка к данным -- только по name для полей ввода и data-атрибутами для всех остальных.

Отметим закомментированный блок кнопок внизу экрана. Их можно прописать в HTML -- но удобнее сформировать при помощи js API позже (что мы увидим во view-блоке). А вот для вёрстки формы более удобным представляется HTML. В распоряжении разработчика оба подхода.

3.3.4.2. data

Открываем файл front/root/_/app/js/data/user.js. Это js-код работы с данными. 

В Eludia.pm Content-процедуры могут работать с БД, но не имеют права формировать HTML (кроме специальных случаев типа redirect-страниц).

Здесь, аналогично, data-код имеет AJAX-доступ к back-приложению, но не должен перерисовывать элементы пользовательского UI. 

Правда, в случае js провести разделение сложнее: если заизолировать data-код от доступа к DOM-дереву, писать крайне неудобно. Сейчас правило такое: в data можно читать состояние экрана, но не менять его фрагменты. Глобальные операции типа смены location.href -- допустимы.

Как видно, по ходу загрузки data/user.js определяет несколько функций, ставя ссылки на них из глобальной переменной $DO. Эти функции предназначены для указания в качестве обработчиков событий: например, нажатия на кнопки, изменения значений и т. д.

В $_DO.update_user показана клиентская валидация данных, алгоритм которой невозможно свести к параметрам input'ов. Ошибки ввода оформляются как исключения знакомого нам формата, где указывается имя проблемного поля.

Все функции, определённые в data/user.js используют query -- основное местное средство запуска AJAX-запросов со стандартной обработкой исключений типа внезапного обрыва сессии или ухода back в перезагрузку. Обработка успешного вызова для $DO-процедур более-менее сводится к перерисовке/закрытию текущей/родительской закладки. А безымянная функция определённая в самом конце (аналог get_item_of_users) передаёт управление callback'у, полученному в параметре. Это будет загрузка view/user.js.

1-й параметр query -- объект с полями type, id, action. Недостающие (здесь -- всюду id) берутся из $_REQUEST. А вот type в рассматриваемом файле всюду определяется явно: user и users -- это разные блоки, хотя тип в back-приложении у них один. Возможно, здесь это временное несоответствие, но 100% совпадения имён блоков и типов не будет наверняка.

2-й параметр query -- объект с остальными полями. Для их сбора предусмотрена функция values. Помимо копирования как такового, она отмечает про себя ($_REQUEST._secret), какие поля имели конфиденциальные значения. Эти данные передаются не в теле запроса, а в дополнительных заголовках. Зачем нужны такие ухищрения? Дело в том, что не только URI, но и тела POST-запросов в данном проекте пишутся в access.log. Вообще содержимое этого access.log практически соответствует тому, что ранее писалось в таблицу log. Только обеспечивают это не Perl-процедуры, а 2 строки в конфигурации nginx.

3.3.4.3. view

Открываем файл front/root/_/app/js/view/user.js. Это js-код визуализации.

Уже более 8 лет назад всё большая часть кода draw_item_... пишется на js. До сих пор она впрыскивалась в HTML-код страниц через волшебные компоненты %_REQUEST. Теперь этот процесс дошёл до конца: перед вами то, во что превратился draw_item_of_users.

Самый главный вызов здесь: 

	fill (view.clone (), user)
	
fill() -- это функция ядра, реализующая подстановку данных с учётом data-атрибутов, описанных в позапрошлом пункте. 

Переменная view -- это предварительно загруженный HTML-шаблон.

А user -- копия data, то есть 1-го параметра, куда use.block передаёт результат data-модуля.

Определение глобальной переменной $F5 нужно только для того, чтобы перерисовывать экран в режимах read_only и редактирования. Само это понятие -- типичная черта UI Eludia. Переключатель режимов и прочие кнопки появляются в результате вызова функции drw.form_buttons, определённой в front/root/_/libs/tmilk/buttons.js. При использовании чужих UI-библиотек это может не быть не актуально, тогда никакой $F5 не нужно.

В общем случае view-код так или иначе должен:

1) очистить свою область экрана (какую — это он решает сам);
2) заполнить её нужными элементами;
3) прописать туда полученные данные;
4) установить обработчики событий.

Пункты 2 и 3 могут быть совмещены в вызове fill(), но могут выполняться и по отдельности при помощи каких-то иных API.

Функция setup_photo обслуживает показ/редактирование фото при помощи 2 процедур API:

* Base64file.measure — анализирует переданное изображение и вызывает callback с вычисленными размерами;
* Base64file.resize — приводит изображение к заданному размеру и выдаёт data URI для новой картинки с заданными параметрами качества.

Таким образом, пользователь может предоставлять сколь угодно "тяжёлые" графические файлы — в любом случае они будут сжиматься в 95% JPEG ограниченного размера ещё до передачи на сервер.

Фотографии сотрудников передаются в обоих направлениях не отдельными запросами, а вместе с остальными полями карточки, в JSON, представленные в виде data URI / Base64.

Файловые вложения произвольного типа и принципиально не ограниченного объёма передаются на сервер функцией Base64file.upload. Она для заданного типа (в данном случае: user_files) сначала вызывает действие create, которым серверное приложение должно создать fake-запись и вернуть соответствующий id, а далее режет файл на части фиксированной длины и последовательно передаёт каждую из них запросом с action=update. Сервер приписывает полученную часть в конец и проверяет длину записанного содержимого: если она сошлась с переданной при create, то проставляет fake=0. В итоге, загрузка файлов на сервер производится такими же POST-запросами с JSON-телами, что и все прочие (а всё, что было связано с поддержкой multipart form data, из Dia.pm удалено). Конечно, упаковка в Base64 добавляет 33% трафика, но зато у приложения есть полный контроль над процессом: проверка размера и типа в do_create_user_file производится в контексте сессии до начала прокачки. При острой необходимости можно задействовать другие механизмы (типа копирования tmp-файла от nginx при настройке client_body_in_file_only), но это требует специфической настройки по месту, так что в данном общем примере не показано.

Обратная же загрузка бинарных файлов (с сервера на клиент) производится знакомым способом с использованием невидимого iframe. Правда, теперь это не do_download_... (нет транзакции -- нет действия), а get_item_of_..., хотя вызывается он POST-запросом (как все запросы к /_back -- для определённости) при помощи временного элемента <form>.

3.3.5. Типовой блок-список (users)

Общие технологические моменты довольно подробно описаны в предыдущем разделе, так что здесь мы отметим только некоторые детали. Многие из них касаются исключительно местной UI-библиотеки (tmilk) и для ознакомления с технологией в целом несущественны. 

Функция $DO.create_user объявлена в data/users.js (а не ...user.js). Дело в том, что её надо назначать обработчиком в тот момент, когда блок 'user' может быть ещё не загружен. Это несколько нарушает последовательность именования, но больших проблем не создаёт.

Вёрстка таблицы выглядит похоже на то, что было в TurboMilk.pm, но имеет существенное отличие: там нет инструмента листания вперёд-назад (как в старых UI: например, Google). Вместо этого предусмотрена автоподкачка новых строк при необходимости (как в современных UI: например, duckduckgo). Обоснование: листать от 1-й до 56-й страницы, а потом обратно до 14-й удобно быть не может. Особенно если каждая страница без прокрутки видна лишь наполовину.

И, да, важно учесть: в хороших (Oracle, Pg) СУБД COUNT(*) -- тяжёлая операция. Следует минимизировать число таких запросов. В будущем.

Механика же нового листания такая: при заданной требуемой portion запрос в БД запускается на portion+1. Если он возвращает максимальное число записей, последняя изних не показывается, а заменяется на специальную клетку-триггер. Как только эта клетка оказывается в видимой области экрана, она исчезает и тут же инициируется подкачка следующей порции данных. Как это сделано, можно посмотреть в front/root/_/libs/tmilk/tables.js. В прикладном коде виден только вызов drw.table.

Точнее, не только drw.table, но и предшествующий ему checkList(). Данная функция, помимо выявления и оформления триггерной записи, ещё вычисляет для каждой строки соответствующий URI. Далее fill() по шаблону добавляет в tr атрибуты data-href, а завершающий вызов use.lib ('tmilk/table-selector') не только запускает рамку-выделение, но и обрамляет текст span'ами с необходимыми обработчиками события click.

3.3.6. logon-блок и жизненный цикл сессии

logon блок работает во многом аналогично карточке пользователя, причём устроен проще (нет режима read_only, действие всего одно).

Обратим внимание на использование $_SESSION. Это лёгкая обёртка над стандартным sessionStorage, позволяющая сохранять/извлекать структурированные данные.

Результатом do_create_session является не просто признак успеха/неуспеха, а информация о пользователе. И информация эта должна сохраняться в sessionStorage. В данном демо она используется лишь для показа ФИО на верхней панели, но в реальных приложениях таким образом должны обрабатываться список пунктов меню, доступных пользователю, его редко изменяемые, но часто используемые и хранимые на сервере настройки и т. п.

Заметим также, что id сессии js-коду не виден: он передаётся между сервером и браузером в виде httpOnly cookie. Клиентское приложение узнаёт об успешной аутентификации в ответе на запрос {type: 'sessions', action: 'create'} и записывает этот факт в sessionStorage. Далее для js-кода именно состояние sessionStorage является показателем того, представился ли пользователь.

Если эти данные устаревают, то есть на сервере удаляется сессия либо карточка текущего пользователя, то на очередной AJAX-запрос приходит ответ с кодом 401 (см. check_session в back/lib/Config.pm). Получив его, функция query очищает весь sessionStorage и вызывает перерисовку страницы, что уже по логике приложения приводит к показу login-формы.

Время неактивности сессии задаётся, как и раньше, в $preconf или $conf, хотя путь изменился, поскольку рядом появилось много новых параметров. Это время тоже сообщается на клиент при login'е и в дальнейшем используется для запуска таймера на пустой запрос. Спецпараметр __keep_alive отменён, сессия продлевается запросами с пустым type. Таймер сбрасывается и перезапускается при каждом успешном AJAX-запросе (это обеспечивается установкой $(document).ajaxSuccess в handler.js), так что активный пользователь пустых запросов не порождает. Пока, правда, эти таймеры независимо запускаются на каждой вкладке приложения.

Как видно из back/conf/elud.json.orig (раздел auth.sessions), теперь, помимо времени жизни сессии, а также имени и пути cookie, можно в качестве альтернативного хранилища сессий указывать сервер memcached. Если заданы эти параметры подключения, memcached берёт на себя задачу слежения за устареванием сессий, а в БД поле sessions.ts больше не обновляется, что позволяет заметно снизить число транзакций: это актуально при высокой нагрузке. Более того, таблицы sessions может вообще не существовать в БД, при этом соответствие cookies и пользователей хранится только в memcached, а REQUEST {sid} приравнивается к $_USER -> {id}. Но если приложению необходимо дублировать записи о сессиях в реляционной таблице -- это работает параллельно с memcached, разумеется, кроме обновления поля ts. Таким образом удобнее находить и/или блокировать сессии, удовлетворяющие заданным критериям (например, прошлые сессии текущего пользователя).

Впрочем, и для традиционного механизма хранения сессий в СУБД число запросов UPDATE и DELETE сокращено: в частности, один клиент не может вызвать более одного UPDATE в минуту, поскольку время в ts записывается не текущее, а будущее, с запасом. Это несколько сбивает точность задания времени жизни сессии, что представляется допустимой потерей на фоне выигрыша в эффективности. В крайнем случае всегда можно ввести новый параметр, возвращающий старый алгоритм.

4. Вместо послесловия

4.1. Что меняется в процессе разработки?

4.1.1. Что может огорчить

То, что раньше выражалось одной Perl-процедурой draw_[item_of]_..., теперь занимает 2 js-файла и ещё один HTML. Это касается именно числа файлов, а не объёма кода -- он если растёт, то не столь существенно.

Для do_... процедур, остающихся в серверном коде, появляются двойники на клиенте. Если честно расписывать валидацию, такого же объёма. Если халтурить -- по 1 строке.

Кое-что из магии на тему "программирование без программирования" уходит в прошлое. Вместе с дырами в безопасности.

4.1.2. Что может порадовать

Резко упрощается интеграция с чем угодно. Поскольку handler -- часть приложения, а не ядра, его легко приспособить под интерфейсы SOAP/REST-сервисов, подключить внешнюю аутентификацию и т. п. напрямую, безо всяких ухищрений с волшебными типами/действиями и прочих трудно поддерживаемых "костылей".

Снимаются зависимость от HTML-вёрстки, изначально ориентированной на MSIE 5.0 и за 15 лет накопившей в себе полный набор содержательных примеров "как нельзя программировать Web UI".

Вещи называются своими именами: HTML-шаблоны живут в файлах .html, js-код -- в библиотеках .js. Они больше не перемешаны с Perl-кодом. А у сторонних js, css и прочего появляется понятное, достойное место в исходных текстах проекта.

4.2. Что же останется от Eludia.pm?

Наблюдая процесс последовательного уничтожения знакомого программного кода и его замены на стороннее ПО, задаёшься вопросом о том, не проще ли отказаться от него полностью, заодно забросить Perl5 и перейти на что-то модное.

На сегодняшний день представляется, что всё-таки:

* в прикладном программировании процедурный API удобнее объектного;
* наш набор sql_процедур лучше и стандартного DBI, и всяческих DBIx::...;
* функция sql ещё лучше для примерно 85% SELECT-запросов, причём её наличие исключает потребность в каком-либо ORM;
* автообновление БД в соответствии с Model удобнее, чем LiquiBase и его аналоги.

Вышеперечисленную функциональность планируется поддерживать и, возможно, портировать на иные платформы (в частности, серверный js).