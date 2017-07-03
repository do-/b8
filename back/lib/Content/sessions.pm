################################################################################

sub do_create_sessions {

	my $d = $_REQUEST {data};

	my $data = {

		timeout => $preconf -> {auth} -> {sessions} -> {timeout},
		
		user    => sql ('users(id, fake, f, i, o, salt, password)' => [
			[login => $d -> {login}],
			[fake  => 0],
			[LIMIT => 1],
		], 'roles(name)'),
		
	};

	if (!$data -> {user} -> {id}) {
	
		warn "Non-existing login entered: $d->{login}\n";

		return undef;
	
	}

	my $hash = password_hash (delete $data -> {user} -> {salt}, $d -> {password});

	if ($hash ne delete $data -> {user} -> {password}) {
	
		warn "Wrong password entered for $d->{login}\n";
	
		return undef;
	
	}

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	start_session (delete $data -> {user} -> {id});

	set_cookie (-name => 'login', -value => $d -> {login}, -httponly => 1, -path => '/_back');
	
	$data -> {user} -> {role} = $data -> {user} -> {role} -> {name};

       	$data;

}

################################################################################

sub do_delete_sessions {
	
	sql_do ("DELETE FROM sessions WHERE id = ?", $_REQUEST {sid});

       	{};

}

1;