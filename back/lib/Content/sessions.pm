################################################################################

sub do_create_sessions {

	my $data = {
	
		success => \1, 
		
		timeout => sql_sessions_timeout_in_minutes (),
		
		user    => sql (users => [
			[login => $_REQUEST {-login}],
			[fake  => [0, -1]],
			[LIMIT => 1],
		]),
		
	};
	
	if (!$data -> {user} -> {id}) {
	
		warn "Non-existing login entered: $_REQUEST{-login}\n";

		return undef;
	
	}
	
	if ($data -> {user} -> {fake} != 0) {
	
		warn "An attempt to use deleted login detected: $_REQUEST{-login}\n";

		return undef;
	
	}

	my $hash = password_hash ($data -> {user} -> {salt}, $_REQUEST {-password});

	if ($hash ne $data -> {user} -> {password}) {
	
		warn "Wrong password entered for $_REQUEST{-login}\n";
	
		return undef;
	
	}

	sql_do ("DELETE FROM sessions WHERE id_user = ?", $data -> {user} -> {id});

	start_session ($data -> {user} -> {id});

	set_cookie (-name => 'login', -value => $_REQUEST {-login}, -httponly => 1, -path => '/_back');

       	$data;

}

################################################################################

sub do_delete_sessions {
	
	sql_do ("DELETE FROM sessions WHERE id = ?", $_REQUEST {sid});

       	{success => \1};

}

1;