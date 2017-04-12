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
	
	$data -> {portion} = $conf -> {portion};
		
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
	
	$data -> {f} =~ /^[�-ߨ][�-��]+$/ or die "#f#:������������ �������";
	$data -> {i} =~ /^[�-ߨ][�-��]+$/ or die "#i#:������������ ���";
	$data -> {o} =~ /^[�-ߨ][�-��]*[��]$/ or die "#o#:������������ ��������";

	$data -> {label} = $data -> {f} . ' ' . $data -> {i} . ' ' . $data -> {o};

	$data -> {id_role} or die "#id_role#:�� ������ ������� ����";	
	$data -> {login}   or die "#login#:�� ������ ������� login";
	
	my $p2 = delete $data -> {password2};
	
	if ($data -> {password}) {
	
		$data -> {password} eq $p2 or die "#password#:������ ��� ������ ��� ��������� ����� ������";
	
		$data -> {salt}     = password_hash (rand, time);
		$data -> {password} = password_hash ($data -> {salt}, $data -> {password});
		
	}
	else {
		delete $data -> {password};
	}
		
	eval {
		sql_do_update (users => $data, $_REQUEST {id});
	};
	
	if ($@ =~ /UNIQUE VIOLATION/i) {
		die "#login#: login $data->{login} ��� �����";
	}
	elsif ($@) {
		die $@;
	}

}

################################################################################

sub do_create_users {

	{id => sql_do_insert (users => {})};
	
}

################################################################################

sub do_delete_users {

	my $data = sql ("users");

	sql_do ('UPDATE users SET fake = -1 WHERE id = ?', $data -> {id});
	
}

################################################################################

sub do_undelete_users {

	my $data = sql ("users");

	eval {
		sql_do_update (users => {fake => 0}, $_REQUEST {id});
	};

	if ($@ =~ /UNIQUE VIOLATION/i) {
		die "#login#: login $data->{login} �����, �������������� ����������";
	}
	elsif ($@) {
		die $@;
	}
	
}

1;