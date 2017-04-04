################################################################################

sub select_users {
	
	my $item = {
		portion => $conf -> {portion},
		__this_content_is_ok_to_be_shown_completely => 1,
	};
	
	my $filter = '';
	my @params = ();
	
	if ($_REQUEST {q}) {		
		$filter .= ' AND users.label LIKE ?';
		push @params, '%' . $_REQUEST {q} . '%';		
	}

	my $start = $_REQUEST {start} + 0;

	($item -> {users}, $item -> {cnt}) = sql_select_all_cnt (<<EOS, @params, {fake => 'users'});
		SELECT
			users.*
			, roles.label AS role_label
		FROM
			users
			LEFT JOIN roles ON users.id_role = roles.id
		WHERE
			1=1
			$filter
		ORDER BY
			users.label
		LIMIT
			$start, $$item{portion}
EOS

	return $item;

}

################################################################################

sub get_item_of_users {

	my $data = sql ("users");
	
	delete $data -> {password};
		
	add_vocabularies ($data, 'roles');
		
	return $data;
	
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
	
	if ($data -> {password}) {
	
		$data -> {password} eq delete $data -> {password2} or die "#password#:Ошибка при первом или повторном вводе пароля";
	
		$data -> {salt}     = password_hash (rand, time);
		$data -> {password} = password_hash ($data -> {salt}, $data -> {password});
	}
	else {
		delete $data -> {-password};
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

1;
