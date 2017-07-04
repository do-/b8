columns => {
	id_task_note   => '(task_notes)',  # Реплика
	id_user        => '(users)',       # Сотрудник
	dt             => 'datetime',      # Дата / время
	is_author      => 'int=0',         # 1 для автора, 0 для адресата
},

keys => {
	id_task_note => 'id_task_note',
	id_user => 'id_user, dt',
},
