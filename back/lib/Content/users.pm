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

	my $item = sql_select_hash ("users");
	
	$item -> {__this_content_is_ok_to_be_shown_completely} = 1;
	
	$_REQUEST {__read_only} ||= !($_REQUEST {__edit} || $item -> {fake} > 0);

	add_vocabularies ($item, 'roles');

	$item -> {path} = [
		{type => 'users', name => 'Пользователи'},
		{type => 'users', name => $item -> {label}, id => $item -> {id}},
	];
		
	return $item;
	
}

################################################################################

sub do_update_users {

	my $data = $_REQUEST {data};
	
	$data -> {-f} =~ /^[А-ЯЁ][а-яё]+$/ or die "#-f#:Некорректная фамилия";
	$data -> {-i} =~ /^[А-ЯЁ][а-яё]+$/ or die "#-i#:Некорректное имя";
	$data -> {-o} =~ /^[А-ЯЁ][а-яё]*[ач]$/ or die "#-o#:Некорректное отчество";

	$data -> {-label} = $data -> {-f} . ' ' . $data -> {-i} . ' ' . $data -> {-o};

	$data -> {-id_role} or die "#-id_role#:Вы забыли указать роль";	
	$data -> {-login}   or die "#-login#:Вы забыли указать login";	

	vld_unique ('users', {field => 'login'}) or die "#_login#:Login '$_REQUEST{_login}' уже занят";
	
	$data -> {id} = $_REQUEST {id};
	
	sql_select_id (users => $data, ['id']);

}

################################################################################

sub do_create_users {

	$_REQUEST {id} = sql_do_insert ('users', {
		label => 'Фамилия И. О.',
	});
	
}

1;
