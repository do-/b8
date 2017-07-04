columns => {
	label          => 'string',  # Тема
	body           => 'text',    # Суть
	id_user        => '(users)', # На ком сейчас
	id_user_from   => '(users)', # Автор
	id_user_to     => '(users)', # Адресат
	id_task_status => '(task_status) = 100', # Статус
},

keys => {
	id_user => 'id_user,id',
	id_user_from => 'id_user_from,id',
},
