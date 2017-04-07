################################################################################

sub select_users {
	
	my $q = $_REQUEST {search};
	
	my $data = {};
	
	sql ($data, 'users(id, fake, label, login)' => [
		['label LIKE %?%' => $q -> {q}],
		[login            => $q -> {login}],
		[fake             => [split ',', $q -> {fake}]],		
		[ORDER            => 'label'],
		[LIMIT            => [0 + $q -> {start}, $conf -> {portion} + 1]],
	], 'roles');
	
	if (@{$data -> {users}} > $conf -> {portion}) {
	
		$data -> {users} -> [-1] = {label => '...'}
	
	}
	
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

	my $old = sql ("users");

	my $data = $_REQUEST {data};
	
	$data -> {f} =~ /^[А-ЯЁ][а-яё]+$/ or die "#f#:Некорректная фамилия";
	$data -> {i} =~ /^[А-ЯЁ][а-яё]+$/ or die "#i#:Некорректное имя";
	$data -> {o} =~ /^[А-ЯЁ][а-яё]*[ач]$/ or die "#o#:Некорректное отчество";

	$data -> {label} = $data -> {f} . ' ' . $data -> {i} . ' ' . $data -> {o};

	$data -> {id_role} or die "#id_role#:Вы забыли указать роль";	
	$data -> {login}   or die "#login#:Вы забыли указать login";
	
	if ($data -> {login} ne $old -> {login}) {
		sql_do ('DELETE FROM logins WHERE id = ?', $old -> {login});
		eval {sql_do ('INSERT INTO logins (id) VALUES (?)', $data -> {login})};
		$@ and die "#_login#:Login '$data->{login}' уже занят";
	}

	my $p2 = delete $data -> {password2};
	
	if ($data -> {password}) {
	
		$data -> {password} eq $p2 or die "#password#:Ошибка при первом или повторном вводе пароля";
	
		$data -> {salt}     = password_hash (rand, time);
		$data -> {password} = password_hash ($data -> {salt}, $data -> {password});
	}
	else {
		delete $data -> {password};
	}
	
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

	my $data = sql ("users");

	sql_do ('UPDATE users SET fake = -1 WHERE id = ?', $data -> {id});
	
	sql_do ('DELETE FROM logins WHERE id = ?', $data -> {login});

}

################################################################################

sub do_undelete_users {

	my $data = sql ("users");

	eval {sql_do ('INSERT INTO logins (id) VALUES (?)', $data -> {login})};
	
	$@ and die "#_login#:Login '$data->{login}' в настоящее время занят";

	sql_do ('UPDATE users SET fake = 0 WHERE id = ?', $_REQUEST {id});
	
}

1;