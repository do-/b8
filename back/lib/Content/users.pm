################################################################################

sub select_users {
	
	my $q = $_REQUEST {search};
	
	my $data = {};
	
	sql ($data, 'users(id, fake, label, login)' => [
		['label LIKE %?%' => $q -> {q}],
		[fake             => [split ',', $q -> {fake}]],		
		[ORDER            => 'label'],
	], 'roles');
	
	$data;

}

################################################################################

sub get_item_of_users {

	my $data = sql ("users");

	delete $data -> {password};
		
	add_vocabularies ($data, 'roles');
		
	$data;
	
}

################################################################################

sub do_update_users {

	my $data = $_REQUEST {data};
	
	$data -> {f} =~ /^[А-ЯЁ][а-яё]+$/ or die "#f#:Некорректная фамилия";
	$data -> {i} =~ /^[А-ЯЁ][а-яё]+$/ or die "#i#:Некорректное имя";
	$data -> {o} =~ /^[А-ЯЁ][а-яё]*[ач]$/ or die "#o#:Некорректное отчество";

	$data -> {label} = $data -> {f} . ' ' . $data -> {i} . ' ' . $data -> {o};

	$data -> {id_role} or die "#id_role#:Вы забыли указать роль";	
	$data -> {login}   or die "#login#:Вы забыли указать login";
	
	my $p2 = delete $data -> {password2};
	
	if ($data -> {password}) {
	
		$data -> {password} eq $p2 or die "#password#:Ошибка при первом или повторном вводе пароля";
	
		$data -> {salt}     = password_hash (rand, time);
		$data -> {password} = password_hash ($data -> {salt}, $data -> {password});
	}
	else {
		delete $data -> {password};
	}

#	vld_unique ('users', {field => 'login'}) or die "#_login#:Login '$_REQUEST{_login}' уже занят";
	
	$data -> {fake} = 0;
	$data -> {id}   = $_REQUEST {id};
	
	sql_select_id (users => dash ($data, ['id']));

}

################################################################################

sub do_create_users {

	{id => sql_do_insert (users => {})};
	
}

################################################################################

sub do_delete_users {

	sql_do ('UPDATE users SET fake = -1 WHERE id = ?', $_REQUEST {id});
	
}

################################################################################

sub do_undelete_users {

	sql_do ('UPDATE users SET fake = 0 WHERE id = ?', $_REQUEST {id});
	
}

1;