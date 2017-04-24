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
	
	my $path = _users_photo_path (); $data -> {photo} = sub {print_as_data_uri ($path)} if -f $path;
		
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
	
	my $photo_b64;
	
	if (my $photo = delete $data -> {photo}) {
	
		$photo =~ m{^data:image/jpeg;base64,} or die "#photo#:Некорректный формат изображения";
		
		$photo_b64 = $';
	
	}
		
	eval {
		sql_do_update (users => $data, $_REQUEST {id});
	};
	
	if ($@ =~ /UNIQUE VIOLATION/i) {
		die "#login#: login $data->{login} уже занят";
	}
	elsif ($@) {
		die $@;
	}
	
	my $path = _users_photo_path ();
	
	open (F, ">$path") or die "Can't write to $path:$!\n";
	binmode F;
	print F MIME::Base64::decode ($photo_b64);
	close (F);

}

################################################################################

sub _users_photo_path {

	$preconf -> {files} -> {root} . "/users/photos/$_REQUEST{id}.jpeg";

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
		die "#login#: login $data->{login} занят, восстановление невозможно";
	}
	elsif ($@) {
		die $@;
	}
	
}

1;